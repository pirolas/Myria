import {
  ArrowRight,
  BookOpen,
  ChartColumn,
  Clock3,
  Flame,
  Sparkles,
  Target,
  UserRound
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { goalLabels } from "@/data/content";
import { useAppStore } from "@/hooks/useAppStore";
import {
  getMotivationalMessage,
  getPersonalPathCopy,
  getProgressTone,
  getRecommendedProgram,
  getStreakDays,
  getWeeklyMinutes
} from "@/lib/selectors";

const shortcuts = [
  {
    to: "/programs",
    label: "Programma di oggi",
    description: "Apri la routine consigliata e inizia senza pensarci troppo.",
    icon: Sparkles,
    wide: true
  },
  {
    to: "/workouts",
    label: "Esercizi",
    description: "Tutto spiegato con calma e in modo chiaro.",
    icon: BookOpen
  },
  {
    to: "/progress",
    label: "Progressi",
    description: "Minuti, costanza e sensazioni in un colpo d'occhio.",
    icon: ChartColumn
  },
  {
    to: "/profile",
    label: "Il mio percorso",
    description: "Rivedi obiettivo, durata e ritmo scelto.",
    icon: UserRound,
    wide: true
  }
];

export function HomePage() {
  const { state } = useAppStore();
  const recommendedProgram = getRecommendedProgram(state.preferences);
  const weeklyMinutes = getWeeklyMinutes(state.progress.sessions);
  const streak = getStreakDays(state.progress.sessions);
  const progressTone = getProgressTone(state.progress.sessions.length);
  const weeklyTarget = state.preferences
    ? state.preferences.daysPerWeek * state.preferences.preferredMinutes
    : recommendedProgram.durationMinutes * 3;
  const remainingMinutes = Math.max(weeklyTarget - weeklyMinutes, 0);
  const weeklyRatio = Math.min(100, Math.round((weeklyMinutes / weeklyTarget) * 100));
  const objectiveLabel = state.preferences
    ? goalLabels[state.preferences.goal]
    : recommendedProgram.focus;
  const rhythmLabel = state.preferences
    ? `${state.preferences.daysPerWeek} giorni a settimana`
    : "ritmo consigliato";
  const personalPathCopy = getPersonalPathCopy(state.preferences);

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient relative overflow-hidden px-5 py-6">
        <div className="absolute right-[-2.5rem] top-5 h-28 w-28 rounded-full border border-white/70 bg-[rgba(255,255,255,0.28)]" />
        <div className="absolute bottom-0 right-0 h-44 w-40 rounded-tl-[4rem] bg-[rgba(94,184,178,0.12)]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow">Il tuo spazio di oggi</div>
            <div className="rounded-full bg-white/75 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-deep">
              a casa
            </div>
          </div>

          <h1 className="mt-4 max-w-[14rem] font-serif text-[2.2rem] leading-[1.02] text-ink">
            Un allenamento pensato per farti stare meglio, non per spremerti.
          </h1>
          <p className="mt-4 max-w-[21rem] text-sm leading-7 text-muted">
            {getMotivationalMessage(state.progress.sessions)} {personalPathCopy}
          </p>

          <div className="mt-6 rounded-[26px] border border-white/70 bg-[rgba(255,255,255,0.72)] px-4 py-4 shadow-[0_16px_40px_rgba(72,102,103,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="eyebrow text-accent-deep">Allenamento consigliato</div>
                <div className="mt-2 text-lg font-semibold text-ink">
                  {recommendedProgram.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {recommendedProgram.description}
                </p>
              </div>
              <div className="rounded-[1.2rem] bg-accent-soft px-4 py-3 text-right text-accent-deep">
                <div className="text-xs uppercase tracking-[0.16em]">oggi</div>
                <div className="mt-1 text-lg font-semibold">
                  {recommendedProgram.durationMinutes} min
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[rgba(215,239,236,0.82)] px-3 py-2 text-xs font-semibold text-accent-deep">
                {objectiveLabel}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                {recommendedProgram.levelLabel}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                {rhythmLabel}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Link to={`/programs/${recommendedProgram.id}`}>
              <Button
                fullWidth
                icon={<ArrowRight size={18} />}
                className="justify-between"
              >
                Inizia ora
              </Button>
            </Link>
          </div>

          <p className="mt-3 text-center text-sm leading-6 text-muted">
            Ti bastano {recommendedProgram.durationMinutes} minuti per tenere vivo il
            tuo percorso.
          </p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Ritmo della settimana"
          title="Una visione semplice della tua costanza"
          description={
            remainingMinutes > 0
              ? `Se vuoi restare nel ritmo che hai scelto, ti mancano ancora ${remainingMinutes} minuti questa settimana.`
              : "Hai già raggiunto il ritmo settimanale che avevi scelto. Ottimo così."
          }
        />

        <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[1.9rem] font-semibold text-ink">{weeklyMinutes}</div>
              <div className="text-sm text-muted">minuti completati</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-ink">{weeklyTarget} min</div>
              <div className="text-sm text-muted">obiettivo morbido</div>
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[rgba(215,239,236,0.72)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#70c7c1_0%,#4ea49f_100%)] transition-all"
              style={{
                width: weeklyMinutes > 0 ? `${Math.max(10, weeklyRatio)}%` : "0%"
              }}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="surface-soft px-4 py-4">
            <div className="flex items-center gap-2 text-muted">
              <Flame size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Streak
              </span>
            </div>
            <div className="mt-4 text-[1.8rem] font-semibold text-ink">{streak}</div>
            <div className="text-sm text-muted">giorni consecutivi</div>
          </div>

          <div className="surface-soft px-4 py-4">
            <div className="flex items-center gap-2 text-muted">
              <Target size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Percorso
              </span>
            </div>
            <div className="mt-4 text-sm font-semibold text-ink">
              {progressTone.title}
            </div>
            <div className="mt-2 text-sm leading-6 text-muted">
              {progressTone.description}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Scorciatoie"
          title="Tutto vicino, senza confusione"
          description="Ogni area è pensata per farti capire subito dove andare."
        />

        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "surface flex flex-col justify-between gap-5 px-4 py-4 transition hover:bg-white/80",
                  item.wide ? "col-span-2 min-h-[150px]" : "min-h-[170px]"
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-[1.1rem] bg-white p-3 text-accent-deep shadow-sm">
                    <Icon size={18} />
                  </div>
                  <ArrowRight size={18} className="text-muted" />
                </div>

                <div>
                  <div className="text-sm font-semibold text-ink">{item.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-line bg-white/45 px-5 py-5">
        <div className="flex items-center gap-2 text-muted">
          <Clock3 size={16} />
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">
            Nota del giorno
          </span>
        </div>
        <p className="mt-3 text-sm leading-7 text-ink">
          Non serve fare di più per sentirti meglio. Serve un ritmo che riesci a
          ritrovare anche domani.
        </p>
      </section>
    </div>
  );
}
