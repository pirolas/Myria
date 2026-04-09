import {
  focusAreaLabels,
  goalLabels,
  lifestyleLabels,
  primaryBodyGoalLabels,
  sleepQualityLabels,
  stressLabels,
  timePreferenceLabels,
  weeklyAvailabilityLabels
} from "@/data/content";
import type {
  ComputedBodyGoal,
  FocusArea,
  Goal,
  LifestyleType,
  PrimaryBodyGoal,
  SleepQuality,
  StressLevel,
  TimePreference,
  WeeklyAvailability
} from "@/types/domain";

const computedBodyGoalLabels: Record<ComputedBodyGoal, string> = {
  fat_loss: "riduzione graduale del peso",
  muscle_gain: "aumento della massa muscolare",
  toning: "tonificazione",
  recomposition: "ricomposizione corporea",
  tone_rebuild_for_lean_body: "ricostruzione del tono in un corpo già asciutto"
};

const inlineTokenLabels: Record<string, string> = {
  glutei_gambe: "glutei e gambe",
  pancia_core: "addome profondo e stabilità",
  addome_core: "addome profondo e stabilità",
  postura: "postura",
  tonicita_generale: "tonificazione generale",
  total_body: "tonificazione generale",
  total_body_leggero: "tonificazione generale",
  ripartenza_dolce: "ripartenza dolce",
  dimagrire: "dimagrire",
  massa_muscolare: "aumentare la massa muscolare",
  tonicita_rassodare: "aumentare tonicità e rassodare",
  aumentare_peso_sano: "aumentare di peso in modo sano",
  ricomposizione_corporea: "ricomposizione corporea",
  tone_rebuild_for_lean_body: "ricostruzione del tono in un corpo già asciutto",
  fat_loss: "riduzione graduale del peso",
  muscle_gain: "aumento della massa muscolare",
  toning: "tonificazione",
  recomposition: "ricomposizione corporea",
  molto_fuori_allenamento: "molto fuori allenamento",
  principiante: "principiante",
  intermedio_leggero: "intermedio leggero",
  abbastanza_allenata: "abbastanza allenata",
  molto_sedentaria: "molto sedentaria",
  abbastanza_attiva: "abbastanza attiva",
  molto_in_movimento: "molto in movimento",
  molto_bassa: "molto bassa",
  medio_alto: "medio-alto",
  abbastanza_buona: "abbastanza buona",
  alcuni_spazi: "alcuni spazi",
  piu_tonificante: "più tonificante",
  piu_posturale: "più posturale",
  piu_dolce: "più dolce",
  piu_energizzante: "più energizzante"
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatGoalLabelValue(value: Goal | string | null | undefined) {
  if (!value) return "";
  if (value in goalLabels) {
    return goalLabels[value as Goal];
  }
  return humanizePlannerText(value);
}

export function formatFocusAreaLabelValue(value: FocusArea | string | null | undefined) {
  if (!value) return "";
  if (value in focusAreaLabels) {
    return focusAreaLabels[value as FocusArea];
  }
  return humanizePlannerText(value);
}

export function formatPrimaryBodyGoalLabelValue(
  value: PrimaryBodyGoal | string | null | undefined
) {
  if (!value) return "";
  if (value in primaryBodyGoalLabels) {
    return primaryBodyGoalLabels[value as PrimaryBodyGoal];
  }
  return humanizePlannerText(value);
}

export function formatComputedBodyGoalLabelValue(
  value: ComputedBodyGoal | string | null | undefined
) {
  if (!value) return "";
  if (value in computedBodyGoalLabels) {
    return computedBodyGoalLabels[value as ComputedBodyGoal];
  }
  return humanizePlannerText(value);
}

export function formatWeeklyAvailabilityLabelValue(
  value: WeeklyAvailability | string | null | undefined
) {
  if (!value) return "";
  if (value in weeklyAvailabilityLabels) {
    return weeklyAvailabilityLabels[value as WeeklyAvailability];
  }
  return humanizePlannerText(value);
}

export function formatLifestyleLabelValue(value: LifestyleType | string | null | undefined) {
  if (!value) return "";
  if (value in lifestyleLabels) {
    return lifestyleLabels[value as LifestyleType];
  }
  return humanizePlannerText(value);
}

export function formatTimePreferenceLabelValue(
  value: TimePreference | string | null | undefined
) {
  if (!value) return "";
  if (value in timePreferenceLabels) {
    return timePreferenceLabels[value as TimePreference];
  }
  return humanizePlannerText(value);
}

export function formatSleepQualityLabelValue(
  value: SleepQuality | string | null | undefined
) {
  if (!value) return "";
  if (value in sleepQualityLabels) {
    return sleepQualityLabels[value as SleepQuality];
  }
  return humanizePlannerText(value);
}

export function formatStressLabelValue(value: StressLevel | string | null | undefined) {
  if (!value) return "";
  if (value in stressLabels) {
    return stressLabels[value as StressLevel];
  }
  return humanizePlannerText(value);
}

export function formatNaturalList(values: Array<string | null | undefined>) {
  const readable = values
    .map((item) => humanizePlannerText(item ?? ""))
    .map((item) => item.trim())
    .filter(Boolean);

  if (readable.length <= 1) {
    return readable[0] ?? "";
  }

  if (readable.length === 2) {
    return `${readable[0]} e ${readable[1]}`;
  }

  return `${readable.slice(0, -1).join(", ")} e ${readable[readable.length - 1]}`;
}

export function humanizePlannerText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  let next = value;

  Object.entries(inlineTokenLabels).forEach(([token, label]) => {
    next = next.replace(new RegExp(`\\b${escapeRegExp(token)}\\b`, "gi"), label);
  });

  return next
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b([a-zA-ZÀ-ÿ]+)\s*\/\s*([a-zA-ZÀ-ÿ]+)/g, "$1 e $2")
    .trim();
}
