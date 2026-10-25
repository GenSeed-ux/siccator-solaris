import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Leaf, Sun, Clock, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemOverviewProps {
  averageTemperature: number;
  averageHumidity: number;
  overallProgress: number;
  status: "idle" | "active" | "paused" | "completed";
  cropType: string;
  targetTemp: number;
  activeTraysCount: number;
  totalTraysCount: number;
  estimatedCompletion?: Date | null;
}

export function SystemOverview({
  averageTemperature,
  averageHumidity,
  overallProgress,
  status,
  cropType,
  targetTemp,
  activeTraysCount,
  totalTraysCount,
  estimatedCompletion,
}: SystemOverviewProps) {
  const statusConfig = {
    idle: { label: "Idle", dot: "bg-muted-foreground" },
    active: { label: "Drying", dot: "bg-lime-500" },
    paused: { label: "Paused", dot: "bg-amber-500" },
    completed: { label: "Completed", dot: "bg-blue-500" },
  }[status];

  const getRemainingTime = () => {
    if (!estimatedCompletion) return "--:--";
    const remaining = Math.max(
      0,
      Math.floor((estimatedCompletion.getTime() - Date.now()) / 60000)
    );
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    {
      icon: Thermometer,
      label: "Target",
      value: `${targetTemp}°C`,
      tint: "text-lime-700 bg-lime-100",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${averageHumidity.toFixed(0)}%`,
      tint: "text-sky-700 bg-sky-100",
    },
    {
      icon: Layers,
      label: "Trays",
      value: `${activeTraysCount}/${totalTraysCount}`,
      tint: "text-emerald-700 bg-emerald-100",
    },
    {
      icon: Clock,
      label: "ETA",
      value: getRemainingTime(),
      tint: "text-amber-700 bg-amber-100",
    },
  ];

  return (
    <div className="glass overflow-hidden">
      {/* Top: weather-style hero */}
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Leaf className="w-4 h-4 text-lime-600" />
              <span>{cropType || "No crop selected"}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 neofarm-pill bg-white/80 border border-border">
            <motion.span
              className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
              animate={status === "active" ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-foreground">{statusConfig.label}</span>
          </div>
        </div>

        {/* Big temperature */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={averageTemperature.toFixed(1)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-start"
              >
                <span className="text-7xl sm:text-8xl font-bold text-foreground tracking-tight leading-none">
                  {averageTemperature.toFixed(1)}
                </span>
                <span className="text-2xl font-semibold text-muted-foreground mt-2">°C</span>
              </motion.div>
            </AnimatePresence>
            <p className="text-sm text-muted-foreground mt-2">
              Chamber average • {totalTraysCount} trays
            </p>
          </div>

          {/* Sun glyph for solar */}
          <motion.div
            animate={{ rotate: status === "active" ? 360 : 0 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full lime-accent flex items-center justify-center shadow-lg"
          >
            <Sun className="w-12 h-12" strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* Stat pills row */}
      <div className="px-6 sm:px-8 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-white/80"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.tint}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-sm font-bold text-foreground">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drying progress bar */}
      <div className="px-6 sm:px-8 pb-6">
        <div className="rounded-2xl bg-white/70 border border-white/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">Overall Drying Progress</p>
              <p className="text-lg font-bold text-foreground">
                {overallProgress.toFixed(0)}%
              </p>
            </div>
            <Badge className="lime-accent border-0">85% → 15% moisture</Badge>
          </div>
          <div className="relative h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 lime-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {status === "active" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
