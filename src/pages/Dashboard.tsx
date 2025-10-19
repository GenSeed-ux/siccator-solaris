import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Battery,
  Power,
  Download,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

interface SensorData {
  timestamp: string;
  topTemp: number;
  bottomTemp: number;
  topHumidity: number;
  bottomHumidity: number;
  moisture: number;
  vocGas: number;
}

const Dashboard = () => {
  const [heaterOn, setHeaterOn] = useState(false);
  const [fanOn, setFanOn] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData>({
    timestamp: new Date().toLocaleTimeString(),
    topTemp: 52,
    bottomTemp: 48,
    topHumidity: 35,
    bottomHumidity: 42,
    moisture: 18,
    vocGas: 250,
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: SensorData = {
        timestamp: new Date().toLocaleTimeString(),
        topTemp: 45 + Math.random() * 15,
        bottomTemp: 42 + Math.random() * 12,
        topHumidity: 30 + Math.random() * 15,
        bottomHumidity: 35 + Math.random() * 15,
        moisture: 15 + Math.random() * 10,
        vocGas: 200 + Math.random() * 100,
      };

      setCurrentData(newData);
      setSensorData((prev) => [...prev.slice(-19), newData]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: Thermometer,
      label: "Top Temperature",
      value: `${currentData.topTemp.toFixed(1)}°C`,
      status: currentData.topTemp > 60 ? "warning" : "normal",
      color: "text-orange-500",
    },
    {
      icon: Thermometer,
      label: "Bottom Temperature",
      value: `${currentData.bottomTemp.toFixed(1)}°C`,
      status: "normal",
      color: "text-orange-400",
    },
    {
      icon: Droplets,
      label: "Top Humidity",
      value: `${currentData.topHumidity.toFixed(1)}%`,
      status: "normal",
      color: "text-blue-500",
    },
    {
      icon: Droplets,
      label: "Bottom Humidity",
      value: `${currentData.bottomHumidity.toFixed(1)}%`,
      status: "normal",
      color: "text-blue-400",
    },
    {
      icon: Wind,
      label: "Moisture Content",
      value: `${currentData.moisture.toFixed(1)}%`,
      status: currentData.moisture < 10 ? "success" : "normal",
      color: "text-teal-500",
    },
    {
      icon: Zap,
      label: "VOC Gas Level",
      value: `${currentData.vocGas.toFixed(0)} ppm`,
      status: currentData.vocGas > 400 ? "warning" : "normal",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Live Monitoring Dashboard</h1>
              <p className="text-muted-foreground">Device ID: DEMO-001 | Status: Active</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Battery className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Battery: 87%</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-glow transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                    </div>
                    <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                  </div>
                  {metric.status === "warning" && (
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  )}
                  {metric.status === "success" && (
                    <TrendingUp className="w-5 h-5 text-primary" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Temperature Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Temperature Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sensorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="topTemp"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Top"
                  />
                  <Line
                    type="monotone"
                    dataKey="bottomTemp"
                    stroke="#fb923c"
                    strokeWidth={2}
                    name="Bottom"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Manual Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Control Panel */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Manual Controls</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Power className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Heater</div>
                      <div className="text-sm text-muted-foreground">
                        {heaterOn ? "On" : "Off"}
                      </div>
                    </div>
                  </div>
                  <Switch checked={heaterOn} onCheckedChange={setHeaterOn} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Wind className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Fan</div>
                      <div className="text-sm text-muted-foreground">
                        {fanOn ? "On" : "Off"}
                      </div>
                    </div>
                  </div>
                  <Switch checked={fanOn} onCheckedChange={setFanOn} />
                </div>
              </div>
            </Card>

            {/* Session Progress */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Drying Session</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">67%</span>
                  </div>
                  <Progress value={67} className="h-3" />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Elapsed Time</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">16h 24m</span>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Est. Remaining</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">8h 12m</span>
                </div>

                <Button className="w-full gradient-primary text-primary-foreground mt-4">
                  Complete Session
                </Button>
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6 bg-accent/10 border-accent/30">
              <h2 className="text-lg font-bold text-foreground mb-4">AI Recommendations</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-foreground">
                    Maintain current temperature for optimal cocoa drying
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-foreground">
                    Consider increasing fan speed after 2 hours
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-foreground">
                    Target moisture content will be reached in ~8 hours
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Humidity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Humidity Levels</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="topHumidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Top"
                />
                <Line
                  type="monotone"
                  dataKey="bottomHumidity"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  name="Bottom"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
