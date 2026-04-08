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

interface WorkoutStepPlan {
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
}

interface PlannerDayOutput {
  day_index: number;
  scheduled_for: string;
  title: string;
  focus: string;
  session_kind: "workout" | "recovery";
  estimated_minutes: number;
  coach_note: string;
  caution_notes: string[];
  steps: WorkoutStepPlan[];
}

interface PlannerOutput {
  user_profile_summary: string;
  current_phase: string;
  phase_label: string;
  phase_focus: string;
  phase_goal: string;
  current_week: number;
  total_weeks: number;
  weekly_goal: string;
  weekly_goal_minutes: number;
  weekly_goal_sessions: number;
  weekly_structure: string[];
  today_workout: PlannerDayOutput;
  weekly_plan: PlannerDayOutput[];
  session_difficulty: string;
  progression_strategy: string;
  progression_reason: string;
  realistic_expected_outcomes: string[];
  motivational_message: string;
  caution_flags: string[];
  recovery_notes: string[];
  adherence_strategy: string;
  nutrition_tips: string[];
  plan_explanation: string;
  adjustments: string[];
  reassessment_due_in_days: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const exerciseCatalog = {
  "ponte-glutei": { title: "Ponte glutei", bodyArea: "Glutei e retro coscia", caution: "Riduci l'altezza se senti la schiena." },
  "squat-alla-sedia": { title: "Squat alla sedia", bodyArea: "Gambe e glutei" },
  "wall-sit": { title: "Wall sit", bodyArea: "Cosce e glutei" },
  "slanci-laterali-in-piedi": { title: "Slanci laterali in piedi", bodyArea: "Gluteo laterale e anche" },
  "affondo-assistito-indietro": { title: "Affondo assistito indietro", bodyArea: "Glutei, cosce, equilibrio" },
  "bird-dog": { title: "Bird dog", bodyArea: "Core, schiena, glutei", caution: "Riduci l'ampiezza se perdi stabilita addominale." },
  "heel-slides": { title: "Heel slides", bodyArea: "Addome profondo e bacino" },
  "dead-bug-semplificato": { title: "Dead bug semplificato", bodyArea: "Core e coordinazione", caution: "Torna alla variante facile se senti pressione addominale." },
  "ponte-con-marcia": { title: "Ponte con marcia", bodyArea: "Glutei e stabilita del bacino" },
  "sollevamenti-polpacci": { title: "Sollevamenti polpacci", bodyArea: "Polpacci e caviglie" },
  "side-leg-lifts": { title: "Side leg lifts", bodyArea: "Gluteo laterale e anche" },
  "respirazione-addominale-profonda": { title: "Respirazione con attivazione addominale profonda", bodyArea: "Respiro, addome profondo, pavimento pelvico" },
  "mobilita-bacino-colonna": { title: "Mobilita bacino e colonna", bodyArea: "Bacino e colonna" },
  "scapole-al-muro": { title: "Scapole al muro", bodyArea: "Schiena alta e spalle" },
  "allungamento-petto-parete": { title: "Apertura del petto alla parete", bodyArea: "Petto e spalle" }
} as const;

const workoutTemplates: Record<string, string[]> = {
  glutei_gambe: [
    "ponte-glutei",
    "squat-alla-sedia",
    "slanci-laterali-in-piedi",
    "wall-sit",
    "sollevamenti-polpacci"
  ],
  pancia_core: [
    "respirazione-addominale-profonda",
    "heel-slides",
    "bird-dog",
    "dead-bug-semplificato",
    "ponte-con-marcia"
  ],
  postura: [
    "mobilita-bacino-colonna",
    "scapole-al-muro",
    "allungamento-petto-parete",
    "bird-dog",
    "respirazione-addominale-profonda"
  ],
  tonicita_generale: [
    "squat-alla-sedia",
    "ponte-glutei",
    "bird-dog",
    "sollevamenti-polpacci",
    "scapole-al-muro"
  ],
  ripartenza_dolce: [
    "respirazione-addominale-profonda",
    "heel-slides",
    "ponte-glutei",
    "mobilita-bacino-colonna",
    "allungamento-petto-parete"
  ]
};

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

    const authHeader = request.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: authError
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "Utente non autenticata." }, 401);
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
        { error: "Il primo piano e gia stato generato. Gli aggiornamenti successivi fanno parte di Premium." },
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

    const aiPlan = await tryAiPlan(plannerInput);
    const plan = aiPlan ?? buildFallbackPlan(plannerInput);
    const source = aiPlan ? "ai" : "fallback";
    const persistedPlanId = await persistPlan(
      adminClient,
      user.id,
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

async function tryAiPlan(input: Record<string, unknown>) {
  const aiUrl = Deno.env.get("AI_API_URL");
  const aiKey = Deno.env.get("AI_API_KEY");
  if (!aiUrl || !aiKey) return null;

  const response = await fetch(aiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${aiKey}`
    },
    body: JSON.stringify({
      model: Deno.env.get("AI_MODEL") ?? "gpt-5.4-mini",
      input,
      response_format: { type: "json_object" }
    })
  }).catch(() => null);

  if (!response?.ok) return null;
  const payload = await response.json().catch(() => null);
  const candidate = payload?.plan ?? payload?.output ?? payload;
  return isPlannerOutput(candidate) ? candidate : null;
}

function buildFallbackPlan(input: Record<string, any>): PlannerOutput {
  const onboarding = input.onboarding;
  const deepProfile = input.deepProfile;
  const reassessment = input.reassessment;
  const sessions = input.sessions as Array<Record<string, any>>;
  const trigger = input.trigger as PlannerTrigger;
  const preferredGoal = reassessment?.new_focus && !reassessment?.keep_current_focus
    ? reassessment.new_focus
    : onboarding.focus_preference;
  const phase = resolvePhaseMeta(trigger, sessions.length, onboarding.gentle_start, reassessment?.plan_fit);
  const workoutDays = getWorkoutDayIndexes(onboarding.days_per_week);
  const weeklyPlan = Array.from({ length: 7 }, (_, index) =>
    buildWorkoutDay(index, workoutDays.includes(index), onboarding.preferred_minutes, preferredGoal, phase.label, onboarding, deepProfile)
  );
  const todayWorkout = weeklyPlan.find((day) => day.session_kind === "workout") ?? weeklyPlan[0];
  const cautionFlags = buildGlobalCautions(onboarding, deepProfile, reassessment);

  return {
    user_profile_summary: buildUserProfileSummary(onboarding, deepProfile),
    current_phase: phase.key,
    phase_label: phase.label,
    phase_focus: formatFocus(preferredGoal),
    phase_goal: buildPhaseGoal(onboarding, deepProfile, phase.label),
    current_week: Math.max(1, Math.min(4, Math.floor(sessions.length / Math.max(onboarding.days_per_week, 1)) + 1)),
    total_weeks: 4,
    weekly_goal: `Allenarti ${onboarding.days_per_week} volte con sessioni da ${onboarding.preferred_minutes} minuti e una percezione di lavoro sostenibile.`,
    weekly_goal_minutes: onboarding.days_per_week * onboarding.preferred_minutes,
    weekly_goal_sessions: onboarding.days_per_week,
    weekly_structure: buildWeeklyStructure(onboarding, preferredGoal),
    today_workout: todayWorkout,
    weekly_plan: weeklyPlan,
    session_difficulty: describeDifficulty(onboarding, deepProfile, reassessment),
    progression_strategy: describeProgressionStrategy(phase.label),
    progression_reason: phase.reason,
    realistic_expected_outcomes: buildRealisticOutcomes(onboarding, deepProfile),
    motivational_message: buildCoachMessage(onboarding),
    caution_flags: cautionFlags,
    recovery_notes: buildRecoveryNotes(onboarding, deepProfile),
    adherence_strategy: describeAdherenceStrategy(onboarding),
    nutrition_tips: buildNutritionTips(deepProfile),
    plan_explanation: buildPlanExplanation(onboarding, deepProfile, phase.label),
    adjustments: buildAdjustments(trigger, reassessment),
    reassessment_due_in_days: 14
  };
}

function buildWorkoutDay(
  dayIndex: number,
  isWorkout: boolean,
  preferredMinutes: number,
  goal: string,
  phaseLabel: string,
  onboarding: Record<string, any>,
  deepProfile: Record<string, any> | null
): PlannerDayOutput {
  const scheduledFor = toDateKey(addDays(startOfWeek(new Date()), dayIndex));
  if (!isWorkout) {
    return {
      day_index: dayIndex,
      scheduled_for: scheduledFor,
      title: "Recupero guidato",
      focus: "Mobilita, respiro e scarico",
      session_kind: "recovery",
      estimated_minutes: 10,
      coach_note: "Oggi conta il recupero: sciogli, respira e conserva energia per la prossima sessione.",
      caution_notes: [],
      steps: buildTemplateSequence("ripartenza_dolce", 10, true)
    };
  }

  return {
    day_index: dayIndex,
    scheduled_for: scheduledFor,
    title: resolveWorkoutTitle(goal, phaseLabel),
    focus: resolveWorkoutFocus(goal),
    session_kind: "workout",
    estimated_minutes: preferredMinutes,
    coach_note: buildWorkoutCoachNote(onboarding, deepProfile),
    caution_notes: buildGlobalCautions(onboarding, deepProfile, null),
    steps: buildTemplateSequence(goal, preferredMinutes, onboarding.gentle_start)
  };
}

function buildTemplateSequence(goal: string, preferredMinutes: number, gentleStart: boolean) {
  const ids = workoutTemplates[goal] ?? workoutTemplates.tonicita_generale;
  const rounds = preferredMinutes <= 10 ? 4 : preferredMinutes <= 15 ? 5 : 6;
  return ids.slice(0, rounds).map((exerciseId, index) => {
    const exercise = exerciseCatalog[exerciseId as keyof typeof exerciseCatalog];
    const durationSeconds = gentleStart ? 35 : 40;
    const restSeconds = gentleStart ? 25 : 20;
    return {
      id: `${exerciseId}-${index}`,
      kind: "exercise" as const,
      exerciseId,
      title: exercise.title,
      summary: `Movimento guidato per ${exercise.bodyArea.toLowerCase()}.`,
      durationSeconds,
      restSeconds,
      bodyArea: exercise.bodyArea,
      doseLabel: `${durationSeconds} secondi`,
      caution: exercise.caution
    };
  });
}

async function persistPlan(
  client: ReturnType<typeof createClient>,
  userId: string,
  plan: PlannerOutput,
  trigger: PlannerTrigger,
  currentPlanId: string | null,
  source: "ai" | "fallback"
) {
  if (currentPlanId) {
    await client.from("training_plans").update({ status: "archived" }).eq("id", currentPlanId).eq("user_id", userId);
  }

  const insertPlan = await client
    .from("training_plans")
    .insert({
      user_id: userId,
      status: "active",
      source,
      current_phase: plan.current_phase,
      phase_label: plan.phase_label,
      phase_focus: plan.phase_focus,
      phase_goal: plan.phase_goal,
      user_profile_summary: plan.user_profile_summary,
      current_week: plan.current_week,
      total_weeks: plan.total_weeks,
      weekly_goal: plan.weekly_goal,
      weekly_goal_minutes: plan.weekly_goal_minutes,
      weekly_goal_sessions: plan.weekly_goal_sessions,
      weekly_structure: plan.weekly_structure,
      session_difficulty: plan.session_difficulty,
      progression_strategy: plan.progression_strategy,
      progression_reason: plan.progression_reason,
      motivational_note: plan.motivational_message,
      realistic_expected_outcomes: plan.realistic_expected_outcomes,
      caution_notes: plan.caution_flags,
      recovery_notes: plan.recovery_notes,
      adherence_strategy: plan.adherence_strategy,
      nutrition_tips: plan.nutrition_tips,
      plan_explanation: plan.plan_explanation,
      adjustments: plan.adjustments,
      reassessment_due_in_days: plan.reassessment_due_in_days,
      next_reassessment_at: nextReassessmentIso(plan.reassessment_due_in_days)
    })
    .select("id")
    .single();

  if (insertPlan.error || !insertPlan.data) throw insertPlan.error ?? new Error("Piano non salvato.");
  const planId = insertPlan.data.id;

  await client.from("training_plan_days").insert(
    plan.weekly_plan.map((day) => ({
      user_id: userId,
      plan_id: planId,
      day_index: day.day_index,
      scheduled_for: day.scheduled_for,
      title: day.title,
      focus: day.focus,
      session_kind: day.session_kind,
      estimated_minutes: day.estimated_minutes,
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
    }))
  );

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
      user_profile_summary: plan.user_profile_summary,
      phase_goal: plan.phase_goal,
      weekly_structure: plan.weekly_structure,
      session_difficulty: plan.session_difficulty,
      progression_strategy: plan.progression_strategy,
      realistic_expected_outcomes: plan.realistic_expected_outcomes,
      motivational_message: plan.motivational_message,
      recovery_notes: plan.recovery_notes,
      adherence_strategy: plan.adherence_strategy,
      nutrition_tips: plan.nutrition_tips,
      plan_explanation: plan.plan_explanation
    })
    .select("id")
    .single();

  const versionId = versionInsert.data?.id ?? null;

  await client.from("plan_adjustments").insert(
    plan.adjustments.slice(0, 3).map((description, index) => ({
      user_id: userId,
      plan_id: planId,
      plan_version_id: versionId,
      adjustment_type: index === 0 ? "focus" : "rhythm",
      title: index === 0 ? "Piano aggiornato" : "Adattamento del ritmo",
      description
    }))
  );

  await client.from("support_tips").insert(
    [
      ...plan.nutrition_tips.slice(0, 2).map((body) => ({
        user_id: userId,
        plan_id: planId,
        category: "alimentazione",
        title: "Supporto semplice per il recupero",
        body
      })),
      ...plan.recovery_notes.slice(0, 2).map((body) => ({
        user_id: userId,
        plan_id: planId,
        category: "recupero",
        title: "Un appoggio per tenere il ritmo",
        body
      }))
    ]
  );

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

function buildUserProfileSummary(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const name = onboarding.full_name ? `${onboarding.full_name}, ` : "";
  const focus = formatFocus(onboarding.focus_preference);
  const energy =
    onboarding.energy_level === "molto_bassa" || onboarding.energy_level === "bassa"
      ? "con energia da dosare bene"
      : "con un margine di lavoro abbastanza gestibile";
  const detail = deepProfile?.priority_area
    ? ` Abbiamo anche considerato un'attenzione extra su ${formatFocus(
        deepProfile.priority_area
      )}.`
    : " Per ora il piano si basa sui tuoi dati essenziali e si raffinera meglio con le prossime risposte.";

  return `${name}${onboarding.age_band?.replace(
    "_",
    "-"
  )} anni circa, livello ${String(onboarding.perceived_level).replaceAll(
    "_",
    " "
  )}, focus principale su ${focus} e disponibilita reale di ${
    onboarding.days_per_week
  } allenamenti a settimana, ${energy}.${detail}`;
}

function buildPhaseGoal(onboarding: Record<string, any>, deepProfile: Record<string, any> | null, phaseLabel: string) {
  const tone = deepProfile?.training_preference === "piu_tonificante" ? "piu tono" : "piu controllo";
  return `In questa fase lavoriamo per costruire ${tone}, continuita e una sensazione di movimento piu sicura, senza chiederti troppo troppo presto.`;
}

function buildWeeklyStructure(onboarding: Record<string, any>, goal: string) {
  return [
    `${onboarding.days_per_week} sessioni guidate da ${onboarding.preferred_minutes} minuti, pensate per entrare bene nelle tue giornate.`,
    `Un asse principale su ${formatFocus(goal)}, senza perdere di vista il tono generale del corpo.`,
    "Tra una sessione e l'altra lasciamo spazio a recupero, mobilita o semplice respiro.",
    "La progressione dipende da come rispondi davvero, non da un aumento automatico dell'intensita."
  ];
}

function buildRealisticOutcomes(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const outcomes = [
    "Più continuita nelle settimane e meno sensazione di ricominciare ogni volta.",
    "Movimenti più puliti e stabili nelle sedute di base.",
    "Percezione migliore del tono generale se l'aderenza resta buona."
  ];
  if (onboarding.focus_preference === "glutei_gambe") outcomes.push("Glutei e gambe più presenti nei gesti quotidiani.");
  if (deepProfile?.posture_perception) outcomes.push("Maggiore controllo posturale e meno rigidita nelle giornate sedute.");
  return outcomes;
}

function buildRecoveryNotes(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  const notes = [
    "Tieni almeno un giorno piu leggero tra le sessioni se l'energia e variabile.",
    "Se arrivi stanca, scegli comunque la versione breve: conta piu la continuita della perfezione."
  ];
  if (deepProfile?.sensitivities?.includes?.("schiena")) notes.push("Nei giorni di schiena piu sensibile riduci ampiezza e velocita.");
  return notes;
}

function buildNutritionTips(deepProfile: Record<string, any> | null) {
  const notes = [
    "Non saltare spesso i pasti: regolarita e recupero si aiutano a vicenda.",
    "Dai spazio a una quota proteica semplice e sostenibile durante la giornata.",
    "Ricordati di bere con continuita, soprattutto nei giorni piu pieni."
  ];
  if (deepProfile?.skips_meals) notes.unshift("Se tendi a rimandare i pasti, prova a tenere almeno un appoggio pratico gia pronto.");
  return notes;
}

function describeDifficulty(onboarding: Record<string, any>, deepProfile: Record<string, any> | null, reassessment: Record<string, any> | null) {
  if (reassessment?.plan_fit === "troppo_difficile") return "Abbiamo abbassato di un gradino il carico percepito per farti ritrovare continuita.";
  if (deepProfile?.training_preference === "piu_energizzante") return "Attiva ma ancora sostenibile, cosi senti lavoro senza uscire scarica.";
  if (onboarding.gentle_start) return "Morbida all'inizio, per farti entrare nel ritmo con fiducia e non per inerzia.";
  return "Lineare e sostenibile, con una richiesta presente ma mai aggressiva.";
}

function describeAdherenceStrategy(onboarding: Record<string, any>) {
  return `L'obiettivo non e riempire la settimana, ma proteggere ${onboarding.days_per_week} appuntamenti realistici nella fascia ${String(
    onboarding.preferred_time_of_day
  ).replaceAll("_", " ")} e farli diventare praticabili davvero.`;
}

function describeProgressionStrategy(phaseLabel: string) {
  return `${phaseLabel}: prima consolidiamo gesto, ritmo e fiducia; poi aumentiamo volume, controllo o precisione solo se il corpo risponde bene.`;
}

function buildPlanExplanation(onboarding: Record<string, any>, deepProfile: Record<string, any> | null, phaseLabel: string) {
  const focus = formatFocus(onboarding.focus_preference);
  const energyLine =
    onboarding.energy_level === "molto_bassa" || onboarding.energy_level === "bassa"
      ? "Dato che l'energia in questo periodo va dosata bene, il piano non parte spingendo troppo."
      : "C'e abbastanza margine per lavorare bene, ma senza trasformare il percorso in qualcosa di pesante.";
  const deepLine = deepProfile?.priority_area
    ? ` Abbiamo anche dato piu spazio a ${formatFocus(
        deepProfile.priority_area
      )}, perche e una delle aree che oggi senti piu importanti.`
    : " Se vorrai, potrai aggiungere ancora qualche dettaglio per renderlo piu preciso su postura, segnali del corpo e gestione della settimana.";

  return `Partiamo da ${phaseLabel.toLowerCase()} perche, guardando focus, ritmo reale e punto di partenza, la cosa piu utile adesso e costruire una base che tu riesca davvero a seguire. Nelle prime settimane lavoreremo soprattutto su ${focus}, controllo del gesto e continuita. ${energyLine} Quando il ritmo si stabilizza, Mirya aggiorna il percorso: puo alleggerire, consolidare oppure chiederti un po di piu, ma sempre in modo graduale.${deepLine}`;
}

function buildAdjustments(trigger: PlannerTrigger, reassessment: Record<string, any> | null) {
  const items = [
    "Il piano resta semplice e leggibile, cosi capisci subito cosa fare oggi senza scegliere da sola.",
    "Le sedute restano brevi per proteggere costanza ed energia, non per tenerti indietro."
  ];
  if (trigger === "reassessment_completed" && reassessment?.plan_fit === "troppo_difficile") {
    items.unshift("Il ritmo e stato alleggerito di un gradino per tornare sostenibile nella tua settimana reale.");
  }
  if (trigger === "deep_profile_completed") {
    items.unshift("Abbiamo raffinato il piano sulle aree che senti piu delicate, piu deboli o piu importanti per te.");
  }
  return items;
}

function buildGlobalCautions(onboarding: Record<string, any>, deepProfile: Record<string, any> | null, reassessment: Record<string, any> | null) {
  const flags: string[] = [];
  const limitations = onboarding.limitations ?? [];
  if (limitations.includes("addome_delicato")) flags.push("Se senti pressione addominale, riduci subito leva e ampiezza.");
  if (limitations.includes("pavimento_pelvico") || deepProfile?.pelvic_signals?.length) flags.push("Attenzione a eventuali fastidi pelvici: fermati se senti peso o disagio.");
  if (limitations.includes("ginocchia_sensibili")) flags.push("Mantieni piegamenti piccoli e controllati se le ginocchia sono sensibili.");
  if (reassessment?.caution_notes) flags.push("Monitora i segnali emersi nell'ultima rivalutazione prima di aumentare il lavoro.");
  return flags;
}

function buildCoachMessage(onboarding: Record<string, any>) {
  return `Oggi non devi capire tu come organizzarti: segui la sequenza, ascolta il ritmo e lascia che il lavoro si sommi nel tempo.`;
}

function buildWorkoutCoachNote(onboarding: Record<string, any>, deepProfile: Record<string, any> | null) {
  if (deepProfile?.training_preference === "piu_posturale") return "Lavora con calma e cura del gesto: oggi conta piu la qualita della velocita.";
  if (onboarding.energy_level === "molto_bassa" || onboarding.energy_level === "bassa") return "Tieni un ritmo morbido: l'obiettivo di oggi e attivarti senza svuotarti.";
  return "Segui il ritmo indicato e resta in ascolto: oggi costruiamo tono senza irrigidirti.";
}

function resolvePhaseMeta(trigger: PlannerTrigger, sessionsCount: number, gentleStart: boolean, planFit?: string | null) {
  if (trigger === "reassessment_completed" && planFit === "troppo_difficile") {
    return { key: "riequilibrio", label: "Riequilibrio e continuita", reason: "Stiamo semplificando il ritmo per proteggere aderenza e qualita del gesto." };
  }
  if (sessionsCount >= 6) {
    return { key: "consolidamento", label: "Consolidamento tecnico", reason: "Hai gia una base minima: adesso consolidiamo tono, controllo e continuita." };
  }
  if (gentleStart) {
    return { key: "riattivazione", label: "Riattivazione e adattamento", reason: "Partiamo con un ingresso graduale per costruire controllo senza fatica inutile." };
  }
  return { key: "base", label: "Base e costanza", reason: "Lavoriamo su una base semplice ma seria prima di intensificare." };
}

function resolveWorkoutTitle(goal: string, phaseLabel: string) {
  return `${formatFocus(goal)} · ${phaseLabel}`;
}

function resolveWorkoutFocus(goal: string) {
  return formatFocus(goal);
}

function getWorkoutDayIndexes(daysPerWeek: number) {
  if (daysPerWeek <= 2) return [1, 4];
  if (daysPerWeek === 3) return [1, 3, 5];
  if (daysPerWeek === 4) return [0, 2, 4, 6];
  return [0, 1, 3, 4, 6];
}

function formatFocus(value: string) {
  return value.replaceAll("_", " ");
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

function isPlannerOutput(value: unknown): value is PlannerOutput {
  return Boolean(
    value &&
      typeof value === "object" &&
      "today_workout" in value &&
      "weekly_plan" in value &&
      "current_phase" in value
  );
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
