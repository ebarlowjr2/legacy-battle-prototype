-- =============================================
-- Rank Calculation Functions
-- =============================================

-- Returns rank name from total XP
CREATE OR REPLACE FUNCTION public.rank_from_xp(total_xp integer)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF total_xp >= 15000 THEN RETURN 'Legend';
  ELSIF total_xp >= 5000 THEN RETURN 'Champion';
  ELSIF total_xp >= 1500 THEN RETURN 'Warrior';
  ELSIF total_xp >= 500 THEN RETURN 'Rival';
  ELSIF total_xp >= 100 THEN RETURN 'Contender';
  ELSE RETURN 'Challenger';
  END IF;
END;
$$;

-- Returns XP needed for next rank
CREATE OR REPLACE FUNCTION public.next_rank_target(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF total_xp >= 15000 THEN RETURN 15000;
  ELSIF total_xp >= 5000 THEN RETURN 15000;
  ELSIF total_xp >= 1500 THEN RETURN 5000;
  ELSIF total_xp >= 500 THEN RETURN 1500;
  ELSIF total_xp >= 100 THEN RETURN 500;
  ELSE RETURN 100;
  END IF;
END;
$$;

-- Recomputes profile XP from the xp_events ledger
-- SECURITY DEFINER so it runs with table owner privileges
CREATE OR REPLACE FUNCTION public.recompute_profile_xp(p_user_id uuid)
RETURNS TABLE(new_xp integer, new_rank text, old_rank text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_xp integer;
  v_new_rank text;
  v_old_rank text;
BEGIN
  SELECT COALESCE(SUM(points), 0) INTO v_total_xp
  FROM public.xp_events
  WHERE user_id = p_user_id;

  v_new_rank := public.rank_from_xp(v_total_xp);

  SELECT level INTO v_old_rank
  FROM public.profiles
  WHERE id = p_user_id;

  UPDATE public.profiles
  SET xp = v_total_xp,
      level = v_new_rank
  WHERE id = p_user_id;

  RETURN QUERY SELECT v_total_xp, v_new_rank, COALESCE(v_old_rank, 'Challenger');
END;
$$;
