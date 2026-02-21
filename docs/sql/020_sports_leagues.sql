-- 020_sports_leagues.sql
-- Top-level sport/league definitions for browsing

CREATE TABLE IF NOT EXISTS public.sports_leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  sport text NOT NULL,
  league_key text NOT NULL,
  display_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(provider, sport)
);

CREATE INDEX IF NOT EXISTS idx_sports_leagues_sport
  ON public.sports_leagues (sport);

ALTER TABLE public.sports_leagues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sports_leagues_select ON public.sports_leagues;
CREATE POLICY sports_leagues_select
  ON public.sports_leagues FOR SELECT
  USING (true);

DROP POLICY IF EXISTS sports_leagues_deny_insert ON public.sports_leagues;
CREATE POLICY sports_leagues_deny_insert
  ON public.sports_leagues FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS sports_leagues_deny_update ON public.sports_leagues;
CREATE POLICY sports_leagues_deny_update
  ON public.sports_leagues FOR UPDATE
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS sports_leagues_deny_delete ON public.sports_leagues;
CREATE POLICY sports_leagues_deny_delete
  ON public.sports_leagues FOR DELETE
  USING (false);

-- Seed the 4 major leagues
INSERT INTO public.sports_leagues (provider, sport, league_key, display_name) VALUES
  ('espn', 'NBA', 'nba', 'National Basketball Association'),
  ('espn', 'NFL', 'nfl', 'National Football League'),
  ('espn', 'MLB', 'mlb', 'Major League Baseball'),
  ('espn', 'NHL', 'nhl', 'National Hockey League')
ON CONFLICT (provider, sport) DO NOTHING;
