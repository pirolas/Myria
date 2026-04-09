import { useEffect, useMemo, useState } from "react";
import { playSoftTimerTone } from "@/lib/audio";
import type { PlannedWorkout } from "@/types/domain";

type PlayerStage = "ready" | "countdown" | "exercise" | "rest" | "finished";

const COUNTDOWN_SECONDS = 5;

export function useWorkoutPlayer(workout: PlannedWorkout, soundEnabled: boolean) {
  const [stage, setStage] = useState<PlayerStage>("ready");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [skippedExerciseIds, setSkippedExerciseIds] = useState<string[]>([]);

  const currentStep = workout.steps[currentIndex] ?? null;
  const totalSteps = workout.steps.length;

  useEffect(() => {
    if (stage === "ready" || stage === "finished" || isPaused || secondsLeft <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isPaused, secondsLeft, stage]);

  useEffect(() => {
    if (!soundEnabled || isPaused || stage === "ready" || stage === "finished") {
      return;
    }

    if (
      (stage === "countdown" && secondsLeft > 0 && secondsLeft <= 4) ||
      (stage !== "countdown" && secondsLeft > 0 && secondsLeft <= 3)
    ) {
      void playSoftTimerTone("tick");
    }
  }, [isPaused, secondsLeft, soundEnabled, stage]);

  useEffect(() => {
    if (stage === "ready" || stage === "finished" || isPaused || secondsLeft > 0) {
      return;
    }

    if (soundEnabled) {
      void playSoftTimerTone("transition");
    }

    if (stage === "countdown") {
      if (workout.steps.length === 0) {
        setStage("finished");
        return;
      }

      setCurrentIndex(0);
      setStage("exercise");
      setSecondsLeft(workout.steps[0]?.durationSeconds ?? 0);
      return;
    }

    if (stage === "exercise") {
      const finishedStep = workout.steps[currentIndex];

      if (finishedStep) {
        setCompletedExerciseIds((current) =>
          current.includes(finishedStep.exerciseId)
            ? current
            : [...current, finishedStep.exerciseId]
        );
      }

      if ((currentStep?.restSeconds ?? 0) > 0) {
        setStage("rest");
        setSecondsLeft(currentStep?.restSeconds ?? 0);
        return;
      }
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= workout.steps.length) {
      setStage("finished");
      setIsPaused(false);
      setSecondsLeft(0);
      return;
    }

    setCurrentIndex(nextIndex);
    setStage("exercise");
    setIsPaused(false);
    setSecondsLeft(workout.steps[nextIndex]?.durationSeconds ?? 0);
  }, [currentIndex, currentStep, isPaused, secondsLeft, soundEnabled, stage, workout]);

  const progressPercent = useMemo(() => {
    if (totalSteps === 0) {
      return 0;
    }

    return Math.round(((currentIndex + (stage === "finished" ? 1 : 0)) / totalSteps) * 100);
  }, [currentIndex, stage, totalSteps]);

  return {
    stage,
    currentIndex,
    currentStep,
    secondsLeft,
    isPaused,
    completedExerciseIds,
    skippedExerciseIds,
    progressPercent,
    totalSteps,
    start() {
      if (workout.steps.length === 0) {
        setStage("finished");
        setSecondsLeft(0);
        return;
      }

      setCurrentIndex(0);
      setSecondsLeft(COUNTDOWN_SECONDS);
      setIsPaused(false);
      setCompletedExerciseIds([]);
      setSkippedExerciseIds([]);
      setStage("countdown");
    },
    togglePause() {
      setIsPaused((current) => !current);
    },
    skipCurrent() {
      const step = workout.steps[currentIndex];

      if (step) {
        setSkippedExerciseIds((current) =>
          current.includes(step.exerciseId) ? current : [...current, step.exerciseId]
        );
      }

      const nextIndex = currentIndex + 1;

      if (nextIndex >= workout.steps.length) {
        setStage("finished");
        setIsPaused(false);
        setSecondsLeft(0);
        return;
      }

      setCurrentIndex(nextIndex);
      setStage("exercise");
      setIsPaused(false);
      setSecondsLeft(workout.steps[nextIndex]?.durationSeconds ?? 0);
    },
    reset() {
      setStage("ready");
      setCurrentIndex(0);
      setSecondsLeft(COUNTDOWN_SECONDS);
      setIsPaused(false);
      setCompletedExerciseIds([]);
      setSkippedExerciseIds([]);
    }
  };
}
