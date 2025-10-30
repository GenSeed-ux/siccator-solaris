import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GasSensorProps {
  vocLevel: number;
  threshold?: number;
  onThresholdExceeded?: () => void;
}

export function GasSensor({ vocLevel, threshold = 200, onThresholdExceeded }: GasSensorProps) {
  const isAlert = vocLevel > threshold;
  const percentage = Math.min((vocLevel / 400) * 100, 100);

  if (isAlert && onThresholdExceeded) {
    onThresholdExceeded();
  }

  return (
    <Card className={isAlert ? "border-red-500 border-2" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className={`h-5 w-5 ${isAlert ? "text-red-500" : "text-primary"}`} />
          MQ-135 Gas Sensor (VOC)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-3xl font-bold ${isAlert ? "text-red-500" : "text-foreground"}`}>
              {vocLevel.toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">PPM</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Threshold</p>
            <p className="text-sm font-medium text-foreground">{threshold} PPM</p>
          </div>
        </div>

        {/* Animated Progress */}
        <div className="space-y-2">
          <div className="h-4 bg-accent/20 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${isAlert ? "bg-red-500" : "bg-primary"}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>

        {isAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                VOC levels exceeded! Activating ventilation fan automatically.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Animated Airflow Indicator */}
        {isAlert && (
          <div className="relative h-12 flex items-center justify-center overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-1 bg-red-500/50 rounded-full"
                initial={{ x: -50, opacity: 0 }}
                animate={{
                  x: 150,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
            <Wind className="h-6 w-6 text-red-500 animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
