import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  Users,
  Zap,
  DollarSign,
  Download,
  Calendar,
} from "lucide-react";

const DashboardAnalytics = () => {
  // Mock data for impact metrics
  const impactData = {
    co2Saved: 1247.5,
    co2Change: 12.3,
    energySaved: 3420,
    energyChange: 8.7,
    farmersServed: 156,
    farmersChange: 15,
    revenueIncrease: 34.2,
    revenueChange: 5.4,
    lossReduction: 42.8,
    lossChange: 3.2,
  };

  // Energy efficiency data
  const energyData = [
    { month: "Jan", solar: 85, grid: 15 },
    { month: "Feb", solar: 88, grid: 12 },
    { month: "Mar", solar: 90, grid: 10 },
    { month: "Apr", solar: 92, grid: 8 },
    { month: "May", solar: 95, grid: 5 },
    { month: "Jun", solar: 93, grid: 7 },
  ];

  // CO2 savings by region
  const co2RegionalData = [
    { name: "Northern", value: 420, color: "hsl(var(--primary))" },
    { name: "Eastern", value: 315, color: "hsl(var(--accent))" },
    { name: "Western", value: 287, color: "hsl(var(--secondary))" },
    { name: "Southern", value: 225, color: "hsl(var(--energy))" },
  ];

  // Crop performance data
  const cropPerformanceData = [
    { crop: "Mangoes", efficiency: 92, revenue: 45000, sessions: 124 },
    { crop: "Tomatoes", efficiency: 88, revenue: 38000, sessions: 98 },
    { crop: "Peppers", efficiency: 85, revenue: 32000, sessions: 87 },
    { crop: "Herbs", efficiency: 94, revenue: 28000, sessions: 76 },
    { crop: "Fish", efficiency: 90, revenue: 41000, sessions: 65 },
  ];

  // Post-harvest loss reduction
  const lossReductionData = [
    { month: "Jan", before: 35, after: 12 },
    { month: "Feb", before: 38, after: 10 },
    { month: "Mar", before: 42, after: 15 },
    { month: "Apr", before: 36, after: 11 },
    { month: "May", before: 40, after: 13 },
    { month: "Jun", before: 34, after: 9 },
  ];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Impact & Analytics</h1>
              <p className="text-sm text-muted-foreground">Sustainability metrics and performance insights</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => exportReport('full')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Key Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Leaf className="w-8 h-8 text-primary" />
                      <Badge variant="default" className="bg-primary/10 text-primary">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{impactData.co2Change}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-foreground">{impactData.co2Saved} kg</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-8 h-8 text-energy" />
                      <Badge variant="default" className="bg-energy/10 text-energy">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{impactData.energyChange}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Energy Saved</p>
                    <p className="text-2xl font-bold text-foreground">{impactData.energySaved} kWh</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-8 h-8 text-accent" />
                      <Badge variant="default" className="bg-accent/10 text-accent">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{impactData.farmersChange}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Farmers Served</p>
                    <p className="text-2xl font-bold text-foreground">{impactData.farmersServed}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 text-secondary" />
                      <Badge variant="default" className="bg-secondary/10 text-secondary-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{impactData.revenueChange}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Revenue Increase</p>
                    <p className="text-2xl font-bold text-foreground">{impactData.revenueIncrease}%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingDown className="w-8 h-8 text-forest" />
                      <Badge variant="default" className="bg-forest/10 text-forest-foreground">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -{impactData.lossChange}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Loss Reduction</p>
                    <p className="text-2xl font-bold text-foreground">{impactData.lossReduction}%</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="energy" className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="energy">Energy</TabsTrigger>
                <TabsTrigger value="co2">CO₂ Impact</TabsTrigger>
                <TabsTrigger value="crops">Crops</TabsTrigger>
              </TabsList>

              <TabsContent value="energy" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Energy Efficiency Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={energyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                          <Legend />
                          <Bar dataKey="solar" fill="hsl(var(--primary))" name="Solar %" />
                          <Bar dataKey="grid" fill="hsl(var(--muted))" name="Grid %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Post-Harvest Loss Reduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lossReductionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                          <Legend />
                          <Line type="monotone" dataKey="before" stroke="hsl(var(--destructive))" name="Before %" strokeWidth={2} />
                          <Line type="monotone" dataKey="after" stroke="hsl(var(--primary))" name="After %" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="co2" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>CO₂ Savings by Region</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={co2RegionalData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                          >
                            {co2RegionalData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Regional Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {co2RegionalData.map((region, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: region.color }} />
                              <span className="font-medium text-foreground">{region.name}</span>
                            </div>
                            <span className="text-lg font-bold text-foreground">{region.value} kg</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="crops" className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Crop Performance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Crop Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Efficiency</th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue</th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Sessions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cropPerformanceData.map((crop, index) => (
                            <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4 font-medium text-foreground">{crop.crop}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-full max-w-[100px] bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${crop.efficiency}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{crop.efficiency}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-foreground">${crop.revenue.toLocaleString()}</td>
                              <td className="py-3 px-4 text-foreground">{crop.sessions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardAnalytics;
