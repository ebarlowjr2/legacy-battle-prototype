-- Achievements and User Achievements Tables

-- Achievements catalog table
create table if not exists public.achievements (
  id text primary key,                 -- e.g. "rank_contender", "first_battle", "share_10"
  name text not null,
  description text not null,
  icon text,                           -- optional: icon key
  category text not null,              -- rank | milestone | social
  created_at timestamptz not null default now()
);

-- User achievements junction table
create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- Everyone can read achievements catalog
drop policy if exists "read achievements" on public.achievements;
create policy "read achievements"
on public.achievements for select
using (true);

-- Users can read their own earned achievements
drop policy if exists "read own user achievements" on public.user_achievements;
create policy "read own user achievements"
on public.user_achievements for select
using (auth.uid() = user_id);

-- Block client writes (server only)
drop policy if exists "deny client writes user achievements" on public.user_achievements;
create policy "deny client writes user achievements"
on public.user_achievements
for all
using (false)
with check (false);
