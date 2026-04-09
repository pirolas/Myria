import { Dot } from "lucide-react";
import { ExerciseFigure } from "@/components/workouts/ExerciseFigure";
import { homeEquipmentTips } from "@/data/homeEquipment";
import { exerciseGuidance } from "@/data/exerciseGuidance";
import { getExerciseById } from "@/lib/selectors";
import type { WorkoutStepPlan } from "@/types/domain";

interface StepGuidanceCardProps {
  step: WorkoutStepPlan;
  eyebrow?: string;
  title?: string;
}

export function StepGuidanceCard({
  step,
  eyebrow = "Esercizio",
  title
}: StepGuidanceCardProps) {
  const exercise = getExerciseById(step.exerciseId);
  const guidance = exerciseGuidance[step.exerciseId];
  const homeSupport = homeEquipmentTips[step.exerciseId];
  const visibleTitle = title ?? exercise?.name ?? step.title;

  return (
    <section className="surface px-5 py-5">
      <div className="eyebrow">{eyebrow}</div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[1.45rem] font-semibold leading-tight text-ink">
            {visibleTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {guidance?.summary ?? step.summary}
          </p>
        </div>
        <div className="rounded-[1.1rem] bg-accent-soft px-3 py-2 text-right text-accent-deep">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
            dose
          </div>
          <div className="mt-1 text-sm font-semibold">{step.doseLabel}</div>
        </div>
      </div>

      <div className="mt-4">
        <ExerciseFigure exerciseId={step.exerciseId} />
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Posizione
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {guidance?.startingPosition ??
              "Prendi una posizione stabile e comoda prima di iniziare il gesto."}
          </p>
        </div>

        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Cosa fare
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {guidance?.movementCue ?? step.executionNote ?? step.summary}
          </p>
        </div>

        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Cosa sentire
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {guidance?.feelCue ??
              `Dovresti sentire soprattutto ${step.bodyArea.toLowerCase()}, senza irrigidire il resto del corpo.`}
          </p>
          {step.easierOption ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink">Se oggi vuoi alleggerire:</span>{" "}
              {step.easierOption}
            </p>
          ) : null}
          {step.caution ? (
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink">Attenzione:</span> {step.caution}
            </p>
          ) : null}
        </div>
      </div>

      {homeSupport ? (
        <div className="mt-4 rounded-[22px] border border-[rgba(94,184,178,0.18)] bg-[rgba(241,252,251,0.92)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Oggetti di casa utili
          </div>
          <div className="mt-2 text-sm font-semibold text-ink">{homeSupport.title}</div>
          <p className="mt-2 text-sm leading-6 text-muted">{homeSupport.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {homeSupport.ideas.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted"
              >
                <Dot size={16} className="-ml-1 text-accent-deep" />
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
