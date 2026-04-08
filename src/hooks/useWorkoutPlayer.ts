import { useEffect, useMemo, useState } from "react";
import { playSoftTimerTone } from "@/lib/audio";
import type { PlannedWorkout } from "@/types/domain";

type PlayerStage = "ready" | "countdown" | "exercise" | "rest" | "finished";

export function useWorkoutPlayer(workout: PlannedWorkout, soundEnabled: boolean) {
  const [stage, setStage] = useState<PlayerStage>("ready");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [skippedExerciseIds, setSkippedExerciseIds] = useState<string[]>([]);

  const currentStep = workout.steps[currentIndex] ?? null;
  const totalSteps = workout.steps.length;

  useEffect(() => {
    if (stage === "ready" || stage === "finished" || isPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsLeft((value) => {
        if (value > 1) {
          if (soundEnabled && value <= 4) {
            void playSoftTimerTone("tick");
          }

          return value - 1;
        }

        if (soundEnabled) {
          void playSoftTimerTone("transition");
        }

        if (stage === "countdown") {
          return transitionToExercise(0, setCurrentIndex, setStage, workout);
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

          if (currentStep?.restSeconds) {
            setStage("rest");
            return currentStep.restSeconds;
          }

          return advanceStep(
            currentIndex,
            workout,
            setCurrentIndex,
            setStage,
            setIsPaused
          );
        }

        return advanceStep(
          currentIndex,
          workout,
          setCurrentIndex,
          setStage,
          setIsPaused
        );
      });
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [currentIndex, currentStep, isPaused, soundEnabled, stage, workout]);

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
        return;
      }

      setCurrentIndex(0);
      setSecondsLeft(5);
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

      setIsPaused(false);
      setSecondsLeft(
        advanceStep(currentIndex, workout, setCurrentIndex, setStage, setIsPaused)
      );
    },
    reset() {
      setStage("ready");
      setCurrentIndex(0);
      setSecondsLeft(5);
      setIsPaused(false);
      setCompletedExerciseIds([]);
      setSkippedExerciseIds([]);
    }
  };
}

function transitionToExercise(
  nextIndex: number,
  setCurrentIndex: (value: number) => void,
  setStage: (value: PlayerStage) => void,
  workout: PlannedWorkout
) {
  setCurrentIndex(nextIndex);
  setStage("exercise");
  return workout.steps[nextIndex]?.durationSeconds ?? 0;
}

function advanceStep(
  currentIndex: number,
  workout: PlannedWorkout,
  setCurrentIndex: (value: number) => void,
  setStage: (value: PlayerStage) => void,
  setIsPaused: (value: boolean) => void
) {
  const nextIndex = currentIndex + 1;

  if (nextIndex >= workout.steps.length) {
    setStage("finished");
    setIsPaused(false);
    return 0;
  }

  setCurrentIndex(nextIndex);
  setStage("exercise");
  setIsPaused(false);
  return workout.steps[nextIndex]?.durationSeconds ?? 0;
}
