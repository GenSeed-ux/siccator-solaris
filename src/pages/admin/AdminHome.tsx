import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2, Upload, Video } from "lucide-react";

const AdminHome = () => {
  const { toast } = useToast();
  const [homeContent, setHomeContent] = useState({
    headline: "",
    subtext: "",
    cta_primary_text: "",
    cta_secondary_text: "",
    hero_video_url: "",
  });
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadContent();
    loadMetrics();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from("home_content")
      .select("*")
      .single();
    
    if (data) setHomeContent(data);
  };

  const loadMetrics = async () => {
    const { data } = await supabase
      .from("impact_metrics")
      .select("*")
      .order("display_order");
    
    if (data) setMetrics(data);
  };

  const saveContent = async () => {
    setLoading(true);
    const { data: existing } = await supabase
      .from("home_content")
      .select("*")
      .single();

    if (existing) {
      await supabase
        .from("home_content")
        .update(homeContent)
        .eq("id", existing.id);
    } else {
      await supabase
        .from("home_content")
        .insert([homeContent]);
    }

    toast({
      title: "Success",
      description: "Home page content updated successfully",
    });
    setLoading(false);
  };

  const addMetric = async () => {
    const newMetric = {
      metric_key: `metric_${Date.now()}`,
      metric_label: "New Metric",
      metric_value: 0,
      metric_unit: "",
      display_order: metrics.length,
    };

    const { data } = await supabase
      .from("impact_metrics")
      .insert([newMetric])
      .select()
      .single();

    if (data) {
      setMetrics([...metrics, data]);
      toast({
        title: "Success",
        description: "New metric added",
      });
    }
  };

  const deleteMetric = async (id: string) => {
    await supabase.from("impact_metrics").delete().eq("id", id);
    setMetrics(metrics.filter((m) => m.id !== id));
    toast({
      title: "Success",
      description: "Metric deleted",
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Error",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-video-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      setHomeContent({ ...homeContent, hero_video_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-[#2E8B57]">Manage Home Page</h1>
        <p className="text-muted-foreground">Edit hero section and impact metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Input
              value={homeContent.headline}
              onChange={(e) => setHomeContent({ ...homeContent, headline: e.target.value })}
              placeholder="Main headline"
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <Textarea
              value={homeContent.subtext}
              onChange={(e) => setHomeContent({ ...homeContent, subtext: e.target.value })}
              placeholder="Supporting text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Primary CTA Text</Label>
              <Input
                value={homeContent.cta_primary_text}
                onChange={(e) => setHomeContent({ ...homeContent, cta_primary_text: e.target.value })}
                placeholder="Get Started"
              />
            </div>
            <div>
              <Label>Secondary CTA Text</Label>
              <Input
                value={homeContent.cta_secondary_text}
                onChange={(e) => setHomeContent({ ...homeContent, cta_secondary_text: e.target.value })}
                placeholder="Learn More"
              />
            </div>
          </div>
          <div>
            <Label>Hero Video</Label>
            <div className="flex gap-2">
              <Input
                value={homeContent.hero_video_url || ""}
                onChange={(e) => setHomeContent({ ...homeContent, hero_video_url: e.target.value })}
                placeholder="Enter URL or upload video"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            {homeContent.hero_video_url && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                <span className="truncate">{homeContent.hero_video_url}</span>
              </div>
            )}
          </div>
          <Button onClick={saveContent} disabled={loading} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Impact Metrics</CardTitle>
          <Button onClick={addMetric} size="sm" className="bg-[#2E8B57]">
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex gap-4 items-end border p-4 rounded-lg">
              <div className="flex-1">
                <Label>Label</Label>
                <Input
                  value={metric.metric_label}
                  onChange={(e) => {
                    setMetrics(metrics.map((m) =>
                      m.id === metric.id ? { ...m, metric_label: e.target.value } : m
                    ));
                  }}
                />
              </div>
              <div className="flex-1">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={metric.metric_value}
                  onChange={(e) => {
                    setMetrics(metrics.map((m) =>
                      m.id === metric.id ? { ...m, metric_value: parseFloat(e.target.value) } : m
                    ));
                  }}
                />
              </div>
              <div className="w-32">
                <Label>Unit</Label>
                <Input
                  value={metric.metric_unit}
                  onChange={(e) => {
                    setMetrics(metrics.map((m) =>
                      m.id === metric.id ? { ...m, metric_unit: e.target.value } : m
                    ));
                  }}
                  placeholder="%"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteMetric(metric.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
