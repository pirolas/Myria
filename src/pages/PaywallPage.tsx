import { ArrowRight, Crown, RefreshCw, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function PaywallPage() {
  const { data, activatePremium, status, error } = useMiryaApp();

  if (!data?.userAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  if (data.userAccess.status === "premium") {
    return <Navigate to="/plan/update" replace />;
  }

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[16rem]">
            <div className="eyebrow">Continua con Premium</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              Il vero valore ora e far evolvere il percorso con te.
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Il primo piano ti ha mostrato la direzione. Premium serve a non
              lasciarlo fermo: osserva i progressi, legge i feedback e aggiorna il
              percorso quando cambia la tua situazione.
            </p>
          </div>
          <div className="rounded-[1.3rem] bg-white/82 p-3 text-accent-deep">
            <Crown size={18} />
          </div>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Con Premium continui così</div>
        <div className="mt-4 space-y-3">
          {[
            {
              icon: RefreshCw,
              title: "Il piano si aggiorna",
              body: "Non resti con il piano iniziale: Mirya può correggere ritmo, focus e progressione nel tempo."
            },
            {
              icon: Sparkles,
              title: "La rivalutazione diventa utile",
              body: "Le rivalutazioni brevi non sono un questionario in più: servono a decidere cosa cambiare davvero."
            },
            {
              icon: Crown,
              title: "Vedi l'evoluzione del percorso",
              body: "Storico adattamenti, focus che si sposta quando serve, tips più rilevanti e reminder."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
                    <Icon size={16} />
                  </div>
                  <div className="text-sm font-semibold text-ink">{item.title}</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
          {error}
        </div>
      ) : null}

      <div className="flex gap-3">
        <Link to="/progress" className="flex-1">
          <Button variant="secondary" fullWidth>
            Rivedi i progressi
          </Button>
        </Link>
        <Button
          fullWidth
          onClick={() => void activatePremium()}
          disabled={status === "saving"}
          icon={<ArrowRight size={18} />}
          className="flex-1 justify-between"
        >
          {status === "saving" ? "Attivazione..." : "Attiva Premium beta"}
        </Button>
      </div>
    </div>
  );
}



