import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, Loader2, Users, Building, DollarSign } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type PartnershipInquiry = Tables<"partnership_inquiries">;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700",
  contacted: "bg-blue-500/20 text-blue-700",
  approved: "bg-green-500/20 text-green-700",
  rejected: "bg-red-500/20 text-red-700",
};

const typeIcons: Record<string, React.ReactNode> = {
  farmer: <Users className="h-4 w-4" />,
  ngo_government: <Building className="h-4 w-4" />,
  investor: <DollarSign className="h-4 w-4" />,
};

const AdminPartnerships = () => {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<PartnershipInquiry | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["admin-partnerships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partnership_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const { error } = await supabase
        .from("partnership_inquiries")
        .update({ status, admin_notes })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partnerships"] });
      toast.success("Inquiry updated");
    },
    onError: () => toast.error("Failed to update inquiry"),
  });

  const filteredInquiries = inquiries?.filter((i) => {
    if (filterType !== "all" && i.inquiry_type !== filterType) return false;
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: inquiries?.length || 0,
    pending: inquiries?.filter((i) => i.status === "pending").length || 0,
    farmers: inquiries?.filter((i) => i.inquiry_type === "farmer").length || 0,
    ngos: inquiries?.filter((i) => i.inquiry_type === "ngo_government").length || 0,
    investors: inquiries?.filter((i) => i.inquiry_type === "investor").length || 0,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Partnership Inquiries</h1>

      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.farmers}</div>
            <p className="text-sm text-muted-foreground">Farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.ngos}</div>
            <p className="text-sm text-muted-foreground">NGOs/Gov</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.investors}</div>
            <p className="text-sm text-muted-foreground">Investors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Inquiries</CardTitle>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="farmer">Farmers</SelectItem>
                  <SelectItem value="ngo_government">NGO/Government</SelectItem>
                  <SelectItem value="investor">Investors</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries?.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {typeIcons[inquiry.inquiry_type]}
                        <span className="capitalize">{inquiry.inquiry_type.replace("_", "/")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{inquiry.full_name}</TableCell>
                    <TableCell>{inquiry.organization || "-"}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{format(new Date(inquiry.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[inquiry.status]}>{inquiry.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setSelectedInquiry(inquiry)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedInquiry.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedInquiry.phone || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Organization</Label>
                  <p className="font-medium">{selectedInquiry.organization || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedInquiry.location || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{selectedInquiry.inquiry_type.replace("_", "/")}</p>
                </div>
              </div>

              {selectedInquiry.inquiry_type === "farmer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Farm Size</Label>
                    <p className="font-medium">{selectedInquiry.farm_size || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Crop Types</Label>
                    <p className="font-medium">{selectedInquiry.crop_types?.join(", ") || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Current Drying Method</Label>
                    <p className="font-medium">{selectedInquiry.current_drying_method || "-"}</p>
                  </div>
                </div>
              )}

              {selectedInquiry.inquiry_type === "ngo_government" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Organization Type</Label>
                    <p className="font-medium">{selectedInquiry.organization_type || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Target Region</Label>
                    <p className="font-medium">{selectedInquiry.target_region || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Est. Beneficiaries</Label>
                    <p className="font-medium">{selectedInquiry.estimated_beneficiaries || "-"}</p>
                  </div>
                </div>
              )}

              {selectedInquiry.inquiry_type === "investor" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Investment Type</Label>
                    <p className="font-medium">{selectedInquiry.investment_type || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Investment Range</Label>
                    <p className="font-medium">{selectedInquiry.investment_range || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Portfolio Focus</Label>
                    <p className="font-medium">{selectedInquiry.portfolio_focus || "-"}</p>
                  </div>
                </div>
              )}

              {selectedInquiry.message && (
                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <p className="font-medium whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              )}

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(status) => {
                    updateMutation.mutate({ id: selectedInquiry.id, status, admin_notes: selectedInquiry.admin_notes || undefined });
                    setSelectedInquiry({ ...selectedInquiry, status });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={selectedInquiry.admin_notes || ""}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, admin_notes: e.target.value })}
                  placeholder="Add internal notes..."
                />
                <Button
                  className="mt-2"
                  onClick={() => updateMutation.mutate({
                    id: selectedInquiry.id,
                    status: selectedInquiry.status,
                    admin_notes: selectedInquiry.admin_notes || undefined,
                  })}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartnerships;
