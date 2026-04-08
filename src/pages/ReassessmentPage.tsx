import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
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
    await submitReassessment(form);
    navigate("/plan", { replace: true });
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
        <ChoiceGrid
          options={reassessmentFitOptions}
          value={form.planFit}
          onChange={(planFit) => setForm((current) => ({ ...current, planFit }))}
        />

        <ChoiceGrid
          options={consistencyOptions}
          value={form.consistencyKeeping}
          onChange={(consistencyKeeping) =>
            setForm((current) => ({ ...current, consistencyKeeping }))
          }
        />

        <ChoiceGrid
          options={minuteOptions}
          value={form.realisticMinutesNow}
          onChange={(realisticMinutesNow) =>
            setForm((current) => ({ ...current, realisticMinutesNow }))
          }
          columns="two"
        />

        <ChoiceGrid
          options={obstacleOptions}
          value={form.mainObstacle ?? "mancanza_tempo"}
          onChange={(mainObstacle) =>
            setForm((current) => ({ ...current, mainObstacle }))
          }
        />
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
                  "surface px-4 py-4 text-left transition",
                  isSelected
                    ? "selection-card-selected"
                    : "selection-card-idle"
                ].join(" ")}
              >
                <div className={isSelected ? "text-sm font-semibold text-accent-deep" : "text-sm font-semibold text-ink"}>
                  {item.label}
                </div>
                <p className={isSelected ? "mt-2 text-sm leading-6 text-ink/78" : "mt-2 text-sm leading-6 text-muted"}>
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

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

        {!form.keepCurrentFocus ? (
          <ChoiceGrid
            options={goalOptions}
            value={form.newFocus ?? data?.onboarding?.focusPreference ?? "glutei_gambe"}
            onChange={(newFocus) =>
              setForm((current) => ({ ...current, newFocus: newFocus as Goal }))
            }
          />
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


