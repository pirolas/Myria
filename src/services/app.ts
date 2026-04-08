import type { User } from "@supabase/supabase-js";
import { requireSupabaseClient } from "@/lib/supabase";
import { toDateKey } from "@/lib/date";
import type {
  ActiveTrainingPlan,
  BetaOnboardingInput,
  DashboardModel,
  DeepProfileInput,
  Goal,
  NotificationPreferenceRecord,
  PlanAdjustment,
  PlannedWorkout,
  PlanDayStatus,
  ProfileRecord,
  ReassessmentInput,
  SupportTip,
  TrainingPlanDay,
  TrainingPlanVersionRecord,
  UserDeepProfileRecord,
  UserAccessRecord,
  UserMilestone,
  UserOnboardingRecord,
  UserPreferenceRecord,
  UserReassessmentRecord,
  WorkoutFeedbackInput,
  WorkoutFeedbackRecord,
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
    ),
    client.from("user_access").upsert(
      {
        user_id: user.id
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
    deepProfileResult,
    reassessmentResult,
    preferencesResult,
    userAccessResult,
    notificationsResult,
    activePlanResult,
    sessionsResult,
    workoutFeedbackResult,
    milestonesResult
  ] = await Promise.all([
    client.from("profiles").select("*").eq("id", userId).maybeSingle(),
    client.from("user_onboarding").select("*").eq("user_id", userId).maybeSingle(),
    client.from("user_deep_profile").select("*").eq("user_id", userId).maybeSingle(),
    client
      .from("user_reassessments")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    client.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
    client.from("user_access").select("*").eq("user_id", userId).maybeSingle(),
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
      .from("workout_feedback")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(40),
    client
      .from("user_milestones")
      .select("*")
      .eq("user_id", userId)
      .order("achieved_at", { ascending: false })
      .limit(8)
  ]);

  [
    profileResult.error,
    onboardingResult.error,
    deepProfileResult.error,
    reassessmentResult.error,
    preferencesResult.error,
    userAccessResult.error,
    notificationsResult.error,
    activePlanResult.error,
    sessionsResult.error,
    workoutFeedbackResult.error,
    milestonesResult.error
  ].forEach(throwIfSupabaseError);

  const activePlanRow = activePlanResult.data;

  const [
    planDaysResult,
    planVersionResult,
    planAdjustmentsResult,
    supportTipsResult
  ] = activePlanRow
    ? await Promise.all([
        client
          .from("training_plan_days")
          .select("*")
          .eq("plan_id", activePlanRow.id)
          .order("day_index", { ascending: true }),
        client
          .from("training_plan_versions")
          .select("*")
          .eq("plan_id", activePlanRow.id)
          .order("version_number", { ascending: false })
          .limit(1)
          .maybeSingle(),
        client
          .from("plan_adjustments")
          .select("*")
          .eq("plan_id", activePlanRow.id)
          .order("created_at", { ascending: false })
          .limit(8),
        client
          .from("support_tips")
          .select("*")
          .eq("user_id", userId)
          .or(`plan_id.eq.${activePlanRow.id},plan_id.is.null`)
          .order("created_at", { ascending: false })
          .limit(8)
      ])
    : [
        { data: [], error: null },
        { data: null, error: null },
        { data: [], error: null },
        { data: [], error: null }
      ];

  [
    planDaysResult.error,
    planVersionResult.error,
    planAdjustmentsResult.error,
    supportTipsResult.error
  ].forEach(throwIfSupabaseError);

  const profile = mapProfile(profileResult.data);
  const onboarding = mapOnboarding(onboardingResult.data);
  const deepProfile = mapDeepProfile(deepProfileResult.data);
  const latestReassessment = mapReassessment(reassessmentResult.data);
  const preferences = mapPreferences(preferencesResult.data);
  const notifications = mapNotificationPreferences(notificationsResult.data);
  const activePlan = mapPlan(activePlanRow);
  const activePlanVersion = mapPlanVersion(
    planVersionResult.data as Database["public"]["Tables"]["training_plan_versions"]["Row"] | null
  );
  const weekPlan = (planDaysResult.data ?? []).map(mapPlanDay);
  const todayPlanDay = resolveTodayPlanDay(weekPlan);
  const sessions = (sessionsResult.data ?? []).map(mapSession);
  const workoutFeedback = (workoutFeedbackResult.data ?? []).map(mapWorkoutFeedback);
  const milestones = (milestonesResult.data ?? []).map(mapMilestone);
  const planAdjustments = (planAdjustmentsResult.data ?? []).map(mapPlanAdjustment);
  const supportTips = (supportTipsResult.data ?? []).map(mapSupportTip);
  const completedSessionCount = sessions.filter((session) => session.status === "completed").length;
  const userAccess = mapUserAccess(
    userAccessResult.data as Database["public"]["Tables"]["user_access"]["Row"] | null,
    sessionsResult.data ?? [],
    completedSessionCount
  );

  if (userAccessResult.data && userAccess) {
    const shouldSyncAccess =
      userAccessResult.data.status !== userAccess.status ||
      userAccessResult.data.free_sessions_used !== userAccess.freeSessionsUsed;

    if (shouldSyncAccess) {
      const syncResult = await client
        .from("user_access")
        .update({
          status: userAccess.status,
          free_sessions_used: userAccess.freeSessionsUsed
        })
        .eq("user_id", userId);
      throwIfSupabaseError(syncResult.error);
    }
  }

  const uncomfortableExerciseIds = Array.from(
    new Set(
      [
        ...sessions.flatMap((session) => {
          const ids = session.sessionSummary?.uncomfortableExerciseIds;
          return Array.isArray(ids)
            ? ids.filter((value): value is string => typeof value === "string")
            : [];
        }),
        ...workoutFeedback.flatMap((feedback) => feedback.uncomfortableExerciseIds)
      ]
    )
  );

  return {
    profile,
    onboarding,
    deepProfile,
    latestReassessment,
    preferences,
    userAccess,
    activePlan,
    activePlanVersion,
    weekPlan,
    todayPlanDay,
    sessions,
    workoutFeedback,
    uncomfortableExerciseIds,
    milestones,
    notifications,
    planAdjustments,
    supportTips
  };
}

export async function saveOnboarding(userId: string, input: BetaOnboardingInput) {
  const client = requireSupabaseClient();
  const limitations =
    input.limitations.length === 0 ? ["nessuna"] : sanitizeLimitations(input.limitations);
  const computedBodyGoal = computeBodyGoal(input);

  const onboardingPayload = {
    user_id: userId,
    full_name: input.fullName || null,
    age_band: input.ageBand,
    height_cm: input.heightCm,
    weight_kg: input.weightKg,
    primary_body_goal: input.primaryBodyGoal,
    computed_body_goal: computedBodyGoal,
    secondary_objectives: input.secondaryObjectives,
    perceived_level: input.perceivedLevel,
    primary_goal: input.primaryGoal,
    secondary_goals: input.secondaryGoals,
    days_per_week: input.daysPerWeek,
    preferred_minutes: input.preferredMinutes,
    energy_level: input.energyLevel,
    past_experience: input.pastExperience,
    lifestyle: input.lifestyle,
    gentle_start: input.gentleStart,
    limitations,
    focus_preference: input.focusPreference,
    sleep_quality: input.sleepQuality,
    stress_level: input.stressLevel,
    consistency_score: input.consistencyScore,
    weekly_availability: input.weeklyAvailability,
    preferred_time_of_day: input.preferredTimeOfDay,
    preferred_days: input.preferredDays,
    focus_areas: input.focusAreas,
    past_training_types: input.pastTrainingTypes,
    prefer_simple_exercises: input.preferSimpleExercises,
    session_style: input.sessionStyle,
    session_tone: input.sessionTone,
    avoid_jumps: input.avoidJumps,
    eating_perception: input.eatingPerception,
    skips_meals: input.skipsMeals,
    nervous_hunger: input.nervousHunger,
    low_water_intake: input.lowWaterIntake,
    low_protein_intake: input.lowProteinIntake,
    wants_timer_sound: input.wantsTimerSound,
    notes: input.notes || null
  };

  const [profileResult, onboardingResult, preferenceResult] = await Promise.all([
    client.from("profiles").upsert(
      {
        id: userId,
        full_name: input.fullName || null
      },
      { onConflict: "id" }
    ),
    client.from("user_onboarding").upsert(onboardingPayload, { onConflict: "user_id" }),
    client.from("user_preferences").upsert(
      {
        user_id: userId,
        timer_sound_enabled: input.wantsTimerSound,
        reminders_enabled: true
      },
      { onConflict: "user_id" }
    )
  ]);

  [profileResult.error, onboardingResult.error, preferenceResult.error].forEach(
    throwIfSupabaseError
  );
}

export async function saveDeepProfile(userId: string, input: DeepProfileInput) {
  const client = requireSupabaseClient();

  const result = await client.from("user_deep_profile").upsert(
    {
      user_id: userId,
      weak_area: input.weakArea,
      priority_area: input.priorityArea,
      movement_discomforts: input.movementDiscomforts || null,
      posture_perception: input.posturePerception,
      mobility_perception: input.mobilityPerception,
      coordination_level: input.coordinationLevel,
      sensitivities: input.sensitivities,
      pregnancies_count: input.pregnanciesCount,
      cesareans_count: input.cesareansCount,
      months_since_last_birth: input.monthsSinceLastBirth,
      diastasis_status: input.diastasisStatus,
      pelvic_signals: input.pelvicSignals,
      scar_discomfort: input.scarDiscomfort,
      body_confidence: input.bodyConfidence,
      dropout_reasons: input.dropoutReasons,
      nutrition_pattern: input.nutritionPattern,
      nervous_hunger: input.nervousHunger,
      skips_meals: input.skipsMeals,
      hydration_pattern: input.hydrationPattern,
      training_preference: input.trainingPreference,
      feared_exercises: input.fearedExercises || null,
      disliked_exercises: input.dislikedExercises || null,
      relevant_interventions: input.relevantInterventions || null,
      notes: input.notes || null
    },
    { onConflict: "user_id" }
  );

  throwIfSupabaseError(result.error);
}

export async function saveReassessment(userId: string, input: ReassessmentInput) {
  const client = requireSupabaseClient();
  const result = await client.from("user_reassessments").insert({
    user_id: userId,
    plan_fit: input.planFit,
    feels_more_stable: input.feelsMoreStable,
    feels_more_toned: input.feelsMoreToned,
    feels_more_energetic: input.feelsMoreEnergetic,
    effective_exercises: input.effectiveExercises,
    uncomfortable_exercises: input.uncomfortableExercises,
    consistency_keeping: input.consistencyKeeping,
    main_obstacle: input.mainObstacle,
    improvements: input.improvements,
    caution_notes: input.cautionNotes || null,
    keep_current_focus: input.keepCurrentFocus,
    new_focus: input.newFocus,
    realistic_minutes_now: input.realisticMinutesNow
  });

  throwIfSupabaseError(result.error);
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

export async function upgradeToPremiumAccess(userId: string) {
  const client = requireSupabaseClient();
  const result = await client.from("user_access").upsert(
    {
      user_id: userId,
      status: "premium",
      premium_started_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );

  throwIfSupabaseError(result.error);
}

export async function startWorkoutSession(userId: string, planDay: TrainingPlanDay) {
  const client = requireSupabaseClient();
  const accessResult = await client.from("user_access").select("*").eq("user_id", userId).maybeSingle();
  throwIfSupabaseError(accessResult.error);
  const completedCountResult = await client
    .from("workout_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");
  throwIfSupabaseError(completedCountResult.error);

  const access = mapUserAccess(
    accessResult.data as Database["public"]["Tables"]["user_access"]["Row"] | null,
    [],
    completedCountResult.count ?? 0
  );

  if (access && !access.canStartWorkout) {
    throw new Error(
      "Il mini-ciclo gratuito si e concluso. Per continuare con il percorso guidato serve Premium."
    );
  }

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

  const exercisesResult = await client.from("workout_session_exercises").insert(
    planDay.workout.steps.map((step, index) => ({
      user_id: userId,
      session_id: sessionResult.data.id,
      exercise_id: step.exerciseId,
      exercise_name: step.title,
      position_index: index,
      prescribed_duration_seconds: step.durationSeconds,
      rest_seconds: step.restSeconds,
      completed: false,
      skipped: false
    }))
  );

  throwIfSupabaseError(exercisesResult.error);

  return sessionResult.data.id;
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

  const [sessionResult, planDayResult, workoutFeedbackResult] = await Promise.all([
    client
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
      .eq("user_id", userId),
    client
      .from("training_plan_days")
      .update({
        status: "completed",
        completed_session_id: sessionId
      })
      .eq("id", planDay.id)
      .eq("user_id", userId),
    client.from("workout_feedback").insert({
      session_id: sessionId,
      user_id: userId,
      feeling: feedback.feeling,
      energy_final: feedback.energyFinal,
      discomfort_notes: feedback.discomfortNotes || null,
      stop_reason: feedback.stopReason || null,
      uncomfortable_exercise_ids: feedback.uncomfortableExerciseIds
    })
  ]);

  [sessionResult.error, planDayResult.error, workoutFeedbackResult.error].forEach(
    throwIfSupabaseError
  );

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
  if (!row) return null;
  return { id: row.id, fullName: row.full_name, email: row.email, createdAt: row.created_at };
}

function mapOnboarding(
  row: Database["public"]["Tables"]["user_onboarding"]["Row"] | null
): UserOnboardingRecord | null {
  if (!row) return null;

  return {
    userId: row.user_id,
    fullName: row.full_name ?? "",
    ageBand: row.age_band as UserOnboardingRecord["ageBand"],
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    primaryBodyGoal:
      (row.primary_body_goal as UserOnboardingRecord["primaryBodyGoal"]) ??
      "tonicita_rassodare",
    computedBodyGoal:
      (row.computed_body_goal as UserOnboardingRecord["computedBodyGoal"]) ?? "toning",
    secondaryObjectives:
      (row.secondary_objectives ?? []) as UserOnboardingRecord["secondaryObjectives"],
    perceivedLevel: row.perceived_level as UserOnboardingRecord["perceivedLevel"],
    primaryGoal: row.primary_goal as UserOnboardingRecord["primaryGoal"],
    secondaryGoals: sanitizeGoalArray(row.secondary_goals, row.primary_goal),
    daysPerWeek: row.days_per_week,
    preferredMinutes: row.preferred_minutes as UserOnboardingRecord["preferredMinutes"],
    energyLevel: row.energy_level as UserOnboardingRecord["energyLevel"],
    pastExperience:
      (row.past_experience as UserOnboardingRecord["pastExperience"]) ?? "mai_costante",
    lifestyle: (row.lifestyle as UserOnboardingRecord["lifestyle"]) ?? "molto_sedentaria",
    focusPreference: row.focus_preference as UserOnboardingRecord["focusPreference"],
    gentleStart: row.gentle_start,
    limitations: sanitizeLimitations(row.limitations) as UserOnboardingRecord["limitations"],
    sleepQuality:
      (row.sleep_quality as UserOnboardingRecord["sleepQuality"]) ?? "discontinua",
    stressLevel: (row.stress_level as UserOnboardingRecord["stressLevel"]) ?? "medio",
    consistencyScore: (row.consistency_score as 1 | 2 | 3 | 4 | 5 | null) ?? 3,
    weeklyAvailability:
      (row.weekly_availability as UserOnboardingRecord["weeklyAvailability"]) ??
      "alcuni_spazi",
    preferredTimeOfDay:
      (row.preferred_time_of_day as UserOnboardingRecord["preferredTimeOfDay"]) ??
      "variabile",
    preferredDays: (row.preferred_days ?? []) as UserOnboardingRecord["preferredDays"],
    pastTrainingTypes:
      (row.past_training_types ?? []) as UserOnboardingRecord["pastTrainingTypes"],
    focusAreas: (row.focus_areas ?? []) as UserOnboardingRecord["focusAreas"],
    preferSimpleExercises: row.prefer_simple_exercises ?? true,
    sessionStyle:
      (row.session_style as UserOnboardingRecord["sessionStyle"]) ?? "sequenze_lente",
    sessionTone: (row.session_tone as UserOnboardingRecord["sessionTone"]) ?? "soft",
    avoidJumps: row.avoid_jumps ?? true,
    eatingPerception:
      (row.eating_perception as UserOnboardingRecord["eatingPerception"]) ?? "abbastanza",
    skipsMeals: row.skips_meals ?? false,
    lowWaterIntake: row.low_water_intake ?? false,
    nervousHunger: row.nervous_hunger ?? false,
    lowProteinIntake:
      (row.low_protein_intake as UserOnboardingRecord["lowProteinIntake"]) ?? "non_so",
    wantsTimerSound: row.wants_timer_sound ?? true,
    notes: row.notes ?? "",
    completedAt: row.completed_at
  };
}

function mapDeepProfile(
  row: Database["public"]["Tables"]["user_deep_profile"]["Row"] | null
): UserDeepProfileRecord | null {
  if (!row) return null;
  return {
    userId: row.user_id,
    weakArea: row.weak_area as UserDeepProfileRecord["weakArea"],
    priorityArea: row.priority_area as UserDeepProfileRecord["priorityArea"],
    movementDiscomforts: row.movement_discomforts ?? "",
    posturePerception: row.posture_perception as UserDeepProfileRecord["posturePerception"],
    mobilityPerception: row.mobility_perception as UserDeepProfileRecord["mobilityPerception"],
    coordinationLevel: row.coordination_level as UserDeepProfileRecord["coordinationLevel"],
    sensitivities: (row.sensitivities ?? []) as UserDeepProfileRecord["sensitivities"],
    pregnanciesCount: row.pregnancies_count,
    cesareansCount: row.cesareans_count,
    monthsSinceLastBirth: row.months_since_last_birth,
    diastasisStatus: row.diastasis_status as UserDeepProfileRecord["diastasisStatus"],
    pelvicSignals: (row.pelvic_signals ?? []) as UserDeepProfileRecord["pelvicSignals"],
    scarDiscomfort: row.scar_discomfort,
    bodyConfidence: row.body_confidence as UserDeepProfileRecord["bodyConfidence"],
    dropoutReasons: (row.dropout_reasons ?? []) as UserDeepProfileRecord["dropoutReasons"],
    nutritionPattern: row.nutrition_pattern as UserDeepProfileRecord["nutritionPattern"],
    nervousHunger: row.nervous_hunger,
    skipsMeals: row.skips_meals,
    hydrationPattern: row.hydration_pattern as UserDeepProfileRecord["hydrationPattern"],
    trainingPreference: row.training_preference as UserDeepProfileRecord["trainingPreference"],
    fearedExercises: row.feared_exercises ?? "",
    dislikedExercises: row.disliked_exercises ?? "",
    relevantInterventions: row.relevant_interventions ?? "",
    notes: row.notes ?? "",
    updatedAt: row.updated_at
  };
}

function mapReassessment(
  row: Database["public"]["Tables"]["user_reassessments"]["Row"] | null
): UserReassessmentRecord | null {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    planFit: row.plan_fit as UserReassessmentRecord["planFit"],
    feelsMoreStable: row.feels_more_stable,
    feelsMoreToned: row.feels_more_toned,
    feelsMoreEnergetic: row.feels_more_energetic,
    effectiveExercises: row.effective_exercises ?? [],
    uncomfortableExercises: row.uncomfortable_exercises ?? [],
    consistencyKeeping: row.consistency_keeping as 1 | 2 | 3 | 4 | 5,
    mainObstacle: row.main_obstacle as UserReassessmentRecord["mainObstacle"],
    improvements: (row.improvements ?? []) as UserReassessmentRecord["improvements"],
    cautionNotes: row.caution_notes ?? "",
    keepCurrentFocus: row.keep_current_focus,
    newFocus: row.new_focus as UserReassessmentRecord["newFocus"],
    realisticMinutesNow: row.realistic_minutes_now as UserReassessmentRecord["realisticMinutesNow"],
    completedAt: row.completed_at
  };
}

function mapPreferences(
  row: Database["public"]["Tables"]["user_preferences"]["Row"] | null
): UserPreferenceRecord | null {
  if (!row) return null;
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
  if (!row) return null;
  return {
    userId: row.user_id,
    remindersEnabled: row.reminders_enabled,
    reminderTime: row.reminder_time,
    weeklySummaryEnabled: row.weekly_summary_enabled
  };
}

function mapUserAccess(
  row: Database["public"]["Tables"]["user_access"]["Row"] | null,
  sessions: Array<SessionRow | Database["public"]["Tables"]["workout_sessions"]["Row"]>,
  explicitCompletedCount?: number
): UserAccessRecord | null {
  if (!row) return null;

  const completedCount =
    explicitCompletedCount ??
    sessions.filter((session) => session.status === "completed").length;
  const now = Date.now();
  const trialExpiresAt = new Date(row.trial_expires_at).getTime();
  const isPremium =
    row.status === "premium" &&
    (!row.premium_ends_at || new Date(row.premium_ends_at).getTime() > now);
  const isLocked = !isPremium && (completedCount >= row.free_sessions_limit || trialExpiresAt <= now);
  const status: UserAccessRecord["status"] = isPremium
    ? "premium"
    : isLocked
      ? "free_locked"
      : "free_trial";
  const remainingSessions = Math.max(row.free_sessions_limit - completedCount, 0);
  const remainingDays = Math.max(
    0,
    Math.ceil((trialExpiresAt - now) / (24 * 60 * 60 * 1000))
  );

  return {
    userId: row.user_id,
    status,
    trialStartedAt: row.trial_started_at,
    trialExpiresAt: row.trial_expires_at,
    freeSessionsLimit: row.free_sessions_limit,
    freeSessionsUsed: completedCount,
    trialRemainingSessions: remainingSessions,
    trialRemainingDays: remainingDays,
    premiumStartedAt: row.premium_started_at,
    premiumEndsAt: row.premium_ends_at,
    canUsePremiumFeatures: status === "premium",
    canStartWorkout: status !== "free_locked"
  };
}

function mapPlan(row: PlanRow | null): ActiveTrainingPlan | null {
  if (!row) return null;

  return {
    id: row.id,
    status: row.status as ActiveTrainingPlan["status"],
    source: row.source as ActiveTrainingPlan["source"],
    primaryBodyGoal: row.primary_body_goal ?? "tonicita_rassodare",
    computedBodyGoal:
      (row.computed_body_goal as ActiveTrainingPlan["computedBodyGoal"]) ?? "toning",
    currentPhase: row.current_phase,
    phaseLabel: row.phase_label,
    phaseFocus: row.phase_focus,
    phaseGoal: row.phase_goal ?? "",
    userProfileSummary: row.user_profile_summary ?? "",
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
    weeklyGoal: row.weekly_goal,
    weeklyGoalMinutes: row.weekly_goal_minutes,
    weeklyGoalSessions: row.weekly_goal_sessions,
    weeklyStructure: readStringArray(row.weekly_structure),
    sessionDifficulty: row.session_difficulty ?? "",
    progressionStrategy: row.progression_strategy ?? "",
    progressionReason: row.progression_reason,
    motivationalNote: row.motivational_note,
    realisticExpectedOutcomes: readStringArray(row.realistic_expected_outcomes),
    cautionNotes: readStringArray(row.caution_notes),
    recoveryNotes: readStringArray(row.recovery_notes),
    adherenceStrategy: row.adherence_strategy ?? "",
    nutritionTips: readStringArray(row.nutrition_tips),
    planExplanation: row.plan_explanation ?? "",
    adjustments: readStringArray(row.adjustments),
    reassessmentDueInDays: row.reassessment_due_in_days,
    nextReassessmentDate: row.next_reassessment_at,
    planOverview: isRecord(row.plan_overview_payload)
      ? (row.plan_overview_payload as unknown as ActiveTrainingPlan["planOverview"])
      : null,
    profileSummary: isRecord(row.profile_summary_payload)
      ? (row.profile_summary_payload as unknown as ActiveTrainingPlan["profileSummary"])
      : null,
    supportTips: isRecord(row.support_tips_payload)
      ? (row.support_tips_payload as unknown as ActiveTrainingPlan["supportTips"])
      : null
  };
}

function mapPlanVersion(
  row: Database["public"]["Tables"]["training_plan_versions"]["Row"] | null
): TrainingPlanVersionRecord | null {
  if (!row) return null;
  return {
    id: row.id,
    planId: row.plan_id,
    versionNumber: row.version_number,
    trigger: row.trigger as TrainingPlanVersionRecord["trigger"],
    userProfileSummary: row.user_profile_summary,
    phaseGoal: row.phase_goal,
    weeklyStructure: readStringArray(row.weekly_structure),
    sessionDifficulty: row.session_difficulty,
    progressionStrategy: row.progression_strategy,
    realisticExpectedOutcomes: readStringArray(row.realistic_expected_outcomes),
    motivationalMessage: row.motivational_message,
    recoveryNotes: readStringArray(row.recovery_notes),
    adherenceStrategy: row.adherence_strategy,
    nutritionTips: readStringArray(row.nutrition_tips),
    planExplanation: row.plan_explanation,
    createdAt: row.created_at
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
      sets: typeof item.sets === "number" ? item.sets : 2,
      repsLabel: typeof item.repsLabel === "string" ? item.repsLabel : "8-10 ripetizioni",
      durationSeconds:
        typeof item.durationSeconds === "number" ? item.durationSeconds : 40,
      restSeconds: typeof item.restSeconds === "number" ? item.restSeconds : 20,
      bodyArea: typeof item.bodyArea === "string" ? item.bodyArea : "",
      doseLabel: typeof item.doseLabel === "string" ? item.doseLabel : "",
      executionNote:
        typeof item.executionNote === "string" ? item.executionNote : undefined,
      easierOption:
        typeof item.easierOption === "string" ? item.easierOption : undefined,
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

function mapWorkoutFeedback(
  row: Database["public"]["Tables"]["workout_feedback"]["Row"]
): WorkoutFeedbackRecord {
  return {
    id: row.id,
    sessionId: row.session_id,
    userId: row.user_id,
    feeling: row.feeling as WorkoutFeedbackRecord["feeling"],
    energyFinal: row.energy_final as WorkoutFeedbackRecord["energyFinal"],
    discomfortNotes: row.discomfort_notes,
    stopReason: row.stop_reason,
    uncomfortableExerciseIds: row.uncomfortable_exercise_ids ?? [],
    completedAt: row.created_at
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

function computeBodyGoal(input: BetaOnboardingInput): UserOnboardingRecord["computedBodyGoal"] {
  const heightM = input.heightCm && input.heightCm > 0 ? input.heightCm / 100 : null;
  const bmi = heightM && input.weightKg ? input.weightKg / (heightM * heightM) : null;
  const wantsToneRebuild =
    input.primaryBodyGoal === "tonicita_rassodare" &&
    input.secondaryObjectives.includes("meno_flaccidita") &&
    bmi !== null &&
    bmi < 22;

  if (wantsToneRebuild) {
    return "tone_rebuild_for_lean_body";
  }

  if (input.primaryBodyGoal === "ricomposizione_corporea") {
    return bmi !== null && bmi < 22 ? "tone_rebuild_for_lean_body" : "recomposition";
  }

  if (input.primaryBodyGoal === "massa_muscolare" || input.primaryBodyGoal === "aumentare_peso_sano") {
    return "muscle_gain";
  }

  if (input.primaryBodyGoal === "dimagrire") {
    return bmi !== null && bmi < 23 ? "recomposition" : "fat_loss";
  }

  return bmi !== null && bmi < 22 ? "tone_rebuild_for_lean_body" : "toning";
}

function mapPlanAdjustment(
  row: Database["public"]["Tables"]["plan_adjustments"]["Row"]
): PlanAdjustment {
  return {
    id: row.id,
    adjustmentType: row.adjustment_type,
    title: row.title,
    description: row.description,
    createdAt: row.created_at
  };
}

function mapSupportTip(
  row: Database["public"]["Tables"]["support_tips"]["Row"]
): SupportTip {
  return {
    id: row.id,
    category: row.category as SupportTip["category"],
    title: row.title,
    body: row.body
  };
}

function resolveTodayPlanDay(days: TrainingPlanDay[]) {
  if (days.length === 0) {
    return null;
  }

  const todayKey = toDateKey(new Date());
  const exact = days.find((day) => day.scheduledFor === todayKey);
  if (exact) return exact;

  return (
    days.find((day) => day.status === "planned" && day.scheduledFor >= todayKey) ??
    days[0]
  );
}

function toPlanDayStatus(status: string): PlanDayStatus {
  return status === "completed" || status === "skipped" ? status : "planned";
}

function sanitizeLimitations(values: string[]) {
  const filtered = values.filter((value) => value !== "nessuna");
  return filtered.length > 0 ? filtered : ["nessuna"];
}

function sanitizeGoalArray(values: string[] | null, primaryGoal: string): Goal[] {
  const normalized = (values ?? []).filter((value): value is Goal => typeof value === "string");
  return normalized.length > 0 ? normalized : [primaryGoal as Goal];
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

  if (unlocked.length === 0) return;

  const result = await client.from("user_milestones").upsert(
    unlocked.map((milestone) => ({
      user_id: userId,
      milestone_code: milestone.code,
      title: milestone.title,
      description: milestone.description
    })),
    { onConflict: "user_id,milestone_code" }
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
