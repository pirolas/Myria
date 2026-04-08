import { ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryMeta } from "@/data/content";
import { programs } from "@/data/workouts";
import { useAppStore } from "@/hooks/useAppStore";
import {
  getProgramCompletionCount,
  getRecommendedProgram
} from "@/lib/selectors";

export function ProgramsPage() {
  const { state } = useAppStore();
  const recommendedProgram = getRecommendedProgram(state.preferences);

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Programmi</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          Percorsi brevi, chiari e già pronti da ripetere.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Ogni programma resta semplice da seguire e costruito per favorire
          costanza, tono e qualità del movimento.
        </p>
      </section>

      <section className="space-y-4">
        <div className="surface-soft px-5 py-5">
          <SectionHeading
            eyebrow="Selezione MVP"
            title="Scegli il percorso che senti più giusto oggi"
            description="Ogni proposta resta essenziale, rassicurante e facile da portare avanti anche quando hai poco tempo."
          />
        </div>

        {programs.map((program) => {
          const isRecommended = program.id === recommendedProgram.id;
          const completionCount = getProgramCompletionCount(
            state.progress.sessions,
            program.id
          );

          return (
            <Link
              key={program.id}
              to={`/programs/${program.id}`}
              className="surface block px-5 py-5 transition hover:border-[rgba(94,184,178,0.22)] hover:bg-[rgba(255,255,255,0.96)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {isRecommended ? (
                    <div className="eyebrow text-accent-deep">
                      Consigliato per te
                    </div>
                  ) : (
                    <div className="eyebrow">
                      {categoryMeta[program.category].title}
                    </div>
                  )}
                  <h2 className="mt-2 text-lg font-semibold text-ink">
                    {program.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {program.description}
                  </p>
                </div>
                <span className="rounded-full bg-[rgba(215,239,236,0.82)] px-3 py-2 text-xs font-semibold text-accent-deep">
                  {program.durationMinutes} min
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                  {program.levelLabel}
                </span>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                  {completionCount} completamenti
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <CheckCircle2 size={16} className="text-success" />
                <span>{program.frequency}</span>
              </div>

              <div className="mt-4 hairline" />
              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-accent-deep">
                <span>Apri il percorso</span>
                <ChevronRight size={18} />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
