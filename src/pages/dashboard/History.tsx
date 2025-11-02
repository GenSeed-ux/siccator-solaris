import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";

const historyData = [
  {
    id: "DS-2024-001",
    cropType: "Maize",
    startTime: new Date(2024, 0, 15, 8, 30),
    endTime: new Date(2024, 0, 15, 16, 45),
    duration: "8h 15m",
    initialMoisture: 85,
    finalMoisture: 12,
    energyUsed: 12.4,
    efficiency: 92,
    status: "completed",
  },
  {
    id: "DS-2024-002",
    cropType: "Pepper",
    startTime: new Date(2024, 0, 16, 9, 0),
    endTime: new Date(2024, 0, 16, 15, 30),
    duration: "6h 30m",
    initialMoisture: 78,
    finalMoisture: 10,
    energyUsed: 9.8,
    efficiency: 89,
    status: "completed",
  },
  {
    id: "DS-2024-003",
    cropType: "Fish",
    startTime: new Date(2024, 0, 17, 7, 45),
    endTime: new Date(2024, 0, 17, 18, 15),
    duration: "10h 30m",
    initialMoisture: 92,
    finalMoisture: 15,
    energyUsed: 15.2,
    efficiency: 87,
    status: "completed",
  },
  {
    id: "DS-2024-004",
    cropType: "Cassava",
    startTime: new Date(2024, 0, 18, 8, 0),
    endTime: new Date(2024, 0, 18, 17, 0),
    duration: "9h 0m",
    initialMoisture: 88,
    finalMoisture: 13,
    energyUsed: 11.5,
    efficiency: 91,
    status: "completed",
  },
  {
    id: "DS-2024-005",
    cropType: "Maize",
    startTime: new Date(2024, 0, 19, 8, 30),
    endTime: null,
    duration: "5h 45m",
    initialMoisture: 83,
    finalMoisture: 45,
    energyUsed: 7.2,
    efficiency: 0,
    status: "stopped",
  },
];

const History = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
      stopped: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
      paused: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
    };
    
    return (
      <Badge className={variants[status] || variants.completed}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600 dark:text-green-400";
    if (efficiency >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Session History</h1>
                <p className="text-sm text-muted-foreground">View all past drying sessions and performance</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Filter Sessions</CardTitle>
                  <CardDescription>Search and filter historical drying sessions</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by ID or crop type..." className="pl-10" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="stopped">Stopped</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Crop Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      <SelectItem value="maize">Maize</SelectItem>
                      <SelectItem value="pepper">Pepper</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="cassava">Cassava</SelectItem>
                      <SelectItem value="cocoa">Cocoa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sessions Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Drying Sessions</CardTitle>
                    <CardDescription>Complete history of all drying operations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session ID</TableHead>
                          <TableHead>Crop Type</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Moisture</TableHead>
                          <TableHead>Energy (kWh)</TableHead>
                          <TableHead>Efficiency</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historyData.map((session) => (
                          <TableRow key={session.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{session.id}</TableCell>
                            <TableCell>{session.cropType}</TableCell>
                            <TableCell>{format(session.startTime, "MMM dd, HH:mm")}</TableCell>
                            <TableCell>{session.duration}</TableCell>
                            <TableCell>
                              <span className="text-muted-foreground">{session.initialMoisture}%</span>
                              {" → "}
                              <span className="font-medium">{session.finalMoisture}%</span>
                            </TableCell>
                            <TableCell>{session.energyUsed.toFixed(1)}</TableCell>
                            <TableCell>
                              <span className={`font-semibold ${getEfficiencyColor(session.efficiency)}`}>
                                {session.efficiency > 0 ? `${session.efficiency}%` : "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>{getStatusBadge(session.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default History;
