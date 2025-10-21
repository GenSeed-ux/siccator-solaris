import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Bell,
  BellOff,
  Search,
  Filter,
  Thermometer,
  Battery,
  Activity,
  Wind,
  Clock,
  MapPin,
  X,
} from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  device: string;
  location: string;
  timestamp: Date;
  acknowledged: boolean;
}

const DashboardAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      title: "Overheating Detected",
      message: "Top chamber temperature exceeded 75°C threshold",
      device: "SD-001",
      location: "Northern Region",
      timestamp: new Date(Date.now() - 10 * 60000),
      acknowledged: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Low Battery",
      message: "Battery level at 15%, charging required",
      device: "SD-045",
      location: "Eastern Region",
      timestamp: new Date(Date.now() - 25 * 60000),
      acknowledged: false,
    },
    {
      id: "3",
      type: "warning",
      title: "High VOC Detected",
      message: "Gas sensor reading above normal range",
      device: "SD-023",
      location: "Western Region",
      timestamp: new Date(Date.now() - 45 * 60000),
      acknowledged: true,
    },
    {
      id: "4",
      type: "info",
      title: "Maintenance Due",
      message: "Device scheduled for routine maintenance",
      device: "SD-012",
      location: "Southern Region",
      timestamp: new Date(Date.now() - 120 * 60000),
      acknowledged: true,
    },
    {
      id: "5",
      type: "success",
      title: "Session Completed",
      message: "Drying session finished successfully",
      device: "SD-034",
      location: "Northern Region",
      timestamp: new Date(Date.now() - 180 * 60000),
      acknowledged: true,
    },
    {
      id: "6",
      type: "critical",
      title: "Sensor Malfunction",
      message: "Temperature sensor not responding",
      device: "SD-067",
      location: "Eastern Region",
      timestamp: new Date(Date.now() - 5 * 60000),
      acknowledged: false,
    },
    {
      id: "7",
      type: "warning",
      title: "Low Airflow",
      message: "Fan speed below optimal threshold",
      device: "SD-089",
      location: "Western Region",
      timestamp: new Date(Date.now() - 60 * 60000),
      acknowledged: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Generate random alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types: Array<"critical" | "warning" | "info" | "success"> = ["critical", "warning", "info", "success"];
        const titles = ["Temperature Spike", "Low Battery", "High Humidity", "System Update"];
        const devices = ["SD-001", "SD-023", "SD-045", "SD-067"];
        
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)],
          title: titles[Math.floor(Math.random() * titles.length)],
          message: "Automatic system notification",
          device: devices[Math.floor(Math.random() * devices.length)],
          location: "Northern Region",
          timestamp: new Date(),
          acknowledged: false,
        };
        
        setAlerts(prev => [newAlert, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "warning":
        return "bg-energy/10 text-energy border-energy/20";
      case "info":
        return "bg-accent/10 text-accent border-accent/20";
      case "success":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "unread") return matchesSearch && !alert.acknowledged;
    return matchesSearch && alert.type === filterType;
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.type === "critical" && !a.acknowledged).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  {unacknowledgedCount} unread • {criticalCount} critical
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                {notificationsEnabled ? (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications On
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4 mr-2" />
                    Notifications Off
                  </>
                )}
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                    <div>
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-energy" />
                    <div>
                      <p className="text-sm text-muted-foreground">Warnings</p>
                      <p className="text-2xl font-bold text-foreground">
                        {alerts.filter(a => a.type === "warning" && !a.acknowledged).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Info className="w-8 h-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Info</p>
                      <p className="text-2xl font-bold text-foreground">
                        {alerts.filter(a => a.type === "info").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Alerts</p>
                      <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts by title, device, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-6 w-full md:w-auto">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                      <TabsTrigger value="critical">Critical</TabsTrigger>
                      <TabsTrigger value="warning">Warning</TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="success">Success</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Alerts List */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Alert History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                          !alert.acknowledged ? "shadow-md" : "opacity-60"
                        } transition-all`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">{alert.title}</h4>
                                {!alert.acknowledged && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  {alert.device}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {alert.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {getTimeAgo(alert.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredAlerts.length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No alerts found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardAlerts;
