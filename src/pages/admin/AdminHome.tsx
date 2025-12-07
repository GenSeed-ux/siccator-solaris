import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2, Upload, Video, GripVertical, Play, Pause, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type HeroVideo = {
  id: string;
  url: string;
  order: number;
};

const AdminHome = () => {
  const { toast } = useToast();
  const [homeContent, setHomeContent] = useState({
    id: "",
    headline: "",
    subtext: "",
    cta_primary_text: "",
    cta_secondary_text: "",
    hero_video_url: "",
  });
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadContent();
    loadMetrics();
  }, []);

  // Parse hero videos from hero_video_url (stored as JSON array or comma-separated)
  useEffect(() => {
    if (homeContent.hero_video_url) {
      try {
        // Try parsing as JSON array first
        const parsed = JSON.parse(homeContent.hero_video_url);
        if (Array.isArray(parsed)) {
          setHeroVideos(parsed.map((url, i) => ({ id: `video-${i}`, url, order: i })));
        } else {
          setHeroVideos([{ id: 'video-0', url: homeContent.hero_video_url, order: 0 }]);
        }
      } catch {
        // If not JSON, treat as single URL or comma-separated
        if (homeContent.hero_video_url.includes(',')) {
          const urls = homeContent.hero_video_url.split(',').map(u => u.trim()).filter(Boolean);
          setHeroVideos(urls.map((url, i) => ({ id: `video-${i}`, url, order: i })));
        } else if (homeContent.hero_video_url) {
          setHeroVideos([{ id: 'video-0', url: homeContent.hero_video_url, order: 0 }]);
        }
      }
    } else {
      setHeroVideos([]);
    }
  }, [homeContent.hero_video_url]);

  // Auto-advance slides
  useEffect(() => {
    if (heroVideos.length <= 1 || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroVideos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroVideos.length, isPlaying]);

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
    // Save videos as JSON array
    const videoUrls = heroVideos.map(v => v.url);
    const videoUrlString = videoUrls.length > 0 ? JSON.stringify(videoUrls) : "";
    
    const contentToSave = {
      ...homeContent,
      hero_video_url: videoUrlString,
    };

    if (homeContent.id) {
      await supabase
        .from("home_content")
        .update(contentToSave)
        .eq("id", homeContent.id);
    } else {
      const { data } = await supabase
        .from("home_content")
        .insert([contentToSave])
        .select()
        .single();
      if (data) setHomeContent(data);
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

  const updateMetric = async (metric: any) => {
    await supabase
      .from("impact_metrics")
      .update({
        metric_label: metric.metric_label,
        metric_value: metric.metric_value,
        metric_unit: metric.metric_unit,
      })
      .eq("id", metric.id);
  };

  const deleteMetric = async (id: string) => {
    await supabase.from("impact_metrics").delete().eq("id", id);
    setMetrics(metrics.filter((m) => m.id !== id));
    toast({
      title: "Success",
      description: "Metric deleted",
    });
  };

  const saveAllMetrics = async () => {
    setLoading(true);
    for (const metric of metrics) {
      if (metric.id) {
        await updateMetric(metric);
      }
    }
    toast({
      title: "Success",
      description: "All metrics saved successfully",
    });
    setLoading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("video/")) {
          toast({
            title: "Error",
            description: `${file.name} is not a video file`,
            variant: "destructive",
          });
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `hero-video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

        setHeroVideos(prev => [...prev, { 
          id: `video-${Date.now()}`, 
          url: publicUrl, 
          order: prev.length 
        }]);
      }
      
      toast({
        title: "Success",
        description: "Video(s) uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const deleteVideo = async (video: HeroVideo) => {
    const confirmed = window.confirm("Are you sure you want to delete this video?");
    if (!confirmed) return;

    // Delete from storage
    if (video.url.includes("supabase")) {
      const urlParts = video.url.split("/media/");
      if (urlParts[1]) {
        await supabase.storage.from("media").remove([urlParts[1]]);
      }
    }

    setHeroVideos(prev => prev.filter(v => v.id !== video.id));
    if (currentSlide >= heroVideos.length - 1) {
      setCurrentSlide(Math.max(0, heroVideos.length - 2));
    }
    
    toast({
      title: "Success",
      description: "Video deleted",
    });
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroVideos.length) return;
    
    const newVideos = [...heroVideos];
    [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
    setHeroVideos(newVideos.map((v, i) => ({ ...v, order: i })));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-primary">Manage Home Page</h1>
        <p className="text-muted-foreground">Edit hero section and impact metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Headline</Label>
            <Input
              value={homeContent.headline}
              onChange={(e) => setHomeContent({ ...homeContent, headline: e.target.value })}
              placeholder="Main headline"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <Textarea
              value={homeContent.subtext || ""}
              onChange={(e) => setHomeContent({ ...homeContent, subtext: e.target.value })}
              placeholder="Supporting text"
              className="mt-1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Primary CTA Text</Label>
              <Input
                value={homeContent.cta_primary_text || ""}
                onChange={(e) => setHomeContent({ ...homeContent, cta_primary_text: e.target.value })}
                placeholder="Get Started"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Secondary CTA Text</Label>
              <Input
                value={homeContent.cta_secondary_text || ""}
                onChange={(e) => setHomeContent({ ...homeContent, cta_secondary_text: e.target.value })}
                placeholder="Learn More"
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Hero Videos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Hero Videos (Slideshow)</Label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleVideoUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Video
              </Button>
            </div>

            {heroVideos.length > 0 ? (
              <div className="space-y-4">
                {/* Preview Slideshow */}
                <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 bg-black">
                  <div className="relative aspect-video">
                    {heroVideos.map((video, index) => (
                      <video
                        key={video.id}
                        src={video.url}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ))}
                    
                    {/* Slide Controls */}
                    {heroVideos.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroVideos.length) % heroVideos.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroVideos.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        
                        {/* Play/Pause & Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <div className="flex gap-1.5">
                            {heroVideos.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Video List */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Drag to reorder • Click to preview</p>
                  {heroVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        index === currentSlide ? 'border-primary bg-primary/5' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveVideo(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                        >
                          <ChevronLeft className="h-3 w-3 rotate-90" />
                        </button>
                        <button
                          onClick={() => moveVideo(index, 'down')}
                          disabled={index === heroVideos.length - 1}
                          className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                        >
                          <ChevronRight className="h-3 w-3 rotate-90" />
                        </button>
                      </div>
                      
                      <div
                        className="w-20 h-12 rounded bg-black/10 overflow-hidden cursor-pointer"
                        onClick={() => setCurrentSlide(index)}
                      >
                        <video src={video.url} className="w-full h-full object-cover" muted />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Video {index + 1}</p>
                        <p className="text-xs text-muted-foreground truncate">{video.url.split('/').pop()}</p>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteVideo(video)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div 
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Video className="h-14 w-14 mx-auto text-muted-foreground/50 group-hover:text-primary/70 mb-4" />
                <p className="text-sm font-medium mb-1">
                  {uploading ? "Uploading..." : "Click to upload hero videos"}
                </p>
                <p className="text-xs text-muted-foreground">MP4, WebM, or MOV • Multiple files supported</p>
              </div>
            )}
          </div>

          <Button onClick={saveContent} disabled={loading} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Impact Metrics</CardTitle>
          <Button onClick={addMetric} size="sm" className="bg-primary">
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
                  className="mt-1.5"
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
                  className="mt-1.5"
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
                  className="mt-1.5"
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
          <Button onClick={saveAllMetrics} disabled={loading} className="w-full bg-primary">
            <Save className="h-4 w-4 mr-2" />
            Save All Metrics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
