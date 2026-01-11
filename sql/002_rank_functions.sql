-- Rank calculation functions
-- These are immutable SQL functions for computing rank from XP

-- Function to compute rank from total XP
create or replace function public.rank_from_xp(total_xp integer)
returns text
language sql
immutable
as $$
  select case
    when total_xp >= 15000 then 'Legend'
    when total_xp >= 5000 then 'Champion'
    when total_xp >= 1500 then 'Warrior'
    when total_xp >= 500 then 'Rival'
    when total_xp >= 100 then 'Contender'
    else 'Challenger'
  end;
$$;

-- Function to compute next rank target XP
create or replace function public.next_rank_target(total_xp integer)
returns integer
language sql
immutable
as $$
  select case
    when total_xp >= 15000 then 15000
    when total_xp >= 5000 then 15000
    when total_xp >= 1500 then 5000
    when total_xp >= 500 then 1500
    when total_xp >= 100 then 500
    else 100
  end;
$$;

-- Function to compute previous rank threshold
create or replace function public.prev_rank_threshold(total_xp integer)
returns integer
language sql
immutable
as $$
  select case
    when total_xp >= 15000 then 15000
    when total_xp >= 5000 then 5000
    when total_xp >= 1500 then 1500
    when total_xp >= 500 then 500
    when total_xp >= 100 then 100
    else 0
  end;
$$;

-- Server-only function to recompute profile XP + rank from ledger
-- This reads the xp_events ledger and updates profiles
create or replace function public.recompute_profile_xp(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  total integer;
  rank text;
begin
  select coalesce(sum(points), 0) into total
  from public.xp_events
  where user_id = p_user_id;

  rank := public.rank_from_xp(total);

  update public.profiles
  set xp = total,
      level = rank
  where id = p_user_id;
end;
$$;

-- Revoke public access to recompute function (server-only)
revoke all on function public.recompute_profile_xp(uuid) from public;
