import { useMemo, useState } from "react";
import {
  Pause,
  Play,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { energyAfterWorkoutOptions, feelingOptions } from "@/data/content";
import { useMyriaApp } from "@/hooks/useMyriaApp";
import { useWorkoutPlayer } from "@/hooks/useWorkoutPlayer";
import { ExerciseFigure } from "@/components/workouts/ExerciseFigure";
import type { Feeling, TrainingPlanDay } from "@/types/domain";

export function ActiveWorkoutPage() {
  const navigate = useNavigate();
  const { planDayId } = useParams();
  const {
    data,
    startSession,
    completeSession,
    setTimerSoundEnabled,
    status
  } = useMyriaApp();
  const planDay = useMemo(
    () => data?.weekPlan.find((item) => item.id === planDayId) ?? null,
    [data?.weekPlan, planDayId]
  );
  const soundEnabled = data?.preferences?.timerSoundEnabled ?? true;
  const player = useWorkoutPlayer(planDay?.workout ?? emptyWorkout, soundEnabled);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling>("giusto");
  const [selectedEnergy, setSelectedEnergy] = useState<
    "molto_bassa" | "bassa" | "media" | "buona"
  >("media");
  const [selectedUncomfortable, setSelectedUncomfortable] = useState<string[]>([]);
  const [discomfortNotes, setDiscomfortNotes] = useState("");
  const [stopReason, setStopReason] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (!planDay) {
    return <Navigate to="/today" replace />;
  }

  const currentStep = player.currentStep;
  const nextStep = planDay.workout.steps[player.currentIndex + 1] ?? null;
  const remainingSteps = Math.max(
    planDay.workout.steps.length - player.currentIndex - 1,
    0
  );
  const stageMeta = getStageMeta(player.stage, currentStep?.title ?? "");

  const handleStart = async () => {
    setLocalError(null);
    setIsStarting(true);

    try {
      const nextSessionId = await startSession(planDay);
      setSessionId(nextSessionId);
      player.start();
    } catch (startError) {
      setLocalError(
        startError instanceof Error
          ? startError.message
          : "Non siamo riusciti ad avviare la sessione."
      );
    } finally {
      setIsStarting(false);
    }
  };

  const handleComplete = async () => {
    if (!sessionId) {
      setLocalError("Avvia prima la sessione per poter salvare il feedback.");
      return;
    }

    setLocalError(null);

    try {
      await completeSession(sessionId, planDay, {
        feeling: selectedFeeling,
        energyFinal: selectedEnergy,
        uncomfortableExerciseIds: selectedUncomfortable,
        discomfortNotes,
        stopReason,
        skippedExerciseIds: player.skippedExerciseIds
      });
      navigate("/progress", { replace: true });
    } catch (completeError) {
      setLocalError(
        completeError instanceof Error
          ? completeError.message
          : "Non siamo riusciti a salvare la sessione."
      );
    }
  };

  const toggleUncomfortable = (exerciseId: string) => {
    setSelectedUncomfortable((current) =>
      current.includes(exerciseId)
        ? current.filter((item) => item !== exerciseId)
        : [...current, exerciseId]
    );
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow">Sessione guidata</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              {planDay.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => void setTimerSoundEnabled(!soundEnabled)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-accent-deep"
            aria-label={soundEnabled ? "Disattiva suoni" : "Attiva suoni"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-muted">{planDay.coachNote}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
            {planDay.estimatedMinutes} minuti
          </span>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            audio {soundEnabled ? "attivo" : "off"}
          </span>
        </div>
      </section>

      {player.stage === "ready" ? (
        <section className="surface px-5 py-5">
          <div className="text-base font-semibold text-ink">
            Tutto e pronto per partire
          </div>
          <p className="mt-3 text-sm leading-7 text-muted">
            Da qui in poi Myria tiene il ritmo per te. Tu devi solo iniziare e
            seguire uno step alla volta.
          </p>

          <div className="mt-5 space-y-3">
            {[
              "Comparira un countdown iniziale breve.",
              "Ogni esercizio andra avanti in automatico.",
              "Se serve, puoi mettere in pausa o saltare uno step."
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-[22px] border border-line bg-white/78 px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(215,239,236,0.82)] text-sm font-semibold text-accent-deep">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-muted">{item}</p>
              </div>
            ))}
          </div>

          {localError ? (
            <div className="mt-4 rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
              {localError}
            </div>
          ) : null}

          <div className="mt-5">
            <Button fullWidth onClick={handleStart} disabled={isStarting}>
              {isStarting ? "Avvio in corso..." : "Avvia la sessione"}
            </Button>
          </div>
        </section>
      ) : null}

      {player.stage !== "ready" && player.stage !== "finished" && currentStep ? (
        <section className="surface timer-panel px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="eyebrow">{stageMeta.eyebrow}</div>
              <div className="mt-2 text-xl font-semibold text-ink">
                {stageMeta.title}
              </div>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {player.currentIndex + 1}/{player.totalSteps}
            </div>
          </div>

          <div className="mt-5 timer-face">
            {player.stage === "countdown" ? (
              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                  <Sparkles size={20} />
                </div>
                <div className="mt-5 text-[4rem] font-semibold leading-none text-ink">
                  {player.secondsLeft}
                </div>
                <div className="mt-2 text-sm text-muted">Prenditi un attimo e parti.</div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {player.stage === "rest" ? "Pausa" : "Adesso"}
                </div>
                <div className="mt-3 text-[4rem] font-semibold leading-none text-ink">
                  {player.secondsLeft}
                </div>
                <div className="mt-4 max-w-[14rem] text-lg font-semibold text-ink">
                  {player.stage === "rest" ? "Recupero breve" : currentStep.title}
                </div>
                <p className="mt-2 max-w-[15rem] text-sm leading-6 text-muted">
                  {player.stage === "rest"
                    ? nextStep
                      ? `Tra poco continui con ${nextStep.title.toLowerCase()}.`
                      : "Ultimo recupero prima della chiusura."
                    : "Segui il gesto con calma. Non serve accelerare."}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[rgba(215,239,236,0.72)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#70c7c1_0%,#4ea49f_100%)] transition-all"
              style={{ width: `${Math.max(6, player.progressPercent)}%` }}
            />
          </div>

          <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Guida del momento
            </div>
            <div className="mt-2 text-sm font-semibold text-ink">
              {player.stage === "rest" ? "Lascia scendere il ritmo." : currentStep.title}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {player.stage === "rest" ? stageMeta.description : currentStep.summary}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
              {player.stage === "rest"
                ? nextStep
                  ? `poi: ${nextStep.title}`
                  : "chiusura sessione"
                : currentStep.doseLabel}
            </p>
          </div>

          {player.stage !== "countdown" ? (
            <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.78)] px-4 py-4">
              <ExerciseFigure exerciseId={currentStep.exerciseId} />
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={player.togglePause}
              className="justify-between"
            >
              <span>{player.isPaused ? "Riprendi" : "Metti in pausa"}</span>
              {player.isPaused ? <Play size={18} /> : <Pause size={18} />}
            </Button>

            <Button
              variant="secondary"
              onClick={player.skipCurrent}
              className="justify-between"
            >
              <span>Salta questo step</span>
              <SkipForward size={18} />
            </Button>
          </div>

          <p className="mt-3 text-center text-sm leading-6 text-muted">
            Restano {remainingSteps} step dopo questo.
          </p>
        </section>
      ) : null}

      {player.stage === "finished" ? (
        <section className="surface px-5 py-5">
          <div className="eyebrow">Feedback finale</div>
          <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-ink">
            Chiudiamo bene questa sessione
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Bastano pochi tocchi. Questo ci serve per tenere il percorso realistico
            e sempre piu adatto a te.
          </p>

          <div className="mt-5">
            <div className="text-sm font-semibold text-ink">Com'e andata?</div>
            <div className="mt-3 grid gap-3">
              {feelingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedFeeling(option.value)}
                  className={[
                    "rounded-[20px] border px-4 py-4 text-left transition",
                    selectedFeeling === option.value
                      ? "border-[rgba(94,184,178,0.45)] bg-[rgba(255,255,255,0.92)]"
                      : "border-line bg-white/72"
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold text-ink">{option.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-semibold text-ink">Come ti senti adesso?</div>
            <div className="mt-3 grid gap-3">
              {energyAfterWorkoutOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedEnergy(option.value)}
                  className={[
                    "rounded-[20px] border px-4 py-4 text-left transition",
                    selectedEnergy === option.value
                      ? "border-[rgba(94,184,178,0.45)] bg-[rgba(255,255,255,0.92)]"
                      : "border-line bg-white/72"
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold text-ink">{option.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-semibold text-ink">
              Se qualcosa non era comodo, segnalo qui
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {planDay.workout.steps.map((step) => (
                <button
                  key={step.exerciseId}
                  type="button"
                  onClick={() => toggleUncomfortable(step.exerciseId)}
                  className={[
                    "rounded-full border px-3 py-2 text-xs font-semibold transition",
                    selectedUncomfortable.includes(step.exerciseId)
                      ? "border-[rgba(94,184,178,0.42)] bg-[rgba(215,239,236,0.8)] text-accent-deep"
                      : "border-line bg-white text-muted"
                  ].join(" ")}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Nota opzionale
            </span>
            <textarea
              rows={4}
              value={discomfortNotes}
              onChange={(event) => setDiscomfortNotes(event.target.value)}
              className="mt-2 w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent"
              placeholder="Per esempio: un esercizio era scomodo oggi oppure la zona lombare si e affaticata presto."
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Eventuale stop
            </span>
            <input
              type="text"
              value={stopReason}
              onChange={(event) => setStopReason(event.target.value)}
              className="mt-2 h-12 w-full rounded-[18px] border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
              placeholder="Lascia vuoto se hai concluso normalmente."
            />
          </label>

          {localError ? (
            <div className="mt-4 rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
              {localError}
            </div>
          ) : null}

          <div className="mt-5">
            <Button fullWidth onClick={handleComplete} disabled={status === "saving"}>
              {status === "saving"
                ? "Aggiorniamo il percorso..."
                : "Salva feedback e continua"}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function getStageMeta(stage: string, currentTitle: string) {
  switch (stage) {
    case "countdown":
      return {
        eyebrow: "Tra poco",
        title: "Preparati a iniziare",
        description: "Prenditi un attimo, trova la posizione e lascia partire il ritmo."
      };
    case "rest":
      return {
        eyebrow: "Recupero",
        title: "Respira e lascia scendere il ritmo",
        description:
          "Questa pausa serve a tenere il gesto pulito anche nello step successivo."
      };
    default:
      return {
        eyebrow: "Adesso",
        title: currentTitle,
        description:
          "Segui un movimento semplice e regolare. La qualita conta piu della velocita."
      };
  }
}

const emptyWorkout: TrainingPlanDay["workout"] = {
  title: "",
  focus: "",
  estimatedMinutes: 0,
  coachNote: "",
  cautionNotes: [],
  steps: []
};
