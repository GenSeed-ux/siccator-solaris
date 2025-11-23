import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Database, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const exportData = async (table: string) => {
    const { data, error } = await supabase.from(table as any).select("*");
    
    if (error) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table}-backup-${new Date().toISOString()}.json`;
    a.click();

    toast({
      title: "Export Complete",
      description: `${table} data exported successfully`,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-[#2E8B57]">Settings</h1>
        <p className="text-muted-foreground">System configuration and data management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Backup & Export</CardTitle>
          <CardDescription>
            Export your database tables for backup or analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {([
            "home_content",
            "impact_metrics",
            "stories_testimonials",
            "team_members",
            "timeline_events",
            "blog_posts",
            "pilot_requests",
            "crop_applications",
          ] as const).map((table) => (
            <div key={table} className="flex justify-between items-center p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{table}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportData(table)}
              >
                <Download className="h-3 w-3 mr-2" />
                Export JSON
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={changingPassword}
              className="bg-[#2E8B57]"
            >
              {changingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Lovable Cloud</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Database</span>
            <span className="font-medium">Supabase</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Authentication</span>
            <span className="font-medium">Enabled</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
