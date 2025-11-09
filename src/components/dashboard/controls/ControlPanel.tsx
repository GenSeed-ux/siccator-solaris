import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { Play, Pause, Square, Fan, RefreshCw, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ControlPanelProps {
  status: "idle" | "active" | "paused" | "completed";
  mode: "auto" | "manual";
  targetTemp: number;
  cropType: string;
  fanSpeed: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onTempChange: (temp: number) => void;
  onCropChange: (crop: string) => void;
  onModeToggle: () => void;
  onFanControl: (speed: number) => void;
  onAlertReset: () => void;
}

export function ControlPanel({
  status,
  mode,
  targetTemp,
  cropType,
  fanSpeed,
  onStart,
  onPause,
  onStop,
  onTempChange,
  onCropChange,
  onModeToggle,
  onFanControl,
  onAlertReset,
}: ControlPanelProps) {
  const [tempInput, setTempInput] = useState(targetTemp.toString());

  const handleTempSubmit = () => {
    const temp = parseFloat(tempInput);
    if (!isNaN(temp) && temp >= 30 && temp <= 70) {
      onTempChange(temp);
    }
  };

  const isActive = status === "active";
  const isPaused = status === "paused";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Control Panel</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <Switch checked={mode === "auto"} onCheckedChange={onModeToggle} />
            <span className="text-sm font-medium text-foreground">
              {mode === "auto" ? "Auto" : "Manual"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Control */}
        <div className="space-y-2">
          <Label htmlFor="target-temp">Target Drying Temperature</Label>
          <div className="flex gap-2">
            <Input
              id="target-temp"
              type="number"
              min="30"
              max="70"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTempSubmit} variant="secondary">
              Set
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Current: {targetTemp}°C (Range: 30-70°C)
          </p>
        </div>

        {/* Crop Type Input */}
        <div className="space-y-2">
          <Label htmlFor="crop-type">Agricultural Produce Type</Label>
          <Input
            id="crop-type"
            type="text"
            placeholder="Enter your produce type (e.g., Maize, Pepper, Fish)"
            value={cropType}
            onChange={(e) => onCropChange(e.target.value)}
          />
        </div>

        {/* Drying Controls */}
        <div className="space-y-2">
          <Label>Drying Process Controls</Label>
          <div className="grid grid-cols-3 gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onStart}
                disabled={isActive}
                className="w-full"
                variant={isActive ? "secondary" : "default"}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onPause}
                disabled={!isActive}
                className="w-full"
                variant="secondary"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onStop}
                disabled={status === "idle"}
                className="w-full"
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Manual Fan Control */}
        {mode === "manual" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="fan-speed">Manual Fan Control</Label>
            <div className="flex items-center gap-3">
              <Fan className={`h-5 w-5 text-primary ${isActive ? "animate-spin" : ""}`} />
              <Input
                id="fan-speed"
                type="range"
                min="0"
                max="100"
                value={fanSpeed}
                onChange={(e) => onFanControl(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-foreground w-12">
                {fanSpeed}%
              </span>
            </div>
          </motion.div>
        )}

        {/* Alert Reset */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onAlertReset} variant="outline" className="w-full">
            <Bell className="h-4 w-4 mr-2" />
            Reset Alerts
          </Button>
        </motion.div>

        {/* Status Indicator */}
        <div className="p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Status:</span>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-green-500" : isPaused ? "bg-yellow-500" : "bg-muted"
                }`}
                animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-semibold text-foreground capitalize">
                {status}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
