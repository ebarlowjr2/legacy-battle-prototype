-- Seed achievements data
-- Run this after creating the achievements table

insert into public.achievements (id, name, description, category)
values
  ('rank_contender', 'Contender', 'Reach 100 XP', 'rank'),
  ('rank_rival', 'Rival', 'Reach 500 XP', 'rank'),
  ('rank_warrior', 'Warrior', 'Reach 1,500 XP', 'rank'),
  ('rank_champion', 'Champion', 'Reach 5,000 XP', 'rank'),
  ('rank_legend', 'Legend', 'Reach 15,000 XP', 'rank'),
  ('first_battle', 'First Blood', 'Create your first battle', 'milestone'),
  ('battles_10', 'Battle Veteran', 'Complete 10 battles', 'milestone'),
  ('battles_50', 'Battle Master', 'Complete 50 battles', 'milestone'),
  ('wins_5', 'Rising Star', 'Win 5 battles', 'milestone'),
  ('wins_25', 'Champion Fighter', 'Win 25 battles', 'milestone'),
  ('share_first', 'Social Starter', 'Share your first result', 'social'),
  ('share_10', 'Social Butterfly', 'Share 10 results', 'social')
on conflict (id) do nothing;
