import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8?target=denonext";

type Goal =
  | "glutei_gambe"
  | "pancia_core"
  | "postura"
  | "tonicita_generale"
  | "ripartenza_dolce";

type Level =
  | "molto_fuori_allenamento"
  | "principiante"
  | "intermedio_leggero";

type Feeling = "facile" | "giusto" | "impegnativo";

type EnergyLevel = "molto_bassa" | "bassa" | "media" | "buona";

type WorkoutStepPlan = {
  id: string;
  kind: "exercise";
  exerciseId: string;
  title: string;
  summary: string;
  durationSeconds: number;
  restSeconds: number;
  bodyArea: string;
  doseLabel: string;
  caution?: string;
};

type PlannerDayOutput = {
  day_index: number;
  scheduled_for: string;
  title: string;
  focus: string;
  session_kind: "workout" | "recovery";
  estimated_minutes: number;
  coach_note: string;
  caution_notes: string[];
  steps: WorkoutStepPlan[];
};

type PlannerOutput = {
  current_phase: string;
  phase_label: string;
  phase_focus: string;
  current_week: number;
  total_weeks: number;
  weekly_goal: string;
  weekly_goal_minutes: number;
  weekly_goal_sessions: number;
  today_workout: PlannerDayOutput;
  weekly_plan: PlannerDayOutput[];
  progression_reason: string;
  motivational_note: string;
  caution_notes: string[];
  adjustments: string[];
};

type PlannerContext = {
  userId: string;
  onboarding: {
    age_band: string;
    perceived_level: Level;
    primary_goal: Goal;
    days_per_week: number;
    preferred_minutes: number;
    energy_level: EnergyLevel;
    gentle_start: boolean;
    limitations: string[];
    focus_preference: Goal;
    notes: string | null;
  };
  sessions: Array<{
    status: string;
    feeling: Feeling | null;
    completed_at: string | null;
    adherence_score: number | null;
    session_summary: Record<string, unknown> | null;
  }>;
  trigger: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const exerciseCatalog = {
  "ponte-glutei": {
    title: "Ponte glutei",
    summary: "Attiva glutei e retro coscia con un gesto semplice e controllato.",
    bodyArea: "Glutei e retro coscia",
    doseLabel: "Movimento lento e pieno",
    caution: "Riduci l'ampiezza se senti pressione nella zona lombare."
  },
  "squat-alla-sedia": {
    title: "Squat alla sedia",
    summary: "Rinforza gambe e glutei con un riferimento sicuro e chiaro.",
    bodyArea: "Gambe e glutei",
    doseLabel: "Discesa controllata e risalita stabile"
  },
  "wall-sit": {
    title: "Wall sit",
    summary: "Una tenuta essenziale per dare tono a cosce e glutei senza impatto.",
    bodyArea: "Cosce e glutei",
    doseLabel: "Mantieni una seduta comoda"
  },
  "slanci-laterali-in-piedi": {
    title: "Slanci laterali in piedi",
    summary: "Lavora sul lato del gluteo e sulla stabilita del bacino.",
    bodyArea: "Gluteo laterale e anche",
    doseLabel: "Ampiezza piccola ma precisa"
  },
  "affondo-assistito-indietro": {
    title: "Affondo assistito indietro",
    summary: "Coinvolge gambe e glutei con un appoggio rassicurante.",
    bodyArea: "Gambe e glutei",
    doseLabel: "Passo corto e busto alto"
  },
  "bird-dog": {
    title: "Bird dog",
    summary: "Allena centro, schiena e glutei senza fretta e senza impatto.",
    bodyArea: "Core, schiena, glutei",
    doseLabel: "Allungo pulito e stabile",
    caution: "Riduci l'ampiezza se senti instabilita addominale."
  },
  "dead-bug-semplificato": {
    title: "Dead bug semplificato",
    summary: "Aiuta il controllo del core con movimenti piccoli e coordinati.",
    bodyArea: "Core e respiro",
    doseLabel: "Tallone giu lentamente",
    caution: "Torna alla variante piu facile se senti pressione addominale."
  },
  "heel-slides": {
    title: "Heel slides",
    summary: "Scivolamenti delicati per ritrovare sostegno del centro.",
    bodyArea: "Addome profondo e bacino",
    doseLabel: "Bacino calmo, gesto corto"
  },
  "ponte-con-marcia": {
    title: "Ponte con marcia",
    summary: "Una progressione del ponte per stabilita di glutei e bacino.",
    bodyArea: "Glutei e core",
    doseLabel: "Bacino fermo, sollevamento piccolo"
  },
  "sollevamenti-polpacci": {
    title: "Sollevamenti polpacci",
    summary: "Rende piu presenti caviglie, polpacci e appoggio del piede.",
    bodyArea: "Polpacci e caviglie",
    doseLabel: "Sali e scendi con controllo"
  },
  "side-leg-lifts": {
    title: "Side leg lifts",
    summary: "Aiuta il lato del gluteo e la stabilita del fianco.",
    bodyArea: "Gluteo laterale",
    doseLabel: "Sollevamento controllato"
  },
  "respirazione-addominale-profonda": {
    title: "Respirazione con attivazione addominale profonda",
    summary: "Rimette al centro respiro, controllo e tono di base.",
    bodyArea: "Respiro e addome profondo",
    doseLabel: "Espira lungo e morbido",
    caution: "Interrompi se il respiro diventa teso o compare fastidio pelvico."
  },
  "mobilita-bacino-colonna": {
    title: "Mobilita bacino e colonna",
    summary: "Piccoli movimenti fluidi per sciogliere la zona lombare.",
    bodyArea: "Bacino e colonna",
    doseLabel: "Dondolio piccolo e continuo"
  },
  "scapole-al-muro": {
    title: "Scapole al muro",
    summary: "Aiuta postura, apertura del torace e stabilita della parte alta.",
    bodyArea: "Schiena alta e spalle",
    doseLabel: "Spalle lontane dalle orecchie"
  },
  "allungamento-petto-parete": {
    title: "Allungamento petto parete",
    summary: "Apertura dolce per alleggerire spalle e torace.",
    bodyArea: "Petto e spalle",
    doseLabel: "Allungamento morbido"
  }
} as const;

const programTemplates = {
  gentle_reset: {
    title: "Reset dolce",
    focus: "Ripartenza e controllo",
    exerciseIds: [
      "respirazione-addominale-profonda",
      "heel-slides",
      "ponte-glutei",
      "mobilita-bacino-colonna",
      "allungamento-petto-parete"
    ]
  },
  glutei_foundation: {
    title: "Glutei e gambe base",
    focus: "Glutei e gambe",
    exerciseIds: [
      "ponte-glutei",
      "squat-alla-sedia",
      "wall-sit",
      "slanci-laterali-in-piedi",
      "sollevamenti-polpacci"
    ]
  },
  glutei_progression: {
    title: "Glutei e gambe presenti",
    focus: "Glutei, gambe e stabilita",
    exerciseIds: [
      "ponte-glutei",
      "affondo-assistito-indietro",
      "side-leg-lifts",
      "wall-sit",
      "sollevamenti-polpacci"
    ]
  },
  core_posture: {
    title: "Core e postura",
    focus: "Centro e appoggio",
    exerciseIds: [
      "respirazione-addominale-profonda",
      "heel-slides",
      "dead-bug-semplificato",
      "bird-dog",
      "scapole-al-muro"
    ]
  },
  total_body: {
    title: "Total body tonificante",
    focus: "Tonicita generale",
    exerciseIds: [
      "squat-alla-sedia",
      "ponte-glutei",
      "bird-dog",
      "sollevamenti-polpacci",
      "scapole-al-muro"
    ]
  },
  recovery_flow: {
    title: "Recupero guidato",
    focus: "Mobilita e recupero",
    exerciseIds: [
      "respirazione-addominale-profonda",
      "mobilita-bacino-colonna",
      "allungamento-petto-parete",
      "scapole-al-muro"
    ]
  }
} as const;

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = request.headers.get("Authorization");

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey || !authHeader) {
      return jsonResponse(
        { error: "Configurazione Supabase incompleta o token assente." },
        401
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: authError
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "Utente non autenticato." }, 401);
    }

    const body = (await request.json().catch(() => ({}))) as { trigger?: string };

    const context = await loadPlannerContext(adminClient, user.id, body.trigger ?? "manual");
    const plan = await buildPlan(context);
    const persistedPlanId = await persistPlan(adminClient, user.id, plan);

    return jsonResponse({
      plan,
      persisted_plan_id: persistedPlanId,
      source: hasAiConfig() ? "ai" : "fallback"
    });
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error ? error.message : "Errore interno nel planner."
      },
      500
    );
  }
});

async function loadPlannerContext(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
  trigger: string
): Promise<PlannerContext> {
  const [onboardingResult, sessionsResult] = await Promise.all([
    adminClient
      .from("user_onboarding")
      .select("*")
      .eq("user_id", userId)
      .single(),
    adminClient
      .from("workout_sessions")
      .select("status, feeling, completed_at, adherence_score, session_summary")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(20)
  ]);

  if (onboardingResult.error || !onboardingResult.data) {
    throw new Error("Onboarding non trovato per questo utente.");
  }

  if (sessionsResult.error) {
    throw new Error(sessionsResult.error.message);
  }

  return {
    userId,
    onboarding: onboardingResult.data as PlannerContext["onboarding"],
    sessions:
      (sessionsResult.data as PlannerContext["sessions"] | null | undefined) ?? [],
    trigger
  };
}

async function buildPlan(context: PlannerContext): Promise<PlannerOutput> {
  const aiPlan = await tryAiPlanner(context);
  if (aiPlan) {
    return aiPlan;
  }

  return buildFallbackPlan(context);
}

async function tryAiPlanner(context: PlannerContext) {
  if (!hasAiConfig()) {
    return null;
  }

  const response = await fetch(Deno.env.get("AI_API_URL") as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("AI_API_KEY")}`
    },
    body: JSON.stringify({
      model: Deno.env.get("AI_MODEL") ?? "planner-beta",
      input: context,
      system:
        "Sei il planner controllato di Mirya. Restituisci solo JSON conforme allo schema richiesto, senza testo libero.",
      schema: {
        current_phase: "string",
        phase_label: "string",
        phase_focus: "string",
        current_week: "number",
        total_weeks: "number",
        weekly_goal: "string",
        weekly_goal_minutes: "number",
        weekly_goal_sessions: "number",
        today_workout: "PlannerDayOutput",
        weekly_plan: "PlannerDayOutput[]",
        progression_reason: "string",
        motivational_note: "string",
        caution_notes: "string[]",
        adjustments: "string[]"
      }
    })
  });

  if (!response.ok) {
    return null;
  }

  const raw = await response.json().catch(() => null);
  const plan = raw?.plan ?? raw;

  if (!isPlannerOutput(plan)) {
    return null;
  }

  return plan;
}

function buildFallbackPlan(context: PlannerContext): PlannerOutput {
  const onboarding = context.onboarding;
  const completedSessions = context.sessions.filter((session) => session.status === "completed");
  const recentFeelings = completedSessions
    .map((session) => session.feeling)
    .filter((value): value is Feeling => Boolean(value));
  const adherenceAverage = average(
    completedSessions
      .map((session) => session.adherence_score)
      .filter((value): value is number => typeof value === "number")
  );
  const currentWeek = Math.min(
    6,
    Math.max(1, Math.floor(completedSessions.length / onboarding.days_per_week) + 1)
  );
  const phaseMeta = resolvePhaseMeta(currentWeek);
  const weeklyGoalSessions = onboarding.days_per_week;
  const weeklyGoalMinutes = onboarding.days_per_week * onboarding.preferred_minutes;
  const adjustments = buildAdjustments(onboarding, recentFeelings, adherenceAverage);
  const cautionNotes = buildGlobalCautions(onboarding.limitations);
  const workoutDayIndexes = getWorkoutDayIndexes(onboarding.days_per_week);
  const templates = buildTemplateSequence(onboarding);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weeklyPlan = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const scheduledFor = toDateKey(date);
    const isWorkoutDay = workoutDayIndexes.includes(index);
    const templateKey = isWorkoutDay
      ? templates[Math.min(workoutDayIndexes.indexOf(index), templates.length - 1)]
      : "recovery_flow";
    const estimatedMinutes = isWorkoutDay
      ? onboarding.preferred_minutes
      : Math.min(10, onboarding.preferred_minutes);
    const workout = buildWorkout(templateKey, estimatedMinutes, onboarding, currentWeek);
    const coachNote = isWorkoutDay
      ? buildWorkoutCoachNote(onboarding, phaseMeta.label)
      : "Oggi il lavoro resta leggero: recupero, respiro e mobilita per sostenere la costanza.";

    return {
      day_index: index,
      scheduled_for: scheduledFor,
      title: workout.title,
      focus: workout.focus,
      session_kind: isWorkoutDay ? "workout" : "recovery",
      estimated_minutes: estimatedMinutes,
      coach_note: coachNote,
      caution_notes: workout.cautionNotes,
      steps: workout.steps
    } satisfies PlannerDayOutput;
  });

  return {
    current_phase: phaseMeta.id,
    phase_label: phaseMeta.label,
    phase_focus: phaseMeta.focus,
    current_week: currentWeek,
    total_weeks: 6,
    weekly_goal: `Completa ${weeklyGoalSessions} sessioni ben distribuite, senza rincorrere intensita inutili.`,
    weekly_goal_minutes: weeklyGoalMinutes,
    weekly_goal_sessions: weeklyGoalSessions,
    today_workout: weeklyPlan[0],
    weekly_plan: weeklyPlan,
    progression_reason: phaseMeta.reason,
    motivational_note: phaseMeta.note,
    caution_notes: cautionNotes,
    adjustments
  };
}

function buildWorkout(
  templateKey: keyof typeof programTemplates,
  estimatedMinutes: number,
  onboarding: PlannerContext["onboarding"],
  currentWeek: number
) {
  const template = programTemplates[templateKey];
  const isGentle =
    onboarding.gentle_start ||
    onboarding.perceived_level === "molto_fuori_allenamento" ||
    onboarding.energy_level === "molto_bassa";
  const stepCount = template.exerciseIds.length;
  const restSeconds = isGentle ? 20 : currentWeek >= 5 ? 15 : 18;
  const totalRest = restSeconds * Math.max(stepCount - 1, 0);
  const workSeconds = Math.max(
    30,
    Math.round((estimatedMinutes * 60 - totalRest) / Math.max(stepCount, 1))
  );

  const steps = template.exerciseIds.map((exerciseId, index) => {
    const item = exerciseCatalog[exerciseId as keyof typeof exerciseCatalog];

    return {
      id: `${templateKey}-${index}`,
      kind: "exercise",
      exerciseId,
      title: item.title,
      summary: item.summary,
      durationSeconds: workSeconds,
      restSeconds: index === stepCount - 1 ? 0 : restSeconds,
      bodyArea: item.bodyArea,
      doseLabel: item.doseLabel,
      caution: item.caution
    } satisfies WorkoutStepPlan;
  });

  const cautionNotes = Array.from(
    new Set(
      [
        ...buildGlobalCautions(onboarding.limitations),
        ...steps
          .map((step) => step.caution)
          .filter((value): value is string => typeof value === "string")
      ].filter(Boolean)
    )
  );

  return {
    title: template.title,
    focus: template.focus,
    cautionNotes,
    steps
  };
}

function buildTemplateSequence(onboarding: PlannerContext["onboarding"]) {
  switch (onboarding.focus_preference) {
    case "glutei_gambe":
      return ["glutei_foundation", "core_posture", "glutei_progression", "total_body", "core_posture"] as const;
    case "pancia_core":
      return ["core_posture", "gentle_reset", "core_posture", "total_body", "core_posture"] as const;
    case "postura":
      return ["core_posture", "recovery_flow", "total_body", "core_posture", "gentle_reset"] as const;
    case "ripartenza_dolce":
      return ["gentle_reset", "recovery_flow", "gentle_reset", "core_posture", "gentle_reset"] as const;
    case "tonicita_generale":
    default:
      return ["total_body", "core_posture", "glutei_foundation", "total_body", "gentle_reset"] as const;
  }
}

function buildAdjustments(
  onboarding: PlannerContext["onboarding"],
  recentFeelings: Feeling[],
  adherenceAverage: number
) {
  const adjustments: string[] = [];

  if (onboarding.gentle_start || onboarding.perceived_level === "molto_fuori_allenamento") {
    adjustments.push("La progressione resta morbida per consolidare base e controllo.");
  }

  if (recentFeelings.filter((item) => item === "impegnativo").length >= 2) {
    adjustments.push("Abbassiamo leggermente la richiesta per proteggere continuita e recupero.");
  }

  if (adherenceAverage > 84 && recentFeelings.includes("facile")) {
    adjustments.push("Possiamo rendere il ritmo un po piu presente senza uscire da una soglia sostenibile.");
  }

  if (adjustments.length === 0) {
    adjustments.push("Manteniamo una progressione lineare per rafforzare la costanza settimana dopo settimana.");
  }

  return adjustments;
}

function buildGlobalCautions(limitations: string[]) {
  const notes = [
    "Interrompi il movimento in caso di dolore.",
    "Se compaiono fastidi addominali o pelvici, riduci il gesto o fermati.",
    "In presenza di dubbi specifici, confrontati con un professionista qualificato."
  ];

  if (limitations.includes("addome_delicato") || limitations.includes("pavimento_pelvico")) {
    notes.unshift("Mantieni il lavoro addominale su ampiezze piccole e respirazione morbida.");
  }

  if (limitations.includes("lombare_delicata")) {
    notes.unshift("Privilegia appoggi stabili e ampiezze controllate per proteggere la zona lombare.");
  }

  if (limitations.includes("ginocchia_sensibili")) {
    notes.unshift("Tieni piegamenti e affondi su profondita ridotte e ben controllate.");
  }

  return Array.from(new Set(notes));
}

function buildWorkoutCoachNote(
  onboarding: PlannerContext["onboarding"],
  phaseLabel: string
) {
  const focusMap: Record<Goal, string> = {
    glutei_gambe: "Oggi diamo presenza a gambe e glutei, senza irrigidire il gesto.",
    pancia_core: "Oggi il centro del corpo guida il ritmo con controllo e respiro.",
    postura: "Oggi lavoriamo su appoggio, apertura e qualita del movimento.",
    tonicita_generale: "Oggi il lavoro resta armonioso: tono diffuso, non intensita dura.",
    ripartenza_dolce: "Oggi conta soprattutto sentirti stabile, non fare di piu."
  };

  return `${focusMap[onboarding.focus_preference]} ${phaseLabel} significa costruire costanza prima di aumentare il carico.`;
}

function resolvePhaseMeta(currentWeek: number) {
  if (currentWeek <= 2) {
    return {
      id: "base_controllo",
      label: "Base e controllo",
      focus: "Stabilita, respiro e fiducia nel gesto",
      reason: "Stai costruendo base e controllo, non intensita.",
      note: "Il corpo risponde meglio quando il ritmo resta chiaro e ripetibile."
    };
  }

  if (currentWeek <= 4) {
    return {
      id: "tono_costante",
      label: "Tono costante",
      focus: "Continuita, tono percepibile e sostegno del centro",
      reason: "Stai consolidando il tono, prima di aumentare la richiesta.",
      note: "Questa fase serve a rendere il lavoro piu presente senza perdere sostenibilita."
    };
  }

  return {
    id: "consolidamento",
    label: "Consolidamento",
    focus: "Piu presenza muscolare, stessa chiarezza",
    reason: "Ora puoi dare piu pienezza al gesto, mantenendo equilibrio e precisione.",
    note: "La progressione resta sobria: piu tono, stessa qualita di movimento."
  };
}

function getWorkoutDayIndexes(daysPerWeek: number) {
  const patternMap: Record<number, number[]> = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 6]
  };

  return patternMap[daysPerWeek] ?? [0, 2, 4];
}

async function persistPlan(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
  plan: PlannerOutput
) {
  const archiveResult = await adminClient
    .from("training_plans")
    .update({ status: "archived" })
    .eq("user_id", userId)
    .eq("status", "active");

  if (archiveResult.error) {
    throw new Error(archiveResult.error.message);
  }

  const planInsert = await adminClient
    .from("training_plans")
    .insert({
      user_id: userId,
      status: "active",
      source: hasAiConfig() ? "ai" : "fallback",
      current_phase: plan.current_phase,
      phase_label: plan.phase_label,
      phase_focus: plan.phase_focus,
      current_week: plan.current_week,
      total_weeks: plan.total_weeks,
      weekly_goal: plan.weekly_goal,
      weekly_goal_minutes: plan.weekly_goal_minutes,
      weekly_goal_sessions: plan.weekly_goal_sessions,
      progression_reason: plan.progression_reason,
      motivational_note: plan.motivational_note,
      caution_notes: plan.caution_notes,
      adjustments: plan.adjustments
    })
    .select("id")
    .single();

  if (planInsert.error || !planInsert.data) {
    throw new Error(planInsert.error?.message ?? "Impossibile salvare il piano.");
  }

  const dayRows = plan.weekly_plan.map((day) => ({
    user_id: userId,
    plan_id: planInsert.data.id,
    day_index: day.day_index,
    scheduled_for: day.scheduled_for,
    title: day.title,
    focus: day.focus,
    session_kind: day.session_kind,
    estimated_minutes: day.estimated_minutes,
    status: "planned",
    coach_note: day.coach_note,
    caution_notes: day.caution_notes,
    workout_payload: {
      title: day.title,
      focus: day.focus,
      estimatedMinutes: day.estimated_minutes,
      coachNote: day.coach_note,
      cautionNotes: day.caution_notes,
      steps: day.steps
    }
  }));

  const dayInsert = await adminClient.from("training_plan_days").insert(dayRows);

  if (dayInsert.error) {
    throw new Error(dayInsert.error.message);
  }

  return planInsert.data.id;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function hasAiConfig() {
  return Boolean(Deno.env.get("AI_API_URL") && Deno.env.get("AI_API_KEY"));
}

function isPlannerOutput(value: unknown): value is PlannerOutput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.current_phase === "string" &&
    typeof record.phase_label === "string" &&
    typeof record.phase_focus === "string" &&
    typeof record.current_week === "number" &&
    typeof record.total_weeks === "number" &&
    typeof record.weekly_goal === "string" &&
    Array.isArray(record.weekly_plan) &&
    typeof record.progression_reason === "string" &&
    typeof record.motivational_note === "string"
  );
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
