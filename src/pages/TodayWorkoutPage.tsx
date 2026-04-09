import { ArrowRight, ShieldAlert } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { StepGuidanceCard } from "@/components/workouts/StepGuidanceCard";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function TodayWorkoutPage() {
  const { data } = useMiryaApp();

  if (!data?.todayPlanDay) {
    return <Navigate to="/dashboard" replace />;
  }

  const planDay = data.todayPlanDay;
  const firstStep = planDay.workout.steps[0] ?? null;
  const remainingSteps = Math.max(planDay.workout.steps.length - 1, 0);

  return (
    <div className="page-enter space-y-5">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="eyebrow">Workout di oggi</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          {planDay.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">{planDay.coachNote}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
            {planDay.estimatedMinutes} minuti
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {planDay.workout.steps.length} esercizi già ordinati
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            focus: {planDay.focus}
          </span>
        </div>

        <div className="mt-5 rounded-[24px] bg-[rgba(255,255,255,0.82)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Cosa succede adesso
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            Si parte con <span className="font-semibold">{firstStep?.title ?? "il primo esercizio"}</span>.
            Prima vedi il gesto, poi avvii il countdown e il timer ti accompagna fino alla fine.
          </p>
        </div>

        <div className="mt-5">
          <Link to={`/session/${planDay.id}`}>
            <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
              Apri il timer e inizia
            </Button>
          </Link>
        </div>
      </section>

      {firstStep ? (
        <StepGuidanceCard
          step={firstStep}
          eyebrow="Si parte da qui"
          title={`Primo esercizio: ${firstStep.title}`}
        />
      ) : null}

      <section className="surface px-5 py-5">
        <div className="eyebrow">Sequenza essenziale</div>
        <h2 className="mt-3 text-[1.35rem] font-semibold leading-tight text-ink">
          Oggi il timer ti farà seguire questa traccia
        </h2>
        <div className="mt-4 space-y-3">
          {planDay.workout.steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {index === 0 ? "Si parte qui" : `Poi ${index + 1}`}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink">{step.title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.summary}</p>
                </div>
                <div className="rounded-full bg-[rgba(246,250,249,0.92)] px-3 py-2 text-xs font-semibold text-muted">
                  {step.doseLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
        {remainingSteps > 0 ? (
          <p className="mt-4 text-sm leading-6 text-muted">
            Non dovrai ricordarti nulla: pause e passaggi ai movimenti successivi
            sono già dentro il timer.
          </p>
        ) : null}
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
