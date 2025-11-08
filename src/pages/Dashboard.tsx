import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RealtimeChart } from "@/components/dashboard/RealtimeChart";
import { EnergyMeter } from "@/components/dashboard/sensors/EnergyMeter";
import { TemperatureHumidity } from "@/components/dashboard/sensors/TemperatureHumidity";
import { LightSensor } from "@/components/dashboard/sensors/LightSensor";
import { GasSensor } from "@/components/dashboard/sensors/GasSensor";
import { MoistureSensor } from "@/components/dashboard/sensors/MoistureSensor";
import { DryingTimeline } from "@/components/dashboard/DryingTimeline";
import { PowerModeIndicator } from "@/components/dashboard/PowerModeIndicator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDryingSession } from "@/hooks/useDryingSession";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const {
    status,
    config,
    sensorData,
    powerMode,
  } = useDryingSession();

  const { toast } = useToast();

  const handleVOCThresholdExceeded = () => {
    if (config.mode === "auto") {
      toast({
        title: "Auto-activation",
        description: "VOC levels high! Fan set to maximum speed.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      idle: { color: "bg-muted text-muted-foreground", label: "Idle" },
      active: { 
        color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30", 
        label: "Active Drying" 
      },
      paused: { 
        color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30", 
        label: "Paused" 
      },
      completed: { 
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30", 
        label: "Completed" 
      },
    };

    const config = statusConfig[status];
    
    return (
      <Badge className={`flex items-center gap-2 px-4 py-2 ${config.color}`}>
        {status === "active" && (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        )}
        {config.label}
      </Badge>
    );
  };

  const estimatedCompletion = sensorData.moistureLevel > 20
    ? new Date(Date.now() + ((sensorData.moistureLevel - 15) / 0.5) * 3000)
    : undefined;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    IoT Solar Dryer Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Real-time sensor monitoring • AI-powered optimization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PowerModeIndicator mode={powerMode} batteryLevel={85} />
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Drying Timeline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DryingTimeline
                status={status}
                moistureLevel={sensorData.moistureLevel}
                cropType={config.cropType}
              />
            </motion.div>

            {/* Sensor Grid - Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <EnergyMeter
                  voltage={sensorData.voltage}
                  current={sensorData.current}
                  power={sensorData.power}
                  energy={sensorData.energy}
                  powerFactor={sensorData.powerFactor}
                  frequency={sensorData.frequency}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TemperatureHumidity
                  tempTop={sensorData.tempTop}
                  humidityTop={sensorData.humidityTop}
                  tempBottom={sensorData.tempBottom}
                  humidityBottom={sensorData.humidityBottom}
                  targetTemp={config.targetTemp}
                />
              </motion.div>
            </div>

            {/* Sensor Grid - Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LightSensor
                  intensity={sensorData.lightIntensity}
                  timestamp={sensorData.timestamp}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GasSensor
                  vocLevel={sensorData.vocLevel}
                  onThresholdExceeded={handleVOCThresholdExceeded}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MoistureSensor
                  moistureLevel={sensorData.moistureLevel}
                  initialMoisture={85}
                  estimatedCompletion={estimatedCompletion}
                />
              </motion.div>
            </div>

            {/* Real-time Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <RealtimeChart 
                tempTop={sensorData.tempTop}
                tempBottom={sensorData.tempBottom}
                humidityTop={sensorData.humidityTop}
                humidityBottom={sensorData.humidityBottom}
              />
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AIInsights />
            </motion.div>

            {/* Info Alert */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-4 bg-primary/10 rounded-lg border border-primary/30 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <strong>Live Sensor Monitoring:</strong> All sensor data updates every 3 seconds. 
                  The system automatically optimizes drying parameters based on real-time conditions.
                  {status === "idle" && " Go to Controls tab to begin a drying session."}
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
