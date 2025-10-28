import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RealtimeChart } from "@/components/dashboard/RealtimeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Droplets,
  Clock,
  Battery,
  Fan,
  Sun,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  // Mock real-time data
  const deviceStatus = {
    temperature: 45,
    humidity: 35,
    dryingTime: "2h 30m",
    batteryLevel: 85,
    solarInput: 850,
    fanSpeed: 75,
    status: "Active Drying",
    progress: 65,
  };

  const metrics = [
    {
      title: "Temperature",
      value: `${deviceStatus.temperature}°C`,
      icon: Thermometer,
      trend: "Optimal range",
      status: "good" as const,
    },
    {
      title: "Humidity",
      value: `${deviceStatus.humidity}%`,
      icon: Droplets,
      trend: "Decreasing",
      status: "good" as const,
    },
    {
      title: "Battery Level",
      value: `${deviceStatus.batteryLevel}%`,
      icon: Battery,
      trend: "Charging",
      status: "good" as const,
    },
    {
      title: "Solar Input",
      value: `${deviceStatus.solarInput}W`,
      icon: Sun,
      trend: "Peak hours",
      status: "good" as const,
    },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
                  <p className="text-sm text-muted-foreground">Real-time monitoring and AI insights</p>
                </div>
              </div>
              <Badge className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 hover:bg-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {deviceStatus.status}
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MetricCard {...metric} />
                </motion.div>
              ))}
            </motion.div>

            {/* Current Session & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Current Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Crop Type</span>
                        <span className="font-medium text-foreground">Tomatoes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Start Time</span>
                        <span className="font-medium text-foreground">10:30 AM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Est. Completion</span>
                        <span className="font-medium text-foreground">1:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Fan Speed</span>
                        <span className="font-medium text-foreground">{deviceStatus.fanSpeed}%</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{deviceStatus.progress}%</span>
                      </div>
                      <Progress value={deviceStatus.progress} className="h-3" />
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Fan className="h-4 w-4 animate-spin" />
                      <span>Active drying in progress...</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <RealtimeChart />
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AIInsights />
            </motion.div>

            {/* Info Alert */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-accent/10 rounded-lg border border-accent/30 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <strong>Demo Mode:</strong> This dashboard displays simulated real-time data. 
                  In production, it will connect to your Siccator Solaris device via IoT sensors 
                  for live monitoring and AI-powered optimization.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
