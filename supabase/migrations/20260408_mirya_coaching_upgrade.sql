alter table public.user_onboarding
  add column if not exists full_name text,
  add column if not exists height_cm integer,
  add column if not exists weight_kg integer,
  add column if not exists past_experience text,
  add column if not exists lifestyle text,
  add column if not exists sleep_quality text,
  add column if not exists stress_level text,
  add column if not exists consistency_score integer,
  add column if not exists weekly_availability text,
  add column if not exists preferred_time_of_day text,
  add column if not exists secondary_goals text[] not null default '{}'::text[];

create table if not exists public.user_deep_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  weak_area text,
  priority_area text,
  movement_discomforts text,
  posture_perception text,
  mobility_perception text,
  coordination_level text,
  sensitivities text[] not null default '{}'::text[],
  pregnancies_count integer,
  cesareans_count integer,
  months_since_last_birth integer,
  diastasis_status text,
  pelvic_signals text[] not null default '{}'::text[],
  scar_discomfort boolean,
  body_confidence text,
  dropout_reasons text[] not null default '{}'::text[],
  nutrition_pattern text,
  nervous_hunger boolean,
  skips_meals boolean,
  hydration_pattern text,
  training_preference text,
  notes text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_reassessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_fit text not null,
  feels_more_stable boolean,
  feels_more_toned boolean,
  feels_more_energetic boolean,
  effective_exercises text[] not null default '{}'::text[],
  uncomfortable_exercises text[] not null default '{}'::text[],
  consistency_keeping integer not null,
  main_obstacle text,
  improvements text[] not null default '{}'::text[],
  caution_notes text,
  keep_current_focus boolean not null default true,
  new_focus text,
  realistic_minutes_now integer not null,
  completed_at timestamptz not null default timezone('utc', now())
);

alter table public.training_plans
  add column if not exists phase_goal text,
  add column if not exists user_profile_summary text,
  add column if not exists weekly_structure jsonb not null default '[]'::jsonb,
  add column if not exists session_difficulty text,
  add column if not exists progression_strategy text,
  add column if not exists realistic_expected_outcomes jsonb not null default '[]'::jsonb,
  add column if not exists recovery_notes jsonb not null default '[]'::jsonb,
  add column if not exists adherence_strategy text,
  add column if not exists nutrition_tips jsonb not null default '[]'::jsonb,
  add column if not exists plan_explanation text,
  add column if not exists reassessment_due_in_days integer not null default 14,
  add column if not exists next_reassessment_at timestamptz;

create table if not exists public.training_plan_versions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version_number integer not null,
  trigger text not null,
  payload jsonb not null default '{}'::jsonb,
  user_profile_summary text not null,
  phase_goal text not null,
  weekly_structure jsonb not null default '[]'::jsonb,
  session_difficulty text not null,
  progression_strategy text not null,
  realistic_expected_outcomes jsonb not null default '[]'::jsonb,
  motivational_message text not null,
  recovery_notes jsonb not null default '[]'::jsonb,
  adherence_strategy text not null,
  nutrition_tips jsonb not null default '[]'::jsonb,
  plan_explanation text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists training_plan_versions_unique_version_idx
  on public.training_plan_versions(plan_id, version_number);

create table if not exists public.workout_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  feeling text,
  energy_final text,
  discomfort_notes text,
  stop_reason text,
  uncomfortable_exercise_ids text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.plan_adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  plan_version_id uuid references public.training_plan_versions(id) on delete set null,
  adjustment_type text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_tips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.training_plans(id) on delete set null,
  category text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_user_deep_profile_updated_at on public.user_deep_profile;
create trigger set_user_deep_profile_updated_at
  before update on public.user_deep_profile
  for each row execute procedure public.set_updated_at();

alter table public.user_deep_profile enable row level security;
alter table public.user_reassessments enable row level security;
alter table public.training_plan_versions enable row level security;
alter table public.workout_feedback enable row level security;
alter table public.plan_adjustments enable row level security;
alter table public.support_tips enable row level security;

drop policy if exists "user_deep_profile_all_own" on public.user_deep_profile;
create policy "user_deep_profile_all_own" on public.user_deep_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_reassessments_all_own" on public.user_reassessments;
create policy "user_reassessments_all_own" on public.user_reassessments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "training_plan_versions_all_own" on public.training_plan_versions;
create policy "training_plan_versions_all_own" on public.training_plan_versions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_feedback_all_own" on public.workout_feedback;
create policy "workout_feedback_all_own" on public.workout_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plan_adjustments_all_own" on public.plan_adjustments;
create policy "plan_adjustments_all_own" on public.plan_adjustments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "support_tips_all_own" on public.support_tips;
create policy "support_tips_all_own" on public.support_tips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
