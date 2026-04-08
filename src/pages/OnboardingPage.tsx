import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ChoiceGrid } from "@/components/ui/ChoiceGrid";
import {
  ageBandLabels,
  ageBandOptions,
  energyLabels,
  energyOptions,
  focusOptions,
  gentleStartOptions,
  goalLabels,
  goalOptions,
  levelLabels,
  levelOptions,
  limitationOptions,
  minuteOptions,
  trainingDayOptions
} from "@/data/content";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import type { BetaOnboardingInput, Goal, LimitationTag } from "@/types/domain";

type StepKey = "identity" | "goals" | "rhythm" | "care";

function buildInitialInput(input: BetaOnboardingInput | null | undefined): BetaOnboardingInput {
  if (input) {
    return {
      ...input,
      secondaryGoals:
        input.secondaryGoals.length > 0 ? input.secondaryGoals : [input.primaryGoal]
    };
  }

  return {
    fullName: "",
    ageBand: "35_44",
    heightCm: null,
    weightKg: null,
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
    notes: ""
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
          eyebrow: "Ingresso essenziale",
          title: "Partiamo leggero, ma con una direzione chiara.",
          description:
            "Ci bastano pochissime informazioni per comporre un primo piano che non sembri generico."
        },
        {
          key: "goals",
          eyebrow: "Quello che vuoi sentire",
          title: "Quale cambiamento vuoi percepire per primo nel tuo corpo?",
          description:
            "Puoi indicare piu aree. Mirya ne usera una come guida, senza perdere di vista il resto."
        },
        {
          key: "rhythm",
          eyebrow: "Ritmo reale",
          title: "Costruiamo un piano che stia davvero dentro le tue giornate.",
          description:
            "Qui decidiamo tono iniziale, frequenza e durata. Il resto lo rifiniamo dopo, se vorrai."
        },
        {
          key: "care",
          eyebrow: "Ultimo filtro utile",
          title: "Solo quello che serve per partire in modo rispettoso.",
          description:
            "Non ti chiediamo tutto subito. Le informazioni piu precise le raccoglieremo in un secondo momento."
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
    ageBandLabels[form.ageBand],
    `${form.daysPerWeek} giorni`,
    `${form.preferredMinutes} minuti`
  ];

  const currentSummary = {
    identity: form.fullName || ageBandLabels[form.ageBand],
    goals: form.secondaryGoals.map((goal) => goalLabels[goal]).join(", "),
    rhythm: `${levelLabels[form.perceivedLevel]} • ${form.daysPerWeek} giorni • ${form.preferredMinutes} min`,
    care: `${energyLabels[form.energyLevel]} • ${form.gentleStart ? "inizio graduale" : "base attiva"}`
  }[currentStep.key];

  const toggleGoal = (value: Goal) => {
    setForm((current) => {
      const exists = current.secondaryGoals.includes(value);
      const nextGoals = exists
        ? current.secondaryGoals.filter((item) => item !== value)
        : [...current.secondaryGoals, value];
      const normalizedGoals = nextGoals.length > 0 ? nextGoals : [value];

      return {
        ...current,
        secondaryGoals: normalizedGoals,
        primaryGoal: normalizedGoals[0],
        focusPreference: normalizedGoals.includes(current.focusPreference)
          ? current.focusPreference
          : normalizedGoals[0]
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
    navigate("/plan/story", { replace: true });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] px-4 pb-36 pt-4">
      <div className="page-enter space-y-6">
        <section className="surface-strong soft-gradient overflow-hidden px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[15rem]">
              <div className="eyebrow">Onboarding leggero</div>
              <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
                Entriamo nel tuo ritmo senza appesantire l'inizio.
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted">
                Mirya costruisce il primo piano sui dati essenziali. Quello che puo
                renderlo ancora piu preciso te lo chiede dopo, con calma.
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

          <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Cosa succede dopo
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ricevi subito un primo piano guidato. Poi, se vuoi, aggiungi qualche
              dettaglio mirato per farlo assomigliare ancora di piu a te.
            </p>
          </div>

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
              onClick={handleContinue}
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
                ? "Stiamo creando il tuo piano..."
                : stepIndex === steps.length - 1
                  ? "Ricevi il tuo piano"
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
          </div>
        );
      case "goals":
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              {goalOptions.map((option) => {
                const isSelected = form.secondaryGoals.includes(option.value);
                const isPrimary = form.primaryGoal === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleGoal(option.value)}
                    className={[
                      "surface px-4 py-4 text-left transition",
                      isSelected
                        ? "border-[rgba(94,184,178,0.48)] bg-white"
                        : "hover:border-accent/30 hover:bg-white/80"
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink">{option.label}</div>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {option.description}
                        </p>
                      </div>
                      {isPrimary ? (
                        <span className="rounded-full bg-[rgba(215,239,236,0.82)] px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-deep">
                          guida
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <ChoiceGrid
              options={focusOptions.filter((option) =>
                form.secondaryGoals.includes(option.value)
              )}
              value={form.focusPreference}
              onChange={(focusPreference) =>
                setForm((current) => ({ ...current, focusPreference }))
              }
            />
          </div>
        );
      case "rhythm":
        return (
          <div className="space-y-4">
            <ChoiceGrid
              options={levelOptions}
              value={form.perceivedLevel}
              onChange={(perceivedLevel) =>
                setForm((current) => ({ ...current, perceivedLevel }))
              }
            />
            <ChoiceGrid
              options={trainingDayOptions}
              value={form.daysPerWeek}
              onChange={(daysPerWeek) => setForm((current) => ({ ...current, daysPerWeek }))}
              columns="two"
            />
            <ChoiceGrid
              options={minuteOptions}
              value={form.preferredMinutes}
              onChange={(preferredMinutes) =>
                setForm((current) => ({ ...current, preferredMinutes }))
              }
              columns="two"
            />
          </div>
        );
      case "care":
        return (
          <div className="space-y-4">
            <ChoiceGrid
              options={energyOptions}
              value={form.energyLevel}
              onChange={(energyLevel) =>
                setForm((current) => ({ ...current, energyLevel }))
              }
            />

            <ChoiceGrid
              options={gentleStartOptions}
              value={form.gentleStart}
              onChange={(gentleStart) =>
                setForm((current) => ({ ...current, gentleStart }))
              }
            />

            <div className="grid gap-3">
              {limitationOptions.map((option) => {
                const isSelected = form.limitations.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleLimitation(option.value)}
                    className={[
                      "surface px-4 py-4 text-left transition",
                      isSelected
                        ? "border-[rgba(94,184,178,0.48)] bg-white"
                        : "hover:border-accent/30 hover:bg-white/80"
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold text-ink">{option.label}</div>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="rounded-[20px] bg-[rgba(255,255,255,0.78)] px-4 py-4 text-sm leading-6 text-muted">
              Dopo il primo piano potrai aggiungere dettagli su sonno, stress,
              postura, eventuali sensibilita e stile di allenamento. Lo facciamo
              solo se ti va, e solo quando ha davvero senso.
            </p>
          </div>
        );
      default:
        return null;
    }
  }
}
