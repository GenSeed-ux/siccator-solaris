import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Power, Battery, Thermometer, Droplets, Wind, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Device {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  temperature: number;
  humidity: number;
  battery: number;
  farmer: string;
  cropType: string;
  sessionActive: boolean;
}

const mockDevices: Device[] = [
  {
    id: "SD-001",
    name: "Solar Dryer Alpha",
    location: "Kisumu, Kenya",
    status: "online",
    temperature: 58.5,
    humidity: 42,
    battery: 87,
    farmer: "John Kamau",
    cropType: "Maize",
    sessionActive: true,
  },
  {
    id: "SD-002",
    name: "Solar Dryer Beta",
    location: "Nakuru, Kenya",
    status: "online",
    temperature: 62.3,
    humidity: 38,
    battery: 92,
    farmer: "Mary Wanjiku",
    cropType: "Cassava",
    sessionActive: true,
  },
  {
    id: "SD-003",
    name: "Solar Dryer Gamma",
    location: "Eldoret, Kenya",
    status: "offline",
    temperature: 0,
    humidity: 0,
    battery: 15,
    farmer: "Peter Odhiambo",
    cropType: "None",
    sessionActive: false,
  },
];

export default function DashboardDevices() {
  const [devices] = useState<Device[]>(mockDevices);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device Management</h1>
          <p className="text-muted-foreground">Monitor and control all smart solar dryers</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Register Device
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search devices by ID, name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{device.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`} />
                    <Badge variant={device.status === "online" ? "default" : "secondary"}>
                      {device.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{device.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Farmer</span>
                    <span className="font-medium">{device.farmer}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Crop Type</span>
                    <span className="font-medium">{device.cropType}</span>
                  </div>
                </div>

                {device.status === "online" && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="text-sm font-bold">{device.temperature}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="text-sm font-bold">{device.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Battery</p>
                        <p className="text-sm font-bold">{device.battery}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Power className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Session</p>
                        <p className="text-sm font-bold">{device.sessionActive ? "Active" : "Idle"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Control
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
