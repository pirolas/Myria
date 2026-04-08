import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import { QuestionBlock } from "@/components/ui/QuestionBlock";
import {
  ageBandLabels,
  ageBandOptions,
  avoidJumpOptions,
  eatingPerceptionOptions,
  energyLabels,
  energyOptions,
  focusAreaLabels,
  gentleStartOptions,
  levelLabels,
  levelOptions,
  limitationOptions,
  minuteOptions,
  pastExperienceOptions,
  pastTrainingTypeOptions,
  preferredDayOptions,
  primaryBodyGoalLabels,
  primaryBodyGoalOptions,
  proteinPerceptionOptions,
  secondaryObjectiveLabels,
  secondaryObjectiveOptions,
  sessionStyleOptions,
  sessionToneOptions,
  simpleExerciseOptions,
  sleepQualityOptions,
  stressLevelOptions,
  timePreferenceOptions,
  trainingDayOptions
} from "@/data/content";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import {
  deriveFocusAreasFromObjectives,
  derivePlanGoalsFromFocusAreas
} from "@/lib/onboarding";
import type {
  BetaOnboardingInput,
  Goal,
  LimitationTag,
  PastTrainingType,
  PreferredDay,
  SecondaryObjective
} from "@/types/domain";

type StepKey = "identity" | "goal" | "rhythm" | "context" | "preferences";

function buildInitialInput(input: BetaOnboardingInput | null | undefined): BetaOnboardingInput {
  const defaults: BetaOnboardingInput = {
    fullName: "",
    ageBand: "35_44",
    heightCm: null,
    weightKg: null,
    primaryBodyGoal: "tonicita_rassodare",
    secondaryObjectives: ["meno_flaccidita", "maggiore_costanza"],
    primaryGoal: "glutei_gambe",
    secondaryGoals: ["glutei_gambe"],
    perceivedLevel: "principiante",
    daysPerWeek: 3,
    preferredMinutes: 15,
    energyLevel: "media",
    pastExperience: "qualche_fase",
    lifestyle: "molto_sedentaria",
    focusPreference: "glutei_gambe",
    gentleStart: true,
    limitations: ["nessuna"],
    sleepQuality: "discontinua",
    stressLevel: "medio",
    consistencyScore: 3,
    weeklyAvailability: "alcuni_spazi",
    preferredTimeOfDay: "variabile",
    preferredDays: [],
    pastTrainingTypes: [],
    focusAreas: ["glutei", "gambe"],
    preferSimpleExercises: true,
    sessionStyle: "sequenze_lente",
    sessionTone: "soft",
    avoidJumps: true,
    eatingPerception: "abbastanza",
    skipsMeals: false,
    lowWaterIntake: false,
    nervousHunger: false,
    lowProteinIntake: "non_so",
    wantsTimerSound: true,
    notes: ""
  };

  const next = { ...defaults, ...input };
  const focusAreas =
    input?.focusAreas && input.focusAreas.length > 0
      ? input.focusAreas
      : deriveFocusAreasFromObjectives(next.secondaryObjectives, next.primaryBodyGoal);
  const derived = derivePlanGoalsFromFocusAreas(focusAreas);

  return {
    ...next,
    focusAreas,
    primaryGoal: input?.primaryGoal ?? derived.primaryGoal,
    secondaryGoals:
      input?.secondaryGoals && input.secondaryGoals.length > 0
        ? input.secondaryGoals
        : derived.secondaryGoals,
    focusPreference: input?.focusPreference ?? derived.focusPreference,
    secondaryObjectives:
      input?.secondaryObjectives && input.secondaryObjectives.length > 0
        ? input.secondaryObjectives
        : defaults.secondaryObjectives
  };
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { data, completeOnboarding, status, error } = useMiryaApp();
  const [form, setForm] = useState<BetaOnboardingInput>(() =>
    buildInitialInput(data?.onboarding)
  );
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(
    () =>
      [
        {
          key: "identity",
          eyebrow: "Base essenziale",
          title: "Partiamo da pochi dati chiari, quelli che servono davvero.",
          description:
            "Ci aiutano a calibrare tono, margine e struttura iniziale del piano."
        },
        {
          key: "goal",
          eyebrow: "Obiettivo reale",
          title: "Che cambiamento vuoi costruire nel modo più concreto possibile?",
          description:
            "Qui distinguiamo perdita di peso, tono, massa e ricomposizione. È da qui che il piano smette di sembrare generico."
        },
        {
          key: "rhythm",
          eyebrow: "Ritmo reale",
          title: "Proteggiamo un ritmo che possa davvero stare nella tua settimana.",
          description:
            "Meglio un percorso ben dosato che un piano ideale ma impossibile da seguire."
        },
        {
          key: "context",
          eyebrow: "Contesto quotidiano",
          title: "Energia, storia e stile di vita cambiano moltissimo il modo di partire.",
          description:
            "Ci aiutano a capire quanto possiamo chiederti subito e cosa invece va costruito con calma."
        },
        {
          key: "preferences",
          eyebrow: "Come vuoi lavorare",
          title: "Ultimi dettagli per rendere il piano prudente, leggibile e davvero tuo.",
          description:
            "Queste scelte ci aiutano a comporre sessioni che ti sembrino accessibili e sensate già dal primo giorno."
        }
      ] as Array<{
        key: StepKey;
        eyebrow: string;
        title: string;
        description: string;
      }>,
    []
  );

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const summaryChips = [
    form.fullName || "Percorso personale",
    primaryBodyGoalLabels[form.primaryBodyGoal],
    `${form.daysPerWeek} giorni`,
    `${form.preferredMinutes} minuti`
  ];

  const currentSummary = {
    identity: `${ageBandLabels[form.ageBand]}${form.heightCm ? ` · ${form.heightCm} cm` : ""}`,
    goal: `${primaryBodyGoalLabels[form.primaryBodyGoal]} · ${form.focusAreas
      .slice(0, 2)
      .map((item) => focusAreaLabels[item])
      .join(", ")}`,
    rhythm: `${form.daysPerWeek} giorni · ${form.preferredMinutes} min`,
    context: `${levelLabels[form.perceivedLevel]} · ${energyLabels[form.energyLevel]}`,
    preferences: `${form.gentleStart ? "inizio graduale" : "base attiva"} · ${
      form.avoidJumps ? "senza salti" : "più libero"
    }`
  }[currentStep.key];

  const toggleValue = <T extends string,>(items: T[], value: T) =>
    items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

  const toggleSecondaryObjective = (value: SecondaryObjective) => {
    setForm((current) => {
      const nextValues = toggleValue(current.secondaryObjectives, value);
      const secondaryObjectives = nextValues.length > 0 ? nextValues : [value];
      const focusAreas = deriveFocusAreasFromObjectives(
        secondaryObjectives,
        current.primaryBodyGoal
      );
      const derived = derivePlanGoalsFromFocusAreas(focusAreas);
      return {
        ...current,
        secondaryObjectives,
        focusAreas,
        primaryGoal: derived.primaryGoal,
        secondaryGoals: derived.secondaryGoals,
        focusPreference: derived.focusPreference
      };
    });
  };

  const togglePreferredDay = (value: PreferredDay) => {
    setForm((current) => ({
      ...current,
      preferredDays: toggleValue(current.preferredDays, value)
    }));
  };

  const togglePastTrainingType = (value: PastTrainingType) => {
    setForm((current) => {
      const nextValues = toggleValue(current.pastTrainingTypes, value);
      return {
        ...current,
        pastTrainingTypes: nextValues.includes("nessuno") && nextValues.length > 1
          ? nextValues.filter((item) => item !== "nessuno")
          : nextValues
      };
    });
  };

  const toggleLimitation = (value: LimitationTag) => {
    setForm((current) => {
      if (value === "nessuna") {
        return { ...current, limitations: ["nessuna"] };
      }

      const nextValues = current.limitations.includes(value)
        ? current.limitations.filter((item) => item !== value)
        : [...current.limitations.filter((item) => item !== "nessuna"), value];

      return {
        ...current,
        limitations: nextValues.length > 0 ? nextValues : ["nessuna"]
      };
    });
  };

  const handleContinue = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    await completeOnboarding(form);
    navigate("/plan/ready", { replace: true });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] px-4 pb-36 pt-4">
      <div className="page-enter space-y-6">
        <section className="surface-strong soft-gradient overflow-hidden px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[15rem]">
              <div className="eyebrow">Ingresso guidato</div>
              <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
                Mirya usa pochi dati ben scelti per comporre il tuo primo piano.
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted">
                Non ti chiede di costruirlo da sola. Legge il tuo obiettivo, il tuo
                ritmo e il tuo punto di partenza, poi li trasforma in una settimana
                concreta da seguire.
              </p>
            </div>
            <div className="rounded-[1.3rem] bg-[rgba(255,255,255,0.82)] p-3 text-accent-deep shadow-sm">
              <Sparkles size={18} />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>
                Passo {stepIndex + 1} di {steps.length}
              </span>
              <span>{currentSummary}</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[rgba(215,239,236,0.72)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#70c7c1_0%,#4ea49f_100%)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {summaryChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/70 bg-white/78 px-3 py-2 text-xs font-semibold text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section className="surface px-5 py-5">
          <div className="eyebrow">{currentStep.eyebrow}</div>
          <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-ink">
            {currentStep.title}
          </h2>
          <p className="mt-3 max-w-[22rem] text-sm leading-7 text-muted">
            {currentStep.description}
          </p>

          <div className="mt-5">{renderStep()}</div>

          {stepIndex === steps.length - 1 ? (
            <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Prima di generare il piano
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Useremo il tuo obiettivo principale, il focus corporeo che senti più
                importante, il ritmo che puoi davvero sostenere e le attenzioni da
                proteggere. Poi Mirya comporrà una prima settimana concreta, con
                struttura, giorni, esercizi e progressione iniziale.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Cosa succede dopo
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Alla fine ricevi un piano già costruito per te, non una libreria da
                interpretare da sola.
              </p>
            </div>
          )}

          {error ? (
            <div className="mt-4 rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
              {error}
            </div>
          ) : null}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[440px] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
        <div className="rounded-[28px] border border-white/70 bg-[rgba(248,252,251,0.94)] p-3 shadow-[0_16px_36px_rgba(73,103,104,0.08)]">
          <div className="flex gap-3">
            {stepIndex > 0 ? (
              <Button
                variant="secondary"
                className="shrink-0 px-4"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                icon={<ChevronLeft size={18} />}
              >
                Indietro
              </Button>
            ) : null}

            <Button
              fullWidth
              onClick={() => void handleContinue()}
              disabled={status === "saving"}
              icon={
                stepIndex === steps.length - 1 ? (
                  <Sparkles size={18} />
                ) : (
                  <ChevronRight size={18} />
                )
              }
              className="justify-between"
            >
              {status === "saving"
                ? "Stiamo componendo il tuo piano..."
                : stepIndex === steps.length - 1
                  ? "Genera il mio piano"
                  : "Continua"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  function renderStep() {
    switch (currentStep.key) {
      case "identity":
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Come vuoi che ti chiamiamo
              </span>
              <input
                type="text"
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, fullName: event.target.value }))
                }
                className="mt-2 h-12 w-full rounded-[18px] border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
                placeholder="Per esempio: Laura"
              />
            </label>

            <ChoiceGrid
              options={ageBandOptions}
              value={form.ageBand}
              onChange={(ageBand) => setForm((current) => ({ ...current, ageBand }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <NumericField
                label="Altezza"
                placeholder="cm"
                value={form.heightCm}
                onChange={(heightCm) => setForm((current) => ({ ...current, heightCm }))}
              />
              <NumericField
                label="Peso"
                placeholder="kg"
                value={form.weightKg}
                onChange={(weightKg) => setForm((current) => ({ ...current, weightKg }))}
              />
            </div>
          </div>
        );
      case "goal":
        return (
          <div className="space-y-4">
            <QuestionBlock
              title="Obiettivo principale"
              description="La direzione che conta di più in questo momento."
            >
              <ChoiceGrid
                options={primaryBodyGoalOptions}
                value={form.primaryBodyGoal}
                onChange={(primaryBodyGoal) =>
                  setForm((current) => {
                    const focusAreas = deriveFocusAreasFromObjectives(
                      current.secondaryObjectives,
                      primaryBodyGoal
                    );
                    const derived = derivePlanGoalsFromFocusAreas(focusAreas);

                    return {
                      ...current,
                      primaryBodyGoal,
                      focusAreas,
                      primaryGoal: derived.primaryGoal,
                      secondaryGoals: derived.secondaryGoals,
                      focusPreference: derived.focusPreference
                    };
                  })
                }
              />
            </QuestionBlock>

            <MultiSelectCards
              title="Cosa vuoi sentire di più, oltre all'obiettivo principale"
              items={secondaryObjectiveOptions}
              selected={form.secondaryObjectives}
              onToggle={(value) => toggleSecondaryObjective(value as SecondaryObjective)}
            />

            <div className="rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Focus che Mirya terrà più presenti
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Lo ricaviamo dai segnali che hai scelto, così non ti facciamo ripetere
                la stessa cosa due volte.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.focusAreas.map((focus) => (
                  <span
                    key={focus}
                    className="selection-chip-selected rounded-full border px-3 py-2 text-sm font-semibold"
                  >
                    {focusAreaLabels[focus]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case "rhythm":
        return (
          <div className="space-y-4">
            <QuestionBlock
              title="Giorni a settimana"
              description="Quanti giorni riesci davvero a proteggere con continuità."
            >
              <ChoiceGrid
                options={trainingDayOptions}
                value={form.daysPerWeek}
                onChange={(daysPerWeek) => setForm((current) => ({ ...current, daysPerWeek }))}
                columns="two"
              />
            </QuestionBlock>
            <QuestionBlock
              title="Tempo per ogni sessione"
              description="Meglio partire da un tempo che senti davvero sostenibile."
            >
              <ChoiceGrid
                options={minuteOptions}
                value={form.preferredMinutes}
                onChange={(preferredMinutes) =>
                  setForm((current) => ({ ...current, preferredMinutes }))
                }
                columns="two"
              />
            </QuestionBlock>
            <QuestionBlock
              title="Momento della giornata"
              description="Il momento in cui hai più probabilità di riuscirci davvero."
            >
              <ChoiceGrid
                options={timePreferenceOptions}
                value={form.preferredTimeOfDay}
                onChange={(preferredTimeOfDay) =>
                  setForm((current) => ({ ...current, preferredTimeOfDay }))
                }
              />
            </QuestionBlock>
            <MultiSelectInline
              title="Se hai giorni più facili da proteggere"
              items={preferredDayOptions}
              selected={form.preferredDays}
              onToggle={(value) => togglePreferredDay(value as PreferredDay)}
            />
            <label className="block rounded-[22px] border border-line bg-white/78 px-4 py-4">
              <div className="text-sm font-semibold text-ink">
                Quanto senti di riuscire a mantenere il ritmo, oggi?
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={form.consistencyScore}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    consistencyScore: Number(event.target.value) as 1 | 2 | 3 | 4 | 5
                  }))
                }
                className="mt-4 w-full accent-[var(--color-accent)]"
              />
              <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
                <span>fragile</span>
                <span>stabile</span>
              </div>
            </label>
          </div>
        );
      case "context":
        return (
          <div className="space-y-4">
            <QuestionBlock
              title="Livello percepito"
              description="Ci serve per decidere quanto chiederti subito."
            >
              <ChoiceGrid
                options={levelOptions}
                value={form.perceivedLevel}
                onChange={(perceivedLevel) =>
                  setForm((current) => ({ ...current, perceivedLevel }))
                }
              />
            </QuestionBlock>
            <QuestionBlock
              title="Esperienza passata"
              description="Non per giudicarti, ma per capire da dove ripartire."
            >
              <ChoiceGrid
                options={pastExperienceOptions}
                value={form.pastExperience}
                onChange={(pastExperience) =>
                  setForm((current) => ({ ...current, pastExperience }))
                }
              />
            </QuestionBlock>
            <MultiSelectInline
              title="Allenamenti già provati"
              items={pastTrainingTypeOptions}
              selected={form.pastTrainingTypes}
              onToggle={(value) => togglePastTrainingType(value as PastTrainingType)}
            />
            <QuestionBlock title="Energia media" description="Quanto margine senti durante la giornata.">
              <ChoiceGrid
                options={energyOptions}
                value={form.energyLevel}
                onChange={(energyLevel) =>
                  setForm((current) => ({ ...current, energyLevel }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Qualità del sonno" description="Ci aiuta a dosare meglio tono e recupero.">
              <ChoiceGrid
                options={sleepQualityOptions}
                value={form.sleepQuality}
                onChange={(sleepQuality) =>
                  setForm((current) => ({ ...current, sleepQuality }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Livello di stress" description="Un piano buono deve stare dentro la tua realtà, non contro di lei.">
              <ChoiceGrid
                options={stressLevelOptions}
                value={form.stressLevel}
                onChange={(stressLevel) =>
                  setForm((current) => ({ ...current, stressLevel }))
                }
              />
            </QuestionBlock>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-4">
            <QuestionBlock title="Partenza" description="Quanto dolcemente vuoi entrare nelle prime settimane.">
              <ChoiceGrid
                options={gentleStartOptions}
                value={form.gentleStart}
                onChange={(gentleStart) =>
                  setForm((current) => ({ ...current, gentleStart }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Tipo di esercizi" description="Per capire se privilegiare semplicità e sicurezza oppure un lavoro un po' più vario.">
              <ChoiceGrid
                options={simpleExerciseOptions}
                value={form.preferSimpleExercises}
                onChange={(preferSimpleExercises) =>
                  setForm((current) => ({ ...current, preferSimpleExercises }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Struttura della sessione" description="Più lineare a circuito oppure con passaggi più lenti e controllati.">
              <ChoiceGrid
                options={sessionStyleOptions}
                value={form.sessionStyle}
                onChange={(sessionStyle) =>
                  setForm((current) => ({ ...current, sessionStyle }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Tono del lavoro" description="Quanto presente vuoi sentire il lavoro già da subito.">
              <ChoiceGrid
                options={sessionToneOptions}
                value={form.sessionTone}
                onChange={(sessionTone) =>
                  setForm((current) => ({ ...current, sessionTone }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Movimenti da evitare" description="Per esempio se preferisci un percorso senza salti.">
              <ChoiceGrid
                options={avoidJumpOptions}
                value={form.avoidJumps}
                onChange={(avoidJumps) =>
                  setForm((current) => ({ ...current, avoidJumps }))
                }
              />
            </QuestionBlock>

            <MultiSelectCards
              title="Fastidi o attenzioni da proteggere"
              items={limitationOptions}
              selected={form.limitations}
              onToggle={(value) => toggleLimitation(value as LimitationTag)}
            />

            <QuestionBlock title="Come senti il tuo ritmo alimentare" description="Solo per evitare che il percorso venga sabotato da abitudini troppo instabili.">
              <ChoiceGrid
                options={eatingPerceptionOptions}
                value={form.eatingPerception}
                onChange={(eatingPerception) =>
                  setForm((current) => ({ ...current, eatingPerception }))
                }
              />
            </QuestionBlock>
            <QuestionBlock title="Proteine nella giornata" description="Una lettura semplice, senza trasformarla in una dieta.">
              <ChoiceGrid
                options={proteinPerceptionOptions}
                value={form.lowProteinIntake}
                onChange={(lowProteinIntake) =>
                  setForm((current) => ({ ...current, lowProteinIntake }))
                }
              />
            </QuestionBlock>

            <BooleanToggleRow
              label="Ti capita di saltare spesso i pasti?"
              value={form.skipsMeals}
              onChange={(skipsMeals) => setForm((current) => ({ ...current, skipsMeals }))}
            />
            <BooleanToggleRow
              label="Ti accorgi di bere poca acqua?"
              value={form.lowWaterIntake}
              onChange={(lowWaterIntake) =>
                setForm((current) => ({ ...current, lowWaterIntake }))
              }
            />
            <BooleanToggleRow
              label="Senti fame nervosa in alcuni momenti?"
              value={form.nervousHunger}
              onChange={(nervousHunger) =>
                setForm((current) => ({ ...current, nervousHunger }))
              }
            />
            <BooleanToggleRow
              label="Vuoi i suoni nel timer?"
              value={form.wantsTimerSound}
              onChange={(wantsTimerSound) =>
                setForm((current) => ({ ...current, wantsTimerSound }))
              }
            />
          </div>
        );
      default:
        return null;
    }
  }
}

function MultiSelectCards({
  title,
  items,
  selected,
  onToggle
}: {
  title: string;
  items: Array<{ value: string; label: string; description: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-ink">{title}</div>
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

function MultiSelectInline({
  title,
  items,
  selected,
  onToggle
}: {
  title: string;
  items: Array<{ value: string; label: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item.value);

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              aria-pressed={isSelected}
              className={[
                "rounded-full border px-3 py-2 text-sm font-semibold transition",
                isSelected
                  ? "selection-chip-selected"
                  : "border-line bg-white/78 text-muted"
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BooleanToggleRow({
  label,
  value,
  onChange
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-[22px] border border-line bg-white/78 px-4 py-4">
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          aria-pressed={value}
          className={[
            "rounded-full px-3 py-2 text-sm font-semibold transition",
            value ? "selection-pill-selected" : "bg-[rgba(246,250,249,0.9)] text-muted"
          ].join(" ")}
        >
          Sì
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          aria-pressed={!value}
          className={[
            "rounded-full px-3 py-2 text-sm font-semibold transition",
            !value ? "selection-pill-selected" : "bg-[rgba(246,250,249,0.9)] text-muted"
          ].join(" ")}
        >
          No
        </button>
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
        inputMode="numeric"
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : null)
        }
        className="mt-2 h-12 w-full rounded-[18px] border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
        placeholder={placeholder}
      />
    </label>
  );
}





