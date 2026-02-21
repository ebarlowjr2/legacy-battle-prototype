-- 022_sports_roster_snapshots.sql
-- Roster version snapshots per team (for historical tracking)

CREATE TABLE IF NOT EXISTS public.sports_team_roster_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  sport text NOT NULL,
  team_id uuid NOT NULL REFERENCES public.sports_teams(id) ON DELETE CASCADE,
  season_year int,
  as_of_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(provider, sport, team_id, as_of_date)
);

CREATE INDEX IF NOT EXISTS idx_roster_snapshots_team
  ON public.sports_team_roster_snapshots (team_id, as_of_date DESC);

ALTER TABLE public.sports_team_roster_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS roster_snapshots_select ON public.sports_team_roster_snapshots;
CREATE POLICY roster_snapshots_select
  ON public.sports_team_roster_snapshots FOR SELECT
  USING (true);

DROP POLICY IF EXISTS roster_snapshots_deny_insert ON public.sports_team_roster_snapshots;
CREATE POLICY roster_snapshots_deny_insert
  ON public.sports_team_roster_snapshots FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS roster_snapshots_deny_update ON public.sports_team_roster_snapshots;
CREATE POLICY roster_snapshots_deny_update
  ON public.sports_team_roster_snapshots FOR UPDATE
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS roster_snapshots_deny_delete ON public.sports_team_roster_snapshots;
CREATE POLICY roster_snapshots_deny_delete
  ON public.sports_team_roster_snapshots FOR DELETE
  USING (false);
