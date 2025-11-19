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
  Menu
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
  { icon: Users, label: "Pilot Requests", path: "/admin/pilots" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const { signOut } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-card border-r h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <SolarDryerLogo size={32} variant="icon" />
            <h2 className="font-semibold text-lg text-primary">Admin Panel</h2>
          </div>
        ) : (
          <SolarDryerLogo size={32} variant="icon" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-[#2E8B57] text-white"
                  : "hover:bg-muted text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};
