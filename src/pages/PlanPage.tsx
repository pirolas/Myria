import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
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

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Piano settimanale</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          Settimana {data.activePlan.currentWeek} di {data.activePlan.totalWeeks}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          {data.activePlan.motivationalNote}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
            {data.activePlan.phaseLabel}
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {data.activePlan.weeklyGoal}
          </span>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Fase attuale"
          title={data.activePlan.phaseFocus}
          description={data.activePlan.progressionReason}
        />

        {data.activePlan.adjustments.length > 0 ? (
          <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Adattamenti in corso
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {data.activePlan.adjustments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Difficolta attuale
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{data.activePlan.sessionDifficulty}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            {data.activePlan.adherenceStrategy}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        {data.weekPlan.map((day) => {
          const isToday = day.scheduledFor === todayKey;
          const isCompleted = day.status === "completed";

          return (
            <Link
              key={day.id}
              to={isToday ? "/today" : "/dashboard"}
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
                  {day.sessionKind === "recovery" ? "Recupero guidato" : "Workout"}
                </span>
              </div>

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

      <section className="surface px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="text-base font-semibold text-ink">Perche questo piano</div>
            <p className="mt-1 text-sm leading-6 text-muted">
              {data.activePlan.progressionReason}
            </p>
          </div>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Outcome realistici"
          title="Cosa ci aspettiamo da questa fase"
          description="Niente promesse lampo: solo risultati coerenti con costanza, energia e situazione reale."
        />
        <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
          {data.activePlan.realisticExpectedOutcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {data.supportTips.length > 0 ? (
        <section className="surface px-5 py-5">
          <SectionHeading
            eyebrow="Tips di supporto"
            title="Piccoli accorgimenti che aiutano il piano a lavorare meglio"
          />
          <div className="mt-4 space-y-3">
            {data.supportTips.slice(0, 4).map((tip) => (
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
