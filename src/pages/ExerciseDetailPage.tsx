import { CheckCircle2, CircleAlert, HeartHandshake } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ExerciseFigure } from "@/components/workouts/ExerciseFigure";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { exerciseGuidance } from "@/data/exerciseGuidance";
import { safetyNotes } from "@/data/content";
import { programs } from "@/data/workouts";
import { useAppStore } from "@/hooks/useAppStore";
import { getExerciseById, getPersonalExerciseNote } from "@/lib/selectors";

export function ExerciseDetailPage() {
  const { exerciseId } = useParams();
  const { state, toggleUncomfortableExercise } = useAppStore();

  if (!exerciseId) {
    return <Navigate to="/workouts" replace />;
  }

  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return <Navigate to="/workouts" replace />;
  }

  const guidance = exerciseGuidance[exercise.id];
  const isUncomfortable = state.progress.uncomfortableExerciseIds.includes(exercise.id);
  const relatedPrograms = programs.filter((program) =>
    program.exerciseIds.includes(exercise.id)
  );
  const personalNote = getPersonalExerciseNote(state.preferences, exercise);

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Dettaglio esercizio</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          {exercise.name}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          {guidance?.summary ?? exercise.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
            {exercise.bodyArea}
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {exercise.dose}
          </span>
        </div>

        <div className="mt-5 rounded-[24px] border border-line bg-[rgba(255,255,255,0.72)] px-4 py-4">
          <div className="text-sm font-semibold text-ink">A cosa serve</div>
          <p className="mt-2 text-sm leading-6 text-muted">
            {guidance?.purpose ?? exercise.benefit}
          </p>
          {guidance?.practicalWhy ? (
            <p className="mt-2 text-sm leading-6 text-ink">{guidance.practicalWhy}</p>
          ) : null}
        </div>

        <div className="mt-5">
          <ExerciseFigure exerciseId={exercise.id} />
        </div>

        <div className="mt-5 rounded-[24px] border border-[rgba(94,184,178,0.18)] bg-[rgba(241,252,251,0.9)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Per te oggi
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{personalNote}</p>
        </div>
      </section>

      {guidance ? (
        <section className="grid gap-3">
          <div className="surface px-5 py-5">
            <div className="text-sm font-semibold text-ink">Come partire</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {guidance.startingPosition}
            </p>
          </div>

          <div className="surface px-5 py-5">
            <div className="text-sm font-semibold text-ink">Come si fa</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {guidance.movementCue}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              <span className="font-semibold text-ink">Ritorno:</span> {guidance.returnCue}
            </p>
          </div>

          <div className="surface px-5 py-5">
            <div className="text-sm font-semibold text-ink">Cosa dovresti sentire</div>
            <p className="mt-2 text-sm leading-6 text-muted">{guidance.feelCue}</p>
            <p className="mt-3 text-sm leading-6 text-accent-deep">
              {guidance.microTip}
            </p>
          </div>
        </section>
      ) : null}

      <section className="surface px-5 py-5">
        <SectionHeading
          title="Passo dopo passo"
          description="Prima trovi la posizione, poi esegui il gesto e infine torni con controllo."
        />
        <ol className="mt-4 space-y-3">
          {(guidance?.steps ?? exercise.steps).map((step, index) => (
            <li key={step} className="flex gap-3">
              <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-deep">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="surface px-5 py-5">
        <div className="flex items-center gap-3">
          <CircleAlert size={18} className="text-accent-deep" />
          <h2 className="text-base font-semibold text-ink">Attenzione</h2>
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
          {(guidance?.attention ?? exercise.commonMistakes).map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <div className="surface px-5 py-5">
          <div className="text-sm font-semibold text-ink">Versione più facile</div>
          <p className="mt-2 text-sm leading-6 text-muted">
            {guidance?.easierOption ?? exercise.easierVariant}
          </p>
        </div>

        <div className="surface px-5 py-5">
          <div className="text-sm font-semibold text-ink">Se vuoi intensificarlo un po'</div>
          <p className="mt-2 text-sm leading-6 text-muted">
            {exercise.intenseVariant}
          </p>
        </div>
      </section>

      {exercise.caution ? (
        <section className="rounded-[28px] border border-[rgba(94,184,178,0.2)] bg-[rgba(242,252,251,0.9)] px-5 py-5">
          <div className="flex items-center gap-3">
            <HeartHandshake size={18} className="text-accent-deep" />
            <h2 className="text-base font-semibold text-ink">Nota di cautela</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{exercise.caution}</p>
        </section>
      ) : null}

      <section className="surface px-5 py-5">
        <div className="text-sm font-semibold text-ink">
          Se oggi non ti risulta comodo
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">
          Puoi segnare questo esercizio come scomodo per ritrovarlo dopo e
          trattarlo con più gradualità.
        </p>
        <div className="mt-4">
          <Button
            variant={isUncomfortable ? "primary" : "secondary"}
            fullWidth
            onClick={() => toggleUncomfortableExercise(exercise.id)}
          >
            {isUncomfortable
              ? "Rimuovi dagli esercizi scomodi"
              : "Segna come scomodo per ora"}
          </Button>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Dove lo trovi"
          title="Programmi collegati"
          description="Puoi aprire direttamente le routine in cui questo movimento compare."
        />
        <div className="mt-4 space-y-3">
          {relatedPrograms.map((program) => (
            <Link
              key={program.id}
              to={`/programs/${program.id}`}
              className="flex items-center justify-between rounded-[22px] border border-line bg-white/70 px-4 py-4 transition hover:bg-white"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{program.title}</div>
                <p className="mt-1 text-sm leading-6 text-muted">{program.focus}</p>
              </div>
              <CheckCircle2 size={18} className="text-accent-deep" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-white/45 px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Sicurezza
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
          {safetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

