import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2 } from "lucide-react";

const AdminAbout = () => {
  const { toast } = useToast();
  const [aboutContent, setAboutContent] = useState({ mission: "", vision: "" });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const [about, team, timelineData] = await Promise.all([
      supabase.from("about_content").select("*").single(),
      supabase.from("team_members").select("*").order("display_order"),
      supabase.from("timeline_events").select("*").order("display_order"),
    ]);

    if (about.data) setAboutContent(about.data);
    if (team.data) setTeamMembers(team.data);
    if (timelineData.data) setTimeline(timelineData.data);
  };

  const saveAbout = async () => {
    setLoading(true);
    const { data: existing } = await supabase.from("about_content").select("*").single();

    if (existing) {
      await supabase.from("about_content").update(aboutContent).eq("id", existing.id);
    } else {
      await supabase.from("about_content").insert([aboutContent]);
    }

    toast({ title: "Success", description: "About content updated" });
    setLoading(false);
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { name: "", title: "", expertise: "", display_order: teamMembers.length },
    ]);
  };

  const addTimelineEvent = () => {
    setTimeline([
      ...timeline,
      { year: "", title: "", description: "", display_order: timeline.length },
    ]);
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
              <Input
                placeholder="Name"
                value={member.name}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].name = e.target.value;
                  setTeamMembers(updated);
                }}
              />
              <Input
                placeholder="Title"
                value={member.title}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].title = e.target.value;
                  setTeamMembers(updated);
                }}
              />
              <Input
                placeholder="Expertise"
                value={member.expertise}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[idx].expertise = e.target.value;
                  setTeamMembers(updated);
                }}
              />
            </div>
          ))}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbout;
