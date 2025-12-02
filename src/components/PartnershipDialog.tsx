import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Tractor, Building2, TrendingUp } from "lucide-react";

type PartnerType = "farmer" | "ngo_government" | "investor";

interface PartnershipDialogProps {
  type: PartnerType;
  triggerText: string;
}

const PartnershipDialog = ({ type, triggerText }: PartnershipDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    location: "",
    message: "",
    // Farmer specific
    farm_size: "",
    crop_types: "",
    current_drying_method: "",
    // NGO/Government specific
    organization_type: "",
    target_region: "",
    estimated_beneficiaries: "",
    // Investor specific
    investment_range: "",
    investment_type: "",
    portfolio_focus: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Record<string, unknown> = {
      inquiry_type: type,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      organization: formData.organization || null,
      location: formData.location || null,
      message: formData.message || null,
    };

    if (type === "farmer") {
      payload.farm_size = formData.farm_size || null;
      payload.crop_types = formData.crop_types ? formData.crop_types.split(",").map((c) => c.trim()) : null;
      payload.current_drying_method = formData.current_drying_method || null;
    } else if (type === "ngo_government") {
      payload.organization_type = formData.organization_type || null;
      payload.target_region = formData.target_region || null;
      payload.estimated_beneficiaries = formData.estimated_beneficiaries ? parseInt(formData.estimated_beneficiaries) : null;
    } else if (type === "investor") {
      payload.investment_range = formData.investment_range || null;
      payload.investment_type = formData.investment_type || null;
      payload.portfolio_focus = formData.portfolio_focus || null;
    }

    const { error } = await supabase.from("partnership_inquiries").insert(payload as never);

    setLoading(false);

    if (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } else {
      toast.success("Thank you! We'll be in touch within 48 hours.");
      setIsOpen(false);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        organization: "",
        location: "",
        message: "",
        farm_size: "",
        crop_types: "",
        current_drying_method: "",
        organization_type: "",
        target_region: "",
        estimated_beneficiaries: "",
        investment_range: "",
        investment_type: "",
        portfolio_focus: "",
      });
    }
  };

  const getIcon = () => {
    switch (type) {
      case "farmer":
        return <Tractor className="w-6 h-6" />;
      case "ngo_government":
        return <Building2 className="w-6 h-6" />;
      case "investor":
        return <TrendingUp className="w-6 h-6" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "farmer":
        return "Farmer Pilot Request";
      case "ngo_government":
        return "NGO & Government Partnership";
      case "investor":
        return "Investment Inquiry";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground">
              {getIcon()}
            </div>
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Farmer Specific Fields */}
          {type === "farmer" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="farm_size">Farm Size</Label>
                  <select
                    id="farm_size"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.farm_size}
                    onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                  >
                    <option value="">Select size</option>
                    <option value="< 1 hectare">Less than 1 hectare</option>
                    <option value="1-5 hectares">1-5 hectares</option>
                    <option value="5-20 hectares">5-20 hectares</option>
                    <option value="> 20 hectares">More than 20 hectares</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="crop_types">Crop Types</Label>
                  <Input
                    id="crop_types"
                    placeholder="Maize, Cassava, Cocoa..."
                    value={formData.crop_types}
                    onChange={(e) => setFormData({ ...formData, crop_types: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="current_drying_method">Current Drying Method</Label>
                <select
                  id="current_drying_method"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.current_drying_method}
                  onChange={(e) => setFormData({ ...formData, current_drying_method: e.target.value })}
                >
                  <option value="">Select method</option>
                  <option value="Sun drying on ground">Sun drying on ground</option>
                  <option value="Raised platform drying">Raised platform drying</option>
                  <option value="Traditional shed drying">Traditional shed drying</option>
                  <option value="Mechanical dryer">Mechanical dryer</option>
                  <option value="No drying facility">No drying facility</option>
                </select>
              </div>
            </>
          )}

          {/* NGO/Government Specific Fields */}
          {type === "ngo_government" && (
            <>
              <div>
                <Label htmlFor="organization">Organization Name *</Label>
                <Input
                  id="organization"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization_type">Organization Type</Label>
                  <select
                    id="organization_type"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.organization_type}
                    onChange={(e) => setFormData({ ...formData, organization_type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="NGO">NGO</option>
                    <option value="Government Ministry">Government Ministry</option>
                    <option value="Development Agency">Development Agency</option>
                    <option value="International Organization">International Organization</option>
                    <option value="Cooperative">Agricultural Cooperative</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="target_region">Target Region</Label>
                  <Input
                    id="target_region"
                    placeholder="e.g., Northern Ghana"
                    value={formData.target_region}
                    onChange={(e) => setFormData({ ...formData, target_region: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="estimated_beneficiaries">Estimated Beneficiaries</Label>
                <Input
                  id="estimated_beneficiaries"
                  type="number"
                  placeholder="Number of farmers"
                  value={formData.estimated_beneficiaries}
                  onChange={(e) => setFormData({ ...formData, estimated_beneficiaries: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Investor Specific Fields */}
          {type === "investor" && (
            <>
              <div>
                <Label htmlFor="organization">Company/Fund Name</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investment_range">Investment Range</Label>
                  <select
                    id="investment_range"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.investment_range}
                    onChange={(e) => setFormData({ ...formData, investment_range: e.target.value })}
                  >
                    <option value="">Select range</option>
                    <option value="$10K - $50K">$10K - $50K</option>
                    <option value="$50K - $250K">$50K - $250K</option>
                    <option value="$250K - $1M">$250K - $1M</option>
                    <option value="> $1M">More than $1M</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="investment_type">Investment Type</Label>
                  <select
                    id="investment_type"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.investment_type}
                    onChange={(e) => setFormData({ ...formData, investment_type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="Equity">Equity</option>
                    <option value="Debt">Debt</option>
                    <option value="Grant">Grant</option>
                    <option value="Convertible Note">Convertible Note</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="portfolio_focus">Portfolio Focus</Label>
                <Input
                  id="portfolio_focus"
                  placeholder="e.g., AgTech, Climate, Africa"
                  value={formData.portfolio_focus}
                  onChange={(e) => setFormData({ ...formData, portfolio_focus: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              rows={3}
              placeholder="Tell us more about your interest..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Inquiry"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipDialog;
