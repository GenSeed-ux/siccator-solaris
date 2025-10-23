import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const { toast } = useToast();

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
