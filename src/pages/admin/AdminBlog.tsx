import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Save, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminBlog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setPosts(data);
  };

  const savePost = async () => {
    const slug = editingPost.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const postData = { ...editingPost, slug };

    if (editingPost.id) {
      await supabase.from("blog_posts").update(postData).eq("id", editingPost.id);
    } else {
      await supabase.from("blog_posts").insert([postData]);
    }

    toast({
      title: "Success",
      description: editingPost.id ? "Post updated" : "Post created",
    });

    loadPosts();
    setIsDialogOpen(false);
    setEditingPost(null);
  };

  const deletePost = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
    toast({ title: "Success", description: "Post deleted" });
  };

  const createNewPost = () => {
    setEditingPost({
      title: "",
      summary: "",
      content: "",
      author: "",
      category: "",
      tags: [],
      is_published: false,
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2E8B57]">Manage Blog Posts</h1>
          <p className="text-muted-foreground">Create and edit blog articles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={createNewPost} className="bg-[#2E8B57]">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost?.id ? "Edit Post" : "Create New Post"}</DialogTitle>
            </DialogHeader>
            {editingPost && (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Summary</Label>
                  <Textarea
                    value={editingPost.summary}
                    onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={10}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Featured Image URL</Label>
                  <Input
                    value={editingPost.featured_image_url || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, featured_image_url: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingPost.is_published}
                      onCheckedChange={(checked) =>
                        setEditingPost({ ...editingPost, is_published: checked })
                      }
                    />
                    <Label>Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingPost.is_featured}
                      onCheckedChange={(checked) =>
                        setEditingPost({ ...editingPost, is_featured: checked })
                      }
                    />
                    <Label>Featured</Label>
                  </div>
                </div>
                <Button onClick={savePost} className="w-full bg-[#2E8B57]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Post
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {post.is_published ? "Published" : "Draft"}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingPost(post);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
