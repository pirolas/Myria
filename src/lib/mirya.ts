import { getWeekDays, toDateKey } from "@/lib/date";
import { goalLabels, horizonMessages } from "@/data/content";
import type {
  ActiveTrainingPlan,
  DashboardModel,
  Goal,
  ProgressSnapshot,
  UserAccessRecord,
  WorkoutSessionRecord
} from "@/types/domain";

export function getUniqueActiveDays(sessions: WorkoutSessionRecord[]) {
  return Array.from(
    new Set(
      sessions
        .filter((session) => session.completedAt)
        .map((session) => toDateKey(new Date(session.completedAt ?? session.startedAt)))
    )
  ).sort((left, right) => (left < right ? 1 : -1));
}

export function getStreakDaysFromRecords(sessions: WorkoutSessionRecord[]) {
  const uniqueDays = getUniqueActiveDays(sessions);

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
    if (dayKey !== toDateKey(cursor)) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getWeeklyMinutesFromRecords(sessions: WorkoutSessionRecord[]) {
  const weekKeys = new Set(getWeekDays().map((day) => day.key));

  return sessions.reduce((total, session) => {
    if (!session.completedAt) {
      return total;
    }

    const key = toDateKey(new Date(session.completedAt));
    return weekKeys.has(key) ? total + session.durationMinutes : total;
  }, 0);
}

export function getWeeklyCompletedSessions(sessions: WorkoutSessionRecord[]) {
  const weekKeys = new Set(getWeekDays().map((day) => day.key));

  return sessions.filter((session) => {
    if (!session.completedAt) {
      return false;
    }

    return weekKeys.has(toDateKey(new Date(session.completedAt)));
  }).length;
}

export function buildProgressSnapshot(
  model: DashboardModel | null
): ProgressSnapshot {
  if (!model) {
    return {
      completedWorkouts: 0,
      totalMinutes: 0,
      activeDays: 0,
      streakDays: 0,
      weeklyMinutes: 0,
      weeklyGoalMinutes: 0,
      weeklyGoalSessions: 0,
      recentFeelings: [],
      uncomfortableExerciseIds: []
    };
  }

  const completedSessions = model.sessions.filter(
    (session) => session.status === "completed"
  );

  return {
    completedWorkouts: completedSessions.length,
    totalMinutes: completedSessions.reduce(
      (total, session) => total + session.durationMinutes,
      0
    ),
    activeDays: getUniqueActiveDays(completedSessions).length,
    streakDays: getStreakDaysFromRecords(completedSessions),
    weeklyMinutes: getWeeklyMinutesFromRecords(completedSessions),
    weeklyGoalMinutes: model.activePlan?.weeklyGoalMinutes ?? 0,
    weeklyGoalSessions: model.activePlan?.weeklyGoalSessions ?? 0,
    recentFeelings: completedSessions
      .map((session) => session.feeling)
      .filter((feeling): feeling is NonNullable<typeof feeling> => Boolean(feeling))
      .slice(0, 6),
    uncomfortableExerciseIds: model.uncomfortableExerciseIds
  };
}

export function getWeeklyBars(sessions: WorkoutSessionRecord[]) {
  const byDay = sessions.reduce<Record<string, number>>((accumulator, session) => {
    if (!session.completedAt) {
      return accumulator;
    }

    const dayKey = toDateKey(new Date(session.completedAt));
    accumulator[dayKey] = (accumulator[dayKey] ?? 0) + session.durationMinutes;
    return accumulator;
  }, {});

  return getWeekDays().map((day) => ({
    ...day,
    minutes: byDay[day.key] ?? 0
  }));
}

export function getPlanHorizonCopy(plan: ActiveTrainingPlan | null) {
  if (!plan) {
    return horizonMessages[0];
  }

  if (plan.currentWeek <= 2) {
    return horizonMessages[0];
  }

  if (plan.currentWeek <= 4) {
    return horizonMessages[1];
  }

  return horizonMessages[2];
}

export function getNextObjective(plan: ActiveTrainingPlan | null) {
  if (!plan) {
    return "Completa la prima sessione per dare una base reale al percorso.";
  }

  if (plan.currentWeek <= 2) {
    return "Rendere il gesto più stabile e far diventare il ritmo familiare.";
  }

  if (plan.currentWeek <= 4) {
    return "Consolidare tono e continuità senza alzare troppo la richiesta.";
  }

  return "Portare il lavoro verso una tonicità più piena, mantenendo la qualità.";
}

export function getGoalLabel(goal: Goal) {
  return goalLabels[goal];
}

export function getLatestFeelingLabel(sessions: WorkoutSessionRecord[]) {
  const latest = sessions.find((session) => session.feeling);
  return latest?.feeling ?? null;
}

export function getTrialStatusCopy(access: UserAccessRecord | null) {
  if (!access) {
    return "Stiamo preparando il tuo accesso iniziale.";
  }

  if (access.status === "premium") {
    return "Premium attivo: il percorso può continuare ad adattarsi a te nel tempo.";
  }

  if (access.status === "free_locked") {
    return "Il primo ciclo guidato si è concluso. Per continuare con un percorso che si aggiorna davvero, serve Premium.";
  }

  return `Hai ancora ${access.trialRemainingSessions} sessioni oppure ${access.trialRemainingDays} giorni per usare il primo ciclo guidato.`;
}

export function shouldShowPremiumGate(access: UserAccessRecord | null) {
  return access?.status === "free_locked";
}


