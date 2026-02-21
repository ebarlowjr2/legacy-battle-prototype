-- 021_sports_players.sql
-- Player profiles linked to teams

CREATE TABLE IF NOT EXISTS public.sports_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  sport text NOT NULL,
  provider_player_id text NOT NULL,
  team_id uuid REFERENCES public.sports_teams(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  short_name text,
  position text,
  jersey text,
  headshot_url text,
  status text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(provider, sport, provider_player_id)
);

CREATE INDEX IF NOT EXISTS idx_sports_players_sport_team
  ON public.sports_players (sport, team_id);

CREATE INDEX IF NOT EXISTS idx_sports_players_name
  ON public.sports_players (sport, lower(full_name));

ALTER TABLE public.sports_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sports_players_select ON public.sports_players;
CREATE POLICY sports_players_select
  ON public.sports_players FOR SELECT
  USING (true);

DROP POLICY IF EXISTS sports_players_deny_insert ON public.sports_players;
CREATE POLICY sports_players_deny_insert
  ON public.sports_players FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS sports_players_deny_update ON public.sports_players;
CREATE POLICY sports_players_deny_update
  ON public.sports_players FOR UPDATE
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS sports_players_deny_delete ON public.sports_players;
CREATE POLICY sports_players_deny_delete
  ON public.sports_players FOR DELETE
  USING (false);
