import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Download, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminPilots = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data } = await supabase
      .from("pilot_requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setRequests(data);
  };

  const updateStatus = async (id: string, status: string) => {
    setLoading(true);
    await supabase
      .from("pilot_requests")
      .update({ status })
      .eq("id", id);

    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({
      title: "Status Updated",
      description: `Request ${status}`,
    });
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Location", "Organization", "Status", "Date"];
    const rows = requests.map((r) => [
      r.full_name,
      r.email,
      r.phone || "-",
      r.location,
      r.organization || "-",
      r.status,
      new Date(r.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pilot-requests.csv";
    a.click();

    toast({
      title: "Export Complete",
      description: "Pilot requests exported to CSV",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: { variant: "outline", icon: Clock, color: "text-yellow-600" },
      approved: { variant: "default", icon: CheckCircle, color: "text-green-600" },
      rejected: { variant: "destructive", icon: XCircle, color: "text-red-600" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2E8B57]">Pilot Requests</h1>
          <p className="text-muted-foreground">Manage incoming pilot program requests</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.full_name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.organization || "-"}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(request.id, "approved")}
                            disabled={loading}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(request.id, "rejected")}
                            disabled={loading}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPilots;
