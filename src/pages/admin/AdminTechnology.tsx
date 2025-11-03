import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2 } from "lucide-react";

const AdminTechnology = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    const { data } = await supabase
      .from("technology_content")
      .select("*")
      .order("display_order");
    
    if (data) setSections(data);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        section_key: `section_${Date.now()}`,
        title: "",
        description: "",
        features: [],
        display_order: sections.length,
        image_url: "",
      },
    ]);
  };

  const deleteSection = async (id: string) => {
    if (id) {
      await supabase.from("technology_content").delete().eq("id", id);
    }
    setSections(sections.filter((s) => s.id !== id));
    toast({
      title: "Success",
      description: "Section deleted",
    });
  };

  const saveSections = async () => {
    setLoading(true);
    try {
      // Delete all existing
      await supabase.from("technology_content").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert new
      const sectionsToInsert = sections.filter(s => s.title && s.description);
      if (sectionsToInsert.length > 0) {
        await supabase.from("technology_content").insert(sectionsToInsert);
      }

      toast({ title: "Success", description: "Technology content saved" });
      loadSections();
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
          <h1 className="text-3xl font-bold text-[#2E8B57]">Manage Technology</h1>
          <p className="text-muted-foreground">Configure technology features and specifications</p>
        </div>
        <Button onClick={saveSections} disabled={loading} className="bg-[#2E8B57]">
          <Save className="h-4 w-4 mr-2" />
          Save All
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Technology Sections</CardTitle>
          <Button onClick={addSection} size="sm" className="bg-[#2E8B57]">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="border-2 border-border p-6 rounded-lg space-y-4 relative">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => deleteSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div>
                <Label>Section Key (unique identifier)</Label>
                <Input
                  value={section.section_key || ""}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[idx].section_key = e.target.value;
                    setSections(updated);
                  }}
                  placeholder="e.g., ai_intelligence"
                />
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={section.title || ""}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[idx].title = e.target.value;
                    setSections(updated);
                  }}
                  placeholder="e.g., AI Drying Intelligence"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={section.description || ""}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[idx].description = e.target.value;
                    setSections(updated);
                  }}
                  placeholder="Detailed description of the technology feature"
                  rows={4}
                />
              </div>

              <div>
                <Label>Features (JSON format)</Label>
                <Textarea
                  value={JSON.stringify(section.features, null, 2) || "[]"}
                  onChange={(e) => {
                    try {
                      const updated = [...sections];
                      updated[idx].features = JSON.parse(e.target.value);
                      setSections(updated);
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='["Feature 1", "Feature 2", "Feature 3"]'
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label>Image URL</Label>
                <Input
                  value={section.image_url || ""}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[idx].image_url = e.target.value;
                    setSections(updated);
                  }}
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTechnology;
