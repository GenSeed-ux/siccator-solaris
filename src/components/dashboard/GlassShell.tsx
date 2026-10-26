import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Sliders, BarChart3, History, Bell, Settings } from "lucide-react";
import bgImage from "@/assets/dashboard-bg.jpg";

const NAV = [
  { url: "/dashboard", icon: Home, label: "Overview" },
  { url: "/dashboard/controls", icon: Sliders, label: "Controls" },
  { url: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { url: "/dashboard/history", icon: History, label: "History" },
  { url: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { url: "/dashboard/settings", icon: Settings, label: "Settings" },
];

/** Shared glass frame (photo background + icon rail) for dashboard sub-pages. */
export function GlassShell({ children }: { children: ReactNode }) {
  return (
    <div className="glass-scope relative isolate min-h-screen w-full overflow-x-hidden">
      <img src={bgImage} alt="" aria-hidden className="fixed inset-0 -z-20 h-full w-full object-cover" />
      <div className="fixed inset-0 -z-10 bg-slate-900/35 backdrop-blur-md" aria-hidden />

      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-20 flex-col items-center justify-between rounded-r-3xl border-r border-white/25 bg-white/10 py-6 backdrop-blur-2xl md:flex">
        <nav className="mt-20 flex flex-col gap-5">
          {NAV.map((n) => (
            <NavLink key={n.url} to={n.url} end title={n.label} aria-label={n.label}
              className={({ isActive }) => `flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-white/25 ${isActive ? "bg-white/35 shadow-lg" : ""}`}>
              <n.icon className="h-6 w-6" />
            </NavLink>
          ))}
        </nav>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-green-600 font-bold text-white" title="Farmer DEMO-001">FA</div>
      </aside>

      <div className="md:pl-24">
        <nav className="mx-3 mt-3 flex justify-around md:hidden">
          {NAV.map((n) => (
            <NavLink key={n.url} to={n.url} end aria-label={n.label}
              className={({ isActive }) => `flex h-10 w-10 items-center justify-center rounded-full text-white ${isActive ? "bg-white/35" : "bg-white/10"}`}>
              <n.icon className="h-5 w-5" />
            </NavLink>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
