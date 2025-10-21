import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, TrendingUp, Settings, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CropProfile {
  id: string;
  name: string;
  targetTemp: number;
  targetHumidity: number;
  estimatedTime: number;
  aiEnabled: boolean;
}

const mockCropProfiles: CropProfile[] = [
  { id: "1", name: "Maize", targetTemp: 60, targetHumidity: 40, estimatedTime: 48, aiEnabled: true },
  { id: "2", name: "Cassava", targetTemp: 65, targetHumidity: 35, estimatedTime: 72, aiEnabled: true },
  { id: "3", name: "Tomatoes", targetTemp: 55, targetHumidity: 45, estimatedTime: 36, aiEnabled: false },
  { id: "4", name: "Chili Peppers", targetTemp: 58, targetHumidity: 42, estimatedTime: 60, aiEnabled: true },
];

export default function DashboardAIControl() {
  const [aiMasterSwitch, setAiMasterSwitch] = useState(true);
  const [profiles, setProfiles] = useState<CropProfile[]>(mockCropProfiles);

  const toggleProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((profile) => (profile.id === id ? { ...profile, aiEnabled: !profile.aiEnabled } : profile))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI & Automation Control</h1>
        <p className="text-muted-foreground">Manage intelligent drying profiles and automation settings</p>
      </div>

      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>AI Master Control</CardTitle>
                <CardDescription>Enable or disable AI automation across all devices</CardDescription>
              </div>
            </div>
            <Switch checked={aiMasterSwitch} onCheckedChange={setAiMasterSwitch} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">AI-managed drying cycles</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Efficiency Gain</span>
              </div>
              <p className="text-2xl font-bold">32%</p>
              <p className="text-xs text-muted-foreground">Compared to manual control</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Predictions Made</span>
              </div>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Crop Drying Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={profile.aiEnabled ? "border-primary/50" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <CardDescription>AI-optimized drying parameters</CardDescription>
                    </div>
                    <Switch
                      checked={profile.aiEnabled}
                      onCheckedChange={() => toggleProfile(profile.id)}
                      disabled={!aiMasterSwitch}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Target Temperature</span>
                        <span className="text-sm font-bold">{profile.targetTemp}°C</span>
                      </div>
                      <Progress value={(profile.targetTemp / 80) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Target Humidity</span>
                        <span className="text-sm font-bold">{profile.targetHumidity}%</span>
                      </div>
                      <Progress value={profile.targetHumidity} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Estimated Time</span>
                      <Badge variant="outline">{profile.estimatedTime}h</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Settings className="w-4 h-4" />
                    Configure Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm font-medium mb-1">Optimization Opportunity</p>
            <p className="text-sm text-muted-foreground">
              Device SD-002 airflow can be increased by 15% to reduce drying time by 4 hours
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium mb-1">Energy Efficiency</p>
            <p className="text-sm text-muted-foreground">
              Shifting 3 sessions to daytime can save 18% battery consumption
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm font-medium mb-1">Predictive Maintenance</p>
            <p className="text-sm text-muted-foreground">
              Device SD-001 fan motor showing 12% efficiency drop - schedule inspection
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
