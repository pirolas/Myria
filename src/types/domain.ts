export type Goal =
  | "glutei_gambe"
  | "pancia_core"
  | "postura"
  | "tonicita_generale"
  | "ripartenza_dolce";

export type PrimaryBodyGoal =
  | "dimagrire"
  | "massa_muscolare"
  | "tonicita_rassodare"
  | "aumentare_peso_sano"
  | "ricomposizione_corporea";

export type ComputedBodyGoal =
  | "fat_loss"
  | "muscle_gain"
  | "toning"
  | "recomposition"
  | "tone_rebuild_for_lean_body";

export type SecondaryObjective =
  | "glutei_piu_sodi"
  | "gambe_piu_toniche"
  | "addome_piu_stabile"
  | "postura_migliore"
  | "piu_energia"
  | "meno_flaccidita"
  | "piu_forza"
  | "maggiore_costanza"
  | "ridurre_rigidita"
  | "migliorare_mobilita";

export type FocusArea =
  | "glutei"
  | "gambe"
  | "addome_core"
  | "postura"
  | "braccia"
  | "total_body";

export type PreferredDay = "lun" | "mar" | "mer" | "gio" | "ven" | "sab" | "dom";

export type PastTrainingType =
  | "nessuno"
  | "camminata"
  | "home_workout"
  | "pesi_macchine"
  | "pilates_yoga"
  | "corsi_fitness";

export type SessionStyle = "circuiti" | "sequenze_lente";
export type SessionTone = "soft" | "tonificante";
export type EatingPerception = "troppo_poco" | "abbastanza" | "troppo" | "disordinato";
export type ProteinPerception = "si" | "no" | "non_so";

export type Level =
  | "molto_fuori_allenamento"
  | "principiante"
  | "intermedio_leggero";

export type CategoryId =
  | "glutei_gambe"
  | "core_pancia_profonda"
  | "postura"
  | "total_body_leggero"
  | "mobilita_recupero"
  | "ripartenza_dolce";

export type Feeling = "facile" | "giusto" | "impegnativo";
export type MinuteOption = 10 | 15 | 20 | 25;

export type AgeBand =
  | "25_34"
  | "35_44"
  | "45_54"
  | "55_64"
  | "65_plus";

export type EnergyLevel =
  | "molto_bassa"
  | "bassa"
  | "media"
  | "buona";

export type LimitationTag =
  | "nessuna"
  | "addome_delicato"
  | "pavimento_pelvico"
  | "lombare_delicata"
  | "ginocchia_sensibili"
  | "spalle_collo";

export type PastTrainingExperience =
  | "mai_costante"
  | "qualche_fase"
  | "abbastanza_regolare";

export type LifestyleType =
  | "molto_sedentaria"
  | "abbastanza_attiva"
  | "molto_in_movimento";

export type SleepQuality = "bassa" | "discontinua" | "abbastanza_buona" | "buona";
export type StressLevel = "alto" | "medio_alto" | "medio" | "gestibile";
export type WeeklyAvailability = "molto_variabile" | "alcuni_spazi" | "abbastanza_stabile";
export type TimePreference = "mattina" | "pausa_pranzo" | "pomeriggio" | "sera" | "variabile";

export type BodyAreaFocus =
  | "glutei_gambe"
  | "core"
  | "postura"
  | "schiena"
  | "stabilita_generale";

export type PosturePerception = "chiusa" | "variabile" | "abbastanza_buona";
export type MobilityPerception = "rigida" | "media" | "buona";
export type CoordinationLevel = "incerta" | "discreta" | "buona";
export type SensitivityTag =
  | "addome"
  | "pavimento_pelvico"
  | "schiena"
  | "ginocchia"
  | "anche";
export type DiastasisStatus = "no" | "forse" | "gia_nota";
export type PelvicSignal = "incontinenza_sotto_sforzo" | "senso_di_peso_pelvico";
export type BodyConfidence = "bassa" | "variabile" | "buona";
export type DropoutReason =
  | "stanchezza"
  | "noia"
  | "mancanza_tempo"
  | "dolore"
  | "scarsa_fiducia";
export type NutritionPattern = "disordinata" | "abbastanza_equilibrata" | "molto_curata";
export type HydrationPattern = "bassa" | "altalenante" | "buona";
export type TrainingPreference =
  | "piu_dolce"
  | "piu_tonificante"
  | "piu_posturale"
  | "piu_energizzante";

export type ReassessmentFit = "troppo_facile" | "giusto" | "troppo_difficile";
export type ObstacleTag =
  | "stanchezza"
  | "mancanza_tempo"
  | "scarsa_costanza"
  | "fastidi"
  | "noia"
  | "fiducia_bassa";
export type ImprovementTag =
  | "tono_generale"
  | "glutei_gambe"
  | "postura"
  | "core"
  | "energia";

export type PlanStatus = "draft" | "active" | "archived";
export type PlanDayStatus = "planned" | "completed" | "skipped";
export type WorkoutStepKind = "exercise" | "rest";

export type PlannerTrigger =
  | "onboarding_completed"
  | "weekly_refresh"
  | "post_workout_feedback"
  | "deep_profile_completed"
  | "reassessment_completed";

export type UserAccessStatus = "free_trial" | "premium" | "free_locked";

export interface PreferenceOption<TValue extends string | number | boolean> {
  value: TValue;
  label: string;
  description: string;
}

export interface MultiPreferenceOption<TValue extends string> {
  value: TValue;
  label: string;
  description: string;
}

export interface UserPreferences {
  daysPerWeek: number;
  preferredMinutes: MinuteOption;
  goal: Goal;
  secondaryGoals?: Goal[];
  level: Level;
  gentleStart: boolean;
}

export interface BetaOnboardingInput {
  fullName: string;
  ageBand: AgeBand;
  heightCm: number | null;
  weightKg: number | null;
  primaryBodyGoal: PrimaryBodyGoal;
  secondaryObjectives: SecondaryObjective[];
  primaryGoal: Goal;
  secondaryGoals: Goal[];
  perceivedLevel: Level;
  daysPerWeek: number;
  preferredMinutes: MinuteOption;
  energyLevel: EnergyLevel;
  pastExperience: PastTrainingExperience;
  lifestyle: LifestyleType;
  focusPreference: Goal;
  gentleStart: boolean;
  limitations: LimitationTag[];
  sleepQuality: SleepQuality;
  stressLevel: StressLevel;
  consistencyScore: 1 | 2 | 3 | 4 | 5;
  weeklyAvailability: WeeklyAvailability;
  preferredTimeOfDay: TimePreference;
  preferredDays: PreferredDay[];
  pastTrainingTypes: PastTrainingType[];
  focusAreas: FocusArea[];
  preferSimpleExercises: boolean;
  sessionStyle: SessionStyle;
  sessionTone: SessionTone;
  avoidJumps: boolean;
  eatingPerception: EatingPerception;
  skipsMeals: boolean;
  lowWaterIntake: boolean;
  nervousHunger: boolean;
  lowProteinIntake: ProteinPerception;
  wantsTimerSound: boolean;
  notes: string;
}

export interface DeepProfileInput {
  weakArea: BodyAreaFocus | null;
  priorityArea: BodyAreaFocus | null;
  movementDiscomforts: string;
  posturePerception: PosturePerception | null;
  mobilityPerception: MobilityPerception | null;
  coordinationLevel: CoordinationLevel | null;
  sensitivities: SensitivityTag[];
  pregnanciesCount: number | null;
  cesareansCount: number | null;
  monthsSinceLastBirth: number | null;
  diastasisStatus: DiastasisStatus | null;
  pelvicSignals: PelvicSignal[];
  scarDiscomfort: boolean | null;
  bodyConfidence: BodyConfidence | null;
  dropoutReasons: DropoutReason[];
  nutritionPattern: NutritionPattern | null;
  nervousHunger: boolean | null;
  skipsMeals: boolean | null;
  hydrationPattern: HydrationPattern | null;
  trainingPreference: TrainingPreference | null;
  fearedExercises: string;
  dislikedExercises: string;
  relevantInterventions: string;
  notes: string;
}

export interface ReassessmentInput {
  planFit: ReassessmentFit;
  feelsMoreStable: boolean | null;
  feelsMoreToned: boolean | null;
  feelsMoreEnergetic: boolean | null;
  effectiveExercises: string[];
  uncomfortableExercises: string[];
  consistencyKeeping: 1 | 2 | 3 | 4 | 5;
  mainObstacle: ObstacleTag | null;
  improvements: ImprovementTag[];
  cautionNotes: string;
  keepCurrentFocus: boolean;
  newFocus: Goal | null;
  realisticMinutesNow: MinuteOption;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  bodyArea: string;
  benefit: string;
  startingPosition?: string;
  movementCue?: string;
  feelCue?: string;
  steps: string[];
  commonMistakes: string[];
  easierVariant: string;
  intenseVariant: string;
  dose: string;
  caution?: string;
  tags?: string[];
  baseLevel?: Level;
  defaultDurationSeconds?: number;
  defaultRestSeconds?: number;
  repetitionsLabel?: string;
}

export interface Program {
  id: string;
  title: string;
  durationMinutes: MinuteOption;
  category: CategoryId;
  focus: string;
  description: string;
  frequency: string;
  levelLabel: string;
  idealFor: string[];
  exerciseIds: string[];
}

export interface CompletedSession {
  id: string;
  programId: string;
  completedAt: string;
  feeling: Feeling;
  durationMinutes: number;
}

export interface ProgressState {
  sessions: CompletedSession[];
  uncomfortableExerciseIds: string[];
}

export interface AppState {
  onboardingCompleted: boolean;
  preferences: UserPreferences | null;
  progress: ProgressState;
}

export interface WorkoutStepPlan {
  id: string;
  kind: WorkoutStepKind;
  exerciseId: string;
  title: string;
  summary: string;
  sets: number;
  repsLabel: string;
  durationSeconds: number;
  restSeconds: number;
  bodyArea: string;
  doseLabel: string;
  executionNote?: string;
  easierOption?: string;
  caution?: string;
}

export interface PlannedWorkout {
  title: string;
  focus: string;
  estimatedMinutes: number;
  coachNote: string;
  cautionNotes: string[];
  steps: WorkoutStepPlan[];
}

export interface TrainingPlanDay {
  id: string;
  planId: string;
  dayIndex: number;
  scheduledFor: string;
  title: string;
  focus: string;
  sessionKind: "workout" | "recovery";
  estimatedMinutes: number;
  status: PlanDayStatus;
  coachNote: string;
  workout: PlannedWorkout;
}

export interface SupportTip {
  id: string;
  category: "recupero" | "costanza" | "alimentazione";
  title: string;
  body: string;
}

export interface PlanAdjustment {
  id: string;
  adjustmentType: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface TrainingPlanVersionRecord {
  id: string;
  planId: string;
  versionNumber: number;
  trigger: PlannerTrigger | "manual";
  userProfileSummary: string;
  phaseGoal: string;
  weeklyStructure: string[];
  sessionDifficulty: string;
  progressionStrategy: string;
  realisticExpectedOutcomes: string[];
  motivationalMessage: string;
  recoveryNotes: string[];
  adherenceStrategy: string;
  nutritionTips: string[];
  planExplanation: string;
  createdAt: string;
}

export interface ActiveTrainingPlan {
  id: string;
  status: PlanStatus;
  source: "ai" | "fallback";
  primaryBodyGoal: string;
  computedBodyGoal: ComputedBodyGoal;
  currentPhase: string;
  phaseLabel: string;
  phaseFocus: string;
  currentWeek: number;
  totalWeeks: number;
  weeklyGoal: string;
  weeklyGoalMinutes: number;
  weeklyGoalSessions: number;
  progressionReason: string;
  motivationalNote: string;
  cautionNotes: string[];
  adjustments: string[];
  phaseGoal: string;
  userProfileSummary: string;
  weeklyStructure: string[];
  sessionDifficulty: string;
  progressionStrategy: string;
  realisticExpectedOutcomes: string[];
  recoveryNotes: string[];
  adherenceStrategy: string;
  nutritionTips: string[];
  reassessmentDueInDays: number;
  nextReassessmentDate: string | null;
  planExplanation: string;
  planOverview: PlannerPlanOverview | null;
  profileSummary: PlannerProfileSummary | null;
  supportTips: PlannerSupportTipsPayload | null;
}

export interface PlannerProfileSummary {
  main_goal: string;
  computed_body_goal: ComputedBodyGoal;
  secondary_goals: string[];
  training_level: string;
  weekly_availability: string;
  focus_areas: string[];
  notes: string[];
}

export interface PlannerPlanOverview {
  phase_name: string;
  phase_duration_weeks: number;
  weekly_sessions: number;
  session_duration_minutes: number;
  intensity: string;
  strategy_explanation: string;
  realistic_expectations: string[];
}

export interface PlannerExerciseOutput {
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

export interface PlannerDayOutput {
  day_index: number;
  scheduled_for: string;
  title: string;
  label: string;
  focus: string;
  session_kind: "workout" | "recovery";
  estimated_duration_minutes: number;
  coach_note: string;
  caution_notes: string[];
  exercises: PlannerExerciseOutput[];
}

export interface PlannerSupportTipsPayload {
  nutrition: string[];
  recovery: string[];
  consistency: string[];
}

export interface PlannerReassessment {
  days_until_checkin: number;
  checkin_focus: string[];
}

export interface PlannerOutput {
  profile_summary: PlannerProfileSummary;
  plan_overview: PlannerPlanOverview;
  weekly_plan: PlannerDayOutput[];
  phase_goal: string;
  phase_focus: string;
  weekly_structure: string[];
  current_phase: string;
  progression_strategy: string;
  progression_reason: string;
  plan_explanation: string;
  realistic_expected_outcomes: string[];
  support_tips: PlannerSupportTipsPayload;
  motivational_message: string;
  caution_flags: string[];
  adjustments: string[];
  reassessment: PlannerReassessment;
}

export interface ProfileRecord {
  id: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
}

export interface UserOnboardingRecord extends BetaOnboardingInput {
  userId: string;
  computedBodyGoal: ComputedBodyGoal;
  completedAt: string;
}

export interface UserDeepProfileRecord extends DeepProfileInput {
  userId: string;
  updatedAt: string;
}

export interface UserReassessmentRecord extends ReassessmentInput {
  id: string;
  userId: string;
  completedAt: string;
}

export interface UserPreferenceRecord {
  userId: string;
  timerSoundEnabled: boolean;
  remindersEnabled: boolean;
  preferredReminderTime: string | null;
  updatedAt: string;
}

export interface WorkoutSessionRecord {
  id: string;
  userId: string;
  planId: string | null;
  planDayId: string | null;
  scheduledFor: string | null;
  startedAt: string;
  completedAt: string | null;
  status: "in_progress" | "completed" | "abandoned";
  durationMinutes: number;
  feeling: Feeling | null;
  energyFinal: EnergyLevel | null;
  discomfortNotes: string | null;
  stopReason: string | null;
  sessionSummary: Record<string, unknown> | null;
}

export interface WorkoutFeedbackRecord {
  id: string;
  sessionId: string;
  userId: string;
  feeling: Feeling | null;
  energyFinal: EnergyLevel | null;
  discomfortNotes: string | null;
  stopReason: string | null;
  uncomfortableExerciseIds: string[];
  completedAt: string;
}

export interface UserMilestone {
  id: string;
  code: string;
  title: string;
  description: string;
  achievedAt: string;
}

export interface NotificationPreferenceRecord {
  userId: string;
  remindersEnabled: boolean;
  reminderTime: string | null;
  weeklySummaryEnabled: boolean;
}

export interface UserAccessRecord {
  userId: string;
  status: UserAccessStatus;
  trialStartedAt: string;
  trialExpiresAt: string;
  freeSessionsLimit: number;
  freeSessionsUsed: number;
  trialRemainingSessions: number;
  trialRemainingDays: number;
  premiumStartedAt: string | null;
  premiumEndsAt: string | null;
  canUsePremiumFeatures: boolean;
  canStartWorkout: boolean;
}

export interface DashboardModel {
  profile: ProfileRecord | null;
  onboarding: UserOnboardingRecord | null;
  deepProfile: UserDeepProfileRecord | null;
  latestReassessment: UserReassessmentRecord | null;
  preferences: UserPreferenceRecord | null;
  activePlan: ActiveTrainingPlan | null;
  activePlanVersion: TrainingPlanVersionRecord | null;
  weekPlan: TrainingPlanDay[];
  todayPlanDay: TrainingPlanDay | null;
  sessions: WorkoutSessionRecord[];
  workoutFeedback: WorkoutFeedbackRecord[];
  uncomfortableExerciseIds: string[];
  milestones: UserMilestone[];
  notifications: NotificationPreferenceRecord | null;
  userAccess: UserAccessRecord | null;
  planAdjustments: PlanAdjustment[];
  supportTips: SupportTip[];
}

export interface ProgressSnapshot {
  completedWorkouts: number;
  totalMinutes: number;
  activeDays: number;
  streakDays: number;
  weeklyMinutes: number;
  weeklyGoalMinutes: number;
  weeklyGoalSessions: number;
  recentFeelings: Feeling[];
  uncomfortableExerciseIds: string[];
}

export interface WorkoutFeedbackInput {
  feeling: Feeling;
  energyFinal: EnergyLevel;
  uncomfortableExerciseIds: string[];
  discomfortNotes: string;
  stopReason: string;
  skippedExerciseIds: string[];
}
