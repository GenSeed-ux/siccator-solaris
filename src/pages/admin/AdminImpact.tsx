import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2 } from "lucide-react";

const AdminImpact = () => {
  const { toast } = useToast();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const { data } = await supabase
      .from("stories_testimonials")
      .select("*")
      .order("display_order");
    
    if (data) setStories(data);
  };

  const addStory = () => {
    setStories([
      ...stories,
      {
        type: "testimonial",
        name: "",
        location: "",
        role: "",
        quote: "",
        is_featured: false,
        display_order: stories.length,
      },
    ]);
  };

  const deleteStory = async (id: string) => {
    if (id) {
      await supabase.from("stories_testimonials").delete().eq("id", id);
    }
    setStories(stories.filter((s) => s.id !== id));
    toast({
      title: "Success",
      description: "Story deleted",
    });
  };

  const saveStories = async () => {
    setLoading(true);
    try {
      // Delete all existing
      await supabase.from("stories_testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert new
      const storiesToInsert = stories.filter(s => s.name && s.quote);
      if (storiesToInsert.length > 0) {
        await supabase.from("stories_testimonials").insert(storiesToInsert);
      }

      toast({ title: "Success", description: "Stories & testimonials saved" });
      loadStories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2E8B57]">Manage Impact Stories</h1>
          <p className="text-muted-foreground">Configure success stories and testimonials</p>
        </div>
        <Button onClick={saveStories} disabled={loading} className="bg-[#2E8B57]">
          <Save className="h-4 w-4 mr-2" />
          Save All
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stories & Testimonials</CardTitle>
          <Button onClick={addStory} size="sm" className="bg-[#2E8B57]">
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {stories.map((story, idx) => (
            <div key={idx} className="border-2 border-border p-6 rounded-lg space-y-4 relative">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => deleteStory(story.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={story.type || "testimonial"}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].type = e.target.value;
                      setStories(updated);
                    }}
                  >
                    <option value="testimonial">Testimonial</option>
                    <option value="story">Success Story</option>
                  </select>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={story.name || ""}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].name = e.target.value;
                      setStories(updated);
                    }}
                    placeholder="Person or organization name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={story.location || ""}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].location = e.target.value;
                      setStories(updated);
                    }}
                    placeholder="e.g., Ghana"
                  />
                </div>
                <div>
                  <Label>Role/Title</Label>
                  <Input
                    value={story.role || ""}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].role = e.target.value;
                      setStories(updated);
                    }}
                    placeholder="e.g., Cocoa Farmer"
                  />
                </div>
              </div>

              <div>
                <Label>Quote/Story</Label>
                <Textarea
                  value={story.quote || ""}
                  onChange={(e) => {
                    const updated = [...stories];
                    updated[idx].quote = e.target.value;
                    setStories(updated);
                  }}
                  placeholder="Their testimonial or success story"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={story.image_url || ""}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].image_url = e.target.value;
                      setStories(updated);
                    }}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Video URL (optional)</Label>
                  <Input
                    value={story.video_url || ""}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].video_url = e.target.value;
                      setStories(updated);
                    }}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`featured-${idx}`}
                  checked={story.is_featured || false}
                  onChange={(e) => {
                    const updated = [...stories];
                    updated[idx].is_featured = e.target.checked;
                    setStories(updated);
                  }}
                  className="w-4 h-4"
                />
                <Label htmlFor={`featured-${idx}`}>Featured Story</Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImpact;
