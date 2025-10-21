import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertTriangle, Thermometer, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LiveDevice {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: "online" | "offline" | "warning";
  temperature: number;
  humidity: number;
  battery: number;
  lastUpdate: string;
}

const mockLiveDevices: LiveDevice[] = [
  {
    id: "SD-001",
    name: "Solar Dryer Alpha",
    location: "Kisumu, Kenya",
    coordinates: { lat: -0.0917, lng: 34.7680 },
    status: "online",
    temperature: 58.5,
    humidity: 42,
    battery: 87,
    lastUpdate: "2s ago",
  },
  {
    id: "SD-002",
    name: "Solar Dryer Beta",
    location: "Nakuru, Kenya",
    coordinates: { lat: -0.3031, lng: 36.0800 },
    status: "warning",
    temperature: 72.3,
    humidity: 38,
    battery: 92,
    lastUpdate: "5s ago",
  },
  {
    id: "SD-003",
    name: "Solar Dryer Gamma",
    location: "Eldoret, Kenya",
    coordinates: { lat: 0.5143, lng: 35.2698 },
    status: "offline",
    temperature: 0,
    humidity: 0,
    battery: 15,
    lastUpdate: "2h ago",
  },
];

export default function DashboardMonitoring() {
  const [devices, setDevices] = useState<LiveDevice[]>(mockLiveDevices);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.status === "online" || device.status === "warning") {
            return {
              ...device,
              temperature: device.temperature + (Math.random() - 0.5) * 2,
              humidity: Math.max(0, Math.min(100, device.humidity + (Math.random() - 0.5) * 3)),
              battery: Math.max(0, device.battery - Math.random() * 0.1),
            };
          }
          return device;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: LiveDevice["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
    }
  };

  const getStatusBadge = (status: LiveDevice["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Monitoring Center</h1>
        <p className="text-muted-foreground">Real-time telemetry from all deployed devices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold">{devices.filter((d) => d.status === "online").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold">{devices.filter((d) => d.status === "warning").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold">{devices.filter((d) => d.status === "offline").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Temp</p>
                <p className="text-2xl font-bold">
                  {(
                    devices
                      .filter((d) => d.status !== "offline")
                      .reduce((sum, d) => sum + d.temperature, 0) /
                    devices.filter((d) => d.status !== "offline").length
                  ).toFixed(1)}
                  °C
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {devices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <Card className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(device.status)}`} />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{device.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{device.id}</p>
                        </div>
                        {getStatusBadge(device.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{device.location}</span>
                      </div>

                      {device.status !== "offline" && (
                        <motion.div
                          className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div>
                            <p className="text-xs text-muted-foreground">Temp</p>
                            <p className="text-lg font-bold">{device.temperature.toFixed(1)}°C</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Humidity</p>
                            <p className="text-lg font-bold">{device.humidity.toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Battery</p>
                            <p className="text-lg font-bold">{device.battery.toFixed(0)}%</p>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last update: {device.lastUpdate}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)} animate-pulse`} />
                          <span>Live</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card className="h-[600px]">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-lg font-semibold">Interactive Map View</p>
                <p className="text-sm text-muted-foreground">
                  Integrate with mapping service (Google Maps / Mapbox) to display device locations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
