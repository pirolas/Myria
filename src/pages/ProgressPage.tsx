import { CalendarDays, Flame, Smile, Timer } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { feelingLabels } from "@/data/content";
import { exercises } from "@/data/workouts";
import { getMonthGrid, toDateKey } from "@/lib/date";
import { getWeeklyBars } from "@/lib/myria";
import { useMyriaApp } from "@/hooks/useMyriaApp";

const weekdayLabels = ["L", "M", "M", "G", "V", "S", "D"];

export function ProgressPage() {
  const { data, progress } = useMyriaApp();

  if (!data) {
    return null;
  }

  const weeklyBars = getWeeklyBars(data.sessions);
  const monthlyGrid = getMonthGrid();
  const completedDays = new Set(
    data.sessions
      .filter((session) => session.completedAt)
      .map((session) => toDateKey(new Date(session.completedAt ?? session.startedAt)))
  );
  const uncomfortableExercises = exercises.filter((exercise) =>
    progress.uncomfortableExerciseIds.includes(exercise.id)
  );
  const maxMinutes = Math.max(...weeklyBars.map((day) => day.minutes), 1);

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Progressi personali</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          Una lettura semplice di cio che stai costruendo.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Allenamenti completati, minuti reali, giorni attivi, sensazioni finali e
          movimenti da tenere sotto osservazione.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="surface px-4 py-4">
          <div className="flex items-center gap-2 text-muted">
            <CalendarDays size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Workout
            </span>
          </div>
          <div className="mt-4 text-[1.8rem] font-semibold text-ink">
            {progress.completedWorkouts}
          </div>
          <div className="text-sm text-muted">sessioni completate</div>
        </div>

        <div className="surface px-4 py-4">
          <div className="flex items-center gap-2 text-muted">
            <Timer size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Minuti totali
            </span>
          </div>
          <div className="mt-4 text-[1.8rem] font-semibold text-ink">
            {progress.totalMinutes}
          </div>
          <div className="text-sm text-muted">minuti registrati</div>
        </div>

        <div className="surface px-4 py-4">
          <div className="flex items-center gap-2 text-muted">
            <Flame size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Streak
            </span>
          </div>
          <div className="mt-4 text-[1.8rem] font-semibold text-ink">
            {progress.streakDays}
          </div>
          <div className="text-sm text-muted">giorni consecutivi</div>
        </div>

        <div className="surface px-4 py-4">
          <div className="flex items-center gap-2 text-muted">
            <CalendarDays size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Giorni attivi
            </span>
          </div>
          <div className="mt-4 text-[1.8rem] font-semibold text-ink">
            {progress.activeDays}
          </div>
          <div className="text-sm text-muted">giorni con movimento</div>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Settimana corrente"
          title={`${progress.weeklyMinutes} minuti questa settimana`}
          description={`Obiettivo attuale: ${progress.weeklyGoalMinutes} minuti distribuiti con calma.`}
        />
        <div className="mt-5 grid grid-cols-7 items-end gap-3">
          {weeklyBars.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end rounded-full bg-white/75 px-2 py-2">
                <div
                  className="w-full rounded-full bg-accent transition-all"
                  style={{
                    height:
                      day.minutes > 0
                        ? `${Math.max(12, (day.minutes / maxMinutes) * 100)}%`
                        : "0%"
                  }}
                />
              </div>
              <div className="text-xs font-semibold text-muted">{day.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Calendario"
          title="I giorni in cui hai creato spazio per te"
        />

        <div className="mt-5 grid grid-cols-7 gap-2">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted"
            >
              {label}
            </div>
          ))}

          {monthlyGrid.map((cell) => {
            const isActive = cell.date ? completedDays.has(cell.key) : false;
            const isToday = cell.date ? cell.key === toDateKey(new Date()) : false;

            return (
              <div
                key={cell.key}
                className={[
                  "flex aspect-square items-center justify-center rounded-[18px] text-sm",
                  cell.date ? "border border-line bg-white/70" : "opacity-0",
                  isActive ? "border-accent bg-accent text-white" : "",
                  isToday && !isActive ? "border-accent/50" : ""
                ].join(" ")}
              >
                {cell.date ? cell.date.getDate() : "."}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3">
        <div className="surface px-5 py-5">
          <div className="flex items-center gap-3">
            <Smile size={18} className="text-accent-deep" />
            <div className="text-base font-semibold text-ink">
              Sensazioni piu recenti
            </div>
          </div>
          {progress.recentFeelings.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {progress.recentFeelings.map((feeling, index) => (
                <span
                  key={`${feeling}-${index}`}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted"
                >
                  {feelingLabels[feeling]}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              Nessun feedback ancora registrato. Dopo la prima sessione troverai qui
              una lettura piu personale dell'andamento.
            </p>
          )}
        </div>

        <div className="surface px-5 py-5">
          <div className="text-base font-semibold text-ink">
            Esercizi segnati come scomodi
          </div>
          {uncomfortableExercises.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
              {uncomfortableExercises.map((exercise) => (
                <li key={exercise.id}>{exercise.name}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              Nessun esercizio segnalato per ora. Se qualcosa non e comodo, Myria lo
              terra presente nel piano successivo.
            </p>
          )}
        </div>

        <div className="surface px-5 py-5">
          <div className="text-base font-semibold text-ink">Storico recente</div>
          {data.sessions.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="rounded-[20px] border border-line bg-white/78 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-ink">
                      {session.sessionSummary?.title?.toString() ?? "Sessione guidata"}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleDateString("it-IT")
                        : "in corso"}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {session.durationMinutes} minuti
                    {session.feeling ? ` • ${feelingLabels[session.feeling]}` : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              Lo storico apparira qui dopo le prime sessioni completate.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
