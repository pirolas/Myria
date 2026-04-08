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
          full_name: string | null;
          age_band: string;
          height_cm: number | null;
          weight_kg: number | null;
          primary_body_goal: string;
          computed_body_goal: string;
          secondary_objectives: string[];
          perceived_level: string;
          primary_goal: string;
          secondary_goals: string[];
          days_per_week: number;
          preferred_minutes: number;
          energy_level: string;
          past_experience: string | null;
          lifestyle: string | null;
          gentle_start: boolean;
          limitations: string[];
          focus_preference: string;
          sleep_quality: string | null;
          stress_level: string | null;
          consistency_score: number | null;
          weekly_availability: string | null;
          preferred_time_of_day: string | null;
          preferred_days: string[];
          focus_areas: string[];
          past_training_types: string[];
          prefer_simple_exercises: boolean;
          session_style: string;
          session_tone: string;
          avoid_jumps: boolean;
          eating_perception: string;
          skips_meals: boolean;
          nervous_hunger: boolean;
          low_water_intake: boolean;
          low_protein_intake: string;
          wants_timer_sound: boolean;
          notes: string | null;
          completed_at: string;
          updated_at: string;
        },
        {
          user_id: string;
          full_name?: string | null;
          age_band: string;
          height_cm?: number | null;
          weight_kg?: number | null;
          primary_body_goal?: string;
          computed_body_goal?: string;
          secondary_objectives?: string[];
          perceived_level: string;
          primary_goal: string;
          secondary_goals?: string[];
          days_per_week: number;
          preferred_minutes: number;
          energy_level: string;
          past_experience?: string | null;
          lifestyle?: string | null;
          gentle_start?: boolean;
          limitations?: string[];
          focus_preference: string;
          sleep_quality?: string | null;
          stress_level?: string | null;
          consistency_score?: number | null;
          weekly_availability?: string | null;
          preferred_time_of_day?: string | null;
          preferred_days?: string[];
          focus_areas?: string[];
          past_training_types?: string[];
          prefer_simple_exercises?: boolean;
          session_style?: string;
          session_tone?: string;
          avoid_jumps?: boolean;
          eating_perception?: string;
          skips_meals?: boolean;
          nervous_hunger?: boolean;
          low_water_intake?: boolean;
          low_protein_intake?: string;
          wants_timer_sound?: boolean;
          notes?: string | null;
          completed_at?: string;
          updated_at?: string;
        },
        {
          user_id?: string;
          full_name?: string | null;
          age_band?: string;
          height_cm?: number | null;
          weight_kg?: number | null;
          primary_body_goal?: string;
          computed_body_goal?: string;
          secondary_objectives?: string[];
          perceived_level?: string;
          primary_goal?: string;
          secondary_goals?: string[];
          days_per_week?: number;
          preferred_minutes?: number;
          energy_level?: string;
          past_experience?: string | null;
          lifestyle?: string | null;
          gentle_start?: boolean;
          limitations?: string[];
          focus_preference?: string;
          sleep_quality?: string | null;
          stress_level?: string | null;
          consistency_score?: number | null;
          weekly_availability?: string | null;
          preferred_time_of_day?: string | null;
          preferred_days?: string[];
          focus_areas?: string[];
          past_training_types?: string[];
          prefer_simple_exercises?: boolean;
          session_style?: string;
          session_tone?: string;
          avoid_jumps?: boolean;
          eating_perception?: string;
          skips_meals?: boolean;
          nervous_hunger?: boolean;
          low_water_intake?: boolean;
          low_protein_intake?: string;
          wants_timer_sound?: boolean;
          notes?: string | null;
          completed_at?: string;
          updated_at?: string;
        }
      >;
      user_deep_profile: TableDef<
        {
          user_id: string;
          weak_area: string | null;
          priority_area: string | null;
          movement_discomforts: string | null;
          posture_perception: string | null;
          mobility_perception: string | null;
          coordination_level: string | null;
          sensitivities: string[];
          pregnancies_count: number | null;
          cesareans_count: number | null;
          months_since_last_birth: number | null;
          diastasis_status: string | null;
          pelvic_signals: string[];
          scar_discomfort: boolean | null;
          body_confidence: string | null;
          dropout_reasons: string[];
          nutrition_pattern: string | null;
          nervous_hunger: boolean | null;
          skips_meals: boolean | null;
          hydration_pattern: string | null;
          training_preference: string | null;
          feared_exercises: string | null;
          disliked_exercises: string | null;
          relevant_interventions: string | null;
          notes: string | null;
          updated_at: string;
        },
        {
          user_id: string;
          weak_area?: string | null;
          priority_area?: string | null;
          movement_discomforts?: string | null;
          posture_perception?: string | null;
          mobility_perception?: string | null;
          coordination_level?: string | null;
          sensitivities?: string[];
          pregnancies_count?: number | null;
          cesareans_count?: number | null;
          months_since_last_birth?: number | null;
          diastasis_status?: string | null;
          pelvic_signals?: string[];
          scar_discomfort?: boolean | null;
          body_confidence?: string | null;
          dropout_reasons?: string[];
          nutrition_pattern?: string | null;
          nervous_hunger?: boolean | null;
          skips_meals?: boolean | null;
          hydration_pattern?: string | null;
          training_preference?: string | null;
          feared_exercises?: string | null;
          disliked_exercises?: string | null;
          relevant_interventions?: string | null;
          notes?: string | null;
          updated_at?: string;
        },
        {
          user_id?: string;
          weak_area?: string | null;
          priority_area?: string | null;
          movement_discomforts?: string | null;
          posture_perception?: string | null;
          mobility_perception?: string | null;
          coordination_level?: string | null;
          sensitivities?: string[];
          pregnancies_count?: number | null;
          cesareans_count?: number | null;
          months_since_last_birth?: number | null;
          diastasis_status?: string | null;
          pelvic_signals?: string[];
          scar_discomfort?: boolean | null;
          body_confidence?: string | null;
          dropout_reasons?: string[];
          nutrition_pattern?: string | null;
          nervous_hunger?: boolean | null;
          skips_meals?: boolean | null;
          hydration_pattern?: string | null;
          training_preference?: string | null;
          feared_exercises?: string | null;
          disliked_exercises?: string | null;
          relevant_interventions?: string | null;
          notes?: string | null;
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
      user_access: TableDef<
        {
          user_id: string;
          status: string;
          trial_started_at: string;
          trial_expires_at: string;
          free_sessions_limit: number;
          free_sessions_used: number;
          first_plan_generated_at: string | null;
          premium_started_at: string | null;
          premium_ends_at: string | null;
          updated_at: string;
        },
        {
          user_id: string;
          status?: string;
          trial_started_at?: string;
          trial_expires_at?: string;
          free_sessions_limit?: number;
          free_sessions_used?: number;
          first_plan_generated_at?: string | null;
          premium_started_at?: string | null;
          premium_ends_at?: string | null;
          updated_at?: string;
        },
        {
          user_id?: string;
          status?: string;
          trial_started_at?: string;
          trial_expires_at?: string;
          free_sessions_limit?: number;
          free_sessions_used?: number;
          first_plan_generated_at?: string | null;
          premium_started_at?: string | null;
          premium_ends_at?: string | null;
          updated_at?: string;
        }
      >;
      user_reassessments: TableDef<
        {
          id: string;
          user_id: string;
          plan_fit: string;
          feels_more_stable: boolean | null;
          feels_more_toned: boolean | null;
          feels_more_energetic: boolean | null;
          effective_exercises: string[];
          uncomfortable_exercises: string[];
          consistency_keeping: number;
          main_obstacle: string | null;
          improvements: string[];
          caution_notes: string | null;
          keep_current_focus: boolean;
          new_focus: string | null;
          realistic_minutes_now: number;
          completed_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan_fit: string;
          feels_more_stable?: boolean | null;
          feels_more_toned?: boolean | null;
          feels_more_energetic?: boolean | null;
          effective_exercises?: string[];
          uncomfortable_exercises?: string[];
          consistency_keeping: number;
          main_obstacle?: string | null;
          improvements?: string[];
          caution_notes?: string | null;
          keep_current_focus?: boolean;
          new_focus?: string | null;
          realistic_minutes_now: number;
          completed_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          plan_fit?: string;
          feels_more_stable?: boolean | null;
          feels_more_toned?: boolean | null;
          feels_more_energetic?: boolean | null;
          effective_exercises?: string[];
          uncomfortable_exercises?: string[];
          consistency_keeping?: number;
          main_obstacle?: string | null;
          improvements?: string[];
          caution_notes?: string | null;
          keep_current_focus?: boolean;
          new_focus?: string | null;
          realistic_minutes_now?: number;
          completed_at?: string;
        }
      >;
      training_plans: TableDef<
        {
          id: string;
          user_id: string;
          status: string;
          source: string;
          primary_body_goal: string;
          computed_body_goal: string;
          current_phase: string;
          phase_label: string;
          phase_focus: string;
          phase_goal: string | null;
          user_profile_summary: string | null;
          profile_summary_payload: Json;
          plan_overview_payload: Json;
          support_tips_payload: Json;
          current_week: number;
          total_weeks: number;
          weekly_goal: string;
          weekly_goal_minutes: number;
          weekly_goal_sessions: number;
          weekly_structure: Json;
          session_difficulty: string | null;
          progression_strategy: string | null;
          progression_reason: string;
          motivational_note: string;
          realistic_expected_outcomes: Json;
          caution_notes: Json;
          recovery_notes: Json;
          adherence_strategy: string | null;
          nutrition_tips: Json;
          plan_explanation: string | null;
          adjustments: Json;
          reassessment_due_in_days: number;
          next_reassessment_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          status?: string;
          source?: string;
          primary_body_goal?: string;
          computed_body_goal?: string;
          current_phase: string;
          phase_label: string;
          phase_focus: string;
          phase_goal?: string | null;
          user_profile_summary?: string | null;
          profile_summary_payload?: Json;
          plan_overview_payload?: Json;
          support_tips_payload?: Json;
          current_week: number;
          total_weeks?: number;
          weekly_goal: string;
          weekly_goal_minutes: number;
          weekly_goal_sessions: number;
          weekly_structure?: Json;
          session_difficulty?: string | null;
          progression_strategy?: string | null;
          progression_reason: string;
          motivational_note: string;
          realistic_expected_outcomes?: Json;
          caution_notes?: Json;
          recovery_notes?: Json;
          adherence_strategy?: string | null;
          nutrition_tips?: Json;
          plan_explanation?: string | null;
          adjustments?: Json;
          reassessment_due_in_days?: number;
          next_reassessment_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          status?: string;
          source?: string;
          primary_body_goal?: string;
          computed_body_goal?: string;
          current_phase?: string;
          phase_label?: string;
          phase_focus?: string;
          phase_goal?: string | null;
          user_profile_summary?: string | null;
          profile_summary_payload?: Json;
          plan_overview_payload?: Json;
          support_tips_payload?: Json;
          current_week?: number;
          total_weeks?: number;
          weekly_goal?: string;
          weekly_goal_minutes?: number;
          weekly_goal_sessions?: number;
          weekly_structure?: Json;
          session_difficulty?: string | null;
          progression_strategy?: string | null;
          progression_reason?: string;
          motivational_note?: string;
          realistic_expected_outcomes?: Json;
          caution_notes?: Json;
          recovery_notes?: Json;
          adherence_strategy?: string | null;
          nutrition_tips?: Json;
          plan_explanation?: string | null;
          adjustments?: Json;
          reassessment_due_in_days?: number;
          next_reassessment_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      training_plan_versions: TableDef<
        {
          id: string;
          plan_id: string;
          user_id: string;
          version_number: number;
          trigger: string;
          payload: Json;
          user_profile_summary: string;
          phase_goal: string;
          weekly_structure: Json;
          session_difficulty: string;
          progression_strategy: string;
          realistic_expected_outcomes: Json;
          motivational_message: string;
          recovery_notes: Json;
          adherence_strategy: string;
          nutrition_tips: Json;
          plan_explanation: string;
          created_at: string;
        },
        {
          id?: string;
          plan_id: string;
          user_id: string;
          version_number: number;
          trigger: string;
          payload?: Json;
          user_profile_summary: string;
          phase_goal: string;
          weekly_structure?: Json;
          session_difficulty: string;
          progression_strategy: string;
          realistic_expected_outcomes?: Json;
          motivational_message: string;
          recovery_notes?: Json;
          adherence_strategy: string;
          nutrition_tips?: Json;
          plan_explanation: string;
          created_at?: string;
        },
        {
          id?: string;
          plan_id?: string;
          user_id?: string;
          version_number?: number;
          trigger?: string;
          payload?: Json;
          user_profile_summary?: string;
          phase_goal?: string;
          weekly_structure?: Json;
          session_difficulty?: string;
          progression_strategy?: string;
          realistic_expected_outcomes?: Json;
          motivational_message?: string;
          recovery_notes?: Json;
          adherence_strategy?: string;
          nutrition_tips?: Json;
          plan_explanation?: string;
          created_at?: string;
        }
      >;
      training_plan_exercises: TableDef<
        {
          id: string;
          user_id: string;
          plan_id: string;
          plan_day_id: string;
          position_index: number;
          exercise_id: string;
          exercise_name: string;
          sets: number;
          reps_label: string;
          duration_seconds_estimate: number;
          rest_seconds: number;
          execution_note: string | null;
          easier_option: string | null;
          body_area: string | null;
          caution: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_day_id: string;
          position_index: number;
          exercise_id: string;
          exercise_name: string;
          sets?: number;
          reps_label: string;
          duration_seconds_estimate?: number;
          rest_seconds?: number;
          execution_note?: string | null;
          easier_option?: string | null;
          body_area?: string | null;
          caution?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          plan_id?: string;
          plan_day_id?: string;
          position_index?: number;
          exercise_id?: string;
          exercise_name?: string;
          sets?: number;
          reps_label?: string;
          duration_seconds_estimate?: number;
          rest_seconds?: number;
          execution_note?: string | null;
          easier_option?: string | null;
          body_area?: string | null;
          caution?: string | null;
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
      workout_feedback: TableDef<
        {
          id: string;
          session_id: string;
          user_id: string;
          feeling: string | null;
          energy_final: string | null;
          discomfort_notes: string | null;
          stop_reason: string | null;
          uncomfortable_exercise_ids: string[];
          created_at: string;
        },
        {
          id?: string;
          session_id: string;
          user_id: string;
          feeling?: string | null;
          energy_final?: string | null;
          discomfort_notes?: string | null;
          stop_reason?: string | null;
          uncomfortable_exercise_ids?: string[];
          created_at?: string;
        },
        {
          id?: string;
          session_id?: string;
          user_id?: string;
          feeling?: string | null;
          energy_final?: string | null;
          discomfort_notes?: string | null;
          stop_reason?: string | null;
          uncomfortable_exercise_ids?: string[];
          created_at?: string;
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
      plan_adjustments: TableDef<
        {
          id: string;
          user_id: string;
          plan_id: string;
          plan_version_id: string | null;
          adjustment_type: string;
          title: string;
          description: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_version_id?: string | null;
          adjustment_type: string;
          title: string;
          description: string;
          created_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          plan_id?: string;
          plan_version_id?: string | null;
          adjustment_type?: string;
          title?: string;
          description?: string;
          created_at?: string;
        }
      >;
      support_tips: TableDef<
        {
          id: string;
          user_id: string;
          plan_id: string | null;
          category: string;
          title: string;
          body: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          category: string;
          title: string;
          body: string;
          created_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          category?: string;
          title?: string;
          body?: string;
          created_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
