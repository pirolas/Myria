import { useMemo, useState } from "react";
import { Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { StepGuidanceCard } from "@/components/workouts/StepGuidanceCard";
import { Button } from "@/components/ui/Button";
import { ExerciseFigure } from "@/components/workouts/ExerciseFigure";
import { energyAfterWorkoutOptions, feelingOptions } from "@/data/content";
import { exerciseGuidance } from "@/data/exerciseGuidance";
import { homeEquipmentTips } from "@/data/homeEquipment";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import { useWorkoutPlayer } from "@/hooks/useWorkoutPlayer";
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
  } = useMiryaApp();
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
    return <Navigate to="/dashboard" replace />;
  }

  const introStep = planDay.workout.steps[0] ?? null;
  const currentStep = player.currentStep;
  const nextStep = planDay.workout.steps[player.currentIndex + 1] ?? null;
  const previewStep = player.stage === "rest" ? nextStep : currentStep;
  const previewGuidance = previewStep ? exerciseGuidance[previewStep.exerciseId] : null;
  const homeSupport = previewStep ? homeEquipmentTips[previewStep.exerciseId] : null;
  const remainingSteps = Math.max(
    planDay.workout.steps.length - player.currentIndex - 1,
    0
  );

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

      const shouldOpenPremium =
        data?.userAccess?.status === "free_trial" &&
        data.userAccess.freeSessionsUsed + 1 >= data.userAccess.freeSessionsLimit;

      navigate(shouldOpenPremium ? "/premium" : "/progress", { replace: true });
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
    <div className="page-enter space-y-5">
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
          <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
            {planDay.workout.steps.length} esercizi
          </span>
        </div>
      </section>

      {player.stage === "ready" && introStep ? (
        <>
          <section className="surface px-5 py-5">
            <div className="eyebrow">Pronta a partire</div>
            <h2 className="mt-3 text-[1.45rem] font-semibold leading-tight text-ink">
              {planDay.workout.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Iniziamo con <span className="font-semibold text-ink">{introStep.title}</span>.
              Poi il timer ti accompagna da solo tra esercizi e pause, senza altri passaggi.
            </p>
            {exerciseGuidance[introStep.exerciseId]?.practicalWhy ? (
              <p className="mt-3 text-sm leading-7 text-ink">
                {exerciseGuidance[introStep.exerciseId]?.practicalWhy}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
                {planDay.estimatedMinutes} minuti
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                focus: {planDay.focus}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted">
                {planDay.workout.steps.length} esercizi già pronti
              </span>
            </div>

            <div className="mt-5 rounded-[22px] bg-[rgba(255,255,255,0.82)] px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Sequenza essenziale
              </div>
              <div className="mt-3 space-y-3">
                {planDay.workout.steps.slice(0, 3).map((step, index) => (
                  <div key={step.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink">
                        {index + 1}. {step.title}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {exerciseGuidance[step.exerciseId]?.purpose ?? step.summary}
                      </p>
                    </div>
                    <div className="rounded-full bg-[rgba(246,250,249,0.92)] px-3 py-2 text-xs font-semibold text-muted">
                      {step.doseLabel}
                    </div>
                  </div>
                ))}
                {planDay.workout.steps.length > 3 ? (
                  <p className="text-sm leading-6 text-muted">
                    Poi il timer ti porta avanti in automatico fino alla fine della sessione.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <Button fullWidth onClick={handleStart} disabled={isStarting}>
                {isStarting ? "Avvio in corso..." : "Inizia ora"}
              </Button>
            </div>
          </section>

          <StepGuidanceCard
            step={introStep}
            eyebrow="Primo esercizio"
            title={introStep.title}
          />

          {localError ? (
            <div className="rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
              {localError}
            </div>
          ) : null}
        </>
      ) : null}

      {player.stage !== "ready" && player.stage !== "finished" && previewStep ? (
        <section className="surface timer-panel px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="eyebrow">
                {player.stage === "countdown"
                  ? "Tra pochissimo"
                  : player.stage === "rest"
                    ? "Tra poco"
                    : "Adesso"}
              </div>
              <div className="mt-2 text-xl font-semibold text-ink">
                {player.stage === "rest" ? nextStep?.title ?? "Ultimo passaggio" : previewStep.title}
              </div>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {Math.min(player.currentIndex + 1, player.totalSteps)}/{player.totalSteps}
            </div>
          </div>

          <div className="mt-5 timer-face">
            <div className="relative z-10 text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {player.stage === "countdown"
                  ? "Countdown"
                  : player.stage === "rest"
                    ? "Recupero"
                    : "Tempo attivo"}
              </div>
              <div className="mt-3 text-[4rem] font-semibold leading-none text-ink">
                {player.secondsLeft}
              </div>
              <div className="mt-4 max-w-[15rem] text-lg font-semibold text-ink">
                {player.stage === "countdown"
                  ? `Tra poco: ${previewStep.title}`
                  : player.stage === "rest"
                    ? nextStep
                      ? `Poi: ${nextStep.title}`
                      : "Chiudiamo la sessione"
                    : previewStep.title}
              </div>
              <p className="mt-2 max-w-[16rem] text-sm leading-6 text-muted">
                {player.stage === "rest"
                  ? "Respira, lascia scendere il ritmo e preparati al passaggio successivo."
                  : previewGuidance?.purpose ?? previewStep.summary}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[rgba(215,239,236,0.72)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#70c7c1_0%,#4ea49f_100%)] transition-all"
              style={{ width: `${Math.max(6, player.progressPercent)}%` }}
            />
          </div>

          <div className="mt-4 rounded-[22px] bg-[rgba(255,255,255,0.82)] px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Gesto del momento
            </div>
            <div className="mt-3">
              <ExerciseFigure exerciseId={previewStep.exerciseId} />
            </div>
            <div className="mt-4 grid gap-3">
              <div>
                <div className="text-sm font-semibold text-ink">Come metterti</div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {previewGuidance?.startingPosition ??
                    "Trova un assetto semplice e stabile prima di muoverti."}
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Come si fa</div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {previewGuidance?.movementCue ?? previewStep.summary}
                </p>
              </div>
              {previewGuidance?.practicalWhy ? (
                <div>
                  <div className="text-sm font-semibold text-ink">
                    Perché lo facciamo adesso
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {previewGuidance.practicalWhy}
                  </p>
                </div>
              ) : null}
              <div>
                <div className="text-sm font-semibold text-ink">Cosa sentire</div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {previewGuidance?.feelCue ??
                    `Dovresti sentire soprattutto ${previewStep.bodyArea.toLowerCase()}.`}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[rgba(246,250,249,0.92)] px-3 py-2 text-xs font-semibold text-muted">
                {previewStep.doseLabel}
              </span>
              {player.stage !== "rest" ? (
                <span className="rounded-full bg-[rgba(246,250,249,0.92)] px-3 py-2 text-xs font-semibold text-muted">
                  recupero {previewStep.restSeconds}s
                </span>
              ) : null}
            </div>
            {previewGuidance?.easierOption ?? previewStep.easierOption ? (
              <p className="mt-4 text-sm leading-6 text-muted">
                <span className="font-semibold text-ink">Versione più facile:</span>{" "}
                {previewGuidance?.easierOption ?? previewStep.easierOption}
              </p>
            ) : null}
            {homeSupport ? (
              <div className="mt-4 rounded-[18px] border border-[rgba(94,184,178,0.18)] bg-[rgba(241,252,251,0.92)] px-4 py-3">
                <div className="text-sm font-semibold text-ink">{homeSupport.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{homeSupport.body}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Idee semplici: {homeSupport.ideas.join(", ")}.
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={player.togglePause}
              className="justify-between"
            >
              <span>{player.isPaused ? "Riprendi" : "Pausa"}</span>
              {player.isPaused ? <Play size={18} /> : <Pause size={18} />}
            </Button>

            <Button
              variant="secondary"
              onClick={player.skipCurrent}
              className="justify-between"
            >
              <span>Salta</span>
              <SkipForward size={18} />
            </Button>
          </div>

          <p className="mt-3 text-center text-sm leading-6 text-muted">
            Restano {remainingSteps} esercizi dopo questo.
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
            Bastano pochi tocchi. Questo ci serve per tenere il percorso realistico e sempre più adatto a te.
          </p>

          <div className="mt-5">
            <div className="text-sm font-semibold text-ink">Com'è andata?</div>
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
              placeholder="Per esempio: un esercizio oggi era scomodo oppure la zona lombare si è affaticata presto."
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

const emptyWorkout: TrainingPlanDay["workout"] = {
  title: "",
  focus: "",
  estimatedMinutes: 0,
  coachNote: "",
  cautionNotes: [],
  steps: []
};
