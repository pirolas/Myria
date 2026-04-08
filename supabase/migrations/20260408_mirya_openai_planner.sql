alter table public.user_onboarding
  add column if not exists primary_body_goal text not null default 'tonicita_rassodare',
  add column if not exists computed_body_goal text not null default 'toning',
  add column if not exists secondary_objectives text[] not null default '{}'::text[],
  add column if not exists preferred_days text[] not null default '{}'::text[],
  add column if not exists focus_areas text[] not null default '{}'::text[],
  add column if not exists past_training_types text[] not null default '{}'::text[],
  add column if not exists prefer_simple_exercises boolean not null default true,
  add column if not exists session_style text not null default 'sequenze_lente',
  add column if not exists session_tone text not null default 'soft',
  add column if not exists avoid_jumps boolean not null default true,
  add column if not exists eating_perception text not null default 'abbastanza',
  add column if not exists skips_meals boolean not null default false,
  add column if not exists nervous_hunger boolean not null default false,
  add column if not exists low_water_intake boolean not null default false,
  add column if not exists low_protein_intake text not null default 'non_so',
  add column if not exists wants_timer_sound boolean not null default true;

alter table public.user_deep_profile
  add column if not exists feared_exercises text,
  add column if not exists disliked_exercises text,
  add column if not exists relevant_interventions text;

alter table public.training_plans
  add column if not exists primary_body_goal text not null default 'tonicita_rassodare',
  add column if not exists computed_body_goal text not null default 'toning',
  add column if not exists profile_summary_payload jsonb not null default '{}'::jsonb,
  add column if not exists plan_overview_payload jsonb not null default '{}'::jsonb,
  add column if not exists support_tips_payload jsonb not null default '{}'::jsonb;

create table if not exists public.training_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  plan_day_id uuid not null references public.training_plan_days(id) on delete cascade,
  position_index integer not null,
  exercise_id text not null,
  exercise_name text not null,
  sets integer not null default 1,
  reps_label text not null,
  duration_seconds_estimate integer not null default 40,
  rest_seconds integer not null default 20,
  execution_note text,
  easier_option text,
  body_area text,
  caution text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists training_plan_exercises_plan_day_idx
  on public.training_plan_exercises(plan_day_id, position_index);

drop trigger if exists set_training_plan_exercises_updated_at on public.training_plan_exercises;
create trigger set_training_plan_exercises_updated_at
  before update on public.training_plan_exercises
  for each row execute procedure public.set_updated_at();

alter table public.training_plan_exercises enable row level security;

drop policy if exists "training_plan_exercises_all_own" on public.training_plan_exercises;
create policy "training_plan_exercises_all_own" on public.training_plan_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
