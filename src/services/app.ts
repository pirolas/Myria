import type { User } from "@supabase/supabase-js";
import { requireSupabaseClient } from "@/lib/supabase";
import { toDateKey } from "@/lib/date";
import type {
  ActiveTrainingPlan,
  BetaOnboardingInput,
  DashboardModel,
  NotificationPreferenceRecord,
  PlannedWorkout,
  PlanDayStatus,
  ProfileRecord,
  TrainingPlanDay,
  UserMilestone,
  UserOnboardingRecord,
  UserPreferenceRecord,
  WorkoutFeedbackInput,
  WorkoutSessionRecord
} from "@/types/domain";
import type { Database, Json } from "@/types/supabase";

type PlanRow = Database["public"]["Tables"]["training_plans"]["Row"];
type PlanDayRow = Database["public"]["Tables"]["training_plan_days"]["Row"];
type SessionRow = Database["public"]["Tables"]["workout_sessions"]["Row"];

const milestoneDefinitions = [
  {
    threshold: 1,
    code: "first_session",
    title: "Primo passo",
    description: "Hai completato il tuo primo workout guidato."
  },
  {
    threshold: 3,
    code: "three_sessions",
    title: "Ritmo iniziale",
    description: "Hai dato continuita ai primi giorni del percorso."
  },
  {
    threshold: 6,
    code: "six_sessions",
    title: "Base costruita",
    description: "La routine sta iniziando ad appoggiarsi su basi reali."
  },
  {
    threshold: 12,
    code: "twelve_sessions",
    title: "Tono in consolidamento",
    description: "Stai trasformando la costanza in un gesto naturale."
  }
] as const;

export async function ensureUserRecords(user: User) {
  const client = requireSupabaseClient();

  await Promise.all([
    client.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name:
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : null
      },
      { onConflict: "id" }
    ),
    client.from("user_preferences").upsert(
      {
        user_id: user.id,
        timer_sound_enabled: true,
        reminders_enabled: true
      },
      { onConflict: "user_id" }
    ),
    client.from("notification_preferences").upsert(
      {
        user_id: user.id,
        reminders_enabled: true,
        weekly_summary_enabled: true
      },
      { onConflict: "user_id" }
    )
  ]);
}

export async function loadDashboardModel(userId: string): Promise<DashboardModel> {
  const client = requireSupabaseClient();

  const [
    profileResult,
    onboardingResult,
    preferencesResult,
    notificationsResult,
    activePlanResult,
    sessionsResult,
    milestonesResult
  ] = await Promise.all([
    client.from("profiles").select("*").eq("id", userId).maybeSingle(),
    client.from("user_onboarding").select("*").eq("user_id", userId).maybeSingle(),
    client.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
    client
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    client
      .from("training_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    client
      .from("workout_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(60),
    client
      .from("user_milestones")
      .select("*")
      .eq("user_id", userId)
      .order("achieved_at", { ascending: false })
      .limit(8)
  ]);

  throwIfSupabaseError(profileResult.error);
  throwIfSupabaseError(onboardingResult.error);
  throwIfSupabaseError(preferencesResult.error);
  throwIfSupabaseError(notificationsResult.error);
  throwIfSupabaseError(activePlanResult.error);
  throwIfSupabaseError(sessionsResult.error);
  throwIfSupabaseError(milestonesResult.error);

  const activePlanRow = activePlanResult.data;
  const planDaysResult = activePlanRow
    ? await client
        .from("training_plan_days")
        .select("*")
        .eq("plan_id", activePlanRow.id)
        .order("day_index", { ascending: true })
    : { data: [], error: null };

  throwIfSupabaseError(planDaysResult.error);

  const profile = mapProfile(profileResult.data);
  const onboarding = mapOnboarding(onboardingResult.data);
  const preferences = mapPreferences(preferencesResult.data);
  const notifications = mapNotificationPreferences(notificationsResult.data);
  const activePlan = mapPlan(activePlanRow);
  const weekPlan = (planDaysResult.data ?? []).map(mapPlanDay);
  const todayPlanDay = resolveTodayPlanDay(weekPlan);
  const sessions = (sessionsResult.data ?? []).map(mapSession);
  const milestones = (milestonesResult.data ?? []).map(mapMilestone);
  const uncomfortableExerciseIds = Array.from(
    new Set(
      sessions.flatMap((session) => {
        const ids = session.sessionSummary?.uncomfortableExerciseIds;
        return Array.isArray(ids)
          ? ids.filter((value): value is string => typeof value === "string")
          : [];
      })
    )
  );

  return {
    profile,
    onboarding,
    preferences,
    activePlan,
    weekPlan,
    todayPlanDay,
    sessions,
    uncomfortableExerciseIds,
    milestones,
    notifications
  };
}

export async function saveOnboarding(
  userId: string,
  input: BetaOnboardingInput
) {
  const client = requireSupabaseClient();
  const limitations =
    input.limitations.length === 0 ? ["nessuna"] : sanitizeLimitations(input.limitations);
  const onboardingPayload = {
    user_id: userId,
    age_band: input.ageBand,
    perceived_level: input.perceivedLevel,
    primary_goal: input.primaryGoal,
    secondary_goals: input.secondaryGoals,
    days_per_week: input.daysPerWeek,
    preferred_minutes: input.preferredMinutes,
    energy_level: input.energyLevel,
    gentle_start: input.gentleStart,
    limitations,
    focus_preference: input.focusPreference,
    notes: input.notes || null
  };

  let onboardingResult = await client
    .from("user_onboarding")
    .upsert(onboardingPayload, { onConflict: "user_id" });

  if (
    onboardingResult.error?.message.includes("secondary_goals") ||
    onboardingResult.error?.message.includes("schema cache")
  ) {
    const fallbackPayload = {
      ...onboardingPayload,
      notes: buildOnboardingNotes(input)
    };

    delete (fallbackPayload as { secondary_goals?: string[] }).secondary_goals;

    onboardingResult = await client
      .from("user_onboarding")
      .upsert(fallbackPayload, { onConflict: "user_id" });
  }

  const [preferenceResult] = await Promise.all([
    client.from("user_preferences").upsert(
      {
        user_id: userId,
        timer_sound_enabled: true,
        reminders_enabled: true
      },
      { onConflict: "user_id" }
    )
  ]);

  throwIfSupabaseError(onboardingResult.error);
  throwIfSupabaseError(preferenceResult.error);
}

export async function updateTimerSound(userId: string, enabled: boolean) {
  const client = requireSupabaseClient();
  const result = await client.from("user_preferences").upsert(
    {
      user_id: userId,
      timer_sound_enabled: enabled
    },
    { onConflict: "user_id" }
  );

  throwIfSupabaseError(result.error);
}

export async function startWorkoutSession(
  userId: string,
  planDay: TrainingPlanDay
) {
  const client = requireSupabaseClient();

  const sessionResult = await client
    .from("workout_sessions")
    .insert({
      user_id: userId,
      plan_id: planDay.planId,
      plan_day_id: planDay.id,
      scheduled_for: planDay.scheduledFor,
      status: "in_progress",
      duration_minutes: 0,
      session_summary: {
        title: planDay.title,
        focus: planDay.focus,
        plannedStepIds: planDay.workout.steps.map((step) => step.exerciseId)
      }
    })
    .select("*")
    .single();

  throwIfSupabaseError(sessionResult.error);

  if (!sessionResult.data) {
    throw new Error("Non siamo riusciti a creare la sessione workout.");
  }

  const sessionId = sessionResult.data.id;
  const exerciseRows = planDay.workout.steps.map((step, index) => ({
    user_id: userId,
    session_id: sessionId,
    exercise_id: step.exerciseId,
    exercise_name: step.title,
    position_index: index,
    prescribed_duration_seconds: step.durationSeconds,
    rest_seconds: step.restSeconds,
    completed: false,
    skipped: false
  }));

  const exercisesResult = await client
    .from("workout_session_exercises")
    .insert(exerciseRows);

  throwIfSupabaseError(exercisesResult.error);

  return sessionId;
}

export async function completeWorkoutSession(
  userId: string,
  sessionId: string,
  planDay: TrainingPlanDay,
  feedback: WorkoutFeedbackInput
) {
  const client = requireSupabaseClient();
  const skippedSet = new Set(feedback.skippedExerciseIds);
  const plannedExerciseIds = planDay.workout.steps.map((step) => step.exerciseId);
  const durationSeconds = planDay.workout.steps.reduce(
    (total, step) => total + step.durationSeconds + step.restSeconds,
    0
  );
  const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
  const completedExerciseIds = plannedExerciseIds.filter(
    (exerciseId) => !skippedSet.has(exerciseId)
  );
  const adherenceScore = Math.round(
    (completedExerciseIds.length / Math.max(plannedExerciseIds.length, 1)) * 100
  );
  const summary = {
    title: planDay.title,
    focus: planDay.focus,
    completedExerciseIds,
    skippedExerciseIds: feedback.skippedExerciseIds,
    uncomfortableExerciseIds: feedback.uncomfortableExerciseIds
  };

  const sessionResult = await client
    .from("workout_sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      duration_minutes: durationMinutes,
      feeling: feedback.feeling,
      energy_final: feedback.energyFinal,
      discomfort_notes: feedback.discomfortNotes || null,
      stop_reason: feedback.stopReason || null,
      adherence_score: adherenceScore,
      session_summary: summary
    })
    .eq("id", sessionId)
    .eq("user_id", userId);

  throwIfSupabaseError(sessionResult.error);

  const planDayResult = await client
    .from("training_plan_days")
    .update({
      status: "completed",
      completed_session_id: sessionId
    })
    .eq("id", planDay.id)
    .eq("user_id", userId);

  throwIfSupabaseError(planDayResult.error);

  const exerciseUpdates = planDay.workout.steps.map((step) =>
    client
      .from("workout_session_exercises")
      .update({
        completed: !skippedSet.has(step.exerciseId),
        skipped: skippedSet.has(step.exerciseId)
      })
      .eq("session_id", sessionId)
      .eq("exercise_id", step.exerciseId)
      .eq("user_id", userId)
  );

  const exerciseFeedbackRows = feedback.uncomfortableExerciseIds.map((exerciseId) => ({
    user_id: userId,
    session_id: sessionId,
    exercise_id: exerciseId,
    marked_uncomfortable: true,
    discomfort_note: feedback.discomfortNotes || null,
    pain_or_stop: Boolean(feedback.stopReason)
  }));

  const results = await Promise.all([
    ...exerciseUpdates,
    exerciseFeedbackRows.length > 0
      ? client.from("exercise_feedback").insert(exerciseFeedbackRows)
      : Promise.resolve({ error: null })
  ]);

  results.forEach((result) => {
    if ("error" in result) {
      throwIfSupabaseError(result.error);
    }
  });

  await upsertMilestones(userId);
}

function mapProfile(
  row: Database["public"]["Tables"]["profiles"]["Row"] | null
): ProfileRecord | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at
  };
}

function mapOnboarding(
  row: Database["public"]["Tables"]["user_onboarding"]["Row"] | null
): UserOnboardingRecord | null {
  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    ageBand: row.age_band as UserOnboardingRecord["ageBand"],
    perceivedLevel: row.perceived_level as UserOnboardingRecord["perceivedLevel"],
    primaryGoal: row.primary_goal as UserOnboardingRecord["primaryGoal"],
    secondaryGoals: (row.secondary_goals ?? []).filter(
      (value): value is UserOnboardingRecord["primaryGoal"] => typeof value === "string"
    ),
    daysPerWeek: row.days_per_week,
    preferredMinutes: row.preferred_minutes as UserOnboardingRecord["preferredMinutes"],
    energyLevel: row.energy_level as UserOnboardingRecord["energyLevel"],
    gentleStart: row.gentle_start,
    limitations: sanitizeLimitations(row.limitations) as UserOnboardingRecord["limitations"],
    focusPreference: row.focus_preference as UserOnboardingRecord["focusPreference"],
    notes: row.notes ?? "",
    completedAt: row.completed_at
  };
}

function mapPreferences(
  row: Database["public"]["Tables"]["user_preferences"]["Row"] | null
): UserPreferenceRecord | null {
  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    timerSoundEnabled: row.timer_sound_enabled,
    remindersEnabled: row.reminders_enabled,
    preferredReminderTime: row.preferred_reminder_time,
    updatedAt: row.updated_at
  };
}

function mapNotificationPreferences(
  row: Database["public"]["Tables"]["notification_preferences"]["Row"] | null
): NotificationPreferenceRecord | null {
  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    remindersEnabled: row.reminders_enabled,
    reminderTime: row.reminder_time,
    weeklySummaryEnabled: row.weekly_summary_enabled
  };
}

function mapPlan(row: PlanRow | null): ActiveTrainingPlan | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    status: row.status as ActiveTrainingPlan["status"],
    source: row.source as ActiveTrainingPlan["source"],
    currentPhase: row.current_phase,
    phaseLabel: row.phase_label,
    phaseFocus: row.phase_focus,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
    weeklyGoal: row.weekly_goal,
    weeklyGoalMinutes: row.weekly_goal_minutes,
    weeklyGoalSessions: row.weekly_goal_sessions,
    progressionReason: row.progression_reason,
    motivationalNote: row.motivational_note,
    cautionNotes: readStringArray(row.caution_notes),
    adjustments: readStringArray(row.adjustments)
  };
}

function mapPlanDay(row: PlanDayRow): TrainingPlanDay {
  return {
    id: row.id,
    planId: row.plan_id,
    dayIndex: row.day_index,
    scheduledFor: row.scheduled_for,
    title: row.title,
    focus: row.focus,
    sessionKind: row.session_kind as TrainingPlanDay["sessionKind"],
    estimatedMinutes: row.estimated_minutes,
    status: toPlanDayStatus(row.status),
    coachNote: row.coach_note,
    workout: mapWorkoutPayload(row.workout_payload, row)
  };
}

function mapWorkoutPayload(payload: Json, row: PlanDayRow): PlannedWorkout {
  const base = isRecord(payload) ? payload : {};
  const rawSteps = Array.isArray(base.steps) ? base.steps : [];
  const steps = rawSteps.reduce<PlannedWorkout["steps"]>((accumulator, item) => {
    if (!isRecord(item)) {
      return accumulator;
    }

    accumulator.push({
      id:
        typeof item.id === "string"
          ? item.id
          : typeof item.exerciseId === "string"
            ? item.exerciseId
            : crypto.randomUUID(),
      kind: "exercise",
      exerciseId:
        typeof item.exerciseId === "string" ? item.exerciseId : "esercizio-generico",
      title: typeof item.title === "string" ? item.title : "Esercizio",
      summary: typeof item.summary === "string" ? item.summary : "",
      durationSeconds:
        typeof item.durationSeconds === "number" ? item.durationSeconds : 40,
      restSeconds: typeof item.restSeconds === "number" ? item.restSeconds : 20,
      bodyArea: typeof item.bodyArea === "string" ? item.bodyArea : "",
      doseLabel: typeof item.doseLabel === "string" ? item.doseLabel : "",
      caution: typeof item.caution === "string" ? item.caution : undefined
    });

    return accumulator;
  }, []);

  return {
    title: typeof base.title === "string" ? base.title : row.title,
    focus: typeof base.focus === "string" ? base.focus : row.focus,
    estimatedMinutes:
      typeof base.estimatedMinutes === "number"
        ? base.estimatedMinutes
        : row.estimated_minutes,
    coachNote: typeof base.coachNote === "string" ? base.coachNote : row.coach_note,
    cautionNotes:
      Array.isArray(base.cautionNotes) && base.cautionNotes.every((value) => typeof value === "string")
        ? (base.cautionNotes as string[])
        : readStringArray(row.caution_notes),
    steps
  };
}

function mapSession(row: SessionRow): WorkoutSessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    planDayId: row.plan_day_id,
    scheduledFor: row.scheduled_for,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    status: row.status as WorkoutSessionRecord["status"],
    durationMinutes: row.duration_minutes,
    feeling: row.feeling as WorkoutSessionRecord["feeling"],
    energyFinal: row.energy_final as WorkoutSessionRecord["energyFinal"],
    discomfortNotes: row.discomfort_notes,
    stopReason: row.stop_reason,
    sessionSummary: isRecord(row.session_summary)
      ? (row.session_summary as Record<string, unknown>)
      : null
  };
}

function mapMilestone(
  row: Database["public"]["Tables"]["user_milestones"]["Row"]
): UserMilestone {
  return {
    id: row.id,
    code: row.milestone_code,
    title: row.title,
    description: row.description,
    achievedAt: row.achieved_at
  };
}

function resolveTodayPlanDay(days: TrainingPlanDay[]) {
  if (days.length === 0) {
    return null;
  }

  const todayKey = toDateKey(new Date());
  const exact = days.find((day) => day.scheduledFor === todayKey);

  if (exact) {
    return exact;
  }

  const nextPlanned = days.find(
    (day) => day.status === "planned" && day.scheduledFor >= todayKey
  );

  return nextPlanned ?? days[0];
}

function toPlanDayStatus(status: string): PlanDayStatus {
  if (status === "completed" || status === "skipped") {
    return status;
  }

  return "planned";
}

function sanitizeLimitations(values: string[]) {
  const filtered = values.filter((value) => value !== "nessuna");
  return filtered.length > 0 ? filtered : ["nessuna"];
}

function buildOnboardingNotes(input: BetaOnboardingInput) {
  const secondaryGoalLabel =
    input.secondaryGoals.length > 1
      ? `Focus aggiuntivi: ${input.secondaryGoals.slice(1).join(", ")}.`
      : "";
  const cleanNotes = input.notes.trim();

  return [cleanNotes, secondaryGoalLabel].filter(Boolean).join("\n");
}

async function upsertMilestones(userId: string) {
  const client = requireSupabaseClient();
  const countResult = await client
    .from("workout_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  throwIfSupabaseError(countResult.error);

  const completedCount = countResult.count ?? 0;
  const unlocked = milestoneDefinitions.filter(
    (milestone) => completedCount >= milestone.threshold
  );

  if (unlocked.length === 0) {
    return;
  }

  const result = await client.from("user_milestones").upsert(
    unlocked.map((milestone) => ({
      user_id: userId,
      milestone_code: milestone.code,
      title: milestone.title,
      description: milestone.description
    })),
    {
      onConflict: "user_id,milestone_code"
    }
  );

  throwIfSupabaseError(result.error);
}

function readStringArray(value: Json) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isRecord(value: unknown): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function throwIfSupabaseError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}
