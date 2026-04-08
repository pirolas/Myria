import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  Target,
  TimerReset
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { goalLabels } from "@/data/content";
import {
  getNextObjective,
  getPlanHorizonCopy,
  getWeeklyCompletedSessions
} from "@/lib/mirya";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function DashboardPage() {
  const { data, progress, status } = useMiryaApp();

  if (status === "loading" && !data) {
    return <DashboardLoadingState />;
  }

  if (!data?.onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!data.activePlan || !data.todayPlanDay) {
    return (
      <div className="page-enter space-y-6">
        <section className="surface-strong px-5 py-6">
          <div className="eyebrow">Stiamo preparando Mirya</div>
          <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
            Il tuo percorso e quasi pronto.
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Un attimo ancora: stiamo componendo la prima settimana in base alle tue
            risposte e al ritmo che hai scelto.
          </p>
        </section>
      </div>
    );
  }

  const weeklyPercent =
    data.activePlan.weeklyGoalMinutes > 0
      ? Math.min(
          100,
          Math.round((progress.weeklyMinutes / data.activePlan.weeklyGoalMinutes) * 100)
        )
      : 0;
  const weeklySessions = getWeeklyCompletedSessions(data.sessions);
  const sessionsRemaining = Math.max(
    data.activePlan.weeklyGoalSessions - weeklySessions,
    0
  );
  const minutesRemaining = Math.max(
    data.activePlan.weeklyGoalMinutes - progress.weeklyMinutes,
    0
  );
  const todayChecklist = [
    `Apri il timer e segui ${data.todayPlanDay.workout.steps.length} step gia pronti.`,
    "Muoviti con calma: il focus oggi e qualita del gesto, non intensita.",
    "Alla fine lascia un feedback breve, cosi Mirya adatta i prossimi giorni."
  ];
  const nextReassessmentCopy = data.activePlan.nextReassessmentDate
    ? `La prossima rivalutazione breve sara disponibile intorno al ${new Date(
        data.activePlan.nextReassessmentDate
      ).toLocaleDateString("it-IT")}.`
    : `Tra circa ${data.activePlan.reassessmentDueInDays} giorni ti chiederemo una breve rivalutazione per confermare o correggere il piano.`;

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient relative overflow-hidden px-5 py-6">
        <div className="absolute right-[-2.5rem] top-5 h-28 w-28 rounded-full border border-white/70 bg-[rgba(255,255,255,0.28)]" />
        <div className="absolute bottom-0 right-0 h-44 w-40 rounded-tl-[4rem] bg-[rgba(94,184,178,0.12)]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow">Da fare oggi</div>
            <div className="rounded-full bg-white/82 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-deep">
              settimana {data.activePlan.currentWeek} di {data.activePlan.totalWeeks}
            </div>
          </div>

          <h1 className="mt-4 max-w-[16rem] font-serif text-[2.28rem] leading-[1.01] text-ink">
            Oggi fai questo, e basta.
          </h1>
          <p className="mt-4 max-w-[21rem] text-sm leading-7 text-muted">
            {data.todayPlanDay.coachNote}
          </p>

          <div className="mt-6 directive-strip">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="eyebrow text-accent-deep">Sessione assegnata</div>
                <div className="mt-2 text-xl font-semibold text-ink">
                  {data.todayPlanDay.workout.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {data.activePlan.motivationalNote}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-accent-soft px-4 py-3 text-right text-accent-deep">
                <div className="text-xs uppercase tracking-[0.16em]">oggi</div>
                <div className="mt-1 text-lg font-semibold">
                  {data.todayPlanDay.estimatedMinutes} min
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[rgba(215,239,236,0.82)] px-3 py-2 text-xs font-semibold text-accent-deep">
                {goalLabels[data.onboarding.focusPreference]}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                {data.todayPlanDay.workout.steps.length} step guidati
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                {data.activePlan.phaseLabel}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Link to="/today">
              <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
                Inizia la sessione di oggi
              </Button>
            </Link>
          </div>

          <p className="mt-3 text-center text-sm leading-6 text-muted">
            Ti chiedera solo pochi minuti e un feedback finale molto breve.
          </p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Lettura del percorso"
          title="Mirya ti sta guidando, non ti sta solo assegnando un workout"
          description={data.activePlan.userProfileSummary}
        />

        <div className="mt-5 grid gap-3">
          <Link
            to="/plan/story"
            className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
          >
            <div className="text-sm font-semibold text-ink">Perche questo piano</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Leggi la logica della fase, i risultati realistici e come evolveranno le prime settimane.
            </p>
          </Link>

          {!data.deepProfile ? (
            <Link
              to="/profile/deep"
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="text-sm font-semibold text-ink">Rendilo ancora piu tuo</div>
              <p className="mt-2 text-sm leading-6 text-muted">
                In un minuto puoi aggiungere contesto, segnali del corpo e preferenze per rifinire il piano.
              </p>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Guida rapida"
          title="Per oggi il percorso e questo"
          description="Mirya ti accompagna in modo lineare. Non devi decidere tu la sequenza."
        />

        <div className="mt-5 space-y-3">
          {todayChecklist.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-[22px] border border-line bg-white/76 px-4 py-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(215,239,236,0.82)] text-sm font-semibold text-accent-deep">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Orizzonte del percorso"
          title={data.activePlan.phaseLabel}
          description={getPlanHorizonCopy(data.activePlan)}
        />

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted">
              <Target size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Fase
              </span>
            </div>
            <div className="mt-4 text-sm font-semibold text-ink">
              {data.activePlan.phaseFocus}
            </div>
          </div>

          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted">
              <CalendarDays size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Settimana
              </span>
            </div>
            <div className="mt-4 text-[1.85rem] font-semibold text-ink">
              {data.activePlan.currentWeek}
            </div>
            <div className="text-sm text-muted">su {data.activePlan.totalWeeks}</div>
          </div>

          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted">
              <TimerReset size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Prossimo
              </span>
            </div>
            <div className="mt-4 text-sm font-semibold text-ink">
              {getNextObjective(data.activePlan)}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Perche stai lavorando cosi
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {data.activePlan.progressionReason}
          </p>
        </div>

        <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Rivalutazione prevista
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{nextReassessmentCopy}</p>
          <Link to="/reassessment" className="mt-3 inline-flex text-sm font-semibold text-accent-deep">
            Invia una rivalutazione adesso
          </Link>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Settimana corrente"
          title={`${progress.weeklyMinutes} minuti completati`}
          description={
            minutesRemaining > 0
              ? `Per chiudere bene la settimana ti mancano ancora ${minutesRemaining} minuti ben distribuiti.`
              : "Hai gia raggiunto il ritmo morbido di questa settimana."
          }
        />

        <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.76)] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[1.95rem] font-semibold text-ink">
                {progress.weeklyMinutes}
              </div>
              <div className="text-sm text-muted">minuti questa settimana</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-ink">
                {data.activePlan.weeklyGoalMinutes} min
              </div>
              <div className="text-sm text-muted">obiettivo della fase</div>
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[rgba(215,239,236,0.72)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#70c7c1_0%,#4ea49f_100%)] transition-all"
              style={{ width: `${Math.max(0, weeklyPercent)}%` }}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted">
              <Flame size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Costanza
              </span>
            </div>
            <div className="mt-4 text-[1.8rem] font-semibold text-ink">
              {progress.streakDays}
            </div>
            <div className="text-sm text-muted">giorni consecutivi</div>
          </div>

          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted">
              <CheckCircle2 size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Sessioni
              </span>
            </div>
            <div className="mt-4 text-[1.8rem] font-semibold text-ink">
              {weeklySessions}
            </div>
            <div className="text-sm text-muted">
              {sessionsRemaining > 0
                ? `${sessionsRemaining} da completare`
                : "ritmo settimanale raggiunto"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="page-enter space-y-4">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Mirya si sta preparando</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          Stiamo caricando il tuo spazio guidato.
        </h1>
      </section>
      <div className="surface h-40 animate-pulse" />
      <div className="surface h-36 animate-pulse" />
    </div>
  );
}
