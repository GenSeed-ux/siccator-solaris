import { GlassShell } from "@/components/dashboard/GlassShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings as SettingsIcon, Bell, Zap, Shield, Database } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const Settings = () => {
  return (
    <GlassShell>
      <div className="w-full">
        
        <main className="flex-1 overflow-auto">
          <div className="glass-header sticky top-0 z-10 mx-3 mt-3 md:mx-4">
            <div className="flex items-center gap-4 px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and system preferences</p>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-4 space-y-6">
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="system" className="gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  System
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal details and farmer profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                            FA
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">Change Photo</Button>
                          <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="full-name">Full Name</Label>
                          <Input id="full-name" defaultValue="John Farmer" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="farmer-id">Farmer ID</Label>
                          <Input id="farmer-id" defaultValue="DEMO-001" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="farmer@siccator.demo" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" defaultValue="+234 123 456 7890" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Farm Location</Label>
                          <Input id="location" defaultValue="Lagos, Nigeria" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="farm-size">Farm Size (hectares)</Label>
                          <Input id="farm-size" type="number" defaultValue="5.5" />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold">Primary Crops</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["Maize", "Pepper", "Fish", "Cassava", "Cocoa", "Tomato"].map((crop) => (
                            <div key={crop} className="flex items-center space-x-2">
                              <Switch id={`crop-${crop.toLowerCase()}`} />
                              <Label htmlFor={`crop-${crop.toLowerCase()}`}>{crop}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full md:w-auto">Save Changes</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* System Settings */}
              <TabsContent value="system">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>System Preferences</CardTitle>
                        <CardDescription>Configure dashboard behavior and display options</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Theme Mode</Label>
                            <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                          </div>
                          <ThemeToggle />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <Label htmlFor="language">Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger id="language">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="sw">Swahili</SelectItem>
                              <SelectItem value="ha">Hausa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select defaultValue="wat">
                            <SelectTrigger id="timezone">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wat">WAT (UTC+1)</SelectItem>
                              <SelectItem value="cat">CAT (UTC+2)</SelectItem>
                              <SelectItem value="eat">EAT (UTC+3)</SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="temp-unit">Temperature Unit</Label>
                          <Select defaultValue="celsius">
                            <SelectTrigger id="temp-unit">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="celsius">Celsius (°C)</SelectItem>
                              <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Auto-start Sessions</Label>
                            <p className="text-sm text-muted-foreground">Automatically start drying when conditions are optimal</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Data Sync</Label>
                            <p className="text-sm text-muted-foreground">Sync sensor data to cloud every 30 seconds</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <Button className="w-full md:w-auto">Save Preferences</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Power Management
                        </CardTitle>
                        <CardDescription>Configure power modes and energy preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <Label htmlFor="power-priority">Power Priority</Label>
                          <Select defaultValue="solar">
                            <SelectTrigger id="power-priority">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solar">Solar First</SelectItem>
                              <SelectItem value="battery">Battery First</SelectItem>
                              <SelectItem value="grid">Grid First</SelectItem>
                              <SelectItem value="auto">Auto (Smart)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Battery Saver Mode</Label>
                            <p className="text-sm text-muted-foreground">Reduce fan speed when battery is below 20%</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <Button className="w-full md:w-auto">Apply Power Settings</Button>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose what alerts and updates you want to receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Alert Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Critical Alerts</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Warning Alerts</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Info Notifications</Label>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold">Session Updates</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Session Started</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Session Completed</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Moisture Milestones</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold">System Updates</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Firmware Updates</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Maintenance Reminders</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Weekly Reports</Label>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <Button className="w-full md:w-auto">Save Notification Settings</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Data Management
                        </CardTitle>
                        <CardDescription>Control your data storage and privacy settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Data Retention Period</Label>
                            <p className="text-sm text-muted-foreground">How long to keep historical sensor data</p>
                          </div>
                          <Select defaultValue="90">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">6 months</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <Button variant="outline" className="w-full justify-start">
                            Export All Data
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                            Clear Session History
                          </Button>
                          <Button variant="destructive" className="w-full justify-start">
                            Delete Account
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Manage your account security settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          Change Password
                        </Button>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                          </div>
                          <Switch />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </GlassShell>
  );
};

export default Settings;
