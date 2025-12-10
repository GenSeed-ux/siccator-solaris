import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AdminAbout = () => {
  const { toast } = useToast();
  const [aboutContent, setAboutContent] = useState({ mission: "", vision: "" });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const imageInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [about, team, timelineData] = await Promise.all([
        supabase.from("about_content").select("*").maybeSingle(),
        supabase.from("team_members").select("*").order("display_order"),
        supabase.from("timeline_events").select("*").order("display_order"),
      ]);

      if (about.data) setAboutContent(about.data);
      if (team.data) setTeamMembers(team.data);
      if (timelineData.data) setTimeline(timelineData.data);
    } catch (error) {
      console.error("Error loading admin about content:", error);
    }
  };

  const saveAbout = async () => {
    setLoading(true);
    try {
      const { data: existing } = await supabase.from("about_content").select("*").maybeSingle();

      if (existing) {
        await supabase.from("about_content").update(aboutContent).eq("id", existing.id);
      } else {
        await supabase.from("about_content").insert([aboutContent]);
      }

      toast({ title: "Success", description: "About content updated" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { 
        name: "", 
        title: "", 
        bio: "",
        expertise: "", 
        linkedin_url: "",
        email: "",
        discord_username: "",
        twitter_url: "",
        github_url: "",
        display_order: teamMembers.length 
      },
    ]);
  };

  const addTimelineEvent = () => {
    setTimeline([
      ...timeline,
      { year: "", title: "", description: "", display_order: timeline.length },
    ]);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(`member-${index}`);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `team-${Date.now()}-${index}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      const updated = [...teamMembers];
      updated[index].image_url = publicUrl;
      setTeamMembers(updated);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(null);
    }
  };

  const saveTeamMembers = async () => {
    setLoading(true);
    try {
      // Delete existing members
      await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert new members
      const membersToInsert = teamMembers.filter(m => m.name && m.title);
      if (membersToInsert.length > 0) {
        await supabase.from("team_members").insert(membersToInsert);
      }

      toast({ title: "Success", description: "Team members saved" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const saveTimeline = async () => {
    setLoading(true);
    try {
      // Delete existing events
      await supabase.from("timeline_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert new events
      const eventsToInsert = timeline.filter(e => e.year && e.title);
      if (eventsToInsert.length > 0) {
        await supabase.from("timeline_events").insert(eventsToInsert);
      }

      toast({ title: "Success", description: "Timeline saved" });
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
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-[#2E8B57]">Manage About Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mission & Vision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Mission Statement</Label>
            <Textarea
              value={aboutContent.mission}
              onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
              rows={4}
            />
          </div>
          <div>
            <Label>Vision Statement</Label>
            <Textarea
              value={aboutContent.vision}
              onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
              rows={4}
            />
          </div>
          <Button onClick={saveAbout} disabled={loading} className="bg-[#2E8B57]">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button onClick={addTeamMember} size="sm" className="bg-[#2E8B57]">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={member.image_url} alt={member.name} />
                  <AvatarFallback>
                    <ImageIcon className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <input
                    ref={(el) => (imageInputRefs.current[idx] = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(idx, file);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRefs.current[idx]?.click()}
                    disabled={uploadingImage === `member-${idx}`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingImage === `member-${idx}` ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              </div>
              <Input
                placeholder="Name"
                value={member.name || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].name = e.target.value;
                  setTeamMembers(updated);
                }}
              />
              <Input
                placeholder="Title"
                value={member.title || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].title = e.target.value;
                  setTeamMembers(updated);
                }}
              />
              <Textarea
                placeholder="Bio"
                value={member.bio || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].bio = e.target.value;
                  setTeamMembers(updated);
                }}
                rows={3}
              />
              <Input
                placeholder="Expertise"
                value={member.expertise || ""}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].expertise = e.target.value;
                  setTeamMembers(updated);
                }}
              />
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Social Media (Optional)</Label>
                <Input
                  placeholder="LinkedIn URL (e.g., https://linkedin.com/in/username)"
                  value={member.linkedin_url || ""}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[idx].linkedin_url = e.target.value;
                    setTeamMembers(updated);
                  }}
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={member.email || ""}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[idx].email = e.target.value;
                    setTeamMembers(updated);
                  }}
                />
                <Input
                  placeholder="Discord Username (e.g., username#1234)"
                  value={member.discord_username || ""}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[idx].discord_username = e.target.value;
                    setTeamMembers(updated);
                  }}
                />
                <Input
                  placeholder="X/Twitter URL (e.g., https://x.com/username)"
                  value={member.twitter_url || ""}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[idx].twitter_url = e.target.value;
                    setTeamMembers(updated);
                  }}
                />
                <Input
                  placeholder="GitHub URL (e.g., https://github.com/username)"
                  value={member.github_url || ""}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[idx].github_url = e.target.value;
                    setTeamMembers(updated);
                  }}
                />
              </div>
            </div>
          ))}
          <Button onClick={saveTeamMembers} disabled={loading} className="w-full bg-[#2E8B57]">
            <Save className="h-4 w-4 mr-2" />
            Save Team Members
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Timeline Events</CardTitle>
          <Button onClick={addTimelineEvent} size="sm" className="bg-[#2E8B57]">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeline.map((event, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-3">
              <Input
                placeholder="Year"
                value={event.year}
                onChange={(e) => {
                  const updated = [...timeline];
                  updated[idx].year = e.target.value;
                  setTimeline(updated);
                }}
              />
              <Input
                placeholder="Title"
                value={event.title}
                onChange={(e) => {
                  const updated = [...timeline];
                  updated[idx].title = e.target.value;
                  setTimeline(updated);
                }}
              />
              <Textarea
                placeholder="Description"
                value={event.description}
                onChange={(e) => {
                  const updated = [...timeline];
                  updated[idx].description = e.target.value;
                  setTimeline(updated);
                }}
              />
            </div>
          ))}
          <Button onClick={saveTimeline} disabled={loading} className="w-full bg-[#2E8B57]">
            <Save className="h-4 w-4 mr-2" />
            Save Timeline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbout;
