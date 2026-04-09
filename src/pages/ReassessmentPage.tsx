import { useState } from "react";
import { Check } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import { QuestionBlock } from "@/components/ui/QuestionBlock";
import {
  goalOptions,
  improvementOptions,
  minuteOptions,
  obstacleOptions,
  reassessmentFitOptions
} from "@/data/content";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import type { Goal, ImprovementTag, ReassessmentInput } from "@/types/domain";

const defaultInput: ReassessmentInput = {
  planFit: "giusto",
  feelsMoreStable: null,
  feelsMoreToned: null,
  feelsMoreEnergetic: null,
  effectiveExercises: [],
  uncomfortableExercises: [],
  consistencyKeeping: 3,
  mainObstacle: null,
  improvements: [],
  cautionNotes: "",
  keepCurrentFocus: true,
  newFocus: null,
  realisticMinutesNow: 15
};

const consistencyOptions = [
  {
    value: 1 as const,
    label: "La sto perdendo",
    description: "Il ritmo mi sta sfuggendo e ho bisogno di più semplicità."
  },
  {
    value: 3 as const,
    label: "La tengo abbastanza",
    description: "Il piano regge, ma va protetto bene dentro la settimana."
  },
  {
    value: 5 as const,
    label: "La proteggo bene",
    description: "Sto riuscendo a tenerlo con una buona continuità."
  }
];

export function ReassessmentPage() {
  const navigate = useNavigate();
  const { data, submitReassessment, status, error } = useMiryaApp();
  const [form, setForm] = useState<ReassessmentInput>(defaultInput);

  if (data?.userAccess && !data.userAccess.canUsePremiumFeatures) {
    return <Navigate to="/plan/update" replace />;
  }

  const toggleImprovement = (value: ImprovementTag) => {
    setForm((current) => ({
      ...current,
      improvements: current.improvements.includes(value)
        ? current.improvements.filter((item) => item !== value)
        : [...current.improvements, value]
    }));
  };

  const handleSubmit = async () => {
    const request = submitReassessment(form);
    navigate("/plan/update", { replace: true });
    await request.catch(() => undefined);
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Rivalutazione breve</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          In meno di un minuto capiamo se il piano va confermato o corretto.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Non ci serve un report lungo. Ci basta capire come ti sta sostenendo,
          quanto riesci a proteggerlo e dove vale la pena aggiustare il tiro.
        </p>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <QuestionBlock title="Come senti il piano, oggi?" description="Ci serve a capire se confermarlo o alleggerirlo.">
          <ChoiceGrid
            options={reassessmentFitOptions}
            value={form.planFit}
            onChange={(planFit) => setForm((current) => ({ ...current, planFit }))}
          />
        </QuestionBlock>

        <QuestionBlock title="Quanto stai riuscendo a proteggerlo" description="Così distinguiamo il piano giusto dal piano difficile da tenere.">
          <ChoiceGrid
            options={consistencyOptions}
            value={form.consistencyKeeping}
            onChange={(consistencyKeeping) =>
              setForm((current) => ({ ...current, consistencyKeeping }))
            }
          />
        </QuestionBlock>

        <QuestionBlock title="Tempo realistico in questo momento" description="Anche qui ci interessa la realtà, non l'ideale.">
          <ChoiceGrid
            options={minuteOptions}
            value={form.realisticMinutesNow}
            onChange={(realisticMinutesNow) =>
              setForm((current) => ({ ...current, realisticMinutesNow }))
            }
            columns="two"
          />
        </QuestionBlock>

        <QuestionBlock title="Ostacolo principale" description="Il punto che oggi rischia di interrompere più facilmente il percorso.">
          <ChoiceGrid
            options={obstacleOptions}
            value={form.mainObstacle ?? "mancanza_tempo"}
            onChange={(mainObstacle) =>
              setForm((current) => ({ ...current, mainObstacle }))
            }
          />
        </QuestionBlock>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Se senti qualche miglioramento, segnalo qui</div>
        <div className="grid gap-3">
          {improvementOptions.map((item) => {
            const isSelected = form.improvements.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleImprovement(item.value)}
                aria-pressed={isSelected}
                className={[
                  "surface relative overflow-hidden px-4 py-4 text-left transition",
                  isSelected
                    ? "selection-card-selected"
                    : "selection-card-idle"
                ].join(" ")}
              >
                {isSelected ? (
                  <>
                    <div className="absolute inset-y-4 left-0 w-1 rounded-full bg-accent-deep/80" />
                    <div className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent-deep bg-accent-deep text-white shadow-sm">
                      <Check size={14} strokeWidth={2.7} />
                    </div>
                  </>
                ) : null}
                <div className={isSelected ? "text-sm font-semibold text-accent-deep" : "text-sm font-semibold text-ink"}>
                  {item.label}
                </div>
                <p
                  className={
                    isSelected
                      ? "mt-2 max-w-[15rem] text-sm leading-6 text-ink/80"
                      : "mt-2 max-w-[15rem] text-sm leading-6 text-muted"
                  }
                >
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        <QuestionBlock title="Direzione del percorso" description="Capire se il focus attuale ha ancora senso oppure no.">
          <ChoiceGrid
            options={[
              {
                value: true,
                label: "Manteniamo il focus attuale",
                description: "Per adesso mi sembra ancora quello giusto."
              },
              {
                value: false,
                label: "Vorrei spostarlo",
                description: "Il mio bisogno principale è cambiato un po'."
              }
            ]}
            value={form.keepCurrentFocus}
            onChange={(keepCurrentFocus) =>
              setForm((current) => ({ ...current, keepCurrentFocus }))
            }
          />
        </QuestionBlock>

        {!form.keepCurrentFocus ? (
          <QuestionBlock title="Nuovo focus da dare al piano">
            <ChoiceGrid
              options={goalOptions}
              value={form.newFocus ?? data?.onboarding?.focusPreference ?? "glutei_gambe"}
              onChange={(newFocus) =>
                setForm((current) => ({ ...current, newFocus: newFocus as Goal }))
              }
            />
          </QuestionBlock>
        ) : null}

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Solo se c'è qualcosa da tenere d'occhio
          </span>
          <textarea
            value={form.cautionNotes}
            onChange={(event) =>
              setForm((current) => ({ ...current, cautionNotes: event.target.value }))
            }
            rows={4}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: il ritmo serale mi pesa di più, oppure alcune ginocchia oggi chiedono più attenzione."
          />
        </label>
      </section>

      {error ? (
        <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
          {error}
        </div>
      ) : null}

      <Button fullWidth onClick={handleSubmit} disabled={status === "saving"}>
        {status === "saving" ? "Aggiorniamo il percorso..." : "Aggiorna il piano"}
      </Button>
    </div>
  );
}


