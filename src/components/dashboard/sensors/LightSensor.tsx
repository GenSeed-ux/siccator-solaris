import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface LightSensorProps {
  intensity: number;
  timestamp: Date;
}

export function LightSensor({ intensity, timestamp }: LightSensorProps) {
  const isDaylight = intensity > 500;
  const percentage = Math.min((intensity / 1000) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isDaylight ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400" />
          )}
          LDR Light Sensor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{intensity.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">Lux</p>
          </div>
          <Badge variant={isDaylight ? "default" : "secondary"}>
            {isDaylight ? "Daylight" : "Night/Indoor"}
          </Badge>
        </div>

        {/* Animated Dial */}
        <div className="relative h-32 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 200 120">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="12"
              opacity="0.2"
            />
            {/* Animated arc */}
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={isDaylight ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Center icon */}
            {isDaylight ? (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <circle cx="100" cy="100" r="15" fill="hsl(var(--primary))" />
                <circle cx="100" cy="100" r="10" fill="hsl(var(--primary-foreground))" />
              </motion.g>
            ) : (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
              >
                <circle cx="100" cy="100" r="12" fill="hsl(var(--muted))" />
              </motion.g>
            )}
          </svg>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Last reading: {timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
