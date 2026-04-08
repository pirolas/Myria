import { ArrowRight, ShieldAlert, Timer } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function TodayWorkoutPage() {
  const { data } = useMiryaApp();

  if (!data?.todayPlanDay) {
    return <Navigate to="/dashboard" replace />;
  }

  const planDay = data.todayPlanDay;
  const startFlow = [
    "Premi avvia e segui il countdown iniziale.",
    "Lascia che il timer faccia avanzare esercizi e pause.",
    "A fine sessione indica come ti sei sentita, in pochi tocchi."
  ];

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="eyebrow">Workout di oggi</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          {planDay.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">{planDay.coachNote}</p>

        <div className="mt-5 directive-strip">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="eyebrow text-accent-deep">Quello che fai adesso</div>
              <div className="mt-2 text-lg font-semibold text-ink">
                Apri il timer e segui una sessione gia pronta.
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Nessuna scelta da fare: oggi hai una sequenza chiara, breve e gia
                composta per te.
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-accent-soft px-4 py-3 text-right text-accent-deep">
              <div className="text-xs uppercase tracking-[0.16em]">durata</div>
              <div className="mt-1 text-lg font-semibold">
                {planDay.estimatedMinutes} min
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
              {planDay.workout.steps.length} step guidati
            </span>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
              focus: {planDay.focus}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <Link to={`/session/${planDay.id}`}>
            <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
              Apri il timer e inizia
            </Button>
          </Link>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Come funziona"
          title="Per oggi ti basta seguire questo flusso"
          description="Mirya resta semplice anche mentre ti alleni: un passo alla volta, senza schermate affollate."
        />

        <div className="mt-5 space-y-3">
          {startFlow.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(215,239,236,0.82)] text-sm font-semibold text-accent-deep">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Sequenza di oggi"
          title="Gli step sono gia ordinati per te"
          description="Leggili solo se vuoi orientarti prima di partire. Durante la sessione troverai una guida ancora piu semplice."
        />

        <div className="mt-5 space-y-3">
          {planDay.workout.steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Step {index + 1}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink">{step.title}</div>
                </div>
                <div className="text-sm font-semibold text-accent-deep">
                  {step.durationSeconds}s
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{step.summary}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                {step.doseLabel}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[rgba(215,239,236,0.78)] p-3 text-accent-deep">
            <Timer size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Timer interno guidato</div>
            <p className="mt-1 text-sm leading-6 text-muted">
              Countdown iniziale, durata esercizio, recupero e passaggio automatico
              allo step successivo.
            </p>
          </div>
        </div>
      </section>

      {planDay.workout.cautionNotes.length > 0 ? (
        <section className="surface px-5 py-5">
          <div className="flex items-center gap-2 text-muted">
            <ShieldAlert size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Attenzioni utili
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {planDay.workout.cautionNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
