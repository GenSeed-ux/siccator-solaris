import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  FileText,
  Bell,
  Users,
  Activity,
  ChevronLeft,
  Cpu,
  Brain,
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Devices",
    icon: Cpu,
    url: "/dashboard/devices",
  },
  {
    title: "Farmers",
    icon: Users,
    url: "/dashboard/farmers",
  },
  {
    title: "Monitoring",
    icon: Activity,
    url: "/dashboard/monitoring",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/dashboard/analytics",
  },
  {
    title: "AI Control",
    icon: Brain,
    url: "/dashboard/ai-control",
  },
  {
    title: "Alerts",
    icon: Bell,
    url: "/dashboard/alerts",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className={cn("border-r border-sidebar-border", state === "collapsed" ? "w-16" : "w-64")}>
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-sidebar-border">
          {state !== "collapsed" ? (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Siccator Solaris" className="w-10 h-10" />
              <div>
                <h2 className="font-bold text-sidebar-foreground">Siccator Solaris</h2>
                <p className="text-xs text-sidebar-foreground/60">Admin Portal</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <img src={logo} alt="Siccator Solaris" className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(state === "collapsed" && "sr-only")}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collapse Toggle */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarTrigger className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 text-sidebar-foreground/70 transition-all">
            <ChevronLeft className={cn("w-5 h-5 transition-transform", state === "collapsed" && "rotate-180")} />
            {state !== "collapsed" && <span className="text-sm font-medium">Collapse</span>}
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
