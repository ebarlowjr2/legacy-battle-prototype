-- 023_sports_roster_members.sql
-- Many-to-many roster membership (snapshot <-> player)

CREATE TABLE IF NOT EXISTS public.sports_roster_members (
  snapshot_id uuid NOT NULL REFERENCES public.sports_team_roster_snapshots(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.sports_players(id) ON DELETE CASCADE,
  depth_order int,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (snapshot_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_roster_members_player
  ON public.sports_roster_members (player_id);

ALTER TABLE public.sports_roster_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS roster_members_select ON public.sports_roster_members;
CREATE POLICY roster_members_select
  ON public.sports_roster_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS roster_members_deny_insert ON public.sports_roster_members;
CREATE POLICY roster_members_deny_insert
  ON public.sports_roster_members FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS roster_members_deny_update ON public.sports_roster_members;
CREATE POLICY roster_members_deny_update
  ON public.sports_roster_members FOR UPDATE
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS roster_members_deny_delete ON public.sports_roster_members;
CREATE POLICY roster_members_deny_delete
  ON public.sports_roster_members FOR DELETE
  USING (false);
