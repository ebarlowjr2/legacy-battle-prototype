import { supabase } from '../lib/supabaseClient';

export type XpEventType = 'create_challenge' | 'accept_challenge' | 'verified_resolution' | 'share_result';

export type AwardXpResult = {
  success: boolean;
  alreadyAwarded: boolean;
  xp: number;
  rank: string;
  previousRank?: string;
  rankChanged: boolean;
  pointsAwarded?: number;
  error?: string;
};

export type XpEvent = {
  id: string;
  user_id: string;
  event_type: string;
  source_type: string;
  source_id: string;
  points: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
};

const XP_POINTS: Record<XpEventType, number> = {
  create_challenge: 25,
  accept_challenge: 25,
  verified_resolution: 100,
  share_result: 10,
};

export const RANK_THRESHOLDS = [
  { rank: 'Challenger', minXp: 0, maxXp: 99 },
  { rank: 'Contender', minXp: 100, maxXp: 499 },
  { rank: 'Rival', minXp: 500, maxXp: 1499 },
  { rank: 'Warrior', minXp: 1500, maxXp: 4999 },
  { rank: 'Champion', minXp: 5000, maxXp: 14999 },
  { rank: 'Legend', minXp: 15000, maxXp: Infinity },
];

export function getRankInfo(xp: number) {
  const currentIdx = RANK_THRESHOLDS.findIndex(
    (t) => xp >= t.minXp && xp <= t.maxXp
  );
  const idx = currentIdx === -1 ? 0 : currentIdx;
  const current = RANK_THRESHOLDS[idx];
  const next = idx < RANK_THRESHOLDS.length - 1 ? RANK_THRESHOLDS[idx + 1] : current;
  const isMaxRank = idx === RANK_THRESHOLDS.length - 1;

  const progressInRank = xp - current.minXp;
  const rankSpan = isMaxRank ? 1 : next.minXp - current.minXp;
  const progress = isMaxRank ? 100 : Math.min((progressInRank / rankSpan) * 100, 100);

  return {
    rank: current.rank,
    nextRank: next.rank,
    nextRankXp: next.minXp,
    progress,
    isMaxRank,
  };
}

export function getPointsForEvent(eventType: XpEventType): number {
  return XP_POINTS[eventType] ?? 0;
}

export const XpService = {
  awardXp: async (
    eventType: XpEventType,
    sourceType: string,
    sourceId: string
  ): Promise<AwardXpResult> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        return {
          success: false,
          alreadyAwarded: false,
          xp: 0,
          rank: 'Challenger',
          rankChanged: false,
          error: 'Not authenticated',
        };
      }

      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

      const response = await fetch(`${supabaseUrl}/functions/v1/award-xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventType, sourceType, sourceId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          alreadyAwarded: false,
          xp: 0,
          rank: 'Challenger',
          rankChanged: false,
          error: result.error || 'Failed to award XP',
        };
      }

      return result as AwardXpResult;
    } catch (err: any) {
      console.error('XP award error:', err);
      return {
        success: false,
        alreadyAwarded: false,
        xp: 0,
        rank: 'Challenger',
        rankChanged: false,
        error: err.message || 'Network error',
      };
    }
  },

  getUserXpEvents: async (userId: string) => {
    return await supabase
      .from('xp_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  getUserAchievements: async (userId: string) => {
    return await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
  },

  getAllAchievements: async () => {
    return await supabase
      .from('achievements')
      .select('*')
      .order('id', { ascending: true });
  },
};
