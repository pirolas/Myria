import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import {
  bodyAreaFocusOptions,
  bodyConfidenceOptions,
  consistencyMessages,
  coordinationOptions,
  diastasisOptions,
  dropoutReasonOptions,
  hydrationPatternOptions,
  lifestyleOptions,
  mobilityPerceptionOptions,
  nutritionPatternOptions,
  pastExperienceOptions,
  pelvicSignalOptions,
  posturePerceptionOptions,
  sensitivityOptions,
  sleepQualityOptions,
  stressLevelOptions,
  timePreferenceOptions,
  trainingPreferenceOptions,
  weeklyAvailabilityOptions
} from "@/data/content";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import type {
  BetaOnboardingInput,
  DeepProfileInput,
  DropoutReason,
  PelvicSignal,
  SensitivityTag
} from "@/types/domain";

const defaultDeepInput: DeepProfileInput = {
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
  fearedExercises: "",
  dislikedExercises: "",
  relevantInterventions: "",
  notes: ""
};

export function DeepProfilePage() {
  const navigate = useNavigate();
  const { data, saveProfileRefinement, status, error } = useMiryaApp();

  if (!data?.onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  const [onboardingForm, setOnboardingForm] = useState<BetaOnboardingInput>(data.onboarding);
  const [deepForm, setDeepForm] = useState<DeepProfileInput>(
    data.deepProfile ?? defaultDeepInput
  );

  const toggleTag = <T extends string,>(items: T[], value: T) =>
    items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

  const handleSubmit = async () => {
    await saveProfileRefinement(onboardingForm, deepForm);
    navigate("/plan/story", { replace: true });
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[16rem]">
            <div className="eyebrow">Profilo approfondito</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              Un minuto in più per farlo assomigliare davvero a te.
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Qui non rifacciamo l'onboarding. Aggiungiamo solo i dettagli che aiutano
              Mirya a dosare meglio tono, recupero e progressione.
            </p>
          </div>
          <div className="rounded-[1.3rem] bg-white/82 p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
        </div>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Contesto quotidiano</div>
        <p className="text-sm leading-6 text-muted">
          Non cambia chi sei: ci aiuta solo a capire quanto margine reale c'è oggi.
        </p>

        <ChoiceGrid
          options={pastExperienceOptions}
          value={onboardingForm.pastExperience}
          onChange={(pastExperience) =>
            setOnboardingForm((current) => ({ ...current, pastExperience }))
          }
        />
        <ChoiceGrid
          options={lifestyleOptions}
          value={onboardingForm.lifestyle}
          onChange={(lifestyle) =>
            setOnboardingForm((current) => ({ ...current, lifestyle }))
          }
        />
        <ChoiceGrid
          options={weeklyAvailabilityOptions}
          value={onboardingForm.weeklyAvailability}
          onChange={(weeklyAvailability) =>
            setOnboardingForm((current) => ({ ...current, weeklyAvailability }))
          }
        />
        <ChoiceGrid
          options={timePreferenceOptions}
          value={onboardingForm.preferredTimeOfDay}
          onChange={(preferredTimeOfDay) =>
            setOnboardingForm((current) => ({ ...current, preferredTimeOfDay }))
          }
        />
        <ChoiceGrid
          options={sleepQualityOptions}
          value={onboardingForm.sleepQuality}
          onChange={(sleepQuality) =>
            setOnboardingForm((current) => ({ ...current, sleepQuality }))
          }
        />
        <ChoiceGrid
          options={stressLevelOptions}
          value={onboardingForm.stressLevel}
          onChange={(stressLevel) =>
            setOnboardingForm((current) => ({ ...current, stressLevel }))
          }
        />

        <label className="block rounded-[22px] border border-line bg-white/78 px-4 py-4">
          <div className="text-sm font-semibold text-ink">
            Quanto senti di riuscire a proteggere la costanza, oggi?
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={onboardingForm.consistencyScore}
            onChange={(event) =>
              setOnboardingForm((current) => ({
                ...current,
                consistencyScore: Number(event.target.value) as 1 | 2 | 3 | 4 | 5
              }))
            }
            className="mt-4 w-full accent-[var(--color-accent)]"
          />
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>1</span>
            <span>
              {consistencyMessages[
                (onboardingForm.consistencyScore - 1) % consistencyMessages.length
              ]}
            </span>
            <span>5</span>
          </div>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <NumericField
            label="Altezza"
            placeholder="cm"
            value={onboardingForm.heightCm}
            onChange={(heightCm) => setOnboardingForm((current) => ({ ...current, heightCm }))}
          />
          <NumericField
            label="Peso"
            placeholder="kg"
            value={onboardingForm.weightKg}
            onChange={(weightKg) => setOnboardingForm((current) => ({ ...current, weightKg }))}
          />
        </div>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Come si sente il tuo corpo</div>
        <p className="text-sm leading-6 text-muted">
          Bastano pochi segnali per capire dove proteggerti e dove possiamo chiederti
          qualcosa in più.
        </p>

        <ChoiceGrid
          options={bodyAreaFocusOptions}
          value={deepForm.weakArea ?? "glutei_gambe"}
          onChange={(weakArea) => setDeepForm((current) => ({ ...current, weakArea }))}
        />
        <ChoiceGrid
          options={bodyAreaFocusOptions}
          value={deepForm.priorityArea ?? "glutei_gambe"}
          onChange={(priorityArea) =>
            setDeepForm((current) => ({ ...current, priorityArea }))
          }
        />
        <ChoiceGrid
          options={posturePerceptionOptions}
          value={deepForm.posturePerception ?? "variabile"}
          onChange={(posturePerception) =>
            setDeepForm((current) => ({ ...current, posturePerception }))
          }
        />
        <ChoiceGrid
          options={mobilityPerceptionOptions}
          value={deepForm.mobilityPerception ?? "media"}
          onChange={(mobilityPerception) =>
            setDeepForm((current) => ({ ...current, mobilityPerception }))
          }
        />
        <ChoiceGrid
          options={coordinationOptions}
          value={deepForm.coordinationLevel ?? "discreta"}
          onChange={(coordinationLevel) =>
            setDeepForm((current) => ({ ...current, coordinationLevel }))
          }
        />
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Segnali utili da tenere presenti</div>

        <TagGroup
          items={sensitivityOptions}
          selected={deepForm.sensitivities}
          onToggle={(value) =>
            setDeepForm((current) => ({
              ...current,
              sensitivities: toggleTag(current.sensitivities, value as SensitivityTag)
            }))
          }
        />
        <TagGroup
          items={pelvicSignalOptions}
          selected={deepForm.pelvicSignals}
          onToggle={(value) =>
            setDeepForm((current) => ({
              ...current,
              pelvicSignals: toggleTag(current.pelvicSignals, value as PelvicSignal)
            }))
          }
        />
        <ChoiceGrid
          options={diastasisOptions}
          value={deepForm.diastasisStatus ?? "no"}
          onChange={(diastasisStatus) =>
            setDeepForm((current) => ({ ...current, diastasisStatus }))
          }
        />

        <div className="grid grid-cols-3 gap-3">
          <NumericField
            label="Gravidanze"
            value={deepForm.pregnanciesCount}
            onChange={(pregnanciesCount) =>
              setDeepForm((current) => ({ ...current, pregnanciesCount }))
            }
          />
          <NumericField
            label="Cesarei"
            value={deepForm.cesareansCount}
            onChange={(cesareansCount) =>
              setDeepForm((current) => ({ ...current, cesareansCount }))
            }
          />
          <NumericField
            label="Mesi dall'ultimo parto"
            value={deepForm.monthsSinceLastBirth}
            onChange={(monthsSinceLastBirth) =>
              setDeepForm((current) => ({ ...current, monthsSinceLastBirth }))
            }
          />
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Interventi, cicatrici o dettagli fisici che vuoi farci tenere presenti
          </span>
          <textarea
            value={deepForm.relevantInterventions}
            onChange={(event) =>
              setDeepForm((current) => ({
                ...current,
                relevantInterventions: event.target.value
              }))
            }
            rows={3}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: cicatrice addominale sensibile, fastidio residuo dopo un intervento, oppure niente di rilevante."
          />
        </label>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Stile del percorso</div>

        <ChoiceGrid
          options={bodyConfidenceOptions}
          value={deepForm.bodyConfidence ?? "variabile"}
          onChange={(bodyConfidence) =>
            setDeepForm((current) => ({ ...current, bodyConfidence }))
          }
        />
        <TagGroup
          items={dropoutReasonOptions}
          selected={deepForm.dropoutReasons}
          onToggle={(value) =>
            setDeepForm((current) => ({
              ...current,
              dropoutReasons: toggleTag(current.dropoutReasons, value as DropoutReason)
            }))
          }
        />
        <ChoiceGrid
          options={nutritionPatternOptions}
          value={deepForm.nutritionPattern ?? "abbastanza_equilibrata"}
          onChange={(nutritionPattern) =>
            setDeepForm((current) => ({ ...current, nutritionPattern }))
          }
        />
        <ChoiceGrid
          options={hydrationPatternOptions}
          value={deepForm.hydrationPattern ?? "altalenante"}
          onChange={(hydrationPattern) =>
            setDeepForm((current) => ({ ...current, hydrationPattern }))
          }
        />
        <ChoiceGrid
          options={trainingPreferenceOptions}
          value={deepForm.trainingPreference ?? "piu_dolce"}
          onChange={(trainingPreference) =>
            setDeepForm((current) => ({ ...current, trainingPreference }))
          }
        />
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Esercizi che temi o che ti mettono in allerta
          </span>
          <textarea
            value={deepForm.fearedExercises}
            onChange={(event) =>
              setDeepForm((current) => ({ ...current, fearedExercises: event.target.value }))
            }
            rows={3}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: plank, affondi profondi, movimenti veloci."
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Esercizi che non gradisci
          </span>
          <textarea
            value={deepForm.dislikedExercises}
            onChange={(event) =>
              setDeepForm((current) => ({ ...current, dislikedExercises: event.target.value }))
            }
            rows={3}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: movimenti troppo ripetitivi, lavori lunghi sulle gambe, esercizi a terra."
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Se c'è qualcosa che vuoi farci capire meglio
          </span>
          <textarea
            value={deepForm.notes}
            onChange={(event) =>
              setDeepForm((current) => ({ ...current, notes: event.target.value }))
            }
            rows={4}
            className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
            placeholder="Per esempio: faccio fatica soprattutto la sera, oppure alcuni movimenti mi mettono in allerta."
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
          {status === "saving" ? "Raffiniamo il piano..." : "Rendi il piano più personale"}
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
  onChange,
  placeholder
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
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
        placeholder={placeholder}
      />
    </label>
  );
}


