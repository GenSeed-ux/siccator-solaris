import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image, Video, Loader2, Upload, X, FileVideo, FileImage } from "lucide-react";

type GalleryMedia = {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  media_url: string;
  thumbnail_url: string | null;
  category: string | null;
  location: string | null;
  is_featured: boolean | null;
  display_order: number | null;
};

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<GalleryMedia | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_type: "image",
    media_url: "",
    thumbnail_url: "",
    category: "general",
    location: "",
    is_featured: false,
    display_order: 0,
  });

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_media")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryMedia[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("gallery_media")
          .update(data)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_media").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success(editingMedia ? "Media updated" : "Media added");
      resetForm();
    },
    onError: () => toast.error("Failed to save media"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (media: GalleryMedia) => {
      // Delete from storage if it's a local file
      if (media.media_url.includes("supabase")) {
        const urlParts = media.media_url.split("/media/");
        if (urlParts[1]) {
          await supabase.storage.from("media").remove([urlParts[1]]);
        }
      }
      if (media.thumbnail_url?.includes("supabase")) {
        const urlParts = media.thumbnail_url.split("/media/");
        if (urlParts[1]) {
          await supabase.storage.from("media").remove([urlParts[1]]);
        }
      }
      const { error } = await supabase.from("gallery_media").delete().eq("id", media.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast.success("Media deleted");
    },
    onError: () => toast.error("Failed to delete media"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      media_type: "image",
      media_url: "",
      thumbnail_url: "",
      category: "general",
      location: "",
      is_featured: false,
      display_order: 0,
    });
    setEditingMedia(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (media: GalleryMedia) => {
    setEditingMedia(media);
    setFormData({
      title: media.title,
      description: media.description || "",
      media_type: media.media_type,
      media_url: media.media_url,
      thumbnail_url: media.thumbnail_url || "",
      category: media.category || "general",
      location: media.location || "",
      is_featured: media.is_featured || false,
      display_order: media.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.media_url) {
      toast.error("Please upload a media file");
      return;
    }
    saveMutation.mutate(editingMedia ? { ...formData, id: editingMedia.id } : formData);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Please upload an image or video file");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `gallery-${Date.now()}.${fileExt}`;
      const folder = isVideo ? "videos" : "images";
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      setFormData({ 
        ...formData, 
        media_url: publicUrl,
        media_type: isVideo ? "video" : "image"
      });
      
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file for thumbnail");
      return;
    }

    setUploadingThumbnail(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `thumbnail-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
      toast.success("Thumbnail uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const removeMedia = async () => {
    if (formData.media_url.includes("supabase")) {
      const urlParts = formData.media_url.split("/media/");
      if (urlParts[1]) {
        await supabase.storage.from("media").remove([urlParts[1]]);
      }
    }
    setFormData({ ...formData, media_url: "", media_type: "image" });
  };

  const removeThumbnail = async () => {
    if (formData.thumbnail_url.includes("supabase")) {
      const urlParts = formData.thumbnail_url.split("/media/");
      if (urlParts[1]) {
        await supabase.storage.from("media").remove([urlParts[1]]);
      }
    }
    setFormData({ ...formData, thumbnail_url: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gallery Media</h1>
          <p className="text-muted-foreground">Manage photos and videos for your gallery</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingMedia ? "Edit Media" : "Add New Media"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Upload Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Media File *</Label>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                
                {formData.media_url ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/30">
                    {formData.media_type === "video" ? (
                      <video 
                        src={formData.media_url} 
                        className="w-full h-48 object-cover"
                        controls
                        muted
                      />
                    ) : (
                      <img 
                        src={formData.media_url} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 shadow-md"
                        onClick={() => mediaInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" /> Replace
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 shadow-md"
                        onClick={removeMedia}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-xs flex items-center gap-1">
                      {formData.media_type === "video" ? <FileVideo className="h-3 w-3" /> : <FileImage className="h-3 w-3" />}
                      {formData.media_type}
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => mediaInputRef.current?.click()}
                    className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <Image className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <Video className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {uploading ? "Uploading..." : "Click to upload image or video"}
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, GIF, MP4, WebM (max 50MB)</p>
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="grid gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter media title"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the media"
                    rows={3}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="operation">Operation</SelectItem>
                      <SelectItem value="results">Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Nakuru, Kenya"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Thumbnail for Videos */}
              {formData.media_type === "video" && (
                <div className="space-y-3">
                  <Label>Video Thumbnail</Label>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                  
                  {formData.thumbnail_url ? (
                    <div className="relative w-40 rounded-lg overflow-hidden border">
                      <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-24 object-cover" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={removeThumbnail}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={uploadingThumbnail}
                    >
                      {uploadingThumbnail ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      Upload Thumbnail
                    </Button>
                  )}
                </div>
              )}

              {/* Display Order & Featured */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="mt-1.5"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(c) => setFormData({ ...formData, is_featured: c })}
                  />
                  <Label className="cursor-pointer">Featured Media</Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending || !formData.media_url} className="bg-primary">
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingMedia ? "Update Media" : "Add Media"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Media ({mediaItems?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mediaItems?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No media items yet. Click "Add Media" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mediaItems?.map((media) => (
                  <TableRow key={media.id}>
                    <TableCell>
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                        {media.media_type === "video" ? (
                          media.thumbnail_url ? (
                            <img src={media.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )
                        ) : (
                          <img src={media.media_url} alt="" className="w-full h-full object-cover" />
                        )}
                        {media.media_type === "video" && (
                          <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[10px] px-1 rounded">
                            VIDEO
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{media.title}</TableCell>
                    <TableCell className="capitalize">{media.category}</TableCell>
                    <TableCell>{media.location || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${media.is_featured ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {media.is_featured ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(media)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Delete this media?")) {
                              deleteMutation.mutate(media);
                            }
                          }}
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

export default AdminGallery;
