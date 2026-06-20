import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrayCard } from "./TrayCard";
import { TraySensorData } from "@/hooks/useMultiTrayDrying";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrayGridProps {
  trays: TraySensorData[];
  targetTemp: number;
  isActive: boolean;
  trayCount: number;
  onAddTray: () => void;
  onRemoveTray: () => void;
}

export function TrayGrid({
  trays,
  targetTemp,
  isActive,
  trayCount,
  onAddTray,
  onRemoveTray,
}: TrayGridProps) {
  return (
    <div className="neofarm-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl lime-accent flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Drying Trays</h2>
            <p className="text-xs text-muted-foreground">
              {trayCount} trays • independent sensors
            </p>
          </div>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-2 bg-white/70 rounded-full p-1 border border-white/80">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemoveTray}
                  disabled={trayCount <= 2}
                  className="h-8 w-8 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove tray (min: 2)</TooltipContent>
            </Tooltip>
            <span className="text-sm font-bold text-foreground w-6 text-center">
              {trayCount}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onAddTray}
                  disabled={trayCount >= 8}
                  className="h-8 w-8 rounded-full lime-accent hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add tray (max: 8)</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {trays.map((tray, index) => (
              <motion.div
                key={tray.trayId}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <TrayCard
                  tray={tray}
                  targetTemp={targetTemp}
                  isActive={isActive}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Visual Dryer Representation */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground mb-3 text-center">Dryer Chamber Layout</p>
          <div className="flex flex-col items-center gap-1 max-w-xs mx-auto">
            {/* Top vent */}
            <div className="w-full h-3 bg-muted rounded-t-lg flex items-center justify-center">
              <motion.div
                className="flex gap-1"
                animate={isActive ? { opacity: [0.3, 1, 0.3] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-primary rounded-full" />
                ))}
              </motion.div>
            </div>
            
            {/* Trays stacked */}
            {[...trays].reverse().map((tray, index) => (
              <motion.div
                key={tray.trayId}
                className={`w-full h-6 rounded flex items-center justify-between px-3 text-xs ${
                  tray.status === "active"
                    ? "bg-primary/20 border border-primary/40"
                    : tray.status === "error"
                    ? "bg-destructive/20 border border-destructive/40"
                    : "bg-muted border border-border"
                }`}
                animate={
                  tray.status === "active" && isActive
                    ? { backgroundColor: ["rgba(34, 197, 94, 0.1)", "rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.1)"] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                <span className="font-medium text-foreground">T{tray.trayNumber}</span>
                <span className="text-muted-foreground">
                  {tray.temperature.toFixed(0)}° | {tray.moistureLevel.toFixed(0)}%
                </span>
              </motion.div>
            ))}
            
            {/* Bottom heat source */}
            <div className="w-full h-4 bg-accent/30 rounded-b-lg flex items-center justify-center border-t-2 border-accent/50">
              <motion.div
                className="flex gap-0.5"
                animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-accent rounded-full"
                    animate={isActive ? { height: [8, 12, 8] } : { height: 4 }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Heat rises from bottom • Airflow exits top
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
