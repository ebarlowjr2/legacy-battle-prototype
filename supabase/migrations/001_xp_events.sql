-- =============================================
-- XP Events Ledger Table
-- Server-authoritative XP tracking
-- =============================================

CREATE TABLE public.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  source_type text NOT NULL,
  source_id text NOT NULL,
  points integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_type, source_type, source_id)
);

CREATE INDEX idx_xp_events_user_id ON public.xp_events(user_id);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own XP events"
ON public.xp_events
FOR SELECT
USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for clients
-- Only service role can write to this table
