import { BarChart3, CalendarRange, House, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Oggi", icon: House },
  { to: "/plan", label: "Piano", icon: CalendarRange },
  { to: "/progress", label: "Progressi", icon: BarChart3 },
  { to: "/profile", label: "Percorso", icon: UserRound }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[440px] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between rounded-[26px] border border-white/75 bg-[rgba(248,252,251,0.96)] px-2 py-2 shadow-[0_16px_36px_rgba(73,103,104,0.1)]">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex min-w-[64px] flex-col items-center gap-1 rounded-[20px] px-3 py-2 text-[0.72rem] font-semibold transition",
                  isActive
                    ? "bg-white text-accent shadow-[0_8px_18px_rgba(73,103,104,0.1)]"
                    : "text-muted hover:text-ink"
                )
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
