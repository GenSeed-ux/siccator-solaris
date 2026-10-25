import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  className?: string;
  active?: boolean;
  children: ReactNode;
}

/**
 * Reusable glassmorphism surface. Applies the `.glass` design-system class,
 * an "active" highlight, and a gentle lift on hover.
 */
export function GlassCard({ className, active, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-4 transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5",
        active && "glass-active",
        className
      )}
    >
      {children}
    </div>
  );
}
