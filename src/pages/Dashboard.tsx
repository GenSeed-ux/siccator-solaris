import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Activity,
  Gauge,
  Sun,
  CloudRain,
  ChevronUp,
  ChevronDown,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react";

interface SensorData {
  timestamp: string;
  time: string;
  topTemp: number;
  bottomTemp: number;
  ambientTemp: number;
  topHumidity: number;
  bottomHumidity: number;
  ambientHumidity: number;
  moisture: number;
  vocGas: number;
  solarPower: number;
  batteryLevel: number;
  airflow: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
}

const Dashboard = () => {
  const [heaterOn, setHeaterOn] = useState(false);
  const [fanOn, setFanOn] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'info', message: 'Drying session started', timestamp: '14:30' },
    { id: '2', type: 'success', message: 'Optimal temperature reached', timestamp: '15:45' },
  ]);
  
  const [currentData, setCurrentData] = useState<SensorData>({
    timestamp: new Date().toLocaleTimeString(),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    topTemp: 52,
    bottomTemp: 48,
    ambientTemp: 28,
    topHumidity: 35,
    bottomHumidity: 42,
    ambientHumidity: 65,
    moisture: 18,
    vocGas: 250,
    solarPower: 450,
    batteryLevel: 87,
    airflow: 3.2,
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: SensorData = {
        timestamp: new Date().toLocaleTimeString(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        topTemp: 45 + Math.random() * 15,
        bottomTemp: 42 + Math.random() * 12,
        ambientTemp: 26 + Math.random() * 4,
        topHumidity: 30 + Math.random() * 15,
        bottomHumidity: 35 + Math.random() * 15,
        ambientHumidity: 60 + Math.random() * 10,
        moisture: 15 + Math.random() * 10,
        vocGas: 200 + Math.random() * 100,
        solarPower: 400 + Math.random() * 150,
        batteryLevel: 85 + Math.random() * 5,
        airflow: 2.8 + Math.random() * 1,
      };

      setCurrentData(newData);
      setSensorData((prev) => [...prev.slice(-29), newData]);

      // Add alert for high temperature
      if (newData.topTemp > 58 && Math.random() > 0.95) {
        setAlerts(prev => [{
          id: Date.now().toString(),
          type: 'warning',
          message: 'Temperature exceeding optimal range',
          timestamp: newData.time
        }, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const primaryMetrics = [
    {
      icon: Thermometer,
      label: "Chamber Temperature",
      value: `${currentData.topTemp.toFixed(1)}°C`,
      subValue: `Bottom: ${currentData.bottomTemp.toFixed(1)}°C`,
      trend: currentData.topTemp > 50 ? 'up' : 'stable',
      status: currentData.topTemp > 60 ? "warning" : currentData.topTemp > 45 ? "success" : "normal",
      color: "hsl(var(--energy))",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Droplets,
      label: "Humidity Level",
      value: `${currentData.topHumidity.toFixed(1)}%`,
      subValue: `Ambient: ${currentData.ambientHumidity.toFixed(1)}%`,
      trend: currentData.topHumidity < 40 ? 'down' : 'stable',
      status: "normal",
      color: "hsl(var(--forest-600))",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Wind,
      label: "Moisture Content",
      value: `${currentData.moisture.toFixed(1)}%`,
      subValue: `Airflow: ${currentData.airflow.toFixed(1)} m/s`,
      trend: currentData.moisture < 18 ? 'down' : 'stable',
      status: currentData.moisture < 10 ? "success" : currentData.moisture > 25 ? "warning" : "normal",
      color: "hsl(var(--forest))",
      bgColor: "bg-teal-500/10",
    },
    {
      icon: Sun,
      label: "Solar Power",
      value: `${currentData.solarPower.toFixed(0)}W`,
      subValue: `Battery: ${currentData.batteryLevel.toFixed(0)}%`,
      trend: currentData.solarPower > 450 ? 'up' : 'stable',
      status: "success",
      color: "hsl(var(--energy))",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const secondaryMetrics = [
    { label: "VOC Level", value: `${currentData.vocGas.toFixed(0)} ppm`, icon: Zap },
    { label: "Ambient Temp", value: `${currentData.ambientTemp.toFixed(1)}°C`, icon: Thermometer },
    { label: "Energy Usage", value: `${(heaterOn ? 250 : 0) + (fanOn ? 50 : 0)}W`, icon: Power },
    { label: "System Uptime", value: "16h 24m", icon: Clock },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest to-energy flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    Live Monitoring Dashboard
                    <Badge variant="default" className="bg-forest">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1.5" />
                      Active
                    </Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground">Device: SOLA-DEMO-001 • Cocoa Drying Session</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Battery className="w-4 h-4 text-forest" />
                <span className="text-sm font-medium">{currentData.batteryLevel.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Activity className="w-4 h-4 text-energy" />
                <span className="text-sm font-medium">3.2 kWh</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
                <Badge variant="secondary" className="ml-1">{alerts.length}</Badge>
              </Button>
              <Button size="sm" className="gap-2 bg-forest hover:bg-forest/90">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                    </div>
                    {metric.trend && (
                      <Badge variant={metric.status === "success" ? "default" : metric.status === "warning" ? "destructive" : "secondary"} className="text-xs">
                        {metric.trend === 'up' && <ChevronUp className="w-3 h-3" />}
                        {metric.trend === 'down' && <ChevronDown className="w-3 h-3" />}
                        {metric.status === "success" ? "Optimal" : metric.status === "warning" ? "High" : "Normal"}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.subValue}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabbed Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-forest" />
                    Real-Time Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="temperature" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="temperature">Temperature</TabsTrigger>
                      <TabsTrigger value="humidity">Humidity</TabsTrigger>
                      <TabsTrigger value="energy">Energy</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="temperature" className="mt-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={sensorData}>
                          <defs>
                            <linearGradient id="topTempGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="bottomTempGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="topTemp"
                            stroke="#f97316"
                            fillOpacity={1}
                            fill="url(#topTempGradient)"
                            strokeWidth={2}
                            name="Top Chamber (°C)"
                          />
                          <Area
                            type="monotone"
                            dataKey="bottomTemp"
                            stroke="#fb923c"
                            fillOpacity={1}
                            fill="url(#bottomTempGradient)"
                            strokeWidth={2}
                            name="Bottom Chamber (°C)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="humidity" className="mt-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={sensorData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="topHumidity"
                            stroke="hsl(var(--forest-600))"
                            strokeWidth={2}
                            name="Chamber (%)"
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="ambientHumidity"
                            stroke="hsl(var(--forest))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Ambient (%)"
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="energy" className="mt-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={sensorData}>
                          <defs>
                            <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--energy))" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="hsl(var(--energy))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="solarPower"
                            stroke="hsl(var(--energy))"
                            fillOpacity={1}
                            fill="url(#solarGradient)"
                            strokeWidth={2}
                            name="Solar Power (W)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {/* Secondary Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {secondaryMetrics.map((metric, index) => (
                      <div key={index} className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <metric.icon className="w-5 h-5 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground text-center mb-1">{metric.label}</p>
                        <p className="text-lg font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Alerts Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-forest" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {alerts.map((alert) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            alert.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/20' :
                            alert.type === 'success' ? 'bg-forest/10 border border-forest/20' :
                            'bg-muted/50 border border-border'
                          }`}
                        >
                          <AlertCircle className={`w-4 h-4 mt-0.5 ${
                            alert.type === 'warning' ? 'text-orange-500' :
                            alert.type === 'success' ? 'text-forest' :
                            'text-muted-foreground'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Controls and Status */}
          <div className="space-y-6">
            {/* Auto Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className={autoMode ? "border-forest/50 bg-forest/5" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <p className="font-semibold">Auto Mode</p>
                        <p className="text-xs text-muted-foreground">AI-Optimized Control</p>
                      </div>
                    </div>
                    <Switch checked={autoMode} onCheckedChange={setAutoMode} />
                  </div>
                  {autoMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-4 border-t border-border"
                    >
                      <p className="text-xs text-muted-foreground">
                        System is automatically adjusting parameters for optimal drying efficiency
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Manual Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manual Controls</CardTitle>
                  <p className="text-xs text-muted-foreground">Override automatic adjustments</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Power className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Heater</p>
                        <p className="text-xs text-muted-foreground">{heaterOn ? "Running" : "Standby"}</p>
                      </div>
                    </div>
                    <Switch checked={heaterOn} onCheckedChange={setHeaterOn} disabled={autoMode} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Wind className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Circulation Fan</p>
                        <p className="text-xs text-muted-foreground">{fanOn ? "Running" : "Stopped"}</p>
                      </div>
                    </div>
                    <Switch checked={fanOn} onCheckedChange={setFanOn} disabled={autoMode} />
                  </div>

                  {autoMode && (
                    <div className="p-3 rounded-lg bg-forest/10 border border-forest/20">
                      <p className="text-xs text-center text-muted-foreground">
                        Disable Auto Mode to use manual controls
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Session Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Drying Session</CardTitle>
                  <p className="text-xs text-muted-foreground">Cocoa beans • Batch #C-2024-042</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Overall Progress</span>
                      <span className="text-lg font-bold">67%</span>
                    </div>
                    <Progress value={67} className="h-3" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Elapsed</span>
                      </div>
                      <span className="text-sm font-semibold">16h 24m</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Remaining</span>
                      </div>
                      <span className="text-sm font-semibold">~8h 12m</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Efficiency</span>
                      </div>
                      <span className="text-sm font-semibold text-forest">94%</span>
                    </div>
                  </div>

                  <Button className="w-full bg-forest hover:bg-forest/90 mt-4">
                    Complete Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-forest/30 bg-gradient-to-br from-forest/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-forest" />
                    AI Insights
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Real-time optimization suggestions</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-card">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest mt-2 flex-shrink-0" />
                    <p className="text-sm">Current temperature range is optimal for cocoa drying</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-card">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest mt-2 flex-shrink-0" />
                    <p className="text-sm">Consider increasing fan speed in 2 hours to maintain airflow</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-card">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest mt-2 flex-shrink-0" />
                    <p className="text-sm">Target moisture content (12%) will be reached in ~8 hours</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-card">
                    <div className="w-1.5 h-1.5 rounded-full bg-energy mt-2 flex-shrink-0" />
                    <p className="text-sm">Solar panel efficiency at 92% - excellent weather conditions</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
        </div>
      </SidebarInset>
    </div>
    </SidebarProvider>
  );
};

export default Dashboard;
