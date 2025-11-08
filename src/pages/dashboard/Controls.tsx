import { ControlPanel } from "@/components/dashboard/controls/ControlPanel";
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
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Drying Controls</h1>
          <p className="text-muted-foreground mt-2">
            Manage your drying session parameters and controls
          </p>
        </div>
        
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
          onModeToggle={() => 
            updateConfig({ mode: config.mode === "auto" ? "manual" : "auto" })
          }
          onFanControl={setFanSpeed}
          onAlertReset={() => 
            toast({ title: "Alerts cleared", description: "All alerts have been reset" })
          }
        />
      </motion.div>
    </div>
  );
}
