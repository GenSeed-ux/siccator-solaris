import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, 
  Droplets, 
  Clock, 
  Battery,
  TrendingUp,
  AlertCircle,
  Leaf
} from "lucide-react";

const Dashboard = () => {
  // Mock data - in production this would come from the device/backend
  const deviceStatus = {
    temperature: 45,
    humidity: 35,
    dryingTime: "2h 30m",
    batteryLevel: 85,
    status: "Active Drying"
  };

  const stats = [
    {
      title: "Temperature",
      value: `${deviceStatus.temperature}°C`,
      icon: Thermometer,
      color: "text-orange-500",
      trend: "+2°C"
    },
    {
      title: "Humidity",
      value: `${deviceStatus.humidity}%`,
      icon: Droplets,
      color: "text-blue-500",
      trend: "-5%"
    },
    {
      title: "Drying Time",
      value: deviceStatus.dryingTime,
      icon: Clock,
      color: "text-purple-500",
      trend: "On track"
    },
    {
      title: "Battery Level",
      value: `${deviceStatus.batteryLevel}%`,
      icon: Battery,
      color: "text-green-500",
      trend: "Good"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Siccator Solaris Dashboard</h1>
                <p className="text-sm text-muted-foreground">Device ID: DEMO-001</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {deviceStatus.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Current Drying Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Crop Type:</span>
                  <span className="font-medium text-foreground">Tomatoes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Start Time:</span>
                  <span className="font-medium text-foreground">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Completion:</span>
                  <span className="font-medium text-foreground">1:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-medium text-foreground">65%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="gradient-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30"
        >
          <p className="text-sm text-muted-foreground text-center">
            <strong>Note:</strong> This is a demo dashboard. In production, real-time data from your Siccator Solaris device would be displayed here.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
