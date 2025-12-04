import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type SuccessStory = Tables<"success_stories">;

const AdminSuccessStories = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [formData, setFormData] = useState({
    farmer_name: "",
    location: "",
    farm_size: "",
    crop_types: [] as string[],
    story_title: "",
    story_content: "",
    challenge: "",
    solution: "",
    results: "",
    image_url: "",
    video_url: "",
    quote: "",
    income_increase_percentage: 0,
    loss_reduction_percentage: 0,
    is_featured: false,
    display_order: 0,
  });

  const { data: stories, isLoading } = useQuery({
    queryKey: ["admin-success-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const payload = {
        ...data,
        income_increase_percentage: data.income_increase_percentage || null,
        loss_reduction_percentage: data.loss_reduction_percentage || null,
      };
      if (data.id) {
        const { error } = await supabase
          .from("success_stories")
          .update(payload)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("success_stories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      toast.success(editingStory ? "Story updated" : "Story added");
      resetForm();
    },
    onError: () => toast.error("Failed to save story"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("success_stories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      toast.success("Story deleted");
    },
    onError: () => toast.error("Failed to delete story"),
  });

  const resetForm = () => {
    setFormData({
      farmer_name: "",
      location: "",
      farm_size: "",
      crop_types: [],
      story_title: "",
      story_content: "",
      challenge: "",
      solution: "",
      results: "",
      image_url: "",
      video_url: "",
      quote: "",
      income_increase_percentage: 0,
      loss_reduction_percentage: 0,
      is_featured: false,
      display_order: 0,
    });
    setEditingStory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (story: SuccessStory) => {
    setEditingStory(story);
    setFormData({
      farmer_name: story.farmer_name,
      location: story.location,
      farm_size: story.farm_size || "",
      crop_types: story.crop_types || [],
      story_title: story.story_title,
      story_content: story.story_content,
      challenge: story.challenge || "",
      solution: story.solution || "",
      results: story.results || "",
      image_url: story.image_url || "",
      video_url: story.video_url || "",
      quote: story.quote || "",
      income_increase_percentage: story.income_increase_percentage || 0,
      loss_reduction_percentage: story.loss_reduction_percentage || 0,
      is_featured: story.is_featured || false,
      display_order: story.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(editingStory ? { ...formData, id: editingStory.id } : formData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Success Stories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? "Edit Story" : "Add Story"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Farmer Name</Label>
                  <Input
                    value={formData.farmer_name}
                    onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Farm Size</Label>
                  <Input
                    value={formData.farm_size}
                    onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                    placeholder="e.g., 5 acres"
                  />
                </div>
                <div>
                  <Label>Crop Types (comma-separated)</Label>
                  <Input
                    value={formData.crop_types.join(", ")}
                    onChange={(e) => setFormData({ ...formData, crop_types: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Maize, Beans, Coffee"
                  />
                </div>
              </div>
              <div>
                <Label>Story Title</Label>
                <Input
                  value={formData.story_title}
                  onChange={(e) => setFormData({ ...formData, story_title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Story Content</Label>
                <Textarea
                  value={formData.story_content}
                  onChange={(e) => setFormData({ ...formData, story_content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Challenge</Label>
                  <Textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Solution</Label>
                  <Textarea
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Results</Label>
                  <Textarea
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Quote</Label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="A memorable quote from the farmer..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Video URL</Label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Income Increase %</Label>
                  <Input
                    type="number"
                    value={formData.income_increase_percentage}
                    onChange={(e) => setFormData({ ...formData, income_increase_percentage: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Loss Reduction %</Label>
                  <Input
                    type="number"
                    value={formData.loss_reduction_percentage}
                    onChange={(e) => setFormData({ ...formData, loss_reduction_percentage: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(c) => setFormData({ ...formData, is_featured: c })}
                />
                <Label>Featured Story</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stories ({stories?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Income +</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories?.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-medium">{story.farmer_name}</TableCell>
                    <TableCell>{story.location}</TableCell>
                    <TableCell>{story.story_title}</TableCell>
                    <TableCell>{story.income_increase_percentage ? `${story.income_increase_percentage}%` : "-"}</TableCell>
                    <TableCell>{story.is_featured ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(story)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(story.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSuccessStories;
