import { ControlPanel } from "@/components/dashboard/controls/ControlPanel";
import { GlassShell } from "@/components/dashboard/GlassShell";
import { useDryingSession } from "@/hooks/useDryingSession";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Controls() {
  const {
    status,
    config,
    fanSpeed,
    startSession,
    pauseSession,
    stopSession,
    updateConfig,
    setFanSpeed,
  } = useDryingSession();

  const { toast } = useToast();

  return (
    <GlassShell>
      <div className="glass-header sticky top-0 z-10 mx-3 mt-3 px-6 py-4 md:mx-4">
        <h1 className="text-2xl font-bold text-foreground">Drying Controls</h1>
        <p className="text-sm text-muted-foreground">Manage your drying session parameters and controls</p>
      </div>
      <div className="p-3 md:p-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <ControlPanel
            status={status}
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
            onAlertReset={() => toast({ title: "Alerts cleared", description: "All alerts have been reset" })}
          />
        </motion.div>
      </div>
    </GlassShell>
  );
}
