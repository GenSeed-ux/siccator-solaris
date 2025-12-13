import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Square, 
  Fan, 
  Settings2, 
  Leaf,
  Thermometer,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EnhancedControlPanelProps {
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
}

const CROP_PRESETS = [
  { name: "Maize/Corn", temp: 50, time: "6-8 hours" },
  { name: "Pepper/Chili", temp: 55, time: "8-12 hours" },
  { name: "Tomato", temp: 55, time: "10-14 hours" },
  { name: "Fish", temp: 45, time: "8-10 hours" },
  { name: "Cassava", temp: 50, time: "12-16 hours" },
  { name: "Mango", temp: 55, time: "10-14 hours" },
  { name: "Herbs", temp: 35, time: "4-6 hours" },
  { name: "Rice", temp: 45, time: "6-8 hours" },
];

export function EnhancedControlPanel({
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
}: EnhancedControlPanelProps) {
  const [tempSlider, setTempSlider] = useState(targetTemp);
  const [customCrop, setCustomCrop] = useState("");

  useEffect(() => {
    setTempSlider(targetTemp);
  }, [targetTemp]);

  const handlePresetSelect = (preset: typeof CROP_PRESETS[0]) => {
    onCropChange(preset.name);
    onTempChange(preset.temp);
    setTempSlider(preset.temp);
  };

  const isActive = status === "active";
  const isPaused = status === "paused";
  const canStart = cropType.length > 0 && !isActive;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Drying Controls</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure and manage your drying session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => mode === "manual" && onModeToggle()}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  mode === "auto"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => mode === "auto" && onModeToggle()}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  mode === "manual"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Manual
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Crop Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-primary" />
            Select Produce Type
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {CROP_PRESETS.map((preset) => (
              <TooltipProvider key={preset.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        cropType === preset.name
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-foreground hover:border-primary/50"
                      }`}
                    >
                      {preset.name.split("/")[0]}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Recommended: {preset.temp}°C • {preset.time}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Or enter custom produce type..."
              value={customCrop}
              onChange={(e) => setCustomCrop(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={() => {
                if (customCrop.trim()) {
                  onCropChange(customCrop.trim());
                  setCustomCrop("");
                }
              }}
              disabled={!customCrop.trim()}
            >
              Set
            </Button>
          </div>
          {cropType && (
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{cropType}</span>
            </p>
          )}
        </div>

        {/* Temperature Control */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            Target Drying Temperature
          </Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">30°C</span>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-primary">{tempSlider}°C</span>
              </div>
              <span className="text-sm text-muted-foreground">70°C</span>
            </div>
            <Slider
              value={[tempSlider]}
              onValueChange={([value]) => setTempSlider(value)}
              onValueCommit={([value]) => onTempChange(value)}
              min={30}
              max={70}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low (herbs)</span>
              <span>Medium (grains)</span>
              <span>High (fish)</span>
            </div>
          </div>
        </div>

        {/* Manual Fan Control */}
        <AnimatePresence>
          {mode === "manual" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <Label className="flex items-center gap-2">
                <Fan className={`w-4 h-4 text-primary ${isActive ? "animate-spin" : ""}`} />
                Manual Fan Speed
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[fanSpeed]}
                  onValueChange={([value]) => onFanControl(value)}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <div className="w-16 text-right">
                  <span className="text-lg font-bold text-foreground">{fanSpeed}%</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Off</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Max</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onStart}
                    disabled={!canStart}
                    className="w-full h-14 gradient-primary text-primary-foreground"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                {!cropType ? "Select a produce type first" : "Begin drying session"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onPause}
                    disabled={!isActive}
                    variant="secondary"
                    className="w-full h-14"
                    size="lg"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Pause the drying process</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onStop}
                    disabled={status === "idle"}
                    variant="destructive"
                    className="w-full h-14"
                    size="lg"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>End the drying session</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Status Display */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current Status</span>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  isActive
                    ? "bg-green-500"
                    : isPaused
                    ? "bg-yellow-500"
                    : status === "completed"
                    ? "bg-blue-500"
                    : "bg-muted-foreground"
                }`}
                animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-semibold text-foreground capitalize">
                {status}
              </span>
            </div>
          </div>
          {mode === "auto" && isActive && (
            <p className="text-xs text-muted-foreground mt-2">
              Auto mode: Fan speed automatically adjusts based on temperature readings
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
