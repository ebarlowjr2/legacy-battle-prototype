-- =============================================
-- Achievements System
-- =============================================

CREATE TABLE public.achievements (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'trophy',
  category text NOT NULL DEFAULT 'rank',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- RLS for achievements (public read)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read achievements"
ON public.achievements
FOR SELECT
USING (true);

-- RLS for user_achievements (users read own)
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);

-- No client INSERT/UPDATE/DELETE - only service role writes

-- Seed rank achievements
INSERT INTO public.achievements (id, name, description, icon, category) VALUES
  ('rank_contender', 'Contender', 'Reached Contender rank (100 XP)', 'shield', 'rank'),
  ('rank_rival', 'Rival', 'Reached Rival rank (500 XP)', 'flame', 'rank'),
  ('rank_warrior', 'Warrior', 'Reached Warrior rank (1,500 XP)', 'sword', 'rank'),
  ('rank_champion', 'Champion', 'Reached Champion rank (5,000 XP)', 'crown', 'rank'),
  ('rank_legend', 'Legend', 'Reached Legend rank (15,000 XP)', 'star', 'rank')
ON CONFLICT (id) DO NOTHING;
