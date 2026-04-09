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
  const guidanceSteps = guidance?.steps ?? [];

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
          <p className="mt-2 text-sm leading-6 text-ink">
            {guidance?.purpose ??
              `Serve a lavorare soprattutto su ${step.bodyArea.toLowerCase()}.`}
          </p>
          {guidance?.practicalWhy ? (
            <p className="mt-2 text-sm leading-6 text-muted">{guidance.practicalWhy}</p>
          ) : null}
        </div>
        <div className="rounded-[1.1rem] bg-accent-soft px-3 py-2 text-right text-accent-deep">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
            dose prevista
          </div>
          <div className="mt-1 text-sm font-semibold">{step.doseLabel}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
          focus: {step.bodyArea}
        </span>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
          recupero {step.restSeconds}s
        </span>
      </div>

      <div className="mt-4">
        <ExerciseFigure exerciseId={step.exerciseId} />
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Come partire
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {guidance?.startingPosition ??
              "Prendi una posizione stabile e comoda prima di iniziare il gesto."}
          </p>
        </div>

        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Passo dopo passo
          </div>
          <ol className="mt-2 space-y-2">
            {guidanceSteps.length > 0 ? (
              guidanceSteps.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-deep">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-ink">{item}</p>
                </li>
              ))
            ) : (
              <li className="text-sm leading-6 text-ink">
                {guidance?.movementCue ?? step.executionNote ?? step.summary}
              </li>
            )}
          </ol>
        </div>

        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Cosa sentire
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {guidance?.feelCue ??
              `Dovresti sentire soprattutto ${step.bodyArea.toLowerCase()}, senza irrigidire il resto del corpo.`}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            <span className="font-semibold text-ink">Ritorno controllato:</span>{" "}
            {guidance?.returnCue ?? "Torna alla posizione iniziale con calma."}
          </p>
          {guidance?.attention?.length ? (
            <div className="mt-3 rounded-[18px] bg-[rgba(244,249,248,0.92)] px-3 py-3">
              <div className="text-sm font-semibold text-ink">Attenzione</div>
              <ul className="mt-2 space-y-2">
                {guidance.attention.map((item) => (
                  <li key={item} className="text-sm leading-6 text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(guidance?.easierOption ?? step.easierOption) ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink">Versione più facile:</span>{" "}
              {guidance?.easierOption ?? step.easierOption}
            </p>
          ) : null}
          {step.caution ? (
            <p className="mt-2 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink">Nota utile:</span> {step.caution}
            </p>
          ) : null}
          {guidance?.microTip ? (
            <p className="mt-2 text-sm leading-6 text-accent-deep">{guidance.microTip}</p>
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
