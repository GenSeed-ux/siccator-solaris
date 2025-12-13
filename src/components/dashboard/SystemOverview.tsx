import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplets, Gauge, Leaf, Target, Clock } from "lucide-react";
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
  const getStatusConfig = () => {
    const configs = {
      idle: { color: "bg-muted text-muted-foreground", label: "Idle", pulse: false },
      active: { color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30", label: "Active Drying", pulse: true },
      paused: { color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30", label: "Paused", pulse: false },
      completed: { color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30", label: "Completed", pulse: false },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig();
  const tempDiff = Math.abs(averageTemperature - targetTemp);
  const isNearTarget = tempDiff <= 3;

  const getRemainingTime = () => {
    if (!estimatedCompletion) return null;
    const remaining = Math.max(0, Math.floor((estimatedCompletion.getTime() - Date.now()) / 60000));
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="gradient-primary text-primary-foreground pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Chamber Overview</CardTitle>
          <Badge className={`${statusConfig.color} flex items-center gap-2 px-4 py-2`}>
            {statusConfig.pulse && (
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {statusConfig.label}
          </Badge>
        </div>
        {cropType && (
          <div className="flex items-center gap-2 mt-2 text-primary-foreground/80">
            <Leaf className="w-4 h-4" />
            <span className="text-sm">Drying: {cropType}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Average Temperature */}
          <motion.div
            className={`p-4 rounded-xl border-2 transition-colors ${
              isNearTarget && status === "active"
                ? "border-green-500/50 bg-green-500/5"
                : "border-border bg-muted/30"
            }`}
            animate={
              status === "active" && isNearTarget
                ? { boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 8px rgba(34, 197, 94, 0.1)", "0 0 0 0 rgba(34, 197, 94, 0)"] }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Thermometer className="w-4 h-4" />
              <span className="text-xs font-medium">Avg. Temperature</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={averageTemperature.toFixed(1)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`text-3xl font-bold ${
                  isNearTarget ? "text-green-600 dark:text-green-400" : "text-foreground"
                }`}
              >
                {averageTemperature.toFixed(1)}°C
              </motion.p>
            </AnimatePresence>
            <div className="flex items-center gap-1 mt-1">
              <Target className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Target: {targetTemp}°C</span>
            </div>
          </motion.div>

          {/* Average Humidity */}
          <div className="p-4 rounded-xl border-2 border-border bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Droplets className="w-4 h-4" />
              <span className="text-xs font-medium">Avg. Humidity</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={averageHumidity.toFixed(1)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-3xl font-bold text-primary"
              >
                {averageHumidity.toFixed(1)}%
              </motion.p>
            </AnimatePresence>
            <span className="text-xs text-muted-foreground">Relative humidity</span>
          </div>

          {/* Active Trays */}
          <div className="p-4 rounded-xl border-2 border-border bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-medium">Active Trays</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {activeTraysCount}/{totalTraysCount}
            </p>
            <span className="text-xs text-muted-foreground">Trays online</span>
          </div>

          {/* Estimated Time */}
          <div className="p-4 rounded-xl border-2 border-border bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Time Remaining</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {getRemainingTime() || "--:--"}
            </p>
            <span className="text-xs text-muted-foreground">
              {estimatedCompletion ? `Est. ${estimatedCompletion.toLocaleTimeString()}` : "Not started"}
            </span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Overall Drying Progress</span>
            <span className="text-lg font-bold text-primary">{overallProgress.toFixed(0)}%</span>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Animated shimmer effect */}
            {status === "active" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Start (85% moisture)</span>
            <span>Target (15% moisture)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
