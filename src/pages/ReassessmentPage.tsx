import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import {
  improvementOptions,
  obstacleOptions,
  reassessmentFitOptions,
  minuteOptions,
  goalOptions
} from "@/data/content";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import type { Goal, ImprovementTag, ObstacleTag, ReassessmentInput } from "@/types/domain";

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

export function ReassessmentPage() {
  const navigate = useNavigate();
  const { data, submitReassessment, status, error } = useMiryaApp();
  const [form, setForm] = useState<ReassessmentInput>(defaultInput);

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
          Bastano pochi tocchi per capire se confermare o correggere il piano.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Niente questionari infiniti: ci serve solo capire se il ritmo attuale e
          ancora giusto per te.
        </p>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <ChoiceGrid
          options={reassessmentFitOptions}
          value={form.planFit}
          onChange={(planFit) => setForm((current) => ({ ...current, planFit }))}
        />

        <label className="block rounded-[22px] border border-line bg-white/78 px-4 py-4">
          <div className="text-sm font-semibold text-ink">
            Riesci a mantenere la costanza in questo momento?
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={form.consistencyKeeping}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                consistencyKeeping: Number(event.target.value) as 1 | 2 | 3 | 4 | 5
              }))
            }
            className="mt-4 w-full accent-[var(--color-accent)]"
          />
        </label>

        <ChoiceGrid
          options={obstacleOptions}
          value={form.mainObstacle ?? "mancanza_tempo"}
          onChange={(mainObstacle) =>
            setForm((current) => ({ ...current, mainObstacle: mainObstacle as ObstacleTag }))
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
          options={[
            { value: true, label: "Manteniamo il focus attuale", description: "Mi sembra ancora coerente con quello che mi serve." },
            { value: false, label: "Vorrei riorientarlo", description: "Meglio spostare il centro del lavoro su un'altra priorita." }
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
            onChange={(newFocus) => setForm((current) => ({ ...current, newFocus: newFocus as Goal }))}
          />
        ) : null}

        <div className="grid gap-3">
          {improvementOptions.map((item) => {
            const isSelected = form.improvements.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleImprovement(item.value)}
                className={[
                  "surface px-4 py-4 text-left transition",
                  isSelected
                    ? "border-[rgba(94,184,178,0.48)] bg-white"
                    : "hover:border-accent/30 hover:bg-white/80"
                ].join(" ")}
              >
                <div className="text-sm font-semibold text-ink">{item.label}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              </button>
            );
          })}
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Se c'e un fastidio o un segnale da monitorare
          </span>
          <textarea
            value={form.cautionNotes}
            onChange={(event) =>
              setForm((current) => ({ ...current, cautionNotes: event.target.value }))
            }
            rows={4}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: il lavoro sulle ginocchia e stato piu scomodo del previsto, oppure sto faticando a reggere il ritmo serale."
          />
        </label>
      </section>

      {error ? (
        <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
          {error}
        </div>
      ) : null}

      <Button fullWidth onClick={handleSubmit} disabled={status === "saving"}>
        {status === "saving" ? "Aggiorniamo il percorso..." : "Aggiorna il mio piano"}
      </Button>
    </div>
  );
}
