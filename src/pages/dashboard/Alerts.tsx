import { GlassShell } from "@/components/dashboard/GlassShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell, BellOff, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const activeAlerts = [
  {
    id: 1,
    type: "critical",
    title: "High VOC Levels Detected",
    message: "VOC levels exceeded 400 ppm threshold. Fan speed automatically increased to maximum.",
    timestamp: new Date(),
    sensor: "MQ-135",
    acknowledged: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Temperature Fluctuation",
    message: "Top chamber temperature varying beyond ±5°C range. Check solar panel alignment.",
    timestamp: new Date(Date.now() - 1800000),
    sensor: "DHT22-1",
    acknowledged: false,
  },
  {
    id: 3,
    type: "info",
    title: "Low Light Conditions",
    message: "Light intensity below 300 lux. System switched to battery backup mode.",
    timestamp: new Date(Date.now() - 3600000),
    sensor: "LDR",
    acknowledged: true,
  },
];

const alertHistory = [
  {
    id: 4,
    type: "warning",
    title: "High Humidity Alert",
    message: "Bottom chamber humidity exceeded 85%. Ventilation increased.",
    timestamp: new Date(Date.now() - 86400000),
    sensor: "DHT22-2",
    resolved: true,
  },
  {
    id: 5,
    type: "critical",
    title: "Power Supply Interruption",
    message: "Solar input dropped to zero. System running on battery backup.",
    timestamp: new Date(Date.now() - 172800000),
    sensor: "PZEM-004T",
    resolved: true,
  },
];

const Alerts = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getAlertBadge = (type: string) => {
    const variants: Record<string, string> = {
      critical: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
      warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
      info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    };
    
    return (
      <Badge className={variants[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <GlassShell>
      <div className="w-full">
        
        <main className="flex-1 overflow-auto">
          <div className="glass-header sticky top-0 z-10 mx-3 mt-3 md:mx-4">
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Alert Center</h1>
                <p className="text-sm text-muted-foreground">Monitor and manage system alerts and notifications</p>
              </div>
              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30 px-3 py-1">
                {activeAlerts.filter(a => !a.acknowledged).length} Active
              </Badge>
            </div>
          </div>

          <div className="p-3 md:p-4 space-y-6">
            {/* Alert Settings */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Alert Settings</CardTitle>
                  <CardDescription>Configure notification thresholds and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notification Channels
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-alerts">Email Alerts</Label>
                          <Switch id="email-alerts" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-alerts">SMS Alerts</Label>
                          <Switch id="sms-alerts" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-alerts">Push Notifications</Label>
                          <Switch id="push-alerts" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Alert Thresholds</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="voc-threshold">VOC Threshold (ppm)</Label>
                          <Input id="voc-threshold" type="number" defaultValue="400" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="temp-threshold">Temp Variance (°C)</Label>
                          <Input id="temp-threshold" type="number" defaultValue="5" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="humidity-threshold">Humidity Max (%)</Label>
                          <Input id="humidity-threshold" type="number" defaultValue="85" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Save Settings</Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Alerts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>Current alerts requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        alert.acknowledged ? "bg-muted/50" : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{alert.title}</h4>
                            {getAlertBadge(alert.type)}
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Sensor: {alert.sensor}</span>
                            <span>{format(alert.timestamp, "MMM dd, HH:mm:ss")}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!alert.acknowledged && (
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Alert History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Alert History</CardTitle>
                  <CardDescription>Recently resolved alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alertHistory.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                              Resolved
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Sensor: {alert.sensor}</span>
                            <span>{format(alert.timestamp, "MMM dd, HH:mm")}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </GlassShell>
  );
};

export default Alerts;
