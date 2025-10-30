import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SensorData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  powerFactor: number;
  frequency: number;
  tempTop: number;
  humidityTop: number;
  tempBottom: number;
  humidityBottom: number;
  lightIntensity: number;
  vocLevel: number;
  moistureLevel: number;
  timestamp: Date;
}

interface SessionConfig {
  cropType: string;
  targetTemp: number;
  mode: "auto" | "manual";
}

export function useDryingSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "active" | "paused" | "completed">("idle");
  const [config, setConfig] = useState<SessionConfig>({
    cropType: "Tomatoes",
    targetTemp: 45,
    mode: "auto",
  });
  const [sensorData, setSensorData] = useState<SensorData>({
    voltage: 220,
    current: 0,
    power: 0,
    energy: 0,
    powerFactor: 0.95,
    frequency: 50,
    tempTop: 25,
    humidityTop: 60,
    tempBottom: 25,
    humidityBottom: 60,
    lightIntensity: 800,
    vocLevel: 50,
    moistureLevel: 85,
    timestamp: new Date(),
  });
  const [fanSpeed, setFanSpeed] = useState(0);
  const [powerMode, setPowerMode] = useState<"solar" | "battery" | "grid">("solar");
  const { toast } = useToast();

  // Simulate sensor readings
  useEffect(() => {
    if (status !== "active") return;

    const interval = setInterval(() => {
      setSensorData((prev) => {
        const newMoisture = Math.max(10, prev.moistureLevel - 0.5);
        const tempVariation = (Math.random() - 0.5) * 2;
        const humidityVariation = (Math.random() - 0.5) * 2;

        return {
          voltage: 220 + (Math.random() - 0.5) * 10,
          current: 2 + Math.random() * 0.5,
          power: 400 + Math.random() * 100,
          energy: prev.energy + 0.001,
          powerFactor: 0.93 + Math.random() * 0.05,
          frequency: 50 + (Math.random() - 0.5) * 0.2,
          tempTop: Math.max(30, Math.min(60, config.targetTemp + tempVariation + 2)),
          humidityTop: Math.max(10, Math.min(70, 40 + humidityVariation)),
          tempBottom: Math.max(30, Math.min(60, config.targetTemp + tempVariation - 2)),
          humidityBottom: Math.max(10, Math.min(70, 42 + humidityVariation)),
          lightIntensity: Math.max(0, 800 + (Math.random() - 0.5) * 200),
          vocLevel: Math.max(20, Math.min(300, 80 + (Math.random() - 0.5) * 40)),
          moistureLevel: newMoisture,
          timestamp: new Date(),
        };
      });

      // Auto-adjust fan in auto mode
      if (config.mode === "auto") {
        setSensorData((current) => {
          const avgTemp = (current.tempTop + current.tempBottom) / 2;
          const tempDiff = avgTemp - config.targetTemp;
          const newFanSpeed = Math.max(30, Math.min(100, 60 + tempDiff * 5));
          setFanSpeed(Math.round(newFanSpeed));
          return current;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, config]);

  // Save sensor readings to database
  useEffect(() => {
    if (!sessionId || status !== "active") return;

    const saveInterval = setInterval(async () => {
      const { error } = await supabase.from("sensor_readings").insert({
        session_id: sessionId,
        voltage: sensorData.voltage,
        current: sensorData.current,
        power: sensorData.power,
        energy: sensorData.energy,
        power_factor: sensorData.powerFactor,
        frequency: sensorData.frequency,
        temp_top: sensorData.tempTop,
        humidity_top: sensorData.humidityTop,
        temp_bottom: sensorData.tempBottom,
        humidity_bottom: sensorData.humidityBottom,
        light_intensity: sensorData.lightIntensity,
        voc_level: sensorData.vocLevel,
        moisture_level: sensorData.moistureLevel,
      });

      if (error) {
        console.error("Error saving sensor data:", error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [sessionId, status, sensorData]);

  const startSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to start a drying session",
          variant: "destructive",
        });
        return;
      }

      // Get crop profile
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
          initial_moisture: sensorData.moistureLevel,
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setStatus("active");
      setFanSpeed(60);

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
  }, [config, powerMode, sensorData.moistureLevel, toast]);

  const pauseSession = useCallback(async () => {
    if (!sessionId) return;

    const { error } = await supabase
      .from("drying_sessions")
      .update({ status: "paused" })
      .eq("id", sessionId);

    if (!error) {
      setStatus("paused");
      setFanSpeed(0);
      toast({ title: "Session paused" });
    }
  }, [sessionId, toast]);

  const stopSession = useCallback(async () => {
    if (!sessionId) return;

    const { error } = await supabase
      .from("drying_sessions")
      .update({
        status: "completed",
        end_time: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (!error) {
      setStatus("idle");
      setSessionId(null);
      setFanSpeed(0);
      toast({ title: "Session completed" });
    }
  }, [sessionId, toast]);

  const updateConfig = useCallback((updates: Partial<SessionConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    sessionId,
    status,
    config,
    sensorData,
    fanSpeed,
    powerMode,
    startSession,
    pauseSession,
    stopSession,
    updateConfig,
    setFanSpeed,
  };
}
