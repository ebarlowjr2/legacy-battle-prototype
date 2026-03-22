import { supabase } from '@/shared/lib/supabaseClient';
import type { Battle, BattleParticipant } from '@/shared/types';
import type { JoinBattleParams, CreateBattleParams } from '@/shared/types';
import type { BattleWithParticipants, ExploreBattle, ExploreBattleRow } from '@/shared/types';

export async function getBattles() {
  return supabase
    .from('battles')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function getBattleWithParticipants(battleId: string): Promise<BattleWithParticipants> {
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
    .select('id, user_id, pick, joined_at, is_winner')
    .eq('battle_id', battleId)
    .order('joined_at', { ascending: true });

  return {
    battle,
    participants: (participants || []) as BattleParticipant[],
    error: participantsError,
  };
}

export async function getExploreBattles(tab: 'Trending' | 'Ending Soon' | 'New' | 'High Activity') {
  let query = supabase
    .from('battles')
    .select(
      `
      id,
      title,
      status,
      created_at,
      stake,
      event_id,
      battle_participants(count)
    `
    )
    .eq('status', 'open');

  if (tab === 'Ending Soon') {
    query = query.order('created_at', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(10);
  if (error || !data) return { data: [], error };

  const battlesWithCount: ExploreBattle[] = (data as ExploreBattleRow[]).map((b) => ({
    ...b,
    participant_count: b.battle_participants?.[0]?.count || 0,
  }));

  return { data: battlesWithCount, error: null };
}

export async function getQuickPickBattles(userId: string, limit = 5) {
  return supabase
    .from('battles')
    .select('*, battle_participants(*)')
    .eq('status', 'open')
    .neq('creator_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function getMyAcceptedBattles(userId: string, limit = 5) {
  return supabase
    .from('battles')
    .select('*, battle_participants(*)')
    .eq('creator_id', userId)
    .in('status', ['active', 'completed'])
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function createBattle(params: CreateBattleParams) {
  const { creatorId, title, description, eventId, stake, creatorPick, visibility } = params;

  const { data: battle, error } = await supabase
    .from('battles')
    .insert({
      creator_id: creatorId,
      title,
      description: description || null,
      event_id: eventId || null,
      stake: stake || 0,
      visibility: visibility || 'public',
    })
    .select()
    .single();

  if (error || !battle) return { data: battle, error };

  if (creatorPick) {
    await supabase.from('battle_participants').insert({
      battle_id: battle.id,
      user_id: creatorId,
      pick: creatorPick,
    });
  }

  return { data: battle, error };
}

export async function joinBattle(params: JoinBattleParams) {
  const { battleId, userId, pick } = params;

  const { data: battle, error: battleError } = await supabase
    .from('battles')
    .select('creator_id, visibility')
    .eq('id', battleId)
    .single();

  if (battleError || !battle) {
    return { data: null, error: battleError || { message: 'Battle not found' } };
  }

  if (battle.visibility === 'crew') {
    const { data: crewLink } = await supabase
      .from('crew_members')
      .select('id')
      .eq('user_id', battle.creator_id)
      .eq('crew_user_id', userId)
      .limit(1)
      .maybeSingle();

    if (!crewLink) {
      return {
        data: null,
        error: { message: "This battle is crew-only. You must be in the creator's crew to join." },
      };
    }
  }

  const { data, error } = await supabase
    .from('battle_participants')
    .insert({ battle_id: battleId, user_id: userId, pick })
    .select()
    .single();

  if (error) return { data, error };

  const { data: participants } = await supabase
    .from('battle_participants')
    .select('id')
    .eq('battle_id', battleId);

  if ((participants?.length || 0) >= 2) {
    await supabase.from('battles').update({ status: 'active' }).eq('id', battleId);
  }

  return { data, error };
}

export function subscribeToBattles(callback: (payload: unknown) => void) {
  return supabase
    .channel('public:battles')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'battles' }, callback)
    .subscribe();
}

export function subscribeToParticipants(battleId: string, callback: (payload: unknown) => void) {
  return supabase
    .channel(`battle_participants:${battleId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` },
      callback
    )
    .subscribe();
}

export function removeChannel(channel: ReturnType<typeof supabase.channel>) {
  supabase.removeChannel(channel);
}
