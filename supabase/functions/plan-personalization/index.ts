import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type PlannerTrigger =
  | "onboarding_completed"
  | "weekly_refresh"
  | "post_workout_feedback"
  | "deep_profile_completed"
  | "reassessment_completed";

interface PlannerRequestBody {
  trigger?: PlannerTrigger;
}

interface PlannerExerciseOutput {
  name: string;
  exercise_id: string;
  sets: number;
  reps: string;
  duration_seconds_estimate: number;
  rest_seconds: number;
  notes: string;
  easier_option: string;
  body_area: string;
  caution: string | null;
}

interface PlannerDayOutput {
  day_index: number;
  scheduled_for: string;
  label: string;
  title: string;
  focus: string;
  session_kind: "workout" | "recovery";
  estimated_duration_minutes: number;
  coach_note: string;
  caution_notes: string[];
  exercises: PlannerExerciseOutput[];
}

interface PlannerOutput {
  profile_summary: {
    main_goal: string;
    computed_body_goal: string;
    secondary_goals: string[];
    training_level: string;
    weekly_availability: string;
    focus_areas: string[];
    notes: string[];
  };
  plan_overview: {
    phase_name: string;
    phase_duration_weeks: number;
    weekly_sessions: number;
    session_duration_minutes: number;
    intensity: string;
    strategy_explanation: string;
    realistic_expectations: string[];
  };
  weekly_plan: PlannerDayOutput[];
  phase_goal: string;
  phase_focus: string;
  weekly_structure: string[];
  current_phase: string;
  progression_strategy: string;
  progression_reason: string;
  plan_explanation: string;
  realistic_expected_outcomes: string[];
  support_tips: {
    nutrition: string[];
    recovery: string[];
    consistency: string[];
  };
  motivational_message: string;
  caution_flags: string[];
  adjustments: string[];
  reassessment: {
    days_until_checkin: number;
    checkin_focus: string[];
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const OPENAI_TIMEOUT_MS = 15000;

const exerciseCatalog = {
  "ponte-glutei": {
    title: "Ponte glutei",
    bodyArea: "Glutei e retro coscia",
    defaultReps: "10-12 ripetizioni",
    easierOption: "Riduci l'altezza del ponte e fermati un attimo in meno in alto.",
    caution: "Riduci il gesto se senti la schiena comprimersi."
  },
  "squat-alla-sedia": {
    title: "Squat alla sedia",
    bodyArea: "Gambe e glutei",
    defaultReps: "8-10 ripetizioni",
    easierOption: "Usa una sedia alta e appoggiati di piu al ritorno."
  },
  "wall-sit": {
    title: "Wall sit",
    bodyArea: "Cosce e glutei",
    defaultReps: "20-30 secondi",
    easierOption: "Riduci il piegamento delle ginocchia e il tempo di tenuta."
  },
  "slanci-laterali-in-piedi": {
    title: "Slanci laterali in piedi",
    bodyArea: "Gluteo laterale e anche",
    defaultReps: "10 ripetizioni per lato",
    easierOption: "Tieni la punta del piede piu bassa e cerca meno ampiezza."
  },
  "affondo-assistito-indietro": {
    title: "Affondo assistito indietro",
    bodyArea: "Glutei, cosce, equilibrio",
    defaultReps: "6-8 ripetizioni per lato",
    easierOption: "Tieni una mano in appoggio e fai un passo piu corto."
  },
  "bird-dog": {
    title: "Bird dog",
    bodyArea: "Core, schiena, glutei",
    defaultReps: "6-8 ripetizioni per lato",
    easierOption: "Muovi solo braccia o solo gambe, senza cercare ampiezza.",
    caution: "Riduci il gesto se perdi controllo addominale o senti pressione."
  },
  "dead-bug-semplificato": {
    title: "Dead bug semplificato",
    bodyArea: "Core e coordinazione",
    defaultReps: "6-8 ripetizioni per lato",
    easierOption: "Lavora con una gamba per volta e con piu pause.",
    caution: "Se senti spinta addominale, torna subito a una variante piu facile."
  },
  "heel-slides": {
    title: "Heel slides",
    bodyArea: "Addome profondo e bacino",
    defaultReps: "8 ripetizioni per lato",
    easierOption: "Riduci la scivolata e mantieni piu fermo il bacino."
  },
  "ponte-con-marcia": {
    title: "Ponte con marcia",
    bodyArea: "Glutei e stabilita del bacino",
    defaultReps: "6-8 passi per lato",
    easierOption: "Mantieni il ponte fermo senza staccare i piedi."
  },
  "sollevamenti-polpacci": {
    title: "Sollevamenti polpacci",
    bodyArea: "Polpacci e caviglie",
    defaultReps: "12-15 ripetizioni",
    easierOption: "Tieni una mano in appoggio e riduci l'altezza."
  },
  "side-leg-lifts": {
    title: "Side leg lifts",
    bodyArea: "Gluteo laterale e anche",
    defaultReps: "10 ripetizioni per lato",
    easierOption: "Piega leggermente il ginocchio e riduci l'escursione."
  },
  "respirazione-addominale-profonda": {
    title: "Respirazione con attivazione addominale profonda",
    bodyArea: "Respiro, addome profondo, pavimento pelvico",
    defaultReps: "5-6 respiri lenti",
    easierOption: "Riduci la durata e concentrati solo sull'espirazione lunga."
  },
  "mobilita-bacino-colonna": {
    title: "Mobilita bacino e colonna",
    bodyArea: "Bacino e colonna",
    defaultReps: "6-8 movimenti lenti",
    easierOption: "Riduci ampiezza e lavora con piu lentezza."
  },
  "scapole-al-muro": {
    title: "Scapole al muro",
    bodyArea: "Schiena alta e spalle",
    defaultReps: "8-10 ripetizioni",
    easierOption: "Riduci la salita delle braccia e mantieni il collo morbido."
  },
  "allungamento-petto-parete": {
    title: "Apertura del petto alla parete",
    bodyArea: "Petto e spalle",
    defaultReps: "25-30 secondi per lato",
    easierOption: "Riduci l'angolo e l'intensita dell'apertura."
  }
} as const;

const exerciseIds = Object.keys(exerciseCatalog);

const focusTemplates: Record<string, string[]> = {
  glutei_gambe: ["ponte-glutei", "squat-alla-sedia", "slanci-laterali-in-piedi", "wall-sit", "sollevamenti-polpacci"],
  pancia_core: ["respirazione-addominale-profonda", "heel-slides", "bird-dog", "dead-bug-semplificato", "ponte-con-marcia"],
  postura: ["mobilita-bacino-colonna", "scapole-al-muro", "allungamento-petto-parete", "bird-dog", "respirazione-addominale-profonda"],
  tonicita_generale: ["squat-alla-sedia", "ponte-glutei", "bird-dog", "sollevamenti-polpacci", "scapole-al-muro"],
  ripartenza_dolce: ["respirazione-addominale-profonda", "heel-slides", "ponte-glutei", "mobilita-bacino-colonna", "allungamento-petto-parete"]
};

const planSchema = {
  name: "mirya_training_plan",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["profile_summary", "plan_overview", "weekly_plan", "phase_goal", "phase_focus", "weekly_structure", "current_phase", "progression_strategy", "progression_reason", "plan_explanation", "realistic_expected_outcomes", "support_tips", "motivational_message", "caution_flags", "adjustments", "reassessment"],
    properties: {
      profile_summary: {
        type: "object",
        additionalProperties: false,
        required: ["main_goal", "computed_body_goal", "secondary_goals", "training_level", "weekly_availability", "focus_areas", "notes"],
        properties: {
          main_goal: { type: "string" },
          computed_body_goal: { type: "string", enum: ["fat_loss", "muscle_gain", "toning", "recomposition", "tone_rebuild_for_lean_body"] },
          secondary_goals: { type: "array", items: { type: "string" } },
          training_level: { type: "string" },
          weekly_availability: { type: "string" },
          focus_areas: { type: "array", items: { type: "string" } },
          notes: { type: "array", items: { type: "string" } }
        }
      },
      plan_overview: {
        type: "object",
        additionalProperties: false,
        required: ["phase_name", "phase_duration_weeks", "weekly_sessions", "session_duration_minutes", "intensity", "strategy_explanation", "realistic_expectations"],
        properties: {
          phase_name: { type: "string" },
          phase_duration_weeks: { type: "integer", minimum: 2, maximum: 6 },
          weekly_sessions: { type: "integer", minimum: 2, maximum: 5 },
          session_duration_minutes: { type: "integer", minimum: 10, maximum: 30 },
          intensity: { type: "string" },
          strategy_explanation: { type: "string" },
          realistic_expectations: { type: "array", items: { type: "string" } }
        }
      },
      weekly_plan: { type: "array", minItems: 7, maxItems: 7, items: { type: "object", additionalProperties: false, required: ["day_index", "label", "title", "focus", "session_kind", "estimated_duration_minutes", "coach_note", "caution_notes", "exercises"], properties: {
        day_index: { type: "integer", minimum: 0, maximum: 6 },
        label: { type: "string" },
        title: { type: "string" },
        focus: { type: "string" },
        session_kind: { type: "string", enum: ["workout", "recovery"] },
        estimated_duration_minutes: { type: "integer", minimum: 5, maximum: 30 },
        coach_note: { type: "string" },
        caution_notes: { type: "array", items: { type: "string" } },
        exercises: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "exercise_id", "sets", "reps", "duration_seconds_estimate", "rest_seconds", "notes", "easier_option", "body_area", "caution"], properties: {
          name: { type: "string" },
          exercise_id: { type: "string", enum: exerciseIds },
          sets: { type: "integer", minimum: 1, maximum: 5 },
          reps: { type: "string" },
          duration_seconds_estimate: { type: "integer", minimum: 20, maximum: 90 },
          rest_seconds: { type: "integer", minimum: 10, maximum: 60 },
          notes: { type: "string" },
          easier_option: { type: "string" },
          body_area: { type: "string" },
          caution: { type: ["string", "null"] }
        } } }
      } } },
      phase_goal: { type: "string" },
      phase_focus: { type: "string" },
      weekly_structure: { type: "array", items: { type: "string" } },
      current_phase: { type: "string" },
      progression_strategy: { type: "string" },
      progression_reason: { type: "string" },
      plan_explanation: { type: "string" },
      realistic_expected_outcomes: { type: "array", items: { type: "string" } },
      support_tips: { type: "object", additionalProperties: false, required: ["nutrition", "recovery", "consistency"], properties: {
        nutrition: { type: "array", items: { type: "string" } },
        recovery: { type: "array", items: { type: "string" } },
        consistency: { type: "array", items: { type: "string" } }
      } },
      motivational_message: { type: "string" },
      caution_flags: { type: "array", items: { type: "string" } },
      adjustments: { type: "array", items: { type: "string" } },
      reassessment: { type: "object", additionalProperties: false, required: ["days_until_checkin", "checkin_focus"], properties: {
        days_until_checkin: { type: "integer", minimum: 7, maximum: 21 },
        checkin_focus: { type: "array", items: { type: "string" } }
      } }
    }
  }
} as const;

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Configurazione Supabase incompleta.");
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const authHeader = request.headers.get("Authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return jsonResponse({ error: "Token utente mancante." }, 401);
    }

    const {
      data: { user },
      error: authError
    } = await adminClient.auth.getUser(accessToken);

    if (authError || !user) {
      return jsonResponse(
        {
          error: authError?.message || "Utente non autenticata."
        },
        401
      );
    }

    const body = (await request.json().catch(() => ({}))) as PlannerRequestBody;
    const trigger = body.trigger ?? "weekly_refresh";

    const [onboardingRes, deepProfileRes, reassessmentRes, sessionRes, currentPlanRes, accessRes] =
      await Promise.all([
        adminClient.from("user_onboarding").select("*").eq("user_id", user.id).maybeSingle(),
        adminClient.from("user_deep_profile").select("*").eq("user_id", user.id).maybeSingle(),
        adminClient
          .from("user_reassessments")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        adminClient
          .from("workout_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("completed_at", { ascending: false })
          .limit(12),
        adminClient
          .from("training_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        adminClient.from("user_access").select("*").eq("user_id", user.id).maybeSingle()
      ]);

    [onboardingRes.error, deepProfileRes.error, reassessmentRes.error, sessionRes.error, currentPlanRes.error, accessRes.error]
      .filter(Boolean)
      .forEach((error) => {
        throw error;
      });

    if (!onboardingRes.data) {
      return jsonResponse({ error: "Onboarding essenziale mancante." }, 400);
    }

    const access = accessRes.data;
    const isPremium =
      access?.status === "premium" &&
      (!access.premium_ends_at || new Date(access.premium_ends_at).getTime() > Date.now());
    const canGenerateInitialPlan = !access?.first_plan_generated_at || !currentPlanRes.data;

    if (trigger === "onboarding_completed" && !canGenerateInitialPlan && !isPremium) {
      return jsonResponse(
        {
          error:
            "Il primo piano e gia stato generato. Gli aggiornamenti successivi fanno parte di Premium."
        },
        403
      );
    }

    if (trigger !== "onboarding_completed" && !isPremium) {
      return jsonResponse(
        { error: "L'aggiornamento del percorso nel tempo e disponibile in Premium." },
        403
      );
    }

    const plannerInput = {
      onboarding: onboardingRes.data,
      deepProfile: deepProfileRes.data,
      reassessment: reassessmentRes.data,
      sessions: sessionRes.data ?? [],
      currentPlan: currentPlanRes.data,
      access,
      trigger
    };

    const aiPlan = await tryOpenAIPlan(plannerInput);
    const plan = aiPlan ?? buildFallbackPlan(plannerInput);
    const source = aiPlan ? "ai" : "fallback";
    const persistedPlanId = await persistPlan(
      adminClient,
      user.id,
      plannerInput,
      plan,
      trigger,
      currentPlanRes.data?.id ?? null,
      source
    );

    return jsonResponse({
      source,
      persisted_plan_id: persistedPlanId,
      plan
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Planner non disponibile."
      },
      500
    );
  }
});

async function tryOpenAIPlan(input: Record<string, unknown>): Promise<PlannerOutput | null> {
  const apiKey = Deno.env.get("OpenAI-API");
  if (!apiKey) return null;

  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-5-mini";
  const context = buildPlannerContext(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    signal: controller.signal,
    body: JSON.stringify({
      model,
      max_completion_tokens: 2200,
      response_format: {
        type: "json_schema",
        json_schema: planSchema
      },
      messages: [
        {
          role: "system",
          content:
            "Sei il motore di pianificazione di Mirya. Generi piani di allenamento femminili per casa, semplici, prudenti, progressivi e concreti. Non sei un medico, non fai diagnosi, non prometti trasformazioni rapide e non scrivi testo vago. Devi restituire solo JSON valido che rispetta lo schema richiesto. Il piano deve essere particolarmente accurato nei casi di donna molto magra con poco tono, sensazione di flaccidita, bisogno di ricomposizione o ricostruzione del tono. Usa soltanto exercise_id ammessi."
        },
        {
          role: "user",
          content: JSON.stringify(context)
        }
      ]
    })
  }).catch((error) => {
    console.error("OpenAI planner fetch failed", error instanceof Error ? error.message : error);
    return null;
  });

  clearTimeout(timeout);

  if (!response?.ok) {
    console.error("OpenAI planner error", await response?.text?.().catch(() => ""));
    return null;
  }

  const payload = await response.json().catch(() => null);
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return null;

  const parsed = JSON.parse(content);
  return sanitizePlannerOutput(parsed, input);
}

function buildFallbackPlan(input: Record<string, any>): PlannerOutput {
  const onboarding = input.onboarding;
  const deepProfile = input.deepProfile;
  const reassessment = input.reassessment;
  const sessions = input.sessions as Array<Record<string, any>>;
  const scheduledDates = resolveScheduledDates(onboarding.preferred_days, onboarding.days_per_week);
  const focusKey = onboarding.focus_preference ?? "tonicita_generale";
  const computedGoal = resolveComputedBodyGoal(onboarding);
  const realistic = buildRealisticOutcomes(onboarding, deepProfile);

  const weeklyPlan = Array.from({ length: 7 }, (_, dayIndex) => {
    const isWorkout = scheduledDates.workoutDayIndexes.includes(dayIndex);
    const exercises = isWorkout
      ? buildFallbackExercises(focusKey, onboarding.preferred_minutes, onboarding.gentle_start)
      : buildFallbackExercises("ripartenza_dolce", 8, true).slice(0, 2);

    return {
      day_index: dayIndex,
      scheduled_for: scheduledDates.dateByIndex[dayIndex],
      label: scheduledDates.labelByIndex[dayIndex],
      title: isWorkout ? resolveWorkoutTitle(focusKey) : "Recupero guidato",
      focus: isWorkout ? formatFocus(focusKey) : "Recupero, respiro e mobilita",
      session_kind: isWorkout ? "workout" : "recovery",
      estimated_duration_minutes: isWorkout ? onboarding.preferred_minutes : 8,
      coach_note: isWorkout
        ? buildWorkoutCoachNote(onboarding, deepProfile)
        : "Oggi lasciamo spazio a recupero e mobilita per proteggere continuita e qualita del gesto.",
      caution_notes: buildGlobalCautions(onboarding, deepProfile, reassessment),
      exercises
    } satisfies PlannerDayOutput;
  });

  return {
    profile_summary: {
      main_goal: formatBodyGoal(onboarding.primary_body_goal),
      computed_body_goal: computedGoal,
      secondary_goals: (onboarding.secondary_objectives ?? []).map(formatSecondaryGoal),
      training_level: String(onboarding.perceived_level).replaceAll("_", " "),
      weekly_availability: `${onboarding.days_per_week} sessioni da ${onboarding.preferred_minutes} minuti`,
      focus_areas: (onboarding.focus_areas ?? []).map(formatFocusArea),
      notes: buildProfileNotes(onboarding, deepProfile)
    },
    plan_overview: {
      phase_name: resolvePhaseName(onboarding, sessions.length),
      phase_duration_weeks: 4,
      weekly_sessions: onboarding.days_per_week,
      session_duration_minutes: onboarding.preferred_minutes,
      intensity: resolveIntensity(onboarding),
      strategy_explanation:
        "Partiamo da un ritmo sostenibile, con esercizi chiari e dosati, cosi il corpo puo rispondere bene prima di chiedere di piu.",
      realistic_expectations: realistic
    },
    weekly_plan: weeklyPlan,
    phase_goal: buildPhaseGoal(onboarding, computedGoal),
    phase_focus: formatFocus(focusKey),
    weekly_structure: buildWeeklyStructure(onboarding),
    current_phase: sessions.length >= 6 ? "consolidamento" : "base_guidata",
    progression_strategy:
      "Nelle prime due settimane lavoriamo su qualita del gesto, costanza e tono di base. Solo dopo valutiamo se aumentare leggermente volume o controllo.",
    progression_reason:
      "Nel tuo caso non serve partire forte: serve costruire una base che abbia davvero chance di restare nella settimana reale.",
    plan_explanation: buildPlanExplanation(onboarding, deepProfile, computedGoal),
    realistic_expected_outcomes: realistic,
    support_tips: {
      nutrition: buildNutritionTips(onboarding, deepProfile),
      recovery: buildRecoveryTips(onboarding, deepProfile),
      consistency: buildConsistencyTips(onboarding)
    },
    motivational_message:
      "Perfetto. Adesso non devi decidere tu come allenarti: hai gia una struttura chiara, misurata sul tuo momento.",
    caution_flags: buildGlobalCautions(onboarding, deepProfile, reassessment),
    adjustments: buildAdjustments(input.trigger as PlannerTrigger, reassessment),
    reassessment: {
      days_until_checkin: 14,
      checkin_focus: [
        "come risponde il tono generale",
        "quanto il ritmo resta davvero sostenibile",
        "quali esercizi senti piu utili o piu scomodi"
      ]
    }
  };
}

async function persistPlan(
  client: ReturnType<typeof createClient>,
  userId: string,
  input: Record<string, any>,
  plan: PlannerOutput,
  trigger: PlannerTrigger,
  currentPlanId: string | null,
  source: "ai" | "fallback"
) {
  if (currentPlanId) {
    await client.from("training_plans").update({ status: "archived" }).eq("id", currentPlanId).eq("user_id", userId);
  }

  const onboarding = input.onboarding;
  const summaryText = buildSummaryText(plan.profile_summary);
  const nextCheckinIso = nextReassessmentIso(plan.reassessment.days_until_checkin);

  const insertPlan = await client
    .from("training_plans")
    .insert({
      user_id: userId,
      status: "active",
      source,
      primary_body_goal: onboarding.primary_body_goal,
      computed_body_goal: plan.profile_summary.computed_body_goal,
      current_phase: plan.current_phase,
      phase_label: plan.plan_overview.phase_name,
      phase_focus: plan.phase_focus,
      phase_goal: plan.phase_goal,
      user_profile_summary: summaryText,
      profile_summary_payload: plan.profile_summary as unknown as Json,
      plan_overview_payload: plan.plan_overview as unknown as Json,
      support_tips_payload: plan.support_tips as unknown as Json,
      current_week: 1,
      total_weeks: Math.max(plan.plan_overview.phase_duration_weeks, 4),
      weekly_goal: `${plan.plan_overview.weekly_sessions} sessioni da ${plan.plan_overview.session_duration_minutes} minuti`,
      weekly_goal_minutes: plan.plan_overview.weekly_sessions * plan.plan_overview.session_duration_minutes,
      weekly_goal_sessions: plan.plan_overview.weekly_sessions,
      weekly_structure: plan.weekly_structure,
      session_difficulty: plan.plan_overview.intensity,
      progression_strategy: plan.progression_strategy,
      progression_reason: plan.progression_reason,
      motivational_note: plan.motivational_message,
      realistic_expected_outcomes: plan.realistic_expected_outcomes,
      caution_notes: plan.caution_flags,
      recovery_notes: plan.support_tips.recovery,
      adherence_strategy: plan.support_tips.consistency[0] ?? "",
      nutrition_tips: plan.support_tips.nutrition,
      plan_explanation: plan.plan_explanation,
      adjustments: plan.adjustments,
      reassessment_due_in_days: plan.reassessment.days_until_checkin,
      next_reassessment_at: nextCheckinIso
    })
    .select("id")
    .single();

  if (insertPlan.error || !insertPlan.data) throw insertPlan.error ?? new Error("Piano non salvato.");
  const planId = insertPlan.data.id;

  const daysInsert = await client
    .from("training_plan_days")
    .insert(
      plan.weekly_plan.map((day) => ({
        user_id: userId,
        plan_id: planId,
        day_index: day.day_index,
        scheduled_for: day.scheduled_for,
        title: day.title,
        focus: day.focus,
        session_kind: day.session_kind,
        estimated_minutes: day.estimated_duration_minutes,
        coach_note: day.coach_note,
        caution_notes: day.caution_notes,
        workout_payload: {
          title: day.title,
          focus: day.focus,
          estimatedMinutes: day.estimated_duration_minutes,
          coachNote: day.coach_note,
          cautionNotes: day.caution_notes,
          steps: day.exercises.map((exercise) => ({
            id: `${exercise.exercise_id}-${day.day_index}`,
            kind: "exercise",
            exerciseId: exercise.exercise_id,
            title: exercise.name,
            summary: exercise.notes,
            sets: exercise.sets,
            repsLabel: exercise.reps,
            durationSeconds: exercise.duration_seconds_estimate,
            restSeconds: exercise.rest_seconds,
            bodyArea: exercise.body_area,
            doseLabel: `${exercise.sets} serie · ${exercise.reps}`,
            executionNote: exercise.notes,
            easierOption: exercise.easier_option,
            caution: exercise.caution ?? undefined
          }))
        }
      }))
    )
    .select("id, day_index");

  if (daysInsert.error) throw daysInsert.error;
  return finalizePersist(client, userId, planId, plan, trigger, daysInsert.data ?? []);
}

async function finalizePersist(
  client: ReturnType<typeof createClient>,
  userId: string,
  planId: string,
  plan: PlannerOutput,
  trigger: PlannerTrigger,
  dayRows: Array<{ id: string; day_index: number }>
) {
  const dayIdMap = new Map<number, string>();
  dayRows.forEach((row) => dayIdMap.set(row.day_index, row.id));

  const exerciseRows = plan.weekly_plan.flatMap((day) => {
    const planDayId = dayIdMap.get(day.day_index);
    if (!planDayId) return [];

    return day.exercises.map((exercise, index) => ({
      user_id: userId,
      plan_id: planId,
      plan_day_id: planDayId,
      position_index: index,
      exercise_id: exercise.exercise_id,
      exercise_name: exercise.name,
      sets: exercise.sets,
      reps_label: exercise.reps,
      duration_seconds_estimate: exercise.duration_seconds_estimate,
      rest_seconds: exercise.rest_seconds,
      execution_note: exercise.notes,
      easier_option: exercise.easier_option,
      body_area: exercise.body_area,
      caution: exercise.caution
    }));
  });

  if (exerciseRows.length > 0) {
    const exerciseInsert = await client.from("training_plan_exercises").insert(exerciseRows);
    if (exerciseInsert.error) throw exerciseInsert.error;
  }

  const versionQuery = await client
    .from("training_plan_versions")
    .select("version_number")
    .eq("user_id", userId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  const versionNumber = (versionQuery.data?.version_number ?? 0) + 1;

  const versionInsert = await client
    .from("training_plan_versions")
    .insert({
      plan_id: planId,
      user_id: userId,
      version_number: versionNumber,
      trigger,
      payload: plan as unknown as Json,
      user_profile_summary: buildSummaryText(plan.profile_summary),
      phase_goal: plan.phase_goal,
      weekly_structure: plan.weekly_structure,
      session_difficulty: plan.plan_overview.intensity,
      progression_strategy: plan.progression_strategy,
      realistic_expected_outcomes: plan.realistic_expected_outcomes,
      motivational_message: plan.motivational_message,
      recovery_notes: plan.support_tips.recovery,
      adherence_strategy: plan.support_tips.consistency[0] ?? "",
      nutrition_tips: plan.support_tips.nutrition,
      plan_explanation: plan.plan_explanation
    })
    .select("id")
    .single();

  const versionId = versionInsert.data?.id ?? null;
  const adjustmentRows = plan.adjustments.slice(0, 3).map((description, index) => ({
    user_id: userId,
    plan_id: planId,
    plan_version_id: versionId,
    adjustment_type: index === 0 ? "focus" : "progression",
    title: index === 0 ? "Piano aggiornato" : "Adattamento del percorso",
    description
  }));

  if (adjustmentRows.length > 0) {
    await client.from("plan_adjustments").insert(adjustmentRows);
  }

  const supportTipRows = [
    ...plan.support_tips.nutrition.map((body) => ({
      user_id: userId,
      plan_id: planId,
      category: "alimentazione",
      title: "Supporto semplice per il piano",
      body
    })),
    ...plan.support_tips.recovery.map((body) => ({
      user_id: userId,
      plan_id: planId,
      category: "recupero",
      title: "Recupero e dosaggio",
      body
    })),
    ...plan.support_tips.consistency.map((body) => ({
      user_id: userId,
      plan_id: planId,
      category: "costanza",
      title: "Continuita del percorso",
      body
    }))
  ];

  if (supportTipRows.length > 0) {
    await client.from("support_tips").insert(supportTipRows);
  }

  await client
    .from("user_access")
    .upsert(
      {
        user_id: userId,
        first_plan_generated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );

  return planId;
}

function sanitizePlannerOutput(value: unknown, input: Record<string, any>): PlannerOutput | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Record<string, any>;
  const onboarding = input.onboarding;
  const scheduledDates = resolveScheduledDates(onboarding.preferred_days, onboarding.days_per_week);
  const focusKey = onboarding.focus_preference ?? "tonicita_generale";
  const cautionFlags = buildGlobalCautions(onboarding, input.deepProfile, input.reassessment);
  const profileSummary = raw.profile_summary;
  const planOverview = raw.plan_overview;
  const weeklyPlanRaw = Array.isArray(raw.weekly_plan) ? raw.weekly_plan : [];

  if (!profileSummary || !planOverview || weeklyPlanRaw.length === 0) return null;

  const normalizedWeeklyPlan = Array.from({ length: 7 }, (_, index) => {
    const candidate = weeklyPlanRaw.find((item) => item?.day_index === index);
    if (!candidate) {
      const isWorkout = scheduledDates.workoutDayIndexes.includes(index);
      return {
        day_index: index,
        scheduled_for: scheduledDates.dateByIndex[index],
        label: scheduledDates.labelByIndex[index],
        title: isWorkout ? resolveWorkoutTitle(focusKey) : "Recupero guidato",
        focus: isWorkout ? formatFocus(focusKey) : "Recupero e mobilita",
        session_kind: isWorkout ? "workout" : "recovery",
        estimated_duration_minutes: isWorkout ? onboarding.preferred_minutes : 8,
        coach_note: isWorkout ? buildWorkoutCoachNote(onboarding, input.deepProfile) : "Giornata piu leggera per lasciare spazio a recupero e mobilita.",
        caution_notes: cautionFlags,
        exercises: isWorkout ? buildFallbackExercises(focusKey, onboarding.preferred_minutes, onboarding.gentle_start) : buildFallbackExercises("ripartenza_dolce", 8, true).slice(0, 2)
      } satisfies PlannerDayOutput;
    }

    return {
      day_index: index,
      scheduled_for: scheduledDates.dateByIndex[index],
      label: typeof candidate.label === "string" ? candidate.label : scheduledDates.labelByIndex[index],
      title: typeof candidate.title === "string" ? candidate.title : candidate.session_kind === "recovery" ? "Recupero guidato" : resolveWorkoutTitle(focusKey),
      focus: typeof candidate.focus === "string" ? candidate.focus : formatFocus(focusKey),
      session_kind: candidate.session_kind === "recovery" ? "recovery" : "workout",
      estimated_duration_minutes: typeof candidate.estimated_duration_minutes === "number" ? candidate.estimated_duration_minutes : onboarding.preferred_minutes,
      coach_note: typeof candidate.coach_note === "string" ? candidate.coach_note : buildWorkoutCoachNote(onboarding, input.deepProfile),
      caution_notes: Array.isArray(candidate.caution_notes) ? candidate.caution_notes.filter((item: unknown): item is string => typeof item === "string") : cautionFlags,
      exercises: sanitizeExercises(candidate.exercises, focusKey, onboarding)
    };
  });

  return {
    profile_summary: {
      main_goal: typeof profileSummary.main_goal === "string" ? profileSummary.main_goal : formatBodyGoal(onboarding.primary_body_goal),
      computed_body_goal: typeof profileSummary.computed_body_goal === "string" ? profileSummary.computed_body_goal : resolveComputedBodyGoal(onboarding),
      secondary_goals: readStringArray(profileSummary.secondary_goals),
      training_level: typeof profileSummary.training_level === "string" ? profileSummary.training_level : String(onboarding.perceived_level).replaceAll("_", " "),
      weekly_availability: typeof profileSummary.weekly_availability === "string" ? profileSummary.weekly_availability : `${onboarding.days_per_week} sessioni da ${onboarding.preferred_minutes} minuti`,
      focus_areas: readStringArray(profileSummary.focus_areas),
      notes: readStringArray(profileSummary.notes)
    },
    plan_overview: {
      phase_name: typeof planOverview.phase_name === "string" ? planOverview.phase_name : resolvePhaseName(onboarding, (input.sessions ?? []).length),
      phase_duration_weeks: typeof planOverview.phase_duration_weeks === "number" ? planOverview.phase_duration_weeks : 4,
      weekly_sessions: typeof planOverview.weekly_sessions === "number" ? planOverview.weekly_sessions : onboarding.days_per_week,
      session_duration_minutes: typeof planOverview.session_duration_minutes === "number" ? planOverview.session_duration_minutes : onboarding.preferred_minutes,
      intensity: typeof planOverview.intensity === "string" ? planOverview.intensity : resolveIntensity(onboarding),
      strategy_explanation: typeof planOverview.strategy_explanation === "string" ? planOverview.strategy_explanation : "Partiamo con una base sostenibile e la facciamo evolvere solo se il corpo risponde bene.",
      realistic_expectations: readStringArray(planOverview.realistic_expectations)
    },
    weekly_plan: normalizedWeeklyPlan,
    phase_goal: typeof raw.phase_goal === "string" ? raw.phase_goal : buildPhaseGoal(onboarding, resolveComputedBodyGoal(onboarding)),
    phase_focus: typeof raw.phase_focus === "string" ? raw.phase_focus : formatFocus(focusKey),
    weekly_structure: readStringArray(raw.weekly_structure),
    current_phase: typeof raw.current_phase === "string" ? raw.current_phase : "base_guidata",
    progression_strategy: typeof raw.progression_strategy === "string" ? raw.progression_strategy : "Prima base e controllo, poi progressione misurata.",
    progression_reason: typeof raw.progression_reason === "string" ? raw.progression_reason : "Serve un inizio coerente con il tuo punto di partenza, non un carico troppo aggressivo.",
    plan_explanation: typeof raw.plan_explanation === "string" ? raw.plan_explanation : buildPlanExplanation(onboarding, input.deepProfile, resolveComputedBodyGoal(onboarding)),
    realistic_expected_outcomes: readStringArray(raw.realistic_expected_outcomes),
    support_tips: {
      nutrition: readStringArray(raw.support_tips?.nutrition),
      recovery: readStringArray(raw.support_tips?.recovery),
      consistency: readStringArray(raw.support_tips?.consistency)
    },
    motivational_message: typeof raw.motivational_message === "string" ? raw.motivational_message : "Hai gia una struttura chiara: adesso conta solo seguirla un passo alla volta.",
    caution_flags: readStringArray(raw.caution_flags).length > 0 ? readStringArray(raw.caution_flags) : cautionFlags,
    adjustments: readStringArray(raw.adjustments),
    reassessment: {
      days_until_checkin: typeof raw.reassessment?.days_until_checkin === "number" ? raw.reassessment.days_until_checkin : 14,
      checkin_focus: readStringArray(raw.reassessment?.checkin_focus)
    }
  };
}

function sanitizeExercises(rawExercises: unknown, focusKey: string, onboarding: Record<string, any>) {
  const parsed = Array.isArray(rawExercises) ? rawExercises : [];
  if (parsed.length === 0) {
    return buildFallbackExercises(focusKey, onboarding.preferred_minutes, onboarding.gentle_start);
  }

  return parsed
    .filter((item) => item && typeof item === "object")
    .slice(0, 6)
    .map((item) => {
      const raw = item as Record<string, any>;
      const exerciseId =
        typeof raw.exercise_id === "string" && exerciseIds.includes(raw.exercise_id)
          ? raw.exercise_id
          : focusTemplates[focusKey]?.[0] ?? "ponte-glutei";
      const exercise = exerciseCatalog[exerciseId as keyof typeof exerciseCatalog];
      return {
        name: exercise.title,
        exercise_id: exerciseId,
        sets: typeof raw.sets === "number" ? raw.sets : 2,
        reps: typeof raw.reps === "string" ? raw.reps : exercise.defaultReps,
        duration_seconds_estimate:
          typeof raw.duration_seconds_estimate === "number"
            ? raw.duration_seconds_estimate
            : inferDurationFromDose(typeof raw.reps === "string" ? raw.reps : exercise.defaultReps),
        rest_seconds: typeof raw.rest_seconds === "number" ? raw.rest_seconds : 20,
        notes: typeof raw.notes === "string" ? raw.notes : "Muoviti con controllo e fermati se perdi qualita del gesto.",
        easier_option: typeof raw.easier_option === "string" ? raw.easier_option : exercise.easierOption,
        body_area: typeof raw.body_area === "string" ? raw.body_area : exercise.bodyArea,
        caution:
          raw.caution === null || typeof raw.caution === "string"
            ? raw.caution
            : exercise.caution ?? null
      } satisfies PlannerExerciseOutput;
    });
}

function buildPlannerContext(input: Record<string, unknown>) {
  const onboarding = input.onboarding as Record<string, unknown>;
  const deepProfile = (input.deepProfile as Record<string, unknown> | null) ?? null;
  const reassessment = (input.reassessment as Record<string, unknown> | null) ?? null;
  const sessions = (input.sessions as Array<Record<string, unknown>>) ?? [];
  const currentPlan = (input.currentPlan as Record<string, unknown> | null) ?? null;

  return {
    locale: "it-IT",
    goal: "Genera un piano settimanale di tonificazione femminile a casa, prudente, personalizzato, concreto e sostenibile.",
    planner_rules: [
      "Non usare linguaggio aggressivo o da bodybuilding.",
      "Non generare allenamenti estremi, impatti alti o volume eccessivo di default.",
      "Non fare promesse irreali e non dare consigli medici.",
      "Considera bene il caso di persona magra ma con poco tono o flaccidita diffusa.",
      "Se il quadro suggerisce piu ricomposizione o ricostruzione del tono che dimagrimento, rifletti questo nella strategia.",
      "Usa solo exercise_id ammessi."
    ],
    allowed_exercises: exerciseIds.map((id) => ({
      exercise_id: id,
      name: exerciseCatalog[id as keyof typeof exerciseCatalog].title,
      body_area: exerciseCatalog[id as keyof typeof exerciseCatalog].bodyArea,
      default_reps: exerciseCatalog[id as keyof typeof exerciseCatalog].defaultReps
    })),
    user_context: {
      onboarding,
      deep_profile: deepProfile,
      latest_reassessment: reassessment,
      recent_sessions: sessions.slice(0, 8),
      current_plan_snapshot: currentPlan
    }
  };
}

function buildFallbackExercises(goal: string, preferredMinutes: number, gentleStart: boolean) {
  const ids = focusTemplates[goal] ?? focusTemplates.tonicita_generale;
  const amount = preferredMinutes <= 10 ? 4 : preferredMinutes <= 15 ? 5 : 6;
  const sets = gentleStart ? 2 : preferredMinutes >= 20 ? 3 : 2;
  const restSeconds = gentleStart ? 25 : 20;

  return ids.slice(0, amount).map((exerciseId) => {
    const exercise = exerciseCatalog[exerciseId as keyof typeof exerciseCatalog];
    const reps = exercise.defaultReps;

    return {
      name: exercise.title,
      exercise_id: exerciseId,
      sets,
      reps,
      duration_seconds_estimate: inferDurationFromDose(reps),
      rest_seconds: restSeconds,
      notes: "Muoviti con controllo, senza cercare fretta o ampiezza forzata.",
      easier_option: exercise.easierOption,
      body_area: exercise.bodyArea,
      caution: exercise.caution ?? null
    } satisfies PlannerExerciseOutput;
  });
}

function buildSummaryText(summary: PlannerOutput["profile_summary"]) {
  return `${summary.main_goal}. Focus su ${summary.focus_areas.join(", ")}. Disponibilita reale: ${summary.weekly_availability}.`;
}

function resolveScheduledDates(preferredDays: unknown, daysPerWeek: number) {
  const preferred = Array.isArray(preferredDays)
    ? preferredDays.filter((item): item is string => typeof item === "string")
    : [];
  const indexesFromPreferred = preferred
    .map((day) => mapPreferredDayToIndex(day))
    .filter((value): value is number => value !== null);
  const workoutDayIndexes =
    indexesFromPreferred.length > 0
      ? indexesFromPreferred.slice(0, daysPerWeek).sort((a, b) => a - b)
      : getDefaultWorkoutDayIndexes(daysPerWeek);
  const start = startOfWeek(new Date());
  const dateByIndex = Array.from({ length: 7 }, (_, index) => toDateKey(addDays(start, index)));
  const labelByIndex = ["Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato", "Domenica"];

  return { workoutDayIndexes, dateByIndex, labelByIndex };
}

function mapPreferredDayToIndex(day: string) {
  return { lun: 0, mar: 1, mer: 2, gio: 3, ven: 4, sab: 5, dom: 6 }[day] ?? null;
}

function getDefaultWorkoutDayIndexes(daysPerWeek: number) {
  if (daysPerWeek <= 2) return [1, 4];
  if (daysPerWeek === 3) return [1, 3, 5];
  if (daysPerWeek === 4) return [0, 2, 4, 6];
  return [0, 1, 3, 4, 6];
}

function resolveWorkoutTitle(goal: string) {
  return `${formatFocus(goal)} · sessione guidata`;
}

function formatFocus(goal: string) {
  return goal.replaceAll("_", " ");
}

function formatFocusArea(value: string) {
  return value.replaceAll("_", " ");
}

function formatBodyGoal(value: string) {
  return value.replaceAll("_", " ");
}

function formatSecondaryGoal(value: string) {
  return value.replaceAll("_", " ");
}

function resolveComputedBodyGoal(onboarding: Record<string, any>) {
  return typeof onboarding.computed_body_goal === "string" ? onboarding.computed_body_goal : "toning";
}

function resolvePhaseName(onboarding: Record<string, any>, sessionsCount: number) {
  if (onboarding.gentle_start || sessionsCount < 3) return "Riattivazione e controllo";
  if (sessionsCount < 8) return "Consolidamento del tono";
  return "Progressione misurata";
}

function resolveIntensity(onboarding: Record<string, any>) {
  if (onboarding.gentle_start) return "Delicata ma presente";
  if (onboarding.session_tone === "tonificante") return "Moderata e tonificante";
  return "Lineare e sostenibile";
}

function buildProfileNotes(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const notes = [
    `Energia media ${String(onboarding.energy_level).replaceAll("_", " ")}.`,
    `Stress ${String(onboarding.stress_level ?? "medio").replaceAll("_", " ")}.`,
    `Costanza percepita ${onboarding.consistency_score}/5.`
  ];
  if (deepProfile?.relevant_interventions) notes.push(String(deepProfile.relevant_interventions));
  if (deepProfile?.feared_exercises) notes.push(`Movimenti da gestire con cura: ${deepProfile.feared_exercises}.`);
  return notes;
}

function buildPhaseGoal(onboarding: Record<string, any>, computedGoal: string) {
  if (computedGoal === "tone_rebuild_for_lean_body") {
    return "Ricostruire tono, stabilita e presenza muscolare senza impostare il lavoro come semplice dimagrimento.";
  }
  if (computedGoal === "fat_loss") {
    return "Migliorare tono e spesa muscolare con una base sostenibile, senza stressare recupero e aderenza.";
  }
  if (computedGoal === "muscle_gain") {
    return "Creare una base di lavoro che sostenga piu tono e piu presenza muscolare nel tempo.";
  }
  if (computedGoal === "recomposition") {
    return "Lavorare su tono, forma e composizione corporea con un ingresso graduale ma concreto.";
  }
  return `Costruire tono e controllo su ${formatFocus(onboarding.focus_preference ?? "tonicita_generale")} senza chiedere troppo troppo presto.`;
}

function buildWeeklyStructure(onboarding: Record<string, any>) {
  return [
    `${onboarding.days_per_week} sedute guidate a settimana da ${onboarding.preferred_minutes} minuti.`,
    "Un focus principale chiaro, senza perdere di vista stabilita e tono generale.",
    "Giornate di recupero o mobilita per proteggere continuita e qualita del gesto.",
    "Progressione iniziale misurata su energia, costanza reale e segnali del corpo."
  ];
}

function buildRealisticOutcomes(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const items = [
    "Maggiore continuita nelle settimane e meno sensazione di ricominciare da zero.",
    "Piu controllo del movimento e migliore percezione del tono generale.",
    "Una base piu stabile per aumentare gradualmente il lavoro senza irrigidirti."
  ];
  if ((onboarding.focus_areas ?? []).includes("glutei")) {
    items.push("Glutei piu presenti nei movimenti base e nella percezione del sostegno.");
  }
  if ((onboarding.focus_areas ?? []).includes("postura") || deepProfile?.posture_perception) {
    items.push("Meno rigidita e una postura un po piu aperta nella giornata.");
  }
  return items;
}

function buildNutritionTips(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const items = [
    "Evita di saltare spesso i pasti: regolarita e recupero si aiutano a vicenda.",
    "Dai spazio a una quota proteica semplice e sostenibile nella giornata.",
    "Nei giorni piu pieni prova a non arrivare al workout completamente scarica."
  ];
  if (onboarding.low_water_intake || deepProfile?.hydration_pattern === "bassa") {
    items.unshift("Ricordati di bere con una certa continuita, anche a piccoli appoggi durante la giornata.");
  }
  return items;
}

function buildRecoveryTips(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const items = [
    "Nei giorni stanchi resta sul ritmo guidato, senza provare ad aggiungere lavoro extra.",
    "Se un movimento ti irrigidisce, riduci ampiezza o torna alla variante piu facile."
  ];
  if (deepProfile?.sensitivities?.includes?.("schiena")) {
    items.push("Quando la schiena e sensibile, lavora con lentezza e cerca meno ampiezza.");
  }
  return items;
}

function buildConsistencyTips(onboarding: Record<string, any>) {
  return [
    `Proteggi prima di tutto ${onboarding.days_per_week} appuntamenti realistici, non una settimana perfetta.`,
    "Se l'energia cala, fai comunque la versione breve: la continuita conta piu del volume.",
    "Non cambiare sessione ogni volta: lascia che il percorso faccia il suo lavoro."
  ];
}

function buildPlanExplanation(
  onboarding: Record<string, any>,
  deepProfile: Record<string, any> | null,
  computedGoal: string
) {
  const focus = (onboarding.focus_areas ?? []).map(formatFocusArea).join(", ");
  const whyNotStrong =
    onboarding.gentle_start || onboarding.energy_level === "bassa" || onboarding.energy_level === "molto_bassa"
      ? "Nel tuo caso non avrebbe senso partire forte, perche il primo obiettivo e creare continuita e controllo senza farti mollare per fatica."
      : "Anche se c'e margine per sentire lavoro, partire troppo forte non aiuterebbe a costruire un tono piu stabile nel tempo.";
  const bodyGoalLine =
    computedGoal === "tone_rebuild_for_lean_body"
      ? "Qui il punto non e dimagrire di piu, ma ricostruire tono e presenza muscolare in un corpo gia tendenzialmente asciutto."
      : computedGoal === "recomposition"
        ? "Qui lavoriamo piu su ricomposizione e qualita del tessuto che su semplice perdita di peso."
        : "";
  const sensitiveLine = deepProfile?.relevant_interventions
    ? "Terremo presenti anche alcuni dettagli corporei che hai segnalato, cosi il piano resta prudente ma non timido."
    : "Se in seguito vorrai aggiungere altri dettagli, useremo anche quelli per rendere il percorso ancora piu preciso.";

  return `Perfetto. In base ai dati che ci hai dato, partiremo con una fase iniziale orientata a costruire base, controllo e costanza. Nelle prime settimane lavoreremo soprattutto su ${focus || formatFocus(onboarding.focus_preference ?? "tonicita_generale")}, con un ritmo realistico per la tua settimana. ${whyNotStrong} ${bodyGoalLine} L'obiettivo iniziale non e inseguire una trasformazione lampo, ma creare un lavoro che inizi a darti piu sostegno, piu tono e una percezione migliore del corpo. ${sensitiveLine}`.trim();
}

function buildWorkoutCoachNote(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  if (deepProfile?.training_preference === "piu_posturale") {
    return "Oggi conta piu la qualita del gesto che la velocita. Cerca controllo, respiro e appoggi stabili.";
  }
  if (onboarding.energy_level === "molto_bassa" || onboarding.energy_level === "bassa") {
    return "Resta su un ritmo morbido: l'obiettivo e attivarti bene senza svuotarti.";
  }
  return "Segui la sequenza cosi com'e: il lavoro di oggi e gia dosato per farti sentire tono senza sovraccaricarti.";
}

function buildGlobalCautions(
  onboarding: Record<string, any>,
  deepProfile: Record<string, any> | null,
  reassessment: Record<string, any> | null
) {
  const flags: string[] = [
    "Interrompi il movimento in caso di dolore.",
    "In presenza di fastidi importanti o dubbi specifici, confrontati con un professionista qualificato."
  ];
  const limitations = onboarding.limitations ?? [];
  if (limitations.includes("addome_delicato")) flags.push("Se senti pressione addominale, riduci leva, ritmo o ampiezza.");
  if (limitations.includes("pavimento_pelvico") || deepProfile?.pelvic_signals?.length) flags.push("Se percepisci peso pelvico o fastidio nella zona, alleggerisci subito o fermati.");
  if (limitations.includes("ginocchia_sensibili")) flags.push("Con ginocchia sensibili mantieni piegamenti corti e ben controllati.");
  if (reassessment?.caution_notes) flags.push("Monitora anche i segnali emersi nell'ultima rivalutazione.");
  return flags;
}

function buildAdjustments(trigger: PlannerTrigger, reassessment: Record<string, any> | null) {
  const items = [
    "Il piano resta leggibile e lineare, cosi capisci subito cosa fare oggi senza interpretazioni tecniche.",
    "Il volume iniziale e calibrato per darti margine di continuita prima di chiederti un salto."
  ];
  if (trigger === "deep_profile_completed") items.unshift("Abbiamo corretto il piano usando dettagli piu precisi su sensibilita, movimenti temuti e contesto corporeo.");
  if (trigger === "reassessment_completed" && reassessment?.plan_fit === "troppo_difficile") items.unshift("Il ritmo e stato alleggerito di un gradino per tornare sostenibile nella tua settimana reale.");
  return items;
}

function inferDurationFromDose(reps: string) {
  const secondsMatch = reps.match(/(\d+)\s*second/i);
  if (secondsMatch) return Number(secondsMatch[1]);

  const repsMatch = reps.match(/(\d+)/);
  if (repsMatch) return Math.max(30, Math.min(Number(repsMatch[1]) * 4, 70));
  return 40;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function nextReassessmentIso(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
