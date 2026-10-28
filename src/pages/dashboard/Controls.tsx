import { useEffect, useState } from "react";
import { Thermometer, Droplets, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { ControlPanel } from "@/components/dashboard/controls/ControlPanel";
import { GlassShell } from "@/components/dashboard/GlassShell";
import { useDryingSession } from "@/hooks/useDryingSession";
import { useToast } from "@/hooks/use-toast";

const glassBar =
  "rounded-3xl border border-white/30 bg-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]";

export default function Controls() {
  const {
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
  } = useDryingSession();

  const { toast } = useToast();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(i);
  }, []);

  const temp = (sensorData.tempTop + sensorData.tempBottom) / 2;
  const humidity = (sensorData.humidityTop + sensorData.humidityBottom) / 2;

  return (
    <GlassShell>
      <header className={`${glassBar} sticky top-0 z-10 mx-3 mt-3 flex flex-wrap items-center justify-between gap-3 px-5 py-3 md:mx-4`}>
        <div>
          <h1 className="text-xl font-semibold leading-tight">Drying Controls</h1>
          <p className="text-xs text-white/70">Temperature, produce and airflow</p>
        </div>
        <div className="flex items-center gap-4 text-sm sm:text-base">
          <span className="flex items-center gap-1.5"><Thermometer className="h-5 w-5" />{temp.toFixed(1)}°C</span>
          <span className="flex items-center gap-1.5"><Droplets className="h-5 w-5" />{Math.round(humidity)}%</span>
          <span className="hidden items-center gap-1.5 capitalize sm:flex"><Zap className="h-5 w-5" />{powerMode}</span>
          <span className="font-semibold">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-5 p-3 pb-10 md:p-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
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
      </main>
    </GlassShell>
  );
}
