import type {
  BetaOnboardingInput,
  FocusArea,
  Goal,
  PrimaryBodyGoal,
  SecondaryObjective
} from "@/types/domain";

const secondaryObjectiveFocusMap: Record<SecondaryObjective, FocusArea[]> = {
  glutei_piu_sodi: ["glutei"],
  gambe_piu_toniche: ["gambe"],
  addome_piu_stabile: ["addome_core"],
  postura_migliore: ["postura"],
  piu_energia: ["total_body"],
  meno_flaccidita: ["total_body"],
  piu_forza: ["total_body"],
  maggiore_costanza: ["total_body"],
  ridurre_rigidita: ["postura"],
  migliorare_mobilita: ["postura", "total_body"]
};

const primaryBodyGoalFocusFallback: Record<PrimaryBodyGoal, FocusArea[]> = {
  dimagrire: ["total_body"],
  massa_muscolare: ["total_body"],
  tonicita_rassodare: ["glutei", "gambe"],
  aumentare_peso_sano: ["total_body"],
  ricomposizione_corporea: ["total_body"]
};

function uniqueFocusAreas(values: FocusArea[]) {
  return Array.from(new Set(values));
}

export function deriveFocusAreasFromObjectives(
  secondaryObjectives: SecondaryObjective[],
  primaryBodyGoal: PrimaryBodyGoal
): FocusArea[] {
  const derived = uniqueFocusAreas(
    secondaryObjectives.flatMap((objective) => secondaryObjectiveFocusMap[objective] ?? [])
  );

  if (derived.length > 0) {
    return derived;
  }

  return primaryBodyGoalFocusFallback[primaryBodyGoal];
}

export function derivePlanGoalsFromFocusAreas(focusAreas: FocusArea[]): {
  primaryGoal: Goal;
  secondaryGoals: Goal[];
  focusPreference: Goal;
} {
  const goals = new Set<Goal>();

  if (focusAreas.includes("glutei") || focusAreas.includes("gambe")) {
    goals.add("glutei_gambe");
  }
  if (focusAreas.includes("addome_core")) {
    goals.add("pancia_core");
  }
  if (focusAreas.includes("postura")) {
    goals.add("postura");
  }
  if (focusAreas.includes("braccia") || focusAreas.includes("total_body")) {
    goals.add("tonicita_generale");
  }

  const derivedGoals = Array.from(goals);
  const primaryGoal = derivedGoals[0] ?? "tonicita_generale";

  return {
    primaryGoal,
    secondaryGoals: derivedGoals.length > 0 ? derivedGoals : [primaryGoal],
    focusPreference: primaryGoal
  };
}

export function normalizeOnboardingInput(input: BetaOnboardingInput): BetaOnboardingInput {
  const focusAreas = deriveFocusAreasFromObjectives(
    input.secondaryObjectives,
    input.primaryBodyGoal
  );
  const derivedGoals = derivePlanGoalsFromFocusAreas(focusAreas);

  return {
    ...input,
    focusAreas,
    primaryGoal: input.primaryGoal ?? derivedGoals.primaryGoal,
    secondaryGoals:
      input.secondaryGoals && input.secondaryGoals.length > 0
        ? input.secondaryGoals
        : derivedGoals.secondaryGoals,
    focusPreference: input.focusPreference ?? derivedGoals.focusPreference
  };
}
