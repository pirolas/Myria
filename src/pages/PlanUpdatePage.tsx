import { CheckCircle2, Crown, RefreshCw, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import { getPlanReviewGate } from "@/lib/mirya";

export function PlanUpdatePage() {
  const {
    data,
    activatePremium,
    status,
    error,
    planRevision,
    clearPlanRevisionFeedback
  } = useMiryaApp();

  if (!data?.userAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const isPremium = data.userAccess.status === "premium";
  const reviewGate = getPlanReviewGate(data);
  const isReviewing = planRevision.status === "loading";
  const hasRevisionOutcome =
    planRevision.status === "updated" || planRevision.status === "unchanged";
  const hasRevisionError = planRevision.status === "error";

  const resetRevisionFeedback = () => {
    clearPlanRevisionFeedback();
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="eyebrow">Rivedi il percorso</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          {isPremium
            ? "Il percorso si aggiorna quando ha davvero senso farlo."
            : "La continuità del percorso fa parte di Premium."}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          {isPremium
            ? "Mirya non ricalcola a caso. Prima raccoglie segnali utili, poi decide se confermare la direzione oppure correggerla."
            : "Il primo piano ti mostra la direzione. Da qui in poi il valore premium è che il percorso continua ad adattarsi con criterio."}
        </p>
      </section>

      {isPremium ? (
        <section className="surface px-5 py-5">
          {isReviewing ? (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-[rgba(94,184,178,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(239,249,247,0.92))] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
                    <RefreshCw size={18} className="animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-ink">
                      Stiamo rivedendo il tuo percorso
                    </div>
                    <p className="text-sm leading-6 text-muted">
                      Stiamo aggiornando il piano in base alle nuove informazioni.
                      Potrebbero volerci alcuni secondi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Rileggiamo il ritmo reale che riesci a proteggere nella tua settimana.",
                  "Controlliamo se serve alleggerire, confermare o spostare il focus.",
                  "Tra poco ti diremo con chiarezza se qualcosa cambia davvero."
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-line bg-white/78 px-4 py-4 text-sm leading-6 text-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : hasRevisionOutcome ? (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-[rgba(94,184,178,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(239,249,247,0.92))] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-ink">
                      {planRevision.status === "updated"
                        ? "Il tuo piano è stato aggiornato"
                        : "Abbiamo rivisto il tuo piano"}
                    </div>
                    <p className="text-sm leading-6 text-muted">{planRevision.message}</p>
                  </div>
                </div>
              </div>

              {planRevision.status === "updated" && planRevision.changesSummary.length > 0 ? (
                <div className="rounded-[24px] border border-line bg-white/82 px-5 py-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Cosa è cambiato
                  </div>
                  <div className="mt-4 space-y-3">
                    {planRevision.changesSummary.map((item) => (
                      <div
                        key={item}
                        className="rounded-[20px] border border-[rgba(94,184,178,0.16)] bg-[rgba(245,251,249,0.92)] px-4 py-4 text-sm leading-6 text-ink"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-line bg-white/82 px-5 py-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Esito della revisione
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Per ora la direzione resta quella giusta. Non erano necessarie
                    modifiche importanti in questa fase.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Link to="/plan" className="flex-1">
                  <Button variant="secondary" fullWidth>
                    Vedi il piano attuale
                  </Button>
                </Link>
                <Button fullWidth onClick={resetRevisionFeedback} className="flex-1">
                  Chiudi
                </Button>
              </div>
            </div>
          ) : hasRevisionError ? (
            <div className="space-y-4">
              <div className="rounded-[24px] bg-[rgba(183,98,98,0.1)] px-5 py-5">
                <div className="text-base font-semibold text-[rgba(116,63,63,0.96)]">
                  Non siamo riusciti a rivedere il piano
                </div>
                <p className="mt-3 text-sm leading-6 text-[rgba(116,63,63,0.9)]">
                  {planRevision.message ??
                    "La revisione non è andata a buon fine. Puoi riprovare tra un attimo."}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/reassessment" className="flex-1">
                  <Button fullWidth icon={<Sparkles size={18} />} className="justify-between">
                    Riapri il check-in
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={resetRevisionFeedback}
                  className="flex-1"
                >
                  Chiudi
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-line bg-white/82 px-5 py-5">
                <div className="text-base font-semibold text-ink">{reviewGate.title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{reviewGate.body}</p>
                {reviewGate.hint ? (
                  <p className="mt-3 text-sm leading-6 text-muted">{reviewGate.hint}</p>
                ) : null}
              </div>

              <div className="space-y-3">
                {[
                  "Prima raccogliamo segnali veri, non una richiesta impulsiva.",
                  "Se il piano resta corretto, te lo diciamo con chiarezza.",
                  "Se serve correggerlo, lo facciamo senza perdere coerenza."
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-line bg-white/78 px-4 py-4 text-sm leading-6 text-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link to={reviewGate.actionTo} className="flex-1">
                  <Button fullWidth icon={<Sparkles size={18} />} className="justify-between">
                    {reviewGate.actionLabel}
                  </Button>
                </Link>
                <Link to="/plan" className="flex-1">
                  <Button variant="secondary" fullWidth>
                    Torna al piano
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="surface px-5 py-5">
          <div className="space-y-3">
            {[
              {
                icon: Sparkles,
                title: "Il focus può spostarsi",
                body: "Quando serve, Mirya può ribilanciare il lavoro tra tono, postura, core e ripartenza."
              },
              {
                icon: RefreshCw,
                title: "Il ritmo può alleggerirsi o aumentare",
                body: "Se la settimana cambia o il corpo risponde meglio, il piano viene corretto e spiegato."
              },
              {
                icon: Crown,
                title: "La continuità resta personale",
                body: "Storico adattamenti, rivalutazioni e tips più rilevanti restano dentro una lettura unica del tuo percorso."
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

      {error && !hasRevisionError ? (
        <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
