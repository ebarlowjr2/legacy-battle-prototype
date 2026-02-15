import { supabase } from '../lib/supabaseClient';
import { getResultByEventId } from './sportsApi';
import { XpService, AwardXpResult } from './xpService';

export type Battle = {
  id: string;
  creator_id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  stake: number;
  status: 'open' | 'active' | 'completed' | 'canceled';
  created_at: string;
  winner_id: string | null;
  resolved_at: string | null;
  final_outcome: Record<string, any> | null;
};

export type BattleParticipant = {
  id: string;
  battle_id?: string;
  user_id: string;
  pick: string | null;
  joined_at: string;
};

export type JoinBattleParams = {
  battleId: string;
  userId: string;
  pick: string;
};

export type CreateBattleParams = {
  creatorId: string;
  title: string;
  description?: string;
  eventId?: string;
  stake?: number;
  creatorPick?: string;
};

export const BattleService = {
  createBattle: async ({ creatorId, title, description, eventId, stake, creatorPick }: CreateBattleParams) => {
    const { data: battle, error } = await supabase
      .from('battles')
      .insert({
        creator_id: creatorId,
        title,
        description: description || null,
        event_id: eventId || null,
        stake: stake || 0,
      })
      .select()
      .single();

    if (error || !battle) {
      return { data: battle, error };
    }

    if (creatorPick) {
      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battle.id,
          user_id: creatorId,
          pick: creatorPick,
        });

      if (participantError) {
        console.error('Error inserting creator participant:', participantError);
      }
    }

    XpService.awardXp('create_challenge', 'battle', battle.id).catch((e) =>
      console.warn('XP award (create) failed:', e)
    );

    return { data: battle, error };
  },

  getBattles:async () => {
    return await supabase
      .from('battles')
      .select('*')
      .order('created_at', { ascending: false });
  },

  getBattlesByStatus: async (status: Battle['status']) => {
    return await supabase
      .from('battles')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
  },

  getUserBattles: async (userId: string) => {
    return await supabase
      .from('battles')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });
  },

  getMyAcceptedBattles: async (userId: string, limit = 5) => {
    return await supabase
      .from('battles')
      .select('*, battle_participants(*)')
      .eq('creator_id', userId)
      .in('status', ['active', 'completed'])
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  getQuickPickBattles: async (userId: string, limit = 5) => {
    return await supabase
      .from('battles')
      .select('*, battle_participants(*)')
      .eq('status', 'open')
      .neq('creator_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  subscribeToBattles: (callback: (payload: any) => void) => {
    return supabase
      .channel('public:battles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'battles' },
        callback
      )
      .subscribe();
  },

  getBattleWithParticipants: async (battleId: string) => {
    const { data: battle, error: battleError } = await supabase
      .from('battles')
      .select('*')
      .eq('id', battleId)
      .single();

    if (battleError) {
      return { battle: null, participants: [], error: battleError };
    }

    const { data: participants, error: participantsError } = await supabase
      .from('battle_participants')
      .select('id, user_id, pick, joined_at')
      .eq('battle_id', battleId)
      .order('joined_at', { ascending: true });

    return { battle, participants: participants || [], error: participantsError };
  },

  joinBattle: async ({ battleId, userId, pick }: JoinBattleParams) => {
    const { data, error } = await supabase
      .from('battle_participants')
      .insert({
        battle_id: battleId,
        user_id: userId,
        pick,
      })
      .select()
      .single();

    if (error) {
      return { data, error };
    }

    const { data: participants, error: participantsError } = await supabase
      .from('battle_participants')
      .select('id')
      .eq('battle_id', battleId);

    if (!participantsError && (participants?.length || 0) >= 2) {
      await supabase
        .from('battles')
        .update({ status: 'active' })
        .eq('id', battleId);
    }

    XpService.awardXp('accept_challenge', 'battle', battleId).catch((e) =>
      console.warn('XP award (join) failed:', e)
    );

    return { data, error };
  },

  subscribeToParticipants:(battleId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`battle_participants:${battleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battle_participants',
          filter: `battle_id=eq.${battleId}`,
        },
        callback
      )
      .subscribe();
  },

  resolveBattle: async (battleId: string) => {
    const { battle, participants, error: loadError } =
      await BattleService.getBattleWithParticipants(battleId);

    if (loadError || !battle) {
      return { error: loadError || { message: 'Battle not found' }, winnerId: null };
    }

    if (!battle.event_id) {
      return { error: { message: 'This battle has no linked event.' }, winnerId: null };
    }

    const { data: result, error: apiError } = await getResultByEventId(battle.event_id);

    if (apiError || !result) {
      return { error: apiError || { message: 'Could not fetch game result' }, winnerId: null };
    }

    const home = Number(result.intHomeScore || 0);
    const away = Number(result.intAwayScore || 0);
    const winnerTeam =
      home > away ? result.strHomeTeam :
      away > home ? result.strAwayTeam :
      'TIE';

    let winnerId: string | null = null;

    if (winnerTeam !== 'TIE') {
      const winningParticipant = participants.find(p => p.pick === winnerTeam);
      if (winningParticipant) {
        winnerId = winningParticipant.user_id;
      }
    }

    const { error: updateError } = await supabase
      .from('battles')
      .update({
        status: 'completed',
        winner_id: winnerId,
        final_outcome: {
          home_team: result.strHomeTeam,
          away_team: result.strAwayTeam,
          home_score: home,
          away_score: away,
        },
        resolved_at: new Date().toISOString(),
      })
      .eq('id', battleId);

    if (!updateError) {
      for (const participant of participants) {
        XpService.awardXp('verified_resolution', 'battle', battleId).catch((e) =>
          console.warn('XP award (resolve) failed:', e)
        );
      }
    }

    return { error: updateError, winnerId };
  },

  shareResult: async (battleId: string): Promise<AwardXpResult> => {
    return await XpService.awardXp('share_result', 'battle', battleId);
  },
};
