import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import { QuestionBlock } from "@/components/ui/QuestionBlock";
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

        <QuestionBlock title="Esperienza passata" description="Quanto il tuo corpo ha già familiarità con una routine.">
          <ChoiceGrid
            options={pastExperienceOptions}
            value={onboardingForm.pastExperience}
            onChange={(pastExperience) =>
              setOnboardingForm((current) => ({ ...current, pastExperience }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Stile di vita" description="Per capire quanto movimento c'è già nella tua giornata.">
          <ChoiceGrid
            options={lifestyleOptions}
            value={onboardingForm.lifestyle}
            onChange={(lifestyle) =>
              setOnboardingForm((current) => ({ ...current, lifestyle }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Disponibilità reale" description="Quanto spazio riesci davvero a proteggere durante la settimana.">
          <ChoiceGrid
            options={weeklyAvailabilityOptions}
            value={onboardingForm.weeklyAvailability}
            onChange={(weeklyAvailability) =>
              setOnboardingForm((current) => ({ ...current, weeklyAvailability }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Momento più adatto" description="Il momento del giorno che senti più gestibile.">
          <ChoiceGrid
            options={timePreferenceOptions}
            value={onboardingForm.preferredTimeOfDay}
            onChange={(preferredTimeOfDay) =>
              setOnboardingForm((current) => ({ ...current, preferredTimeOfDay }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Qualità del sonno" description="Ci aiuta a capire quanto margine di recupero hai oggi.">
          <ChoiceGrid
            options={sleepQualityOptions}
            value={onboardingForm.sleepQuality}
            onChange={(sleepQuality) =>
              setOnboardingForm((current) => ({ ...current, sleepQuality }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Livello di stress" description="Per dosare il piano dentro la tua realtà, non sopra di essa.">
          <ChoiceGrid
            options={stressLevelOptions}
            value={onboardingForm.stressLevel}
            onChange={(stressLevel) =>
              setOnboardingForm((current) => ({ ...current, stressLevel }))
            }
          />
        </QuestionBlock>

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

        <QuestionBlock title="Area che senti più debole" description="Quella che oggi percepisci meno presente o meno sostenuta.">
          <ChoiceGrid
            options={bodyAreaFocusOptions}
            value={deepForm.weakArea ?? "glutei_gambe"}
            onChange={(weakArea) => setDeepForm((current) => ({ ...current, weakArea }))}
          />
        </QuestionBlock>
        <QuestionBlock title="Area che vuoi migliorare di più" description="Quella su cui desideri vedere il cambiamento più chiaro.">
          <ChoiceGrid
            options={bodyAreaFocusOptions}
            value={deepForm.priorityArea ?? "glutei_gambe"}
            onChange={(priorityArea) =>
              setDeepForm((current) => ({ ...current, priorityArea }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Percezione della postura" description="Come ti senti nella giornata, soprattutto dopo tante ore seduta o ferma.">
          <ChoiceGrid
            options={posturePerceptionOptions}
            value={deepForm.posturePerception ?? "variabile"}
            onChange={(posturePerception) =>
              setDeepForm((current) => ({ ...current, posturePerception }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Percezione della mobilità" description="Quanto ti senti fluida o frenata nei movimenti.">
          <ChoiceGrid
            options={mobilityPerceptionOptions}
            value={deepForm.mobilityPerception ?? "media"}
            onChange={(mobilityPerception) =>
              setDeepForm((current) => ({ ...current, mobilityPerception }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Equilibrio e coordinazione" description="Ci serve per capire quanto tenere il lavoro stabile e semplice.">
          <ChoiceGrid
            options={coordinationOptions}
            value={deepForm.coordinationLevel ?? "discreta"}
            onChange={(coordinationLevel) =>
              setDeepForm((current) => ({ ...current, coordinationLevel }))
            }
          />
        </QuestionBlock>
      </section>

      <section className="surface px-5 py-5 space-y-4">
        <div className="text-base font-semibold text-ink">Segnali utili da tenere presenti</div>

        <TagGroup
          title="Zone sensibili"
          description="Solo se c'è qualche area che preferisci proteggere di più."
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
          title="Segnali pelvici"
          description="Solo se li senti presenti e vuoi farli tenere in considerazione."
          items={pelvicSignalOptions}
          selected={deepForm.pelvicSignals}
          onToggle={(value) =>
            setDeepForm((current) => ({
              ...current,
              pelvicSignals: toggleTag(current.pelvicSignals, value as PelvicSignal)
            }))
          }
        />
        <QuestionBlock title="Addome e diastasi" description="Una lettura prudente, senza farla diventare clinica.">
          <ChoiceGrid
            options={diastasisOptions}
            value={deepForm.diastasisStatus ?? "no"}
            onChange={(diastasisStatus) =>
              setDeepForm((current) => ({ ...current, diastasisStatus }))
            }
          />
        </QuestionBlock>

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

        <QuestionBlock title="Confidenza con il corpo" description="Per capire quanto il percorso deve anche rassicurarti, non solo attivarti.">
          <ChoiceGrid
            options={bodyConfidenceOptions}
            value={deepForm.bodyConfidence ?? "variabile"}
            onChange={(bodyConfidence) =>
              setDeepForm((current) => ({ ...current, bodyConfidence }))
            }
          />
        </QuestionBlock>
        <TagGroup
          title="Cosa tende a farti mollare"
          description="Serve a proteggere meglio la costanza, non a etichettarti."
          items={dropoutReasonOptions}
          selected={deepForm.dropoutReasons}
          onToggle={(value) =>
            setDeepForm((current) => ({
              ...current,
              dropoutReasons: toggleTag(current.dropoutReasons, value as DropoutReason)
            }))
          }
        />
        <QuestionBlock title="Ritmo alimentare percepito" description="Una lettura semplice per non costruire un piano scollegato dal tuo quotidiano.">
          <ChoiceGrid
            options={nutritionPatternOptions}
            value={deepForm.nutritionPattern ?? "abbastanza_equilibrata"}
            onChange={(nutritionPattern) =>
              setDeepForm((current) => ({ ...current, nutritionPattern }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Idratazione" description="Solo per capire se c'è un punto facile da migliorare a supporto del percorso.">
          <ChoiceGrid
            options={hydrationPatternOptions}
            value={deepForm.hydrationPattern ?? "altalenante"}
            onChange={(hydrationPattern) =>
              setDeepForm((current) => ({ ...current, hydrationPattern }))
            }
          />
        </QuestionBlock>
        <QuestionBlock title="Taglio del percorso" description="Il modo in cui preferisci sentire il lavoro nelle prossime settimane.">
          <ChoiceGrid
            options={trainingPreferenceOptions}
            value={deepForm.trainingPreference ?? "piu_dolce"}
            onChange={(trainingPreference) =>
              setDeepForm((current) => ({ ...current, trainingPreference }))
            }
          />
        </QuestionBlock>
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
  title,
  description,
  items,
  selected,
  onToggle
}: {
  title: string;
  description?: string;
  items: Array<{ value: string; label: string; description: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="text-sm font-semibold text-ink">{title}</div>
        {description ? (
          <p className="max-w-[22rem] text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-3">
        {items.map((item) => {
        const isSelected = selected.includes(item.value);

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onToggle(item.value)}
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


