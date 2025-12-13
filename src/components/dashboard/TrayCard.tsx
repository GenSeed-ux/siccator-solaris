import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplets, Droplet, Wifi, WifiOff, AlertTriangle } from "lucide-react";
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

  const getStatusBadge = () => {
    switch (tray.status) {
      case "active":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            Active
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Error
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <WifiOff className="w-3 h-3" />
            Offline
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Idle
          </Badge>
        );
    }
  };

  const dryingProgress = Math.max(0, Math.min(100, ((85 - tray.moistureLevel) / (85 - 15)) * 100));

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        <Card
          className={`h-full transition-all duration-300 ${
            isActive && tray.status === "active"
              ? "border-2 border-primary/50 shadow-md"
              : tray.status === "error"
              ? "border-2 border-destructive/50"
              : "border border-border"
          }`}
        >
          {/* Animated active indicator */}
          {isActive && tray.status === "active" && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 gradient-primary rounded-t-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tray.status === "active"
                      ? "gradient-primary"
                      : tray.status === "error"
                      ? "bg-destructive"
                      : "bg-muted"
                  }`}
                >
                  <span className="text-lg font-bold text-primary-foreground">
                    {tray.trayNumber}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Tray {tray.trayNumber}</h3>
                  <p className="text-xs text-muted-foreground">
                    {tray.lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {getStatusBadge()}
            </div>

            {/* Sensor Readings */}
            <div className="grid grid-cols-3 gap-3">
              {/* Temperature */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`p-3 rounded-lg text-center cursor-help transition-colors ${
                      isOverTemp
                        ? "bg-red-500/10 border border-red-500/30"
                        : isNearTarget && tray.status === "active"
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-muted/50"
                    }`}
                    animate={
                      isNearTarget && tray.status === "active"
                        ? { boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 4px rgba(34, 197, 94, 0.1)", "0 0 0 0 rgba(34, 197, 94, 0)"] }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Thermometer
                      className={`w-4 h-4 mx-auto mb-1 ${
                        isOverTemp ? "text-red-500" : "text-primary"
                      }`}
                    />
                    <p
                      className={`text-lg font-bold ${
                        isOverTemp
                          ? "text-red-500"
                          : isNearTarget && tray.status === "active"
                          ? "text-green-600 dark:text-green-400"
                          : "text-foreground"
                      }`}
                    >
                      {tray.temperature.toFixed(1)}°
                    </p>
                    <p className="text-[10px] text-muted-foreground">Temp</p>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Temperature reading from DHT22 sensor</p>
                  <p className="text-xs text-muted-foreground">Target: {targetTemp}°C</p>
                </TooltipContent>
              </Tooltip>

              {/* Humidity */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-3 rounded-lg bg-muted/50 text-center cursor-help">
                    <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <p className="text-lg font-bold text-foreground">
                      {tray.humidity.toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Humidity</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Relative humidity from DHT22 sensor</p>
                  <p className="text-xs text-muted-foreground">Optimal: 30-50%</p>
                </TooltipContent>
              </Tooltip>

              {/* Moisture */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`p-3 rounded-lg text-center cursor-help ${
                      tray.moistureLevel < 20
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-muted/50"
                    }`}
                  >
                    <Droplet
                      className={`w-4 h-4 mx-auto mb-1 ${
                        tray.moistureLevel < 20 ? "text-green-500" : "text-accent"
                      }`}
                    />
                    <p
                      className={`text-lg font-bold ${
                        tray.moistureLevel < 20
                          ? "text-green-600 dark:text-green-400"
                          : "text-foreground"
                      }`}
                    >
                      {tray.moistureLevel.toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Moisture</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Produce moisture level</p>
                  <p className="text-xs text-muted-foreground">Target: 15%</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Drying Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Drying Progress</span>
                <span className="font-medium text-foreground">{dryingProgress.toFixed(0)}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    dryingProgress > 80
                      ? "bg-green-500"
                      : dryingProgress > 40
                      ? "bg-primary"
                      : "bg-accent"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dryingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
