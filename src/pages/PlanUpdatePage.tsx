import { Crown, RefreshCw, Sparkles } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function PlanUpdatePage() {
  const { data, regeneratePlan, activatePremium, status, error } = useMiryaApp();

  if (!data?.userAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const isPremium = data.userAccess.status === "premium";

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="eyebrow">Aggiorna il mio percorso</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          {isPremium
            ? "Facciamo il punto e adattiamo il percorso."
            : "L'aggiornamento del percorso fa parte della continuita Premium."}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          {isPremium
            ? "Usiamo progressi, feedback e ritmo reale per capire se confermare, alleggerire o far evolvere la fase."
            : "Il primo piano ti mostra la direzione. Da qui in poi il valore premium e che Mirya non resta ferma, ma si adatta con te."}
        </p>
      </section>

      {isPremium ? (
        <section className="surface px-5 py-5">
          <div className="text-base font-semibold text-ink">Cosa useremo adesso</div>
          <div className="mt-4 space-y-3">
            {[
              "Le sessioni completate e quanto bene sei riuscita a proteggerle.",
              "Il feedback finale che hai lasciato dopo i workout.",
              "Le eventuali nuove informazioni del profilo o della rivalutazione breve."
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-line bg-white/78 px-4 py-4 text-sm leading-6 text-muted"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Button
              fullWidth
              onClick={() => void regeneratePlan("weekly_refresh")}
              disabled={status === "saving"}
              icon={<RefreshCw size={18} />}
              className="justify-between"
            >
              {status === "saving" ? "Aggiornamento in corso..." : "Aggiorna il mio percorso"}
            </Button>
          </div>
        </section>
      ) : (
        <section className="surface px-5 py-5">
          <div className="space-y-3">
            {[
              {
                icon: Sparkles,
                title: "Il focus puo spostarsi",
                body: "Quando serve, Mirya puo ribilanciare il lavoro tra tono, postura, core e ripartenza."
              },
              {
                icon: RefreshCw,
                title: "Il ritmo puo alleggerirsi o salire",
                body: "Se la settimana cambia o il corpo risponde meglio, il piano viene corretto e spiegato."
              },
              {
                icon: Crown,
                title: "La continuita resta personale",
                body: "Storico adattamenti, rivalutazioni e tips piu rilevanti restano dentro una lettura unica del tuo percorso."
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

          <div className="mt-5">
            <Button
              fullWidth
              onClick={() => void activatePremium()}
              disabled={status === "saving"}
              icon={<Crown size={18} />}
              className="justify-between"
            >
              {status === "saving" ? "Attivazione..." : "Passa a Premium beta"}
            </Button>
          </div>
        </section>
      )}

      {error ? (
        <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
