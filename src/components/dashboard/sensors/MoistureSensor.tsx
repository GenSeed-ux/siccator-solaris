import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface MoistureSensorProps {
  moistureLevel: number;
  initialMoisture?: number;
  estimatedCompletion?: Date;
}

export function MoistureSensor({ 
  moistureLevel, 
  initialMoisture = 100,
  estimatedCompletion 
}: MoistureSensorProps) {
  const dryingProgress = initialMoisture > 0 
    ? Math.max(0, ((initialMoisture - moistureLevel) / initialMoisture) * 100)
    : 0;
  
  const getStatusColor = () => {
    if (moistureLevel < 20) return "text-green-500";
    if (moistureLevel < 40) return "text-yellow-500";
    return "text-blue-500";
  };

  const getStatusText = () => {
    if (moistureLevel < 20) return "Nearly Complete";
    if (moistureLevel < 40) return "Drying Well";
    return "In Progress";
  };

  const remainingTime = estimatedCompletion 
    ? Math.max(0, Math.floor((estimatedCompletion.getTime() - Date.now()) / 60000))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          Soil/Produce Moisture Sensor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-4xl font-bold ${getStatusColor()}`}>
              {moistureLevel.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Current Moisture</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{getStatusText()}</p>
            {remainingTime !== null && (
              <p className="text-xs text-muted-foreground mt-1">
                ~{remainingTime}min remaining
              </p>
            )}
          </div>
        </div>

        {/* Animated Drying Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Drying Progress</span>
            <span className="font-medium text-foreground">{dryingProgress.toFixed(0)}%</span>
          </div>
          <Progress value={dryingProgress} className="h-3" />
        </div>

        {/* AI Prediction */}
        {estimatedCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-primary/10 rounded-lg border border-primary/30"
          >
            <p className="text-xs font-medium text-primary mb-1">AI Prediction</p>
            <p className="text-sm text-foreground">
              Estimated completion: {estimatedCompletion.toLocaleTimeString()}
            </p>
          </motion.div>
        )}

        {/* Animated Droplet Visual */}
        <div className="relative h-24 flex items-center justify-center">
          <div className="relative">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <defs>
                <clipPath id="droplet-clip">
                  <path d="M 30 10 Q 10 30 10 50 Q 10 70 30 70 Q 50 70 50 50 Q 50 30 30 10 Z" />
                </clipPath>
              </defs>
              {/* Droplet outline */}
              <path
                d="M 30 10 Q 10 30 10 50 Q 10 70 30 70 Q 50 70 50 50 Q 50 30 30 10 Z"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              {/* Animated fill */}
              <g clipPath="url(#droplet-clip)">
                <motion.rect
                  x="0"
                  y="10"
                  width="60"
                  height="70"
                  fill="hsl(var(--primary))"
                  opacity="0.6"
                  initial={{ y: 80 }}
                  animate={{ y: 80 - (moistureLevel / 100) * 60 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {moistureLevel.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
