import { ArrowLeft } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { brand } from "@/data/content";
import { formatLongDate } from "@/lib/date";

function resolveMeta(pathname: string) {
  if (pathname.startsWith("/session/")) {
    return {
      label: "Sessione attiva",
      backTo: "/today",
      badge: "timer"
    };
  }

  if (pathname.startsWith("/today")) {
    return {
      label: "Workout di oggi",
      backTo: "/dashboard",
      badge: "oggi"
    };
  }

  if (pathname.startsWith("/plan")) {
    return pathname.startsWith("/plan/story")
      ? { label: "Perche questo piano", backTo: "/plan", badge: "lettura" }
      : { label: "Piano settimanale", badge: "percorso" };
  }

  if (pathname.startsWith("/progress")) {
    return { label: "Progressi", badge: "costanza" };
  }

  if (pathname.startsWith("/profile")) {
    return pathname.startsWith("/profile/deep")
      ? { label: "Profilo approfondito", backTo: "/profile", badge: "precisione" }
      : { label: "Il mio percorso", badge: "profilo" };
  }

  if (pathname.startsWith("/reassessment")) {
    return { label: "Rivalutazione", backTo: "/plan", badge: "breve" };
  }

  return { label: "Dashboard", badge: formatLongDate(new Date()) };
}

export function AppShell() {
  const location = useLocation();
  const meta = resolveMeta(location.pathname);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.44),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-4 pb-28 pt-4">
        <header className="page-enter sticky top-0 z-20 mb-6 flex items-center justify-between rounded-[26px] border border-white/75 bg-[rgba(248,252,251,0.94)] px-4 py-3 shadow-[0_12px_30px_rgba(73,103,104,0.06)]">
          <div className="flex items-center gap-3">
            {meta.backTo ? (
              <Link
                to={meta.backTo}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-[rgba(255,255,255,0.92)] text-ink"
                aria-label="Torna indietro"
              >
                <ArrowLeft size={18} />
              </Link>
            ) : null}
            <div>
              <div className="eyebrow">{brand.name}</div>
              <div className="text-sm font-semibold text-ink">{meta.label}</div>
            </div>
          </div>
          <div className="rounded-full border border-white/70 bg-[rgba(255,255,255,0.9)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-deep">
            {meta.badge}
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
