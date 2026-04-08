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

export type PlanStatus = "draft" | "active" | "archived";

export type PlanDayStatus = "planned" | "completed" | "skipped";

export type WorkoutStepKind = "exercise" | "rest";

export type PlannerTrigger =
  | "onboarding_completed"
  | "weekly_refresh"
  | "post_workout_feedback";

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
  level: Level;
  gentleStart: boolean;
}

export interface BetaOnboardingInput {
  ageBand: AgeBand;
  perceivedLevel: Level;
  primaryGoal: Goal;
  daysPerWeek: number;
  preferredMinutes: MinuteOption;
  energyLevel: EnergyLevel;
  gentleStart: boolean;
  limitations: LimitationTag[];
  focusPreference: Goal;
  notes: string;
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
  preferences: UserPreferenceRecord | null;
  activePlan: ActiveTrainingPlan | null;
  weekPlan: TrainingPlanDay[];
  todayPlanDay: TrainingPlanDay | null;
  sessions: WorkoutSessionRecord[];
  uncomfortableExerciseIds: string[];
  milestones: UserMilestone[];
  notifications: NotificationPreferenceRecord | null;
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
