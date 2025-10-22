import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Layers,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPilots: 0,
    pendingPilots: 0,
    publishedBlogs: 0,
    totalApplications: 0,
    totalStories: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [pilots, blogs, applications, stories] = await Promise.all([
      supabase.from("pilot_requests").select("*", { count: "exact" }),
      supabase.from("blog_posts").select("*", { count: "exact" }).eq("is_published", true),
      supabase.from("crop_applications").select("*", { count: "exact" }),
      supabase.from("stories_testimonials").select("*", { count: "exact" }),
    ]);

    const pendingPilots = await supabase
      .from("pilot_requests")
      .select("*", { count: "exact" })
      .eq("status", "pending");

    setStats({
      totalPilots: pilots.count || 0,
      pendingPilots: pendingPilots.count || 0,
      publishedBlogs: blogs.count || 0,
      totalApplications: applications.count || 0,
      totalStories: stories.count || 0,
    });
  };

  const statCards = [
    {
      title: "Total Pilot Requests",
      value: stats.totalPilots,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Pending Requests",
      value: stats.pendingPilots,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Published Blogs",
      value: stats.publishedBlogs,
      icon: FileText,
      color: "text-green-500",
    },
    {
      title: "Crop Applications",
      value: stats.totalApplications,
      icon: Layers,
      color: "text-purple-500",
    },
    {
      title: "Stories & Testimonials",
      value: stats.totalStories,
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2E8B57]">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Smart Solar Dryer CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <FileText className="h-6 w-6 text-[#2E8B57] mb-2" />
            <h3 className="font-semibold">Create New Blog Post</h3>
            <p className="text-sm text-muted-foreground">Add a new article to your blog</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <Users className="h-6 w-6 text-[#2E8B57] mb-2" />
            <h3 className="font-semibold">Review Pilot Requests</h3>
            <p className="text-sm text-muted-foreground">Approve or reject pending requests</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
