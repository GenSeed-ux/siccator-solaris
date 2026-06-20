import { Thermometer, Droplets, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TraySensorData } from "@/hooks/useMultiTrayDrying";

interface TrayCardProps {
  tray: TraySensorData;
  targetTemp: number;
  isActive: boolean;
}

export function TrayCard({ tray, targetTemp, isActive }: TrayCardProps) {
  const tempDiff = Math.abs(tray.temperature - targetTemp);
  const isNearTarget = tempDiff <= 3;
  const isOverTemp = tray.temperature > targetTemp + 5;

  const dryingProgress = Math.max(
    0,
    Math.min(100, ((85 - tray.moistureLevel) / (85 - 15)) * 100)
  );

  // Circular progress geometry
  const size = 92;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (dryingProgress / 100) * circumference;

  const statusPill = (() => {
    switch (tray.status) {
      case "active":
        return (
          <span className="neofarm-pill bg-lime-100 text-lime-800 flex items-center gap-1">
            <Wifi className="w-3 h-3" /> Active
          </span>
        );
      case "error":
        return (
          <span className="neofarm-pill bg-red-100 text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Error
          </span>
        );
      case "disconnected":
        return (
          <span className="neofarm-pill bg-muted text-muted-foreground flex items-center gap-1">
            <WifiOff className="w-3 h-3" /> Offline
          </span>
        );
      default:
        return (
          <span className="neofarm-pill bg-muted text-muted-foreground">Idle</span>
        );
    }
  })();

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="neofarm-card p-5 h-full relative overflow-hidden"
      >
        {isActive && tray.status === "active" && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 lime-accent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl lime-accent flex items-center justify-center font-bold">
              {tray.trayNumber}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Tray {tray.trayNumber}</h3>
              <p className="text-[10px] text-muted-foreground">
                {tray.lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          {statusPill}
        </div>

        {/* Moisture circle as focal point */}
        <div className="flex items-center gap-4">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="hsl(var(--muted))"
                fill="none"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="hsl(95 70% 50%)"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground leading-none">
                {dryingProgress.toFixed(0)}%
              </span>
              <span className="text-[9px] text-muted-foreground">dried</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-between rounded-xl px-3 py-2 cursor-help ${
                    isOverTemp
                      ? "bg-red-50 text-red-700"
                      : isNearTarget && tray.status === "active"
                      ? "bg-lime-50 text-lime-800"
                      : "bg-muted/60 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    <span className="text-[11px] font-medium">Temp</span>
                  </div>
                  <span className="text-sm font-bold">{tray.temperature.toFixed(1)}°</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Target: {targetTemp}°C</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-sky-50 text-sky-700">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span className="text-[11px] font-medium">Humidity</span>
              </div>
              <span className="text-sm font-bold">{tray.humidity.toFixed(0)}%</span>
            </div>

            <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-amber-50 text-amber-700">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium">Moisture</span>
              </div>
              <span className="text-sm font-bold">{tray.moistureLevel.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
