import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Info, 
  Cpu, 
  Layers, 
  TrendingUp, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  Menu,
  Image,
  Award,
  Handshake
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SolarDryerLogo } from "@/components/SolarDryerLogo";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Home, label: "Home Page", path: "/admin/home" },
  { icon: Info, label: "About Page", path: "/admin/about" },
  { icon: Cpu, label: "Technology", path: "/admin/technology" },
  { icon: Layers, label: "Applications", path: "/admin/applications" },
  { icon: TrendingUp, label: "Impact Data", path: "/admin/impact" },
  { icon: FileText, label: "Blog Posts", path: "/admin/blog" },
  { icon: Image, label: "Gallery", path: "/admin/gallery" },
  { icon: Award, label: "Success Stories", path: "/admin/success-stories" },
  { icon: Handshake, label: "Partnerships", path: "/admin/partnerships" },
  { icon: Users, label: "Pilot Requests", path: "/admin/pilots" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const { signOut } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-card border-r h-screen sticky top-0 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <SolarDryerLogo size={32} variant="icon" className="flex-shrink-0" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base text-primary truncate">Admin Panel</h2>
            <p className="text-xs text-muted-foreground truncate">Solar Dryer CMS</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};
