// XP Service - Client-side service for awarding XP via Edge Function
import { supabase } from '../lib/supabaseClient';

export type XpEventType = 
  | 'create_challenge' 
  | 'accept_challenge' 
  | 'verified_resolution' 
  | 'share_result';

export type XpSourceType = 'battle' | 'share' | 'system';

export type AwardXpParams = {
  eventType: XpEventType;
  sourceType: XpSourceType;
  sourceId: string;
};

export type AwardXpResult = {
  ok: boolean;
  status: 'awarded' | 'already_awarded' | 'error';
  points?: number;
  eventType?: string;
  previousXp?: number;
  newXp?: number;
  previousLevel?: string;
  newLevel?: string;
  rankUp?: boolean;
  newAchievement?: string | null;
  error?: string;
};

// Rank thresholds for client-side display
export const RANK_THRESHOLDS = {
  Challenger: { min: 0, max: 99 },
  Contender: { min: 100, max: 499 },
  Rival: { min: 500, max: 1499 },
  Warrior: { min: 1500, max: 4999 },
  Champion: { min: 5000, max: 14999 },
  Legend: { min: 15000, max: Infinity },
};

// XP values for display purposes
export const XP_VALUES = {
  create_challenge: 25,
  accept_challenge: 25,
  verified_resolution: 100,
  share_result: 10,
};

export const XpService = {
  /**
   * Award XP to the current user for an action
   * This calls the award-xp Edge Function which handles:
   * - Idempotent XP insertion (no double awards)
   * - Profile XP/rank recomputation
   * - Achievement unlocking
   */
  awardXp: async ({ eventType, sourceType, sourceId }: AwardXpParams): Promise<AwardXpResult> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { ok: false, status: 'error', error: 'Not authenticated' };
      }

      const response = await supabase.functions.invoke('award-xp', {
        body: { eventType, sourceType, sourceId },
      });

      if (response.error) {
        console.error('Error awarding XP:', response.error);
        return { ok: false, status: 'error', error: response.error.message };
      }

      return response.data as AwardXpResult;
    } catch (error: any) {
      console.error('Error in awardXp:', error);
      return { ok: false, status: 'error', error: error.message };
    }
  },

  /**
   * Get XP history for the current user
   */
  getXpHistory: async (limit = 50) => {
    const { data, error } = await supabase
      .from('xp_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  /**
   * Get user's achievements
   */
  getUserAchievements: async () => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .order('earned_at', { ascending: false });

    return { data, error };
  },

  /**
   * Get all available achievements
   */
  getAllAchievements: async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    return { data, error };
  },

  /**
   * Calculate rank info from XP (client-side helper)
   */
  getRankInfo: (xp: number) => {
    let currentRank = 'Challenger';
    let nextRank = 'Contender';
    let prevThreshold = 0;
    let nextThreshold = 100;

    if (xp >= 15000) {
      currentRank = 'Legend';
      nextRank = 'Legend';
      prevThreshold = 15000;
      nextThreshold = 15000;
    } else if (xp >= 5000) {
      currentRank = 'Champion';
      nextRank = 'Legend';
      prevThreshold = 5000;
      nextThreshold = 15000;
    } else if (xp >= 1500) {
      currentRank = 'Warrior';
      nextRank = 'Champion';
      prevThreshold = 1500;
      nextThreshold = 5000;
    } else if (xp >= 500) {
      currentRank = 'Rival';
      nextRank = 'Warrior';
      prevThreshold = 500;
      nextThreshold = 1500;
    } else if (xp >= 100) {
      currentRank = 'Contender';
      nextRank = 'Rival';
      prevThreshold = 100;
      nextThreshold = 500;
    }

    const progress = nextThreshold === prevThreshold 
      ? 100 
      : ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

    return {
      currentRank,
      nextRank,
      prevThreshold,
      nextThreshold,
      progress: Math.min(100, Math.max(0, progress)),
      xpToNext: Math.max(0, nextThreshold - xp),
    };
  },
};
