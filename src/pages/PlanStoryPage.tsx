import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function PlanStoryPage() {
  const { data } = useMiryaApp();

  if (!data?.activePlan) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[16rem]">
            <div className="eyebrow">Perche questo piano</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              Un inizio pensato sulla tua situazione, non su un modello generico.
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
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
          eyebrow="Lettura del profilo"
          title="Quello che Mirya ha considerato per partire"
          description={data.activePlan.userProfileSummary}
        />

        <div className="mt-5 grid gap-3">
          {[
            ["Fase attuale", data.activePlan.phaseLabel],
            ["Obiettivo della fase", data.activePlan.phaseGoal],
            ["Difficolta iniziale", data.activePlan.sessionDifficulty],
            ["Strategia di aderenza", data.activePlan.adherenceStrategy]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {label}
              </div>
              <div className="mt-2 text-sm leading-6 text-ink">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <SectionHeading
          eyebrow="Prime settimane"
          title="Come si muovera il percorso da qui"
          description={data.activePlan.progressionStrategy}
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
        <SectionHeading
          eyebrow="Risultati realistici"
          title="Cosa ha senso aspettarsi se il ritmo resta buono"
        />
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
          {data.activePlan.realisticExpectedOutcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="flex gap-3">
        <Link to="/profile/deep" className="flex-1">
          <Button variant="secondary" fullWidth>
            Rendi il piano piu preciso
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
            Vai al tuo oggi
          </Button>
        </Link>
      </div>
    </div>
  );
}
