-- XP Events Ledger Table
-- This table stores all XP awards as an audit trail
-- Writes are done via Edge Function using service role key (not client)

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,            -- create_challenge | accept_challenge | verified_resolution | share_result
  source_type text not null,           -- battle | share | system
  source_id text not null,             -- battle_id or share_id etc (string for flexibility)
  points integer not null check (points > 0),
  created_at timestamptz not null default now(),

  -- Prevent duplicates per action:
  unique (user_id, event_type, source_type, source_id)
);

create index if not exists idx_xp_events_user_time on public.xp_events (user_id, created_at desc);

alter table public.xp_events enable row level security;

-- Allow users to read their own xp history
drop policy if exists "read own xp events" on public.xp_events;
create policy "read own xp events"
on public.xp_events
for select
using (auth.uid() = user_id);

-- Block client inserts/updates/deletes (server only)
drop policy if exists "deny client writes xp events" on public.xp_events;
create policy "deny client writes xp events"
on public.xp_events
for all
using (false)
with check (false);
