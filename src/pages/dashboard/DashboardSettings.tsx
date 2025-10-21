import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Building,
  Bell,
  Database,
  Smartphone,
  Mail,
  Download,
  Upload,
  Save,
  Shield,
} from "lucide-react";

const DashboardSettings = () => {
  const { toast } = useToast();
  
  // Organization settings
  const [orgName, setOrgName] = useState("Siccator Solaris");
  const [orgEmail, setOrgEmail] = useState("admin@siccatorsolaris.com");
  const [orgPhone, setOrgPhone] = useState("+1234567890");
  const [orgAddress, setOrgAddress] = useState("123 Green Tech Park, Eco City");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // System settings
  const [defaultTempUnit, setDefaultTempUnit] = useState("celsius");
  const [dataRetention, setDataRetention] = useState("90");
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Crop profiles
  const [cropProfiles, setCropProfiles] = useState([
    { name: "Mangoes", temp: 55, humidity: 30, duration: 48 },
    { name: "Tomatoes", temp: 60, humidity: 25, duration: 36 },
    { name: "Peppers", temp: 58, humidity: 28, duration: 40 },
    { name: "Fish", temp: 50, humidity: 35, duration: 24 },
  ]);

  const saveSettings = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download...",
    });
  };

  const backupDatabase = () => {
    toast({
      title: "Backup Initiated",
      description: "Database backup is in progress...",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
              <p className="text-sm text-muted-foreground">Configure and manage your system</p>
            </div>
            <ThemeToggle />
          </header>

          <main className="p-6">
            <Tabs defaultValue="organization" className="space-y-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-5">
                <TabsTrigger value="organization">
                  <Building className="w-4 h-4 mr-2" />
                  Organization
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="system">
                  <Settings className="w-4 h-4 mr-2" />
                  System
                </TabsTrigger>
                <TabsTrigger value="crops">
                  <Database className="w-4 h-4 mr-2" />
                  Crop Profiles
                </TabsTrigger>
                <TabsTrigger value="backup">
                  <Shield className="w-4 h-4 mr-2" />
                  Backup
                </TabsTrigger>
              </TabsList>

              {/* Organization Settings */}
              <TabsContent value="organization">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                    <CardDescription>Update your organization details and branding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input
                          id="orgName"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orgEmail">Email Address</Label>
                        <Input
                          id="orgEmail"
                          type="email"
                          value={orgEmail}
                          onChange={(e) => setOrgEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orgPhone">Phone Number</Label>
                        <Input
                          id="orgPhone"
                          value={orgPhone}
                          onChange={(e) => setOrgPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataRetention">Data Retention (days)</Label>
                        <Input
                          id="dataRetention"
                          type="number"
                          value={dataRetention}
                          onChange={(e) => setDataRetention(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orgAddress">Address</Label>
                      <Textarea
                        id="orgAddress"
                        value={orgAddress}
                        onChange={(e) => setOrgAddress(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button onClick={() => saveSettings("Organization")}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive alerts and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="email-notif" className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                        </div>
                        <Switch
                          id="email-notif"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="sms-notif" className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Get text message alerts</p>
                        </div>
                        <Switch
                          id="sms-notif"
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="whatsapp-notif" className="text-base">WhatsApp Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates on WhatsApp</p>
                        </div>
                        <Switch
                          id="whatsapp-notif"
                          checked={whatsappNotifications}
                          onCheckedChange={setWhatsappNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="critical-alerts" className="text-base">Critical Alerts</Label>
                          <p className="text-sm text-muted-foreground">Always notify for critical issues</p>
                        </div>
                        <Switch
                          id="critical-alerts"
                          checked={criticalAlerts}
                          onCheckedChange={setCriticalAlerts}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="weekly-reports" className="text-base">Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                        </div>
                        <Switch
                          id="weekly-reports"
                          checked={weeklyReports}
                          onCheckedChange={setWeeklyReports}
                        />
                      </div>
                    </div>

                    <Button onClick={() => saveSettings("Notification")}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Settings */}
              <TabsContent value="system">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Configure system-wide settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temp-unit">Default Temperature Unit</Label>
                        <Select value={defaultTempUnit} onValueChange={setDefaultTempUnit}>
                          <SelectTrigger id="temp-unit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="celsius">Celsius (°C)</SelectItem>
                            <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="auto-backup" className="text-base">Automatic Backup</Label>
                          <p className="text-sm text-muted-foreground">Daily automatic data backup</p>
                        </div>
                        <Switch
                          id="auto-backup"
                          checked={autoBackup}
                          onCheckedChange={setAutoBackup}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Restrict system access during maintenance</p>
                        </div>
                        <Switch
                          id="maintenance-mode"
                          checked={maintenanceMode}
                          onCheckedChange={setMaintenanceMode}
                        />
                      </div>
                    </div>

                    <Button onClick={() => saveSettings("System")}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Crop Profiles */}
              <TabsContent value="crops">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Crop Drying Profiles</CardTitle>
                    <CardDescription>Manage default settings for different crop types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cropProfiles.map((crop, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                          <h4 className="font-semibold text-foreground">{crop.name}</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Target Temp (°C)</Label>
                              <Input type="number" value={crop.temp} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Humidity (%)</Label>
                              <Input type="number" value={crop.humidity} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Duration (hrs)</Label>
                              <Input type="number" value={crop.duration} readOnly />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Add New Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Backup & Export */}
              <TabsContent value="backup">
                <div className="space-y-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Data Export</CardTitle>
                      <CardDescription>Download your data for external analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button onClick={exportData} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data (CSV)
                      </Button>
                      <Button onClick={exportData} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export Analytics Report (PDF)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Database Backup</CardTitle>
                      <CardDescription>Create and manage database backups</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Last Backup</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                        <Badge variant="secondary">2.3 GB</Badge>
                      </div>
                      
                      <Button onClick={backupDatabase} className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Create New Backup
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardSettings;
