import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  devicesAssigned: number;
  activeSessions: number;
  totalRevenue: number;
  joinedDate: string;
  status: "active" | "inactive";
}

const mockFarmers: Farmer[] = [
  {
    id: "F-001",
    name: "John Kamau",
    email: "john.kamau@example.com",
    phone: "+254 712 345 678",
    location: "Kisumu, Kenya",
    devicesAssigned: 2,
    activeSessions: 1,
    totalRevenue: 12500,
    joinedDate: "2024-01-15",
    status: "active",
  },
  {
    id: "F-002",
    name: "Mary Wanjiku",
    email: "mary.w@example.com",
    phone: "+254 723 456 789",
    location: "Nakuru, Kenya",
    devicesAssigned: 1,
    activeSessions: 1,
    totalRevenue: 8300,
    joinedDate: "2024-02-20",
    status: "active",
  },
  {
    id: "F-003",
    name: "Peter Odhiambo",
    email: "peter.o@example.com",
    phone: "+254 734 567 890",
    location: "Eldoret, Kenya",
    devicesAssigned: 1,
    activeSessions: 0,
    totalRevenue: 5600,
    joinedDate: "2024-03-10",
    status: "inactive",
  },
];

export default function DashboardFarmers() {
  const [farmers] = useState<Farmer[]>(mockFarmers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Farmer Management</h1>
          <p className="text-muted-foreground">Manage farmers and their device assignments</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Farmer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Farmers</p>
                <p className="text-2xl font-bold">{farmers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{farmers.filter((f) => f.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-500 font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${farmers.reduce((sum, f) => sum + f.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-500 font-bold">#</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{farmers.reduce((sum, f) => sum + f.activeSessions, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search farmers by name, email, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFarmers.map((farmer, index) => (
          <motion.div
            key={farmer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(farmer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{farmer.name}</CardTitle>
                      <Badge variant={farmer.status === "active" ? "default" : "secondary"}>
                        {farmer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{farmer.id}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{farmer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{farmer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{farmer.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Devices</p>
                    <p className="text-lg font-bold">{farmer.devicesAssigned}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    <p className="text-lg font-bold">{farmer.activeSessions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-lg font-bold">${farmer.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage Devices
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
