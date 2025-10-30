import { Badge } from "@/components/ui/badge";
import { Sun, Battery, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface PowerModeIndicatorProps {
  mode: "solar" | "battery" | "grid";
  batteryLevel: number;
}

export function PowerModeIndicator({ mode, batteryLevel }: PowerModeIndicatorProps) {
  const modeConfig = {
    solar: {
      icon: Sun,
      label: "Solar Mode",
      color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
    },
    battery: {
      icon: Battery,
      label: "Battery Mode",
      color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
    },
    grid: {
      icon: Zap,
      label: "Grid Mode",
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    },
  };

  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <Badge className={`flex items-center gap-2 px-4 py-2 ${config.color}`}>
        <Icon className="h-4 w-4" />
        {config.label}
      </Badge>
      {mode === "battery" && (
        <div className="flex items-center gap-2">
          <Battery className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{batteryLevel}%</span>
        </div>
      )}
    </motion.div>
  );
}
