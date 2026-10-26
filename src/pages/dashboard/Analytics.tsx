import { GlassShell } from "@/components/dashboard/GlassShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Zap, Droplets, ThermometerSun, Activity } from "lucide-react";
import { motion } from "framer-motion";

const energyData = [
  { day: "Mon", solar: 12.4, grid: 2.1, battery: 5.2 },
  { day: "Tue", solar: 14.2, grid: 1.8, battery: 6.1 },
  { day: "Wed", solar: 11.8, grid: 2.5, battery: 4.8 },
  { day: "Thu", solar: 15.1, grid: 1.2, battery: 7.2 },
  { day: "Fri", solar: 13.6, grid: 1.9, battery: 5.9 },
  { day: "Sat", solar: 14.8, grid: 1.5, battery: 6.5 },
  { day: "Sun", solar: 12.9, grid: 2.0, battery: 5.5 },
];

const cropDistribution = [
  { name: "Maize", value: 35, color: "#4ade80" },
  { name: "Pepper", value: 25, color: "#fbbf24" },
  { name: "Fish", value: 20, color: "#38bdf8" },
  { name: "Cassava", value: 15, color: "#f87171" },
  { name: "Cocoa", value: 5, color: "#c084fc" },
];

const efficiencyData = [
  { month: "Jan", efficiency: 78, sessions: 12 },
  { month: "Feb", efficiency: 82, sessions: 15 },
  { month: "Mar", efficiency: 85, sessions: 18 },
  { month: "Apr", efficiency: 88, sessions: 20 },
  { month: "May", efficiency: 91, sessions: 22 },
  { month: "Jun", efficiency: 89, sessions: 19 },
];

const Analytics = () => {
  return (
    <GlassShell>
      <div className="w-full">
        
        <main className="flex-1 overflow-auto">
          <div className="glass-header sticky top-0 z-10 mx-3 mt-3 md:mx-4">
            <div className="flex items-center gap-4 px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">Performance insights and trends</p>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-4 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Energy Saved</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">847 kWh</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Drying Efficiency</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89.2%</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+3.1%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">126</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+18</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Water Removed</CardTitle>
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,847 L</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">-2.3%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Tabs */}
            <Tabs defaultValue="energy" className="space-y-4">
              <TabsList>
                <TabsTrigger value="energy">Energy Usage</TabsTrigger>
                <TabsTrigger value="crops">Crop Distribution</TabsTrigger>
                <TabsTrigger value="efficiency">Efficiency Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="energy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Energy Consumption</CardTitle>
                    <CardDescription>Solar, Grid, and Battery usage over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis dataKey="day" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Legend />
                        <Bar dataKey="solar" fill="#4ade80" name="Solar (kWh)" />
                        <Bar dataKey="grid" fill="#fbbf24" name="Grid (kWh)" />
                        <Bar dataKey="battery" fill="#38bdf8" name="Battery (kWh)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="crops" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Type Distribution</CardTitle>
                    <CardDescription>Breakdown of dried crops by percentage</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={cropDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                        >
                          {cropDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="efficiency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Efficiency Over Time</CardTitle>
                    <CardDescription>Monthly drying efficiency and session count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis dataKey="month" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" stroke="#4ade80" name="Efficiency %" strokeWidth={2} />
                        <Line type="monotone" dataKey="sessions" stroke="#fbbf24" name="Sessions" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </GlassShell>
  );
};

export default Analytics;
