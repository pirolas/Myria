import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import {
  bodyAreaFocusOptions,
  bodyConfidenceOptions,
  coordinationOptions,
  diastasisOptions,
  dropoutReasonOptions,
  hydrationPatternOptions,
  mobilityPerceptionOptions,
  nutritionPatternOptions,
  pelvicSignalOptions,
  posturePerceptionOptions,
  sensitivityOptions,
  trainingPreferenceOptions
} from "@/data/content";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import type {
  BodyAreaFocus,
  DeepProfileInput,
  DropoutReason,
  PelvicSignal,
  SensitivityTag
} from "@/types/domain";

const defaultInput: DeepProfileInput = {
  weakArea: null,
  priorityArea: null,
  movementDiscomforts: "",
  posturePerception: null,
  mobilityPerception: null,
  coordinationLevel: null,
  sensitivities: [],
  pregnanciesCount: null,
  cesareansCount: null,
  monthsSinceLastBirth: null,
  diastasisStatus: null,
  pelvicSignals: [],
  scarDiscomfort: null,
  bodyConfidence: null,
  dropoutReasons: [],
  nutritionPattern: null,
  nervousHunger: null,
  skipsMeals: null,
  hydrationPattern: null,
  trainingPreference: null,
  notes: ""
};

export function DeepProfilePage() {
  const navigate = useNavigate();
  const { data, saveDeepProfileAnswers, status, error } = useMiryaApp();
  const [form, setForm] = useState<DeepProfileInput>(data?.deepProfile ?? defaultInput);

  const toggleTag = <T extends string,>(items: T[], value: T) =>
    items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

  const handleSubmit = async () => {
    await saveDeepProfileAnswers(form);
    navigate("/plan/story", { replace: true });
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[16rem]">
            <div className="eyebrow">Profilo approfondito</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              Rendiamo il piano ancora piu preciso, senza complicarlo.
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Questo passaggio e opzionale. Serve a far capire meglio a Mirya dove
              proteggerti e dove puo chiederti qualcosa in piu.
            </p>
          </div>
          <div className="rounded-[1.3rem] bg-white/82 p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
        </div>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <ChoiceGrid
          options={bodyAreaFocusOptions}
          value={form.weakArea ?? "glutei_gambe"}
          onChange={(weakArea) => setForm((current) => ({ ...current, weakArea }))}
        />
        <ChoiceGrid
          options={bodyAreaFocusOptions}
          value={form.priorityArea ?? "glutei_gambe"}
          onChange={(priorityArea) => setForm((current) => ({ ...current, priorityArea }))}
        />
        <ChoiceGrid
          options={posturePerceptionOptions}
          value={form.posturePerception ?? "variabile"}
          onChange={(posturePerception) =>
            setForm((current) => ({ ...current, posturePerception }))
          }
        />
        <ChoiceGrid
          options={mobilityPerceptionOptions}
          value={form.mobilityPerception ?? "media"}
          onChange={(mobilityPerception) =>
            setForm((current) => ({ ...current, mobilityPerception }))
          }
        />
        <ChoiceGrid
          options={coordinationOptions}
          value={form.coordinationLevel ?? "discreta"}
          onChange={(coordinationLevel) =>
            setForm((current) => ({ ...current, coordinationLevel }))
          }
        />
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Segnali da tenere presenti</div>
        <TagGroup
          items={sensitivityOptions}
          selected={form.sensitivities}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              sensitivities: toggleTag(current.sensitivities, value as SensitivityTag)
            }))
          }
        />
        <TagGroup
          items={pelvicSignalOptions}
          selected={form.pelvicSignals}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              pelvicSignals: toggleTag(current.pelvicSignals, value as PelvicSignal)
            }))
          }
        />
        <ChoiceGrid
          options={diastasisOptions}
          value={form.diastasisStatus ?? "no"}
          onChange={(diastasisStatus) =>
            setForm((current) => ({ ...current, diastasisStatus }))
          }
        />
        <div className="grid grid-cols-3 gap-3">
          <NumericField
            label="Gravidanze"
            value={form.pregnanciesCount}
            onChange={(pregnanciesCount) => setForm((current) => ({ ...current, pregnanciesCount }))}
          />
          <NumericField
            label="Cesarei"
            value={form.cesareansCount}
            onChange={(cesareansCount) => setForm((current) => ({ ...current, cesareansCount }))}
          />
          <NumericField
            label="Mesi dall'ultimo parto"
            value={form.monthsSinceLastBirth}
            onChange={(monthsSinceLastBirth) =>
              setForm((current) => ({ ...current, monthsSinceLastBirth }))
            }
          />
        </div>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <ChoiceGrid
          options={bodyConfidenceOptions}
          value={form.bodyConfidence ?? "variabile"}
          onChange={(bodyConfidence) =>
            setForm((current) => ({ ...current, bodyConfidence }))
          }
        />
        <TagGroup
          items={dropoutReasonOptions}
          selected={form.dropoutReasons}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              dropoutReasons: toggleTag(current.dropoutReasons, value as DropoutReason)
            }))
          }
        />
        <ChoiceGrid
          options={nutritionPatternOptions}
          value={form.nutritionPattern ?? "abbastanza_equilibrata"}
          onChange={(nutritionPattern) =>
            setForm((current) => ({ ...current, nutritionPattern }))
          }
        />
        <ChoiceGrid
          options={hydrationPatternOptions}
          value={form.hydrationPattern ?? "altalenante"}
          onChange={(hydrationPattern) =>
            setForm((current) => ({ ...current, hydrationPattern }))
          }
        />
        <ChoiceGrid
          options={trainingPreferenceOptions}
          value={form.trainingPreference ?? "piu_dolce"}
          onChange={(trainingPreference) =>
            setForm((current) => ({ ...current, trainingPreference }))
          }
        />
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Se c'e qualcosa che vuoi farci capire meglio
          </span>
          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            rows={4}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: alcuni movimenti mi mettono a disagio, oppure vorrei lavorare con un tono piu energizzante."
          />
        </label>
      </section>

      {error ? (
        <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
          {error}
        </div>
      ) : null}

      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={() => navigate("/plan/story")}>
          Lo faccio dopo
        </Button>
        <Button fullWidth onClick={handleSubmit} disabled={status === "saving"}>
          {status === "saving" ? "Aggiorniamo il piano..." : "Rendi il piano piu preciso"}
        </Button>
      </div>
    </div>
  );
}

function TagGroup({
  items,
  selected,
  onToggle
}: {
  items: Array<{ value: string; label: string; description: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const isSelected = selected.includes(item.value);

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onToggle(item.value)}
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
  );
}

function NumericField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        type="number"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}
        className="mt-2 h-12 w-full rounded-[18px] border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
      />
    </label>
  );
}
