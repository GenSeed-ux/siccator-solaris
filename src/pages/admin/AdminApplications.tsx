import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2 } from "lucide-react";

const AdminApplications = () => {
  const { toast } = useToast();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    const { data } = await supabase
      .from("crop_applications")
      .select("*")
      .order("display_order");
    
    if (data) setCrops(data);
  };

  const addCrop = () => {
    setCrops([
      ...crops,
      {
        crop_name: "",
        category: "",
        drying_time: "",
        temperature_range: "",
        humidity_range: "",
        roi_percentage: 0,
        benefits: [],
        display_order: crops.length,
        image_url: "",
      },
    ]);
  };

  const deleteCrop = async (id: string) => {
    if (id) {
      await supabase.from("crop_applications").delete().eq("id", id);
    }
    setCrops(crops.filter((c) => c.id !== id));
    toast({
      title: "Success",
      description: "Crop deleted",
    });
  };

  const saveCrops = async () => {
    setLoading(true);
    try {
      // Delete all existing
      await supabase.from("crop_applications").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      // Insert new
      const cropsToInsert = crops.filter(c => c.crop_name && c.category);
      if (cropsToInsert.length > 0) {
        await supabase.from("crop_applications").insert(cropsToInsert);
      }

      toast({ title: "Success", description: "Crop applications saved" });
      loadCrops();
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
          <h1 className="text-3xl font-bold text-[#2E8B57]">Manage Applications</h1>
          <p className="text-muted-foreground">Configure crop-specific drying applications</p>
        </div>
        <Button onClick={saveCrops} disabled={loading} className="bg-[#2E8B57]">
          <Save className="h-4 w-4 mr-2" />
          Save All
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crop Applications</CardTitle>
          <Button onClick={addCrop} size="sm" className="bg-[#2E8B57]">
            <Plus className="h-4 w-4 mr-2" />
            Add Crop
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {crops.map((crop, idx) => (
            <div key={idx} className="border-2 border-border p-6 rounded-lg space-y-4 relative">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => deleteCrop(crop.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Crop Name</Label>
                  <Input
                    value={crop.crop_name || ""}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].crop_name = e.target.value;
                      setCrops(updated);
                    }}
                    placeholder="e.g., Cocoa Beans"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={crop.category || ""}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].category = e.target.value;
                      setCrops(updated);
                    }}
                    placeholder="e.g., Cash Crop"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Drying Time</Label>
                  <Input
                    value={crop.drying_time || ""}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].drying_time = e.target.value;
                      setCrops(updated);
                    }}
                    placeholder="e.g., 48-72 hours"
                  />
                </div>
                <div>
                  <Label>Temperature Range</Label>
                  <Input
                    value={crop.temperature_range || ""}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].temperature_range = e.target.value;
                      setCrops(updated);
                    }}
                    placeholder="e.g., 50-60°C"
                  />
                </div>
                <div>
                  <Label>Humidity Range</Label>
                  <Input
                    value={crop.humidity_range || ""}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].humidity_range = e.target.value;
                      setCrops(updated);
                    }}
                    placeholder="e.g., 7-8%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ROI Percentage</Label>
                  <Input
                    type="number"
                    value={crop.roi_percentage || 0}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].roi_percentage = parseFloat(e.target.value);
                      setCrops(updated);
                    }}
                    placeholder="150"
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={crop.image_url || ""}
                    onChange={(e) => {
                      const updated = [...crops];
                      updated[idx].image_url = e.target.value;
                      setCrops(updated);
                    }}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label>Benefits (comma-separated)</Label>
                <Textarea
                  value={crop.benefits?.join(", ") || ""}
                  onChange={(e) => {
                    const updated = [...crops];
                    updated[idx].benefits = e.target.value.split(",").map(b => b.trim()).filter(b => b);
                    setCrops(updated);
                  }}
                  placeholder="Consistent quality, Prevents mold, Extends shelf life"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApplications;
