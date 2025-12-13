import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TraySensorData {
  trayId: string;
  trayNumber: number;
  temperature: number;
  humidity: number;
  moistureLevel: number;
  status: "active" | "disconnected" | "error" | "idle";
  lastUpdate: Date;
}

export interface SystemSensorData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  powerFactor: number;
  frequency: number;
  lightIntensity: number;
  vocLevel: number;
  timestamp: Date;
}

export interface SafetyAlert {
  id: string;
  type: "gas" | "temperature" | "energy" | "sensor_failure";
  severity: "warning" | "danger";
  message: string;
  trayId?: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface SessionConfig {
  cropType: string;
  targetTemp: number;
  mode: "auto" | "manual";
}

export interface DryingSessionState {
  sessionId: string | null;
  status: "idle" | "active" | "paused" | "completed";
  startTime: Date | null;
  estimatedCompletion: Date | null;
}

const generateTrayData = (trayNumber: number, baseTemp: number, isActive: boolean): TraySensorData => {
  const variation = (Math.random() - 0.5) * 4;
  const humidityVariation = (Math.random() - 0.5) * 6;
  const moistureVariation = (Math.random() - 0.5) * 5;
  
  // Simulate slight variations per tray level (bottom trays tend to be warmer)
  const trayTempAdjust = (trayNumber - 1) * 1.5;
  const trayHumidityAdjust = (trayNumber - 1) * 2;
  
  return {
    trayId: `tray-${trayNumber}`,
    trayNumber,
    temperature: isActive ? baseTemp + trayTempAdjust + variation : 25 + variation,
    humidity: isActive ? 35 + trayHumidityAdjust + humidityVariation : 60 + humidityVariation,
    moistureLevel: 85 - (trayNumber * 5) + moistureVariation,
    status: Math.random() > 0.95 ? "error" : isActive ? "active" : "idle",
    lastUpdate: new Date(),
  };
};

export function useMultiTrayDrying(initialTrayCount: number = 4) {
  const [trayCount, setTrayCount] = useState(initialTrayCount);
  const [trays, setTrays] = useState<TraySensorData[]>([]);
  const [systemData, setSystemData] = useState<SystemSensorData>({
    voltage: 220,
    current: 0,
    power: 0,
    energy: 0,
    powerFactor: 0.95,
    frequency: 50,
    lightIntensity: 800,
    vocLevel: 50,
    timestamp: new Date(),
  });
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [session, setSession] = useState<DryingSessionState>({
    sessionId: null,
    status: "idle",
    startTime: null,
    estimatedCompletion: null,
  });
  const [config, setConfig] = useState<SessionConfig>({
    cropType: "",
    targetTemp: 45,
    mode: "auto",
  });
  const [fanSpeed, setFanSpeed] = useState(0);
  const [powerMode, setPowerMode] = useState<"solar" | "battery" | "grid">("solar");
  const { toast } = useToast();

  // Initialize trays
  useEffect(() => {
    const initialTrays = Array.from({ length: trayCount }, (_, i) =>
      generateTrayData(i + 1, config.targetTemp, session.status === "active")
    );
    setTrays(initialTrays);
  }, [trayCount]);

  // Simulate sensor updates
  useEffect(() => {
    if (session.status !== "active") return;

    const interval = setInterval(() => {
      // Update tray data
      setTrays(prevTrays =>
        prevTrays.map(tray => {
          const newMoisture = Math.max(10, tray.moistureLevel - (0.3 + Math.random() * 0.2));
          const tempVariation = (Math.random() - 0.5) * 2;
          const humidityVariation = (Math.random() - 0.5) * 3;
          
          return {
            ...tray,
            temperature: Math.max(30, Math.min(70, config.targetTemp + (tray.trayNumber - 1) * 1.5 + tempVariation)),
            humidity: Math.max(10, Math.min(70, 35 + (tray.trayNumber - 1) * 2 + humidityVariation)),
            moistureLevel: newMoisture,
            status: Math.random() > 0.98 ? "error" : "active",
            lastUpdate: new Date(),
          };
        })
      );

      // Update system data
      setSystemData(prev => ({
        voltage: 220 + (Math.random() - 0.5) * 10,
        current: 2 + Math.random() * 0.5,
        power: 400 + Math.random() * 100,
        energy: prev.energy + 0.001,
        powerFactor: 0.93 + Math.random() * 0.05,
        frequency: 50 + (Math.random() - 0.5) * 0.2,
        lightIntensity: Math.max(0, 800 + (Math.random() - 0.5) * 200),
        vocLevel: Math.max(20, Math.min(300, prev.vocLevel + (Math.random() - 0.5) * 20)),
        timestamp: new Date(),
      }));

      // Auto-adjust fan in auto mode
      if (config.mode === "auto") {
        setTrays(currentTrays => {
          const avgTemp = currentTrays.reduce((sum, t) => sum + t.temperature, 0) / currentTrays.length;
          const tempDiff = avgTemp - config.targetTemp;
          const newFanSpeed = Math.max(30, Math.min(100, 60 + tempDiff * 5));
          setFanSpeed(Math.round(newFanSpeed));
          return currentTrays;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [session.status, config]);

  // Check for alerts
  useEffect(() => {
    const newAlerts: SafetyAlert[] = [];
    
    // Check VOC levels
    if (systemData.vocLevel > 200) {
      const existingAlert = alerts.find(a => a.type === "gas" && !a.acknowledged);
      if (!existingAlert) {
        newAlerts.push({
          id: `gas-${Date.now()}`,
          type: "gas",
          severity: systemData.vocLevel > 300 ? "danger" : "warning",
          message: `High VOC levels detected: ${systemData.vocLevel.toFixed(0)} PPM`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
    }

    // Check tray temperatures
    trays.forEach(tray => {
      if (tray.temperature > config.targetTemp + 10) {
        const existingAlert = alerts.find(a => a.type === "temperature" && a.trayId === tray.trayId && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `temp-${tray.trayId}-${Date.now()}`,
            type: "temperature",
            severity: tray.temperature > config.targetTemp + 15 ? "danger" : "warning",
            message: `Over-temperature on Tray ${tray.trayNumber}: ${tray.temperature.toFixed(1)}°C`,
            trayId: tray.trayId,
            timestamp: new Date(),
            acknowledged: false,
          });
        }
      }

      if (tray.status === "error") {
        const existingAlert = alerts.find(a => a.type === "sensor_failure" && a.trayId === tray.trayId && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `sensor-${tray.trayId}-${Date.now()}`,
            type: "sensor_failure",
            severity: "warning",
            message: `Sensor failure on Tray ${tray.trayNumber}`,
            trayId: tray.trayId,
            timestamp: new Date(),
            acknowledged: false,
          });
        }
      }
    });

    // Check energy usage
    if (systemData.power > 500) {
      const existingAlert = alerts.find(a => a.type === "energy" && !a.acknowledged);
      if (!existingAlert) {
        newAlerts.push({
          id: `energy-${Date.now()}`,
          type: "energy",
          severity: "warning",
          message: `High energy usage: ${systemData.power.toFixed(0)}W`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
      newAlerts.forEach(alert => {
        toast({
          title: alert.severity === "danger" ? "Critical Alert!" : "Warning",
          description: alert.message,
          variant: "destructive",
        });
      });
    }
  }, [trays, systemData, config.targetTemp, alerts, toast]);

  // Computed values
  const averageTemperature = trays.length > 0
    ? trays.reduce((sum, t) => sum + t.temperature, 0) / trays.length
    : 0;

  const averageHumidity = trays.length > 0
    ? trays.reduce((sum, t) => sum + t.humidity, 0) / trays.length
    : 0;

  const averageMoisture = trays.length > 0
    ? trays.reduce((sum, t) => sum + t.moistureLevel, 0) / trays.length
    : 0;

  const overallProgress = Math.max(0, Math.min(100, ((85 - averageMoisture) / (85 - 15)) * 100));

  const activeTraysCount = trays.filter(t => t.status === "active").length;
  const errorTraysCount = trays.filter(t => t.status === "error").length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const startSession = useCallback(async () => {
    if (!config.cropType) {
      toast({
        title: "Crop type required",
        description: "Please enter the type of produce being dried",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Allow demo mode without authentication
        const demoSessionId = `demo-${Date.now()}`;
        const estimatedHours = 8;
        const estimatedCompletion = new Date(Date.now() + estimatedHours * 60 * 60 * 1000);

        setSession({
          sessionId: demoSessionId,
          status: "active",
          startTime: new Date(),
          estimatedCompletion,
        });

        setFanSpeed(60);
        setTrays(prev => prev.map(tray => ({ ...tray, status: "active" })));

        toast({
          title: "Demo session started",
          description: `Now drying ${config.cropType} at ${config.targetTemp}°C`,
        });
        return;
      }

      const { data: cropProfile } = await supabase
        .from("crop_profiles")
        .select("*")
        .eq("crop_name", config.cropType)
        .single();

      const estimatedHours = cropProfile?.estimated_hours || 8;
      const estimatedCompletion = new Date(Date.now() + estimatedHours * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from("drying_sessions")
        .insert({
          user_id: user.id,
          crop_type: config.cropType,
          target_temperature: config.targetTemp,
          status: "active",
          mode: config.mode,
          power_mode: powerMode,
          start_time: new Date().toISOString(),
          estimated_completion: estimatedCompletion.toISOString(),
          initial_moisture: averageMoisture,
        })
        .select()
        .single();

      if (error) throw error;

      setSession({
        sessionId: data.id,
        status: "active",
        startTime: new Date(),
        estimatedCompletion,
      });

      setFanSpeed(60);
      setTrays(prev => prev.map(tray => ({ ...tray, status: "active" })));

      toast({
        title: "Drying session started",
        description: `Now drying ${config.cropType} at ${config.targetTemp}°C`,
      });
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Failed to start session",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }, [config, powerMode, averageMoisture, toast]);

  const pauseSession = useCallback(async () => {
    if (session.sessionId && !session.sessionId.startsWith("demo-")) {
      await supabase
        .from("drying_sessions")
        .update({ status: "paused" })
        .eq("id", session.sessionId);
    }

    setSession(prev => ({ ...prev, status: "paused" }));
    setFanSpeed(0);
    toast({ title: "Session paused" });
  }, [session.sessionId, toast]);

  const stopSession = useCallback(async () => {
    if (session.sessionId && !session.sessionId.startsWith("demo-")) {
      await supabase
        .from("drying_sessions")
        .update({
          status: "completed",
          end_time: new Date().toISOString(),
        })
        .eq("id", session.sessionId);
    }

    setSession({
      sessionId: null,
      status: "idle",
      startTime: null,
      estimatedCompletion: null,
    });
    setFanSpeed(0);
    setTrays(prev => prev.map(tray => ({ ...tray, status: "idle" })));
    toast({ title: "Session completed" });
  }, [session.sessionId, toast]);

  const updateConfig = useCallback((updates: Partial<SessionConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
  }, []);

  const addTray = useCallback(() => {
    if (trayCount >= 8) {
      toast({
        title: "Maximum trays reached",
        description: "Cannot add more than 8 trays",
        variant: "destructive",
      });
      return;
    }
    setTrayCount(prev => prev + 1);
  }, [trayCount, toast]);

  const removeTray = useCallback(() => {
    if (trayCount <= 2) {
      toast({
        title: "Minimum trays required",
        description: "Cannot have less than 2 trays",
        variant: "destructive",
      });
      return;
    }
    setTrayCount(prev => prev - 1);
  }, [trayCount, toast]);

  return {
    // Tray data
    trays,
    trayCount,
    addTray,
    removeTray,
    
    // System data
    systemData,
    
    // Aggregated metrics
    averageTemperature,
    averageHumidity,
    averageMoisture,
    overallProgress,
    activeTraysCount,
    errorTraysCount,
    
    // Session management
    session,
    config,
    fanSpeed,
    powerMode,
    startSession,
    pauseSession,
    stopSession,
    updateConfig,
    setFanSpeed,
    
    // Alerts
    alerts,
    unacknowledgedAlerts,
    acknowledgeAlert,
    clearAllAlerts,
  };
}
