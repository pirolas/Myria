import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { feelingOptions } from "@/data/content";
import { useAppStore } from "@/hooks/useAppStore";
import {
  getExercisesForProgram,
  getProgramById,
  getProgramCompletionCount
} from "@/lib/selectors";
import type { Feeling } from "@/types/domain";

export function ProgramDetailPage() {
  const { programId } = useParams();
  const { state, recordSession } = useAppStore();
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);

  if (!programId) {
    return <Navigate to="/programs" replace />;
  }

  const program = getProgramById(programId);

  if (!program) {
    return <Navigate to="/programs" replace />;
  }

  const exerciseList = getExercisesForProgram(program);
  const completionCount = getProgramCompletionCount(
    state.progress.sessions,
    program.id
  );

  const handleComplete = (feeling: Feeling) => {
    setSelectedFeeling(feeling);
    recordSession({
      programId: program.id,
      feeling,
      durationMinutes: program.durationMinutes
    });
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Programma</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          {program.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">{program.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
            {program.durationMinutes} minuti
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {program.levelLabel}
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {completionCount} volte completato
          </span>
        </div>

        <div className="mt-5 rounded-[24px] border border-line bg-[rgba(255,255,255,0.72)] px-4 py-4">
          <div className="text-sm font-semibold text-ink">{program.focus}</div>
          <p className="mt-2 text-sm leading-6 text-muted">{program.frequency}</p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Per chi è ideale"
          title="Quando può esserti più utile"
        />
        <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
          {program.idealFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Sequenza"
          title="Gli esercizi del programma"
          description="Apri ogni esercizio per vedere passo per passo, errori comuni e varianti."
        />

        <div className="mt-4 space-y-3">
          {exerciseList.map((exercise, index) => (
            <Link
              key={exercise.id}
              to={`/workouts/${exercise.id}`}
              className="flex items-center justify-between rounded-[22px] border border-line bg-white/70 px-4 py-4 transition hover:bg-white"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Step {index + 1}
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {exercise.name}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {exercise.dose}
                </p>
              </div>
              <CheckCircle2 size={18} className="shrink-0 text-accent-deep" />
            </Link>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="text-base font-semibold text-ink">
              Com'è andato l'allenamento?
            </div>
            <p className="mt-1 text-sm leading-6 text-muted">
              Salviamo la tua sensazione per tenere il percorso realistico.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {feelingOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedFeeling === option.value ? "primary" : "secondary"}
              fullWidth
              onClick={() => handleComplete(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {selectedFeeling ? (
          <div className="mt-4 rounded-[20px] bg-[rgba(95,139,121,0.12)] px-4 py-4 text-sm leading-6 text-[rgba(51,89,74,0.95)]">
            Sessione salvata nei progressi. Perfetto così: continuiamo con un
            ritmo che resta sostenibile.
          </div>
        ) : null}
      </section>
    </div>
  );
}
