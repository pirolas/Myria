create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  age_band text not null,
  perceived_level text not null,
  primary_goal text not null,
  secondary_goals text[] not null default '{}'::text[],
  days_per_week integer not null check (days_per_week between 2 and 5),
  preferred_minutes integer not null check (preferred_minutes in (10, 15, 20, 25)),
  energy_level text not null,
  gentle_start boolean not null default true,
  limitations text[] not null default array['nessuna']::text[],
  focus_preference text not null,
  notes text,
  completed_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timer_sound_enabled boolean not null default true,
  reminders_enabled boolean not null default true,
  preferred_reminder_time time,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active',
  source text not null default 'fallback',
  current_phase text not null,
  phase_label text not null,
  phase_focus text not null,
  current_week integer not null default 1,
  total_weeks integer not null default 6,
  weekly_goal text not null,
  weekly_goal_minutes integer not null default 45,
  weekly_goal_sessions integer not null default 3,
  progression_reason text not null,
  motivational_note text not null,
  caution_notes jsonb not null default '[]'::jsonb,
  adjustments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists training_plans_user_id_idx on public.training_plans(user_id);
create index if not exists training_plans_user_status_idx on public.training_plans(user_id, status);

create table if not exists public.training_plan_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  day_index integer not null,
  scheduled_for date not null,
  title text not null,
  focus text not null,
  session_kind text not null default 'workout',
  estimated_minutes integer not null,
  status text not null default 'planned',
  coach_note text not null,
  caution_notes jsonb not null default '[]'::jsonb,
  workout_payload jsonb not null,
  completed_session_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (plan_id, day_index)
);

create index if not exists training_plan_days_plan_id_idx on public.training_plan_days(plan_id);
create index if not exists training_plan_days_user_scheduled_idx on public.training_plan_days(user_id, scheduled_for);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.training_plans(id) on delete set null,
  plan_day_id uuid references public.training_plan_days(id) on delete set null,
  scheduled_for date,
  status text not null default 'in_progress',
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  duration_minutes integer not null default 0,
  feeling text,
  energy_final text,
  discomfort_notes text,
  stop_reason text,
  adherence_score integer,
  session_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists workout_sessions_user_id_idx on public.workout_sessions(user_id);
create index if not exists workout_sessions_user_started_idx on public.workout_sessions(user_id, started_at desc);

create table if not exists public.workout_session_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id text not null,
  exercise_name text not null,
  position_index integer not null,
  prescribed_duration_seconds integer not null,
  rest_seconds integer not null default 0,
  completed boolean not null default false,
  skipped boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_id, exercise_id)
);

create index if not exists workout_session_exercises_session_idx on public.workout_session_exercises(session_id);

create table if not exists public.exercise_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id text not null,
  marked_uncomfortable boolean not null default false,
  discomfort_note text,
  pain_or_stop boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists exercise_feedback_user_id_idx on public.exercise_feedback(user_id);

create table if not exists public.user_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  milestone_code text not null,
  title text not null,
  description text not null,
  achieved_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, milestone_code)
);

create index if not exists user_milestones_user_id_idx on public.user_milestones(user_id);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reminders_enabled boolean not null default true,
  reminder_time time,
  weekly_summary_enabled boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_user_onboarding_updated_at on public.user_onboarding;
create trigger set_user_onboarding_updated_at
  before update on public.user_onboarding
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_user_preferences_updated_at on public.user_preferences;
create trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_training_plans_updated_at on public.training_plans;
create trigger set_training_plans_updated_at
  before update on public.training_plans
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_training_plan_days_updated_at on public.training_plan_days;
create trigger set_training_plan_days_updated_at
  before update on public.training_plan_days
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_workout_sessions_updated_at on public.workout_sessions;
create trigger set_workout_sessions_updated_at
  before update on public.workout_sessions
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_workout_session_exercises_updated_at on public.workout_session_exercises;
create trigger set_workout_session_exercises_updated_at
  before update on public.workout_session_exercises
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_notification_preferences_updated_at on public.notification_preferences;
create trigger set_notification_preferences_updated_at
  before update on public.notification_preferences
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_onboarding enable row level security;
alter table public.user_preferences enable row level security;
alter table public.training_plans enable row level security;
alter table public.training_plan_days enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_session_exercises enable row level security;
alter table public.exercise_feedback enable row level security;
alter table public.user_milestones enable row level security;
alter table public.notification_preferences enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "user_onboarding_all_own" on public.user_onboarding;
create policy "user_onboarding_all_own" on public.user_onboarding
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_preferences_all_own" on public.user_preferences;
create policy "user_preferences_all_own" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "training_plans_all_own" on public.training_plans;
create policy "training_plans_all_own" on public.training_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "training_plan_days_all_own" on public.training_plan_days;
create policy "training_plan_days_all_own" on public.training_plan_days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_sessions_all_own" on public.workout_sessions;
create policy "workout_sessions_all_own" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_session_exercises_all_own" on public.workout_session_exercises;
create policy "workout_session_exercises_all_own" on public.workout_session_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "exercise_feedback_all_own" on public.exercise_feedback;
create policy "exercise_feedback_all_own" on public.exercise_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_milestones_all_own" on public.user_milestones;
create policy "user_milestones_all_own" on public.user_milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notification_preferences_all_own" on public.notification_preferences;
create policy "notification_preferences_all_own" on public.notification_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
