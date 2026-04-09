import { CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import { toDateKey } from "@/lib/date";

export function PlanPage() {
  const { data } = useMiryaApp();

  if (!data?.activePlan) {
    return null;
  }

  const todayKey = toDateKey(new Date());
  const highlightedTips = data.supportTips.slice(0, 2);

  return (
    <div className="page-enter space-y-5">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Piano settimanale</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          Settimana {data.activePlan.currentWeek} di {data.activePlan.totalWeeks}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          {data.activePlan.planExplanation}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
            {data.activePlan.planOverview?.phase_name ?? data.activePlan.phaseLabel}
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {data.activePlan.weeklyGoal}
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {data.activePlan.sessionDifficulty}
          </span>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Lettura rapida"
          title={data.activePlan.phaseFocus}
          description={data.activePlan.progressionReason}
        />

        <div className="mt-4 grid gap-3">
          <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Obiettivo di questa fase
            </div>
            <p className="mt-2 text-sm leading-6 text-ink">{data.activePlan.phaseGoal}</p>
          </div>

          <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Cosa ci aspettiamo in modo realistico
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {data.activePlan.realisticExpectedOutcomes.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/plan/story"
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="text-sm font-semibold text-ink">Perché questo piano</div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Rileggi la logica del percorso con calma.
              </p>
            </Link>
            <Link
              to={data.userAccess?.status === "premium" ? "/plan/update" : "/premium"}
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="text-sm font-semibold text-ink">
                {data.userAccess?.status === "premium"
                  ? "Rivedi il percorso"
                  : "Continuità Premium"}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {data.userAccess?.status === "premium"
                  ? "Usa un check-in guidato per capire se il piano va davvero corretto."
                  : "La parte premium è l'adattamento del percorso nel tempo."}
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {data.weekPlan.map((day) => {
          const isToday = day.scheduledFor === todayKey;
          const isCompleted = day.status === "completed";

          return (
            <Link
              key={day.id}
              to={isToday ? `/session/${day.id}` : "/dashboard"}
              className="surface block px-5 py-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow text-accent-deep">
                    {isToday ? "Oggi" : `Giorno ${day.dayIndex + 1}`}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-ink">{day.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{day.coachNote}</p>
                </div>
                <div className="rounded-full bg-[rgba(215,239,236,0.82)] px-3 py-2 text-xs font-semibold text-accent-deep">
                  {day.estimatedMinutes} min
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                  {day.focus}
                </span>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                  {day.workout.steps.length} esercizi
                </span>
              </div>

              {day.workout.steps[0] ? (
                <div className="mt-4 rounded-[18px] bg-[rgba(248,252,251,0.9)] px-4 py-3 text-sm leading-6 text-muted">
                  <span className="font-semibold text-ink">Si parte con:</span>{" "}
                  {day.workout.steps[0].title}. {day.workout.steps[0].doseLabel}.
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <CheckCircle2
                    size={16}
                    className={isCompleted ? "text-success" : "text-[rgba(118,144,145,0.6)]"}
                  />
                  <span>{isCompleted ? "Completato" : "Da fare"}</span>
                </div>
                <ChevronRight size={18} className="text-accent-deep" />
              </div>
            </Link>
          );
        })}
      </section>

      {highlightedTips.length > 0 ? (
        <section className="surface px-5 py-5">
          <SectionHeading
            eyebrow="Piccoli supporti"
            title="Due cose semplici che aiutano questa fase"
          />
          <div className="mt-4 space-y-3">
            {highlightedTips.map((tip) => (
              <div
                key={tip.id}
                className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
              >
                <div className="text-sm font-semibold text-ink">{tip.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
