create table if not exists public.user_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'free_trial',
  trial_started_at timestamptz not null default timezone('utc', now()),
  trial_expires_at timestamptz not null default (timezone('utc', now()) + interval '7 days'),
  free_sessions_limit integer not null default 3,
  free_sessions_used integer not null default 0,
  first_plan_generated_at timestamptz,
  premium_started_at timestamptz,
  premium_ends_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_user_access_updated_at on public.user_access;
create trigger set_user_access_updated_at
  before update on public.user_access
  for each row execute procedure public.set_updated_at();

alter table public.user_access enable row level security;

drop policy if exists "user_access_all_own" on public.user_access;
create policy "user_access_all_own" on public.user_access
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
