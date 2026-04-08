import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import type {
  AppState,
  Feeling,
  ProgressState,
  UserPreferences
} from "@/types/domain";

const STORAGE_KEY = "myria.app-state.v1";
const LEGACY_STORAGE_KEY = "lieve.app-state.v1";

const defaultProgress: ProgressState = {
  sessions: [],
  uncomfortableExerciseIds: []
};

const defaultState: AppState = {
  onboardingCompleted: false,
  preferences: null,
  progress: defaultProgress
};

interface AppStoreContextValue {
  state: AppState;
  savePreferences: (preferences: UserPreferences) => void;
  recordSession: (input: {
    programId: string;
    feeling: Feeling;
    durationMinutes: number;
  }) => void;
  toggleUncomfortableExercise: (exerciseId: string) => void;
}

const AppStoreContext = createContext<AppStoreContextValue | undefined>(undefined);

function readStoredState() {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const rawState =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!rawState) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<AppState>;

    return {
      onboardingCompleted: parsed.onboardingCompleted ?? false,
      preferences: parsed.preferences ?? null,
      progress: {
        sessions: parsed.progress?.sessions ?? [],
        uncomfortableExerciseIds: parsed.progress?.uncomfortableExerciseIds ?? []
      }
    } satisfies AppState;
  } catch {
    return defaultState;
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(readStoredState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const savePreferences = (preferences: UserPreferences) => {
    setState((currentState) => ({
      ...currentState,
      onboardingCompleted: true,
      preferences
    }));
  };

  const recordSession = ({
    programId,
    feeling,
    durationMinutes
  }: {
    programId: string;
    feeling: Feeling;
    durationMinutes: number;
  }) => {
    setState((currentState) => ({
      ...currentState,
      progress: {
        ...currentState.progress,
        sessions: [
          ...currentState.progress.sessions,
          {
            id: crypto.randomUUID(),
            programId,
            completedAt: new Date().toISOString(),
            feeling,
            durationMinutes
          }
        ]
      }
    }));
  };

  const toggleUncomfortableExercise = (exerciseId: string) => {
    setState((currentState) => {
      const alreadySelected =
        currentState.progress.uncomfortableExerciseIds.includes(exerciseId);

      return {
        ...currentState,
        progress: {
          ...currentState.progress,
          uncomfortableExerciseIds: alreadySelected
            ? currentState.progress.uncomfortableExerciseIds.filter(
                (item) => item !== exerciseId
              )
            : [...currentState.progress.uncomfortableExerciseIds, exerciseId]
        }
      };
    });
  };

  return (
    <AppStoreContext.Provider
      value={{
        state,
        savePreferences,
        recordSession,
        toggleUncomfortableExercise
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error("useAppStore deve essere usato dentro AppStoreProvider");
  }

  return context;
}
