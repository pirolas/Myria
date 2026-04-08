import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { buildProgressSnapshot } from "@/lib/mirya";
import { useAuth } from "@/hooks/useAuth";
import {
  completeWorkoutSession,
  ensureUserRecords,
  loadDashboardModel,
  saveDeepProfile,
  saveOnboarding,
  saveReassessment,
  startWorkoutSession,
  upgradeToPremiumAccess,
  updateTimerSound
} from "@/services/app";
import { generatePersonalizedPlan } from "@/services/planner";
import type {
  BetaOnboardingInput,
  DashboardModel,
  DeepProfileInput,
  PlannerTrigger,
  ReassessmentInput,
  TrainingPlanDay,
  WorkoutFeedbackInput
} from "@/types/domain";

type MiryaStatus = "idle" | "loading" | "ready" | "saving" | "error";

interface MiryaAppContextValue {
  status: MiryaStatus;
  data: DashboardModel | null;
  error: string | null;
  progress: ReturnType<typeof buildProgressSnapshot>;
  refresh: () => Promise<void>;
  recoverInitialPlan: () => Promise<void>;
  completeOnboarding: (input: BetaOnboardingInput) => Promise<void>;
  saveDeepProfileAnswers: (input: DeepProfileInput) => Promise<void>;
  saveProfileRefinement: (
    onboardingInput: BetaOnboardingInput,
    deepInput: DeepProfileInput
  ) => Promise<void>;
  submitReassessment: (input: ReassessmentInput) => Promise<void>;
  regeneratePlan: (trigger?: PlannerTrigger) => Promise<void>;
  activatePremium: () => Promise<void>;
  setTimerSoundEnabled: (enabled: boolean) => Promise<void>;
  startSession: (planDay: TrainingPlanDay) => Promise<string>;
  completeSession: (
    sessionId: string,
    planDay: TrainingPlanDay,
    feedback: WorkoutFeedbackInput
  ) => Promise<void>;
}

const MiryaAppContext = createContext<MiryaAppContextValue | undefined>(undefined);

export function MiryaAppProvider({ children }: { children: ReactNode }) {
  const { status: authStatus, session, user } = useAuth();
  const [status, setStatus] = useState<MiryaStatus>("idle");
  const [data, setData] = useState<DashboardModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setData(null);
      setStatus("idle");
      return;
    }

    setStatus((current) => (current === "saving" ? current : "loading"));
    setError(null);

    try {
      await ensureUserRecords(user);
      const nextData = await loadDashboardModel(user.id);

      setData(nextData);
      setStatus("ready");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Non siamo riusciti a caricare il tuo percorso."
      );
      setStatus("error");
    }
  }, [user]);

  useEffect(() => {
    if (authStatus === "signed_in" && user) {
      void refresh();
      return;
    }

    if (authStatus === "signed_out" || authStatus === "missing_config") {
      setData(null);
      setStatus("idle");
      setError(null);
    }
  }, [authStatus, refresh, user]);

  const value = useMemo<MiryaAppContextValue>(
    () => ({
      status,
      data,
      error,
      progress: buildProgressSnapshot(data),
      async refresh() {
        await refresh();
      },
      async recoverInitialPlan() {
        if (!user) {
          throw new Error("Devi accedere per completare la generazione del piano.");
        }

        if (!data?.onboarding) {
          throw new Error("Completa prima l'onboarding per generare il piano.");
        }

        setStatus("saving");
        setError(null);

        try {
          await generatePersonalizedPlan(
            "onboarding_completed",
            session?.access_token ?? null
          );
          await refresh();
        } catch (plannerError) {
          setError(
            plannerError instanceof Error
              ? plannerError.message
              : "Non siamo riusciti a completare il primo piano."
          );
          setStatus("error");
          throw plannerError;
        }
      },
      async completeOnboarding(input) {
        if (!user) {
          throw new Error("Devi accedere per completare l'onboarding.");
        }

        setStatus("saving");
        setError(null);

        try {
          await saveOnboarding(user.id, input);
          await generatePersonalizedPlan(
            "onboarding_completed",
            session?.access_token ?? null
          );
          await refresh();
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Non siamo riusciti a creare il tuo percorso."
          );
          setStatus("error");
          throw submitError;
        }
      },
      async saveDeepProfileAnswers(input) {
        if (!user) {
          throw new Error("Devi accedere per completare il profilo.");
        }

        setStatus("saving");
        setError(null);

        try {
          await saveDeepProfile(user.id, input);
          if (data?.userAccess?.canUsePremiumFeatures) {
            await generatePersonalizedPlan(
              "deep_profile_completed",
              session?.access_token ?? null
            );
          }
          await refresh();
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Non siamo riusciti a salvare queste informazioni."
          );
          setStatus("error");
          throw submitError;
        }
      },
      async saveProfileRefinement(onboardingInput, deepInput) {
        if (!user) {
          throw new Error("Devi accedere per aggiornare il profilo.");
        }

        setStatus("saving");
        setError(null);

        try {
          await Promise.all([
            saveOnboarding(user.id, onboardingInput),
            saveDeepProfile(user.id, deepInput)
          ]);
          if (data?.userAccess?.canUsePremiumFeatures) {
            await generatePersonalizedPlan(
              "deep_profile_completed",
              session?.access_token ?? null
            );
          }
          await refresh();
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Non siamo riusciti a rendere il piano più preciso."
          );
          setStatus("error");
          throw submitError;
        }
      },
      async submitReassessment(input) {
        if (!user) {
          throw new Error("Devi accedere per inviare la rivalutazione.");
        }
        if (!data?.userAccess?.canUsePremiumFeatures) {
          throw new Error("Le rivalutazioni guidate fanno parte di Premium.");
        }

        setStatus("saving");
        setError(null);

        try {
          await saveReassessment(user.id, input);
          await generatePersonalizedPlan(
            "reassessment_completed",
            session?.access_token ?? null
          );
          await refresh();
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Non siamo riusciti ad aggiornare il percorso."
          );
          setStatus("error");
          throw submitError;
        }
      },
      async regeneratePlan(trigger = "weekly_refresh") {
        if (!user) {
          throw new Error("Devi accedere per aggiornare il percorso.");
        }
        if (!data?.userAccess?.canUsePremiumFeatures) {
          throw new Error(
            "L'aggiornamento del percorso nel tempo e disponibile in Premium."
          );
        }

        setStatus("saving");
        setError(null);

        try {
          await generatePersonalizedPlan(trigger, session?.access_token ?? null);
          await refresh();
        } catch (plannerError) {
          setError(
            plannerError instanceof Error
              ? plannerError.message
              : "Non siamo riusciti ad aggiornare il piano."
          );
          setStatus("error");
          throw plannerError;
        }
      },
      async activatePremium() {
        if (!user) {
          throw new Error("Devi accedere per attivare Premium.");
        }

        setStatus("saving");
        setError(null);

        try {
          await upgradeToPremiumAccess(user.id);
          await refresh();
        } catch (upgradeError) {
          setError(
            upgradeError instanceof Error
              ? upgradeError.message
              : "Non siamo riusciti ad attivare Premium."
          );
          setStatus("error");
          throw upgradeError;
        }
      },
      async setTimerSoundEnabled(enabled) {
        if (!user) {
          throw new Error("Devi accedere per aggiornare le preferenze.");
        }

        setData((current) =>
          current
            ? {
                ...current,
                preferences: current.preferences
                  ? {
                      ...current.preferences,
                      timerSoundEnabled: enabled
                    }
                  : null
              }
            : current
        );

        try {
          await updateTimerSound(user.id, enabled);
        } catch (toggleError) {
          setError(
            toggleError instanceof Error
              ? toggleError.message
              : "Non siamo riusciti a salvare questa preferenza."
          );
          await refresh();
          throw toggleError;
        }
      },
      async startSession(planDay) {
        if (!user) {
          throw new Error("Devi accedere per iniziare la sessione.");
        }

        return startWorkoutSession(user.id, planDay);
      },
      async completeSession(sessionId, planDay, feedback) {
        if (!user) {
          throw new Error("Devi accedere per salvare la sessione.");
        }

        setStatus("saving");
        setError(null);

        try {
          await completeWorkoutSession(user.id, sessionId, planDay, feedback);
          if (data?.userAccess?.canUsePremiumFeatures) {
            await generatePersonalizedPlan(
              "post_workout_feedback",
              session?.access_token ?? null
            );
          }
          await refresh();
        } catch (sessionError) {
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : "Non siamo riusciti a salvare il workout."
          );
          setStatus("error");
          throw sessionError;
        }
      }
    }),
    [data, error, refresh, session, status, user]
  );

  return (
    <MiryaAppContext.Provider value={value}>{children}</MiryaAppContext.Provider>
  );
}

export function useMiryaApp() {
  const context = useContext(MiryaAppContext);

  if (!context) {
    throw new Error("useMiryaApp deve essere usato dentro MiryaAppProvider.");
  }

  return context;
}

