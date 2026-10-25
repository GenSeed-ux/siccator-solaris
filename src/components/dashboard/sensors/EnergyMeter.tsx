import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface EnergyMeterProps {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  powerFactor: number;
  frequency: number;
}

export function EnergyMeter({ voltage, current, power, energy, powerFactor, frequency }: EnergyMeterProps) {
  return (
    <Card className="relative overflow-hidden glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          PZEM-004T Energy Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Voltage</p>
            <p className="text-2xl font-bold text-foreground">{voltage.toFixed(1)} V</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-2xl font-bold text-foreground">{current.toFixed(2)} A</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Power</p>
            <p className="text-2xl font-bold text-primary">{power.toFixed(0)} W</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Energy</p>
            <p className="text-2xl font-bold text-foreground">{energy.toFixed(2)} kWh</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Power Factor</p>
            <p className="text-lg font-semibold text-foreground">{powerFactor.toFixed(2)}</p>
            <Progress value={powerFactor * 100} className="h-2" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Frequency</p>
            <p className="text-lg font-semibold text-foreground">{frequency.toFixed(1)} Hz</p>
          </div>
        </div>

        {/* Animated Power Flow */}
        <div className="relative h-16 bg-accent/10 rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="ml-2 text-sm font-medium text-foreground">Power Flow Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
