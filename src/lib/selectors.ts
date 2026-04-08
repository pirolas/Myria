import {
  categoryMeta,
  consistencyMessages,
  feelingLabels,
  goalLabels,
  levelLabels
} from "@/data/content";
import { exercises, programs } from "@/data/workouts";
import { getWeekDays, toDateKey } from "@/lib/date";
import type {
  CategoryId,
  CompletedSession,
  Goal,
  Program,
  UserPreferences
} from "@/types/domain";

const goalToCategory: Record<Goal, CategoryId> = {
  glutei_gambe: "glutei_gambe",
  pancia_core: "core_pancia_profonda",
  postura: "postura",
  tonicita_generale: "total_body_leggero",
  ripartenza_dolce: "ripartenza_dolce"
};

export function getExerciseById(exerciseId: string) {
  return exercises.find((exercise) => exercise.id === exerciseId) ?? null;
}

export function getProgramById(programId: string) {
  return programs.find((program) => program.id === programId) ?? null;
}

export function getExercisesForProgram(program: Program) {
  return program.exerciseIds
    .map((exerciseId) => getExerciseById(exerciseId))
    .filter((exercise): exercise is NonNullable<typeof exercise> => exercise !== null);
}

export function getRecommendedProgram(preferences: UserPreferences | null) {
  if (!preferences) {
    return programs[0];
  }

  const preferredCategory = goalToCategory[preferences.goal];

  return (
    programs.find(
      (program) =>
        program.category === preferredCategory &&
        program.durationMinutes === preferences.preferredMinutes
    ) ??
    programs.find((program) => program.category === preferredCategory) ??
    programs.find((program) => program.durationMinutes === preferences.preferredMinutes) ??
    programs[0]
  );
}

export function getWeeklyMinutes(sessions: CompletedSession[]) {
  const weekKeys = new Set(getWeekDays().map((day) => day.key));
  return sessions.reduce((total, session) => {
    const key = toDateKey(new Date(session.completedAt));
    return weekKeys.has(key) ? total + session.durationMinutes : total;
  }, 0);
}

export function getUniqueSessionDays(sessions: CompletedSession[]) {
  return Array.from(
    new Set(sessions.map((session) => toDateKey(new Date(session.completedAt))))
  ).sort((left, right) => (left < right ? 1 : -1));
}

export function getStreakDays(sessions: CompletedSession[]) {
  const uniqueDays = getUniqueSessionDays(sessions);

  if (uniqueDays.length === 0) {
    return 0;
  }

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  const todayKey = toDateKey(cursor);
  const latestKey = uniqueDays[0];

  if (latestKey !== todayKey) {
    const yesterday = new Date(cursor);
    yesterday.setDate(yesterday.getDate() - 1);

    if (latestKey !== toDateKey(yesterday)) {
      return 0;
    }

    cursor = yesterday;
  }

  for (const dayKey of uniqueDays) {
    if (dayKey === toDateKey(cursor)) {
      streak += 1;
      const previousDay = new Date(cursor);
      previousDay.setDate(previousDay.getDate() - 1);
      cursor = previousDay;
      continue;
    }

    break;
  }

  return streak;
}

export function getWeeklyChart(sessions: CompletedSession[]) {
  const byDay = sessions.reduce<Record<string, number>>((accumulator, session) => {
    const dayKey = toDateKey(new Date(session.completedAt));
    accumulator[dayKey] = (accumulator[dayKey] ?? 0) + session.durationMinutes;
    return accumulator;
  }, {});

  return getWeekDays().map((day) => ({
    ...day,
    minutes: byDay[day.key] ?? 0
  }));
}

export function getProgressTone(sessionCount: number) {
  if (sessionCount >= 10) {
    return {
      title: "La tua routine è ormai presente",
      description: "Stai costruendo una base molto credibile e sostenibile."
    };
  }

  if (sessionCount >= 4) {
    return {
      title: "La costanza sta prendendo forma",
      description: "Il corpo risponde bene quando il ritmo resta semplice."
    };
  }

  if (sessionCount >= 1) {
    return {
      title: "Hai già iniziato a creare spazio per te",
      description: "Continua con sessioni brevi: la regolarità farà il resto."
    };
  }

  return {
    title: "Il tuo percorso parte da gesti piccoli",
    description: "Anche 10 minuti possono essere un ottimo primo passo."
  };
}

export function getFeelingSummary(sessions: CompletedSession[]) {
  if (sessions.length === 0) {
    return "Nessuna sensazione registrata";
  }

  const latest = [...sessions].sort((left, right) =>
    left.completedAt < right.completedAt ? 1 : -1
  )[0];

  return feelingLabels[latest.feeling];
}

export function getMotivationalMessage(sessions: CompletedSession[]) {
  return consistencyMessages[sessions.length % consistencyMessages.length];
}

export function getProfileSummary(preferences: UserPreferences | null) {
  if (!preferences) {
    return [];
  }

  return [
    {
      label: "Obiettivo attuale",
      value: goalLabels[preferences.goal]
    },
    {
      label: "Durata preferita",
      value: `${preferences.preferredMinutes} minuti`
    },
    {
      label: "Livello",
      value: levelLabels[preferences.level]
    },
    {
      label: "Approccio iniziale",
      value: preferences.gentleStart ? "Molto delicato" : "Delicato ma attivo"
    },
    {
      label: "Ritmo settimanale",
      value: `${preferences.daysPerWeek} giorni a settimana`
    }
  ];
}

export function getCategoryLabel(categoryId: CategoryId) {
  return categoryMeta[categoryId].title;
}

export function getProgramCompletionCount(
  sessions: CompletedSession[],
  programId: string
) {
  return sessions.filter((session) => session.programId === programId).length;
}

export function getPersonalPathCopy(preferences: UserPreferences | null) {
  if (!preferences) {
    return "Mirya ti propone un percorso breve e progressivo, pensato per farti iniziare con calma.";
  }

  const goal = goalLabels[preferences.goal].toLowerCase();
  const intro =
    preferences.gentleStart || preferences.level === "molto_fuori_allenamento"
      ? "con un inizio molto morbido"
      : "con un ritmo delicato ma attivo";

  return `Mirya ha costruito il tuo percorso su ${goal}, ${preferences.daysPerWeek} giorni a settimana e sessioni da ${preferences.preferredMinutes} minuti, ${intro}.`;
}

export function getPersonalExerciseNote(
  preferences: UserPreferences | null,
  exercise: { category: CategoryId }
) {
  if (!preferences) {
    return "Tieni il gesto semplice, regolare e senza fretta. La qualità del movimento viene prima della quantità.";
  }

  const gentleLine =
    preferences.gentleStart || preferences.level === "molto_fuori_allenamento"
      ? "Per te oggi conta soprattutto restare in un'ampiezza piccola e pulita."
      : "Per te oggi può essere utile cercare un gesto pieno ma sempre controllato.";

  const focusMatch =
    (preferences.goal === "glutei_gambe" && exercise.category === "glutei_gambe") ||
    (preferences.goal === "pancia_core" &&
      exercise.category === "core_pancia_profonda") ||
    (preferences.goal === "postura" && exercise.category === "postura") ||
    (preferences.goal === "tonicita_generale" &&
      exercise.category === "total_body_leggero") ||
    (preferences.goal === "ripartenza_dolce" &&
      exercise.category === "ripartenza_dolce");

  const focusLine = focusMatch
    ? "Questo esercizio e molto coerente con il focus che hai scelto in Mirya."
    : "Anche quando non è il focus principale, questo movimento aiuta a rendere il corpo più stabile e presente.";

  return `${gentleLine} ${focusLine}`;
}


