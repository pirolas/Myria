export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<
        {
          id: string;
          full_name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      user_onboarding: TableDef<
        {
          user_id: string;
          age_band: string;
          perceived_level: string;
          primary_goal: string;
          days_per_week: number;
          preferred_minutes: number;
          energy_level: string;
          gentle_start: boolean;
          limitations: string[];
          focus_preference: string;
          notes: string | null;
          completed_at: string;
          updated_at: string;
        },
        {
          user_id: string;
          age_band: string;
          perceived_level: string;
          primary_goal: string;
          days_per_week: number;
          preferred_minutes: number;
          energy_level: string;
          gentle_start: boolean;
          limitations?: string[];
          focus_preference: string;
          notes?: string | null;
          completed_at?: string;
          updated_at?: string;
        },
        {
          user_id?: string;
          age_band?: string;
          perceived_level?: string;
          primary_goal?: string;
          days_per_week?: number;
          preferred_minutes?: number;
          energy_level?: string;
          gentle_start?: boolean;
          limitations?: string[];
          focus_preference?: string;
          notes?: string | null;
          completed_at?: string;
          updated_at?: string;
        }
      >;
      user_preferences: TableDef<
        {
          user_id: string;
          timer_sound_enabled: boolean;
          reminders_enabled: boolean;
          preferred_reminder_time: string | null;
          updated_at: string;
        },
        {
          user_id: string;
          timer_sound_enabled?: boolean;
          reminders_enabled?: boolean;
          preferred_reminder_time?: string | null;
          updated_at?: string;
        },
        {
          user_id?: string;
          timer_sound_enabled?: boolean;
          reminders_enabled?: boolean;
          preferred_reminder_time?: string | null;
          updated_at?: string;
        }
      >;
      training_plans: TableDef<
        {
          id: string;
          user_id: string;
          status: string;
          source: string;
          current_phase: string;
          phase_label: string;
          phase_focus: string;
          current_week: number;
          total_weeks: number;
          weekly_goal: string;
          weekly_goal_minutes: number;
          weekly_goal_sessions: number;
          progression_reason: string;
          motivational_note: string;
          caution_notes: Json;
          adjustments: Json;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          status?: string;
          source?: string;
          current_phase: string;
          phase_label: string;
          phase_focus: string;
          current_week: number;
          total_weeks?: number;
          weekly_goal: string;
          weekly_goal_minutes: number;
          weekly_goal_sessions: number;
          progression_reason: string;
          motivational_note: string;
          caution_notes?: Json;
          adjustments?: Json;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          status?: string;
          source?: string;
          current_phase?: string;
          phase_label?: string;
          phase_focus?: string;
          current_week?: number;
          total_weeks?: number;
          weekly_goal?: string;
          weekly_goal_minutes?: number;
          weekly_goal_sessions?: number;
          progression_reason?: string;
          motivational_note?: string;
          caution_notes?: Json;
          adjustments?: Json;
          created_at?: string;
          updated_at?: string;
        }
      >;
      training_plan_days: TableDef<
        {
          id: string;
          user_id: string;
          plan_id: string;
          day_index: number;
          scheduled_for: string;
          title: string;
          focus: string;
          session_kind: string;
          estimated_minutes: number;
          status: string;
          coach_note: string;
          caution_notes: Json;
          workout_payload: Json;
          completed_session_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan_id: string;
          day_index: number;
          scheduled_for: string;
          title: string;
          focus: string;
          session_kind: string;
          estimated_minutes: number;
          status?: string;
          coach_note: string;
          caution_notes?: Json;
          workout_payload: Json;
          completed_session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          plan_id?: string;
          day_index?: number;
          scheduled_for?: string;
          title?: string;
          focus?: string;
          session_kind?: string;
          estimated_minutes?: number;
          status?: string;
          coach_note?: string;
          caution_notes?: Json;
          workout_payload?: Json;
          completed_session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      workout_sessions: TableDef<
        {
          id: string;
          user_id: string;
          plan_id: string | null;
          plan_day_id: string | null;
          scheduled_for: string | null;
          status: string;
          started_at: string;
          completed_at: string | null;
          duration_minutes: number;
          feeling: string | null;
          energy_final: string | null;
          discomfort_notes: string | null;
          stop_reason: string | null;
          adherence_score: number | null;
          session_summary: Json;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          plan_day_id?: string | null;
          scheduled_for?: string | null;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          duration_minutes?: number;
          feeling?: string | null;
          energy_final?: string | null;
          discomfort_notes?: string | null;
          stop_reason?: string | null;
          adherence_score?: number | null;
          session_summary?: Json;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          plan_day_id?: string | null;
          scheduled_for?: string | null;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          duration_minutes?: number;
          feeling?: string | null;
          energy_final?: string | null;
          discomfort_notes?: string | null;
          stop_reason?: string | null;
          adherence_score?: number | null;
          session_summary?: Json;
          created_at?: string;
          updated_at?: string;
        }
      >;
      workout_session_exercises: TableDef<
        {
          id: string;
          user_id: string;
          session_id: string;
          exercise_id: string;
          exercise_name: string;
          position_index: number;
          prescribed_duration_seconds: number;
          rest_seconds: number;
          completed: boolean;
          skipped: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          session_id: string;
          exercise_id: string;
          exercise_name: string;
          position_index: number;
          prescribed_duration_seconds: number;
          rest_seconds?: number;
          completed?: boolean;
          skipped?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          session_id?: string;
          exercise_id?: string;
          exercise_name?: string;
          position_index?: number;
          prescribed_duration_seconds?: number;
          rest_seconds?: number;
          completed?: boolean;
          skipped?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      exercise_feedback: TableDef<
        {
          id: string;
          user_id: string;
          session_id: string;
          exercise_id: string;
          marked_uncomfortable: boolean;
          discomfort_note: string | null;
          pain_or_stop: boolean;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          session_id: string;
          exercise_id: string;
          marked_uncomfortable?: boolean;
          discomfort_note?: string | null;
          pain_or_stop?: boolean;
          created_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          session_id?: string;
          exercise_id?: string;
          marked_uncomfortable?: boolean;
          discomfort_note?: string | null;
          pain_or_stop?: boolean;
          created_at?: string;
        }
      >;
      user_milestones: TableDef<
        {
          id: string;
          user_id: string;
          milestone_code: string;
          title: string;
          description: string;
          achieved_at: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          milestone_code: string;
          title: string;
          description: string;
          achieved_at?: string;
          created_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          milestone_code?: string;
          title?: string;
          description?: string;
          achieved_at?: string;
          created_at?: string;
        }
      >;
      notification_preferences: TableDef<
        {
          user_id: string;
          reminders_enabled: boolean;
          reminder_time: string | null;
          weekly_summary_enabled: boolean;
          updated_at: string;
        },
        {
          user_id: string;
          reminders_enabled?: boolean;
          reminder_time?: string | null;
          weekly_summary_enabled?: boolean;
          updated_at?: string;
        },
        {
          user_id?: string;
          reminders_enabled?: boolean;
          reminder_time?: string | null;
          weekly_summary_enabled?: boolean;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
