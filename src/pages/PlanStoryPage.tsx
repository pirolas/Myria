import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { planStoryCopy } from "@/copy/plan";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import {
  formatComputedBodyGoalLabelValue,
  formatNaturalList,
  humanizePlannerText
} from "@/lib/formatters";

export function PlanStoryPage() {
  const { data } = useMiryaApp();

  if (!data?.activePlan) {
    return <Navigate to="/dashboard" replace />;
  }

  const profileSummary = data.activePlan.profileSummary;

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[17rem]">
            <div className="eyebrow">{planStoryCopy.eyebrow}</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              {planStoryCopy.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              {data.activePlan.planExplanation}
            </p>
          </div>
          <div className="rounded-[1.3rem] bg-white/82 p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow={planStoryCopy.profileEyebrow}
          title={planStoryCopy.profileTitle}
          description={data.activePlan.userProfileSummary}
        />

        <div className="mt-5 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white/78">
          {[
            [
              "Obiettivo principale",
              profileSummary?.main_goal ?? data.activePlan.userProfileSummary
            ],
            [
              "Direzione del lavoro",
              formatComputedBodyGoalLabelValue(profileSummary?.computed_body_goal)
            ],
            [
              "Aree che guideranno il percorso",
              formatNaturalList(profileSummary?.focus_areas ?? [])
            ],
            [
              "Spazio reale nella settimana",
              humanizePlannerText(
                profileSummary?.weekly_availability ?? data.activePlan.weeklyGoal
              )
            ],
            [
              "Ritmo iniziale",
              data.activePlan.planOverview?.intensity ?? data.activePlan.sessionDifficulty
            ],
            ["Come lo rendiamo sostenibile", data.activePlan.adherenceStrategy]
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {label}
              </div>
              <div className="mt-2 text-sm leading-6 text-ink">
                {humanizePlannerText(String(value))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {planStoryCopy.summaryTitle}
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{planStoryCopy.summaryBody}</p>
        </div>

        <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {planStoryCopy.precisionTitle}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{planStoryCopy.precisionBody}</p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Prime settimane"
          title={planStoryCopy.weeklyTitle}
          description={
            data.activePlan.planOverview?.strategy_explanation ??
            data.activePlan.progressionStrategy
          }
        />

        <div className="mt-5 space-y-3">
          {data.activePlan.weeklyStructure.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="rounded-full bg-[rgba(215,239,236,0.72)] p-2 text-accent-deep">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading eyebrow="Aspettative realistiche" title={planStoryCopy.outcomesTitle} />
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
          {(data.activePlan.planOverview?.realistic_expectations ??
            data.activePlan.realisticExpectedOutcomes).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="surface px-5 py-5">
        <div className="rounded-[24px] border border-[rgba(94,184,178,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(242,250,248,0.92))] px-4 py-4">
          <div className="text-base font-semibold text-ink">{planStoryCopy.sincerityTitle}</div>
          <p className="mt-3 text-sm leading-7 text-muted">{planStoryCopy.sincerityBody}</p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">{planStoryCopy.closingTitle}</div>
        <p className="mt-3 text-sm leading-7 text-muted">{planStoryCopy.closingBody}</p>
      </section>

      <div className="flex gap-3">
        <Link to="/profile/deep" className="flex-1">
          <Button variant="secondary" fullWidth>
            Aggiungi dettagli utili
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
            Torna al tuo oggi
          </Button>
        </Link>
      </div>
    </div>
  );
}
