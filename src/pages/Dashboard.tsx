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
import { Bell, Leaf } from "lucide-react";

const Dashboard = () => {
  const {
    trays,
    trayCount,
    addTray,
    removeTray,
    systemData,
    averageTemperature,
    averageHumidity,
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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full neofarm-canvas">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header — softer, app-like */}
          <div className="sticky top-0 z-10 backdrop-blur-md bg-white/40 dark:bg-card/40 border-b border-white/40">
            <div className="flex items-center justify-between px-4 sm:px-8 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl lime-accent flex items-center justify-center shadow-md">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hi, {greeting}</p>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                      Neofarm Dryer
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PowerModeIndicator mode={powerMode} batteryLevel={85} />
                <button className="relative w-10 h-10 rounded-full bg-white/80 dark:bg-card flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                  <Bell className="w-4 h-4 text-foreground" />
                  {unacknowledgedAlerts.length > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      {unacknowledgedAlerts.length}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* Hero / Chamber Overview */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
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

            {/* Control + Safety */}
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
                  onModeToggle={() =>
                    updateConfig({ mode: config.mode === "auto" ? "manual" : "auto" })
                  }
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

            {/* Energy & Light */}
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
