import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SystemOverview } from "@/components/dashboard/SystemOverview";
import { TrayGrid } from "@/components/dashboard/TrayGrid";
import { SafetyPanel } from "@/components/dashboard/SafetyPanel";
import { EnhancedControlPanel } from "@/components/dashboard/EnhancedControlPanel";
import { EnergyMeter } from "@/components/dashboard/sensors/EnergyMeter";
import { LightSensor } from "@/components/dashboard/sensors/LightSensor";
import { PowerModeIndicator } from "@/components/dashboard/PowerModeIndicator";
import { motion } from "framer-motion";
import { useMultiTrayDrying } from "@/hooks/useMultiTrayDrying";

const Dashboard = () => {
  const {
    trays,
    trayCount,
    addTray,
    removeTray,
    systemData,
    averageTemperature,
    averageHumidity,
    averageMoisture,
    overallProgress,
    activeTraysCount,
    session,
    config,
    fanSpeed,
    powerMode,
    startSession,
    pauseSession,
    stopSession,
    updateConfig,
    setFanSpeed,
    alerts,
    unacknowledgedAlerts,
    acknowledgeAlert,
    clearAllAlerts,
  } = useMultiTrayDrying(4);

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
                    Multi-Tray Solar Dryer Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {trayCount} trays • Real-time monitoring • AI optimization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PowerModeIndicator mode={powerMode} batteryLevel={85} />
                {unacknowledgedAlerts.length > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full text-sm font-medium"
                  >
                    {unacknowledgedAlerts.length} Alerts
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* System Overview */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SystemOverview
                averageTemperature={averageTemperature}
                averageHumidity={averageHumidity}
                overallProgress={overallProgress}
                status={session.status}
                cropType={config.cropType}
                targetTemp={config.targetTemp}
                activeTraysCount={activeTraysCount}
                totalTraysCount={trayCount}
                estimatedCompletion={session.estimatedCompletion}
              />
            </motion.div>

            {/* Tray Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TrayGrid
                trays={trays}
                targetTemp={config.targetTemp}
                isActive={session.status === "active"}
                trayCount={trayCount}
                onAddTray={addTray}
                onRemoveTray={removeTray}
              />
            </motion.div>

            {/* Control Panel and Safety */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EnhancedControlPanel
                  status={session.status}
                  mode={config.mode}
                  targetTemp={config.targetTemp}
                  cropType={config.cropType}
                  fanSpeed={fanSpeed}
                  onStart={startSession}
                  onPause={pauseSession}
                  onStop={stopSession}
                  onTempChange={(temp) => updateConfig({ targetTemp: temp })}
                  onCropChange={(crop) => updateConfig({ cropType: crop })}
                  onModeToggle={() => updateConfig({ mode: config.mode === "auto" ? "manual" : "auto" })}
                  onFanControl={setFanSpeed}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SafetyPanel
                  alerts={alerts}
                  systemData={systemData}
                  trays={trays}
                  targetTemp={config.targetTemp}
                  onAcknowledgeAlert={acknowledgeAlert}
                  onClearAllAlerts={clearAllAlerts}
                />
              </motion.div>
            </div>

            {/* Energy & Environment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <EnergyMeter
                  voltage={systemData.voltage}
                  current={systemData.current}
                  power={systemData.power}
                  energy={systemData.energy}
                  powerFactor={systemData.powerFactor}
                  frequency={systemData.frequency}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <LightSensor
                  intensity={systemData.lightIntensity}
                  timestamp={systemData.timestamp}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
