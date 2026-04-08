export type Goal =
  | "glutei_gambe"
  | "pancia_core"
  | "postura"
  | "tonicita_generale"
  | "ripartenza_dolce";

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
  durationSeconds: number;
  restSeconds: number;
  bodyArea: string;
  doseLabel: string;
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
}

export interface PlannerDayOutput {
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

export interface PlannerOutput {
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

export interface ProfileRecord {
  id: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
}

export interface UserOnboardingRecord extends BetaOnboardingInput {
  userId: string;
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
