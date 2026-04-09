import { ArrowRight, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { planReadyCopy } from "@/copy/plan";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import { getTrialStatusCopy } from "@/lib/mirya";

export function PlanReadyPage() {
  const { data } = useMiryaApp();

  if (!data?.activePlan || !data.userAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[17rem]">
            <div className="eyebrow">{planReadyCopy.eyebrow}</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              {planReadyCopy.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">{planReadyCopy.intro}</p>
          </div>
          <div className="rounded-[1.3rem] bg-white/82 p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="mt-5 rounded-[22px] bg-white/82 px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {planReadyCopy.accessLabel}
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {getTrialStatusCopy(data.userAccess)}
          </p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">{planReadyCopy.stepsTitle}</div>
        <div className="mt-4 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white/78">
          {planReadyCopy.steps.map((item, index) => (
            <div key={item} className="flex items-start gap-4 px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(215,239,236,0.82)] text-sm font-semibold text-accent-deep">
                {index + 1}
              </div>
              <p className="pt-1 text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="rounded-[24px] border border-[rgba(94,184,178,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(242,250,248,0.92))] px-4 py-4">
          <div className="text-base font-semibold text-ink">{planReadyCopy.sincerityTitle}</div>
          <p className="mt-3 text-sm leading-7 text-muted">{planReadyCopy.sincerityBody}</p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">{planReadyCopy.closingTitle}</div>
        <p className="mt-3 text-sm leading-7 text-muted">{planReadyCopy.closingBody}</p>
      </section>

      <div className="flex gap-3">
        <Link to="/plan/story" className="flex-1">
          <Button variant="secondary" fullWidth>
            Capisci il piano
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
            Apri il tuo oggi
          </Button>
        </Link>
      </div>
    </div>
  );
}
