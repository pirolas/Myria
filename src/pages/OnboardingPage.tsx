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
  limitationLabels,
  limitationOptions,
  minuteOptions,
  trainingDayOptions
} from "@/data/content";
import { useMyriaApp } from "@/hooks/useMyriaApp";
import type {
  BetaOnboardingInput,
  Goal,
  LimitationTag,
  PreferenceOption
} from "@/types/domain";

type StepKey =
  | "age"
  | "level"
  | "goal"
  | "days"
  | "minutes"
  | "energy"
  | "gentle"
  | "limitations"
  | "focus";

function buildInitialInput(
  onboarding: BetaOnboardingInput | null | undefined
): BetaOnboardingInput {
  return (
    onboarding ?? {
      ageBand: "35_44",
      perceivedLevel: "principiante",
      primaryGoal: "glutei_gambe",
      daysPerWeek: 3,
      preferredMinutes: 15,
      energyLevel: "media",
      gentleStart: true,
      limitations: ["nessuna"],
      focusPreference: "glutei_gambe",
      notes: ""
    }
  );
}

function findLabel<TValue extends string | number | boolean>(
  options: PreferenceOption<TValue>[],
  value: TValue
) {
  return options.find((option) => option.value === value)?.label ?? String(value);
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { data, completeOnboarding, status, error } = useMyriaApp();
  const [form, setForm] = useState<BetaOnboardingInput>(() =>
    buildInitialInput(data?.onboarding)
  );
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(
    () =>
      [
        {
          key: "age",
          eyebrow: "Profilo",
          title: "In quale fascia d'eta ti riconosci oggi?",
          description:
            "Ci serve solo per regolare tono, gradualita e modo di accompagnarti."
        },
        {
          key: "level",
          eyebrow: "Punto di partenza",
          title: "Come ti senti rispetto al movimento in questo momento?",
          description:
            "Basta una fotografia onesta del presente. Myria si adatta da qui."
        },
        {
          key: "goal",
          eyebrow: "Obiettivo principale",
          title: "Qual e il cambiamento che vuoi sentire di piu?",
          description:
            "Scegliamo un asse principale, senza escludere il resto del corpo."
        },
        {
          key: "days",
          eyebrow: "Ritmo",
          title: "Quanti giorni a settimana puoi dedicarti a te?",
          description:
            "Meglio un ritmo credibile che un piano troppo ambizioso per la tua settimana."
        },
        {
          key: "minutes",
          eyebrow: "Durata",
          title: "Quanto tempo vuoi che duri una sessione tipica?",
          description:
            "Costruiamo il percorso intorno a un tempo che puoi ritrovare davvero."
        },
        {
          key: "energy",
          eyebrow: "Energia",
          title: "Com'e la tua energia media in questo periodo?",
          description:
            "Questo aiuta Myria a dosare volume, intensita e recupero."
        },
        {
          key: "gentle",
          eyebrow: "Approccio iniziale",
          title: "Vuoi che la partenza sia molto delicata?",
          description:
            "Possiamo costruire una fase iniziale ancora piu rassicurante."
        },
        {
          key: "limitations",
          eyebrow: "Attenzioni utili",
          title: "Ci sono zone o situazioni che vuoi far tenere presenti a Myria?",
          description:
            "Segnalaci solo cio che puo aiutare il piano a restare semplice e rispettoso."
        },
        {
          key: "focus",
          eyebrow: "Direzione del percorso",
          title: "Dove vuoi sentire il percorso piu centrato nelle prossime settimane?",
          description:
            "Questo focus guidera i primi micro-obiettivi del piano."
        }
      ] satisfies Array<{
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
    ageBandLabels[form.ageBand],
    `${form.daysPerWeek} giorni`,
    `${form.preferredMinutes} minuti`,
    goalLabels[form.focusPreference]
  ];

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
    navigate("/dashboard", { replace: true });
  };

  const renderChoices = () => {
    switch (currentStep.key) {
      case "age":
        return (
          <ChoiceGrid
            options={ageBandOptions}
            value={form.ageBand}
            onChange={(ageBand) => setForm((current) => ({ ...current, ageBand }))}
          />
        );
      case "level":
        return (
          <ChoiceGrid
            options={levelOptions}
            value={form.perceivedLevel}
            onChange={(perceivedLevel) =>
              setForm((current) => ({ ...current, perceivedLevel }))
            }
          />
        );
      case "goal":
        return (
          <ChoiceGrid
            options={goalOptions}
            value={form.primaryGoal}
            onChange={(primaryGoal) =>
              setForm((current) => ({ ...current, primaryGoal }))
            }
          />
        );
      case "days":
        return (
          <ChoiceGrid
            options={trainingDayOptions}
            value={form.daysPerWeek}
            onChange={(daysPerWeek) =>
              setForm((current) => ({ ...current, daysPerWeek }))
            }
            columns="two"
          />
        );
      case "minutes":
        return (
          <ChoiceGrid
            options={minuteOptions}
            value={form.preferredMinutes}
            onChange={(preferredMinutes) =>
              setForm((current) => ({ ...current, preferredMinutes }))
            }
            columns="two"
          />
        );
      case "energy":
        return (
          <ChoiceGrid
            options={energyOptions}
            value={form.energyLevel}
            onChange={(energyLevel) =>
              setForm((current) => ({ ...current, energyLevel }))
            }
          />
        );
      case "gentle":
        return (
          <ChoiceGrid
            options={gentleStartOptions}
            value={form.gentleStart}
            onChange={(gentleStart) =>
              setForm((current) => ({ ...current, gentleStart }))
            }
          />
        );
      case "limitations":
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              {limitationOptions.map((option) => {
                const isSelected = form.limitations.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleLimitation(option.value)}
                    className={[
                      "surface text-left px-4 py-4 transition",
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

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Nota opzionale
              </span>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
                rows={4}
                className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
                placeholder="Per esempio: preferisco evitare movimenti troppo bruschi o giornate troppo intense."
              />
            </label>
          </div>
        );
      case "focus":
        return (
          <ChoiceGrid
            options={focusOptions}
            value={form.focusPreference}
            onChange={(focusPreference: Goal) =>
              setForm((current) => ({ ...current, focusPreference }))
            }
          />
        );
      default:
        return null;
    }
  };

  const currentSummary = (() => {
    switch (currentStep.key) {
      case "age":
        return ageBandLabels[form.ageBand];
      case "level":
        return levelLabels[form.perceivedLevel];
      case "goal":
        return goalLabels[form.primaryGoal];
      case "days":
        return findLabel(trainingDayOptions, form.daysPerWeek);
      case "minutes":
        return findLabel(minuteOptions, form.preferredMinutes);
      case "energy":
        return energyLabels[form.energyLevel];
      case "gentle":
        return form.gentleStart ? "Partenza molto delicata" : "Partenza delicata attiva";
      case "limitations":
        return form.limitations.map((item) => limitationLabels[item]).join(", ");
      case "focus":
        return goalLabels[form.focusPreference];
      default:
        return "";
    }
  })();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] px-4 pb-36 pt-4">
      <div className="page-enter space-y-6">
        <section className="surface-strong soft-gradient overflow-hidden px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[14rem]">
              <div className="eyebrow">Onboarding intelligente</div>
              <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
                Impostiamo un percorso che ti assomigli davvero.
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted">
                Pochi passaggi chiari per costruire una base sostenibile, guidata e
                personale fin dal primo accesso.
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
          <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-ink">
            {currentStep.title}
          </h2>
          <p className="mt-3 max-w-[21rem] text-sm leading-7 text-muted">
            {currentStep.description}
          </p>

          <div className="mt-5">{renderChoices()}</div>

          <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Sintesi del passo
            </div>
            <div className="mt-2 text-sm font-semibold text-ink">{currentSummary}</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Myria usera questa informazione per dosare ritmo, focus e progressione.
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
                ? "Creiamo il tuo percorso..."
                : stepIndex === steps.length - 1
                  ? data?.onboarding
                    ? "Aggiorna il mio percorso"
                    : "Ricevi il mio percorso"
                  : "Continua"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
