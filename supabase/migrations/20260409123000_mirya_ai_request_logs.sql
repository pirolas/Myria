create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.training_plans(id) on delete set null,
  request_kind text not null check (request_kind in ('initial_plan', 'plan_update', 'reassessment')),
  trigger text not null,
  provider text not null default 'openai',
  source text not null check (source in ('ai', 'fallback', 'cached')),
  model text not null,
  request_hash text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens integer not null default 0,
  estimated_cost_usd numeric(12, 6) not null default 0,
  latency_ms integer,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ai_request_logs_user_created_idx
  on public.ai_request_logs(user_id, created_at desc);

create index if not exists ai_request_logs_request_hash_idx
  on public.ai_request_logs(user_id, request_hash, created_at desc);

alter table public.ai_request_logs enable row level security;

drop policy if exists "ai_request_logs_select_own" on public.ai_request_logs;
create policy "ai_request_logs_select_own" on public.ai_request_logs
  for select using (auth.uid() = user_id);
