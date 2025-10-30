import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface TemperatureHumidityProps {
  tempTop: number;
  humidityTop: number;
  tempBottom: number;
  humidityBottom: number;
  targetTemp?: number;
}

export function TemperatureHumidity({ 
  tempTop, 
  humidityTop, 
  tempBottom, 
  humidityBottom,
  targetTemp 
}: TemperatureHumidityProps) {
  const avgTemp = (tempTop + tempBottom) / 2;
  const avgHumidity = (humidityTop + humidityBottom) / 2;
  
  const getTempStatus = (temp: number) => {
    if (!targetTemp) return "text-foreground";
    const diff = Math.abs(temp - targetTemp);
    if (diff <= 2) return "text-green-500";
    if (diff <= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const tempPercentage = Math.min((avgTemp / 100) * 100, 100);
  const humidityPercentage = avgHumidity;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          DHT22 Sensors (Temperature & Humidity)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Display */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Average Temperature</p>
            <p className={`text-3xl font-bold ${getTempStatus(avgTemp)}`}>
              {avgTemp.toFixed(1)}°C
            </p>
            {targetTemp && (
              <p className="text-xs text-muted-foreground mt-1">
                Target: {targetTemp}°C
              </p>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Average Humidity</p>
            <p className="text-3xl font-bold text-primary">{avgHumidity.toFixed(1)}%</p>
          </div>
        </div>

        {/* Animated Gauges */}
        <div className="grid grid-cols-2 gap-4">
          {/* Temperature Gauge */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Temperature</p>
            <div className="relative h-40 flex items-end justify-center">
              <div className="w-16 bg-accent/20 rounded-t-full relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 to-orange-500 rounded-t-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${tempPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Thermometer className="h-8 w-8 text-white relative z-10" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">Top: {tempTop.toFixed(1)}°C</p>
              <p className="text-xs text-muted-foreground">Bottom: {tempBottom.toFixed(1)}°C</p>
            </div>
          </div>

          {/* Humidity Gauge */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Humidity</p>
            <div className="relative h-40 flex items-end justify-center">
              <div className="w-16 bg-accent/20 rounded-t-full relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${humidityPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-white relative z-10" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">Top: {humidityTop.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Bottom: {humidityBottom.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
