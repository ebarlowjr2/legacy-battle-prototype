import { supabase } from '@/shared/lib/supabaseClient';
import type { UserProfile, BattleStats } from '@/shared/types';

export async function getProfileById(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

export async function updateDisplayName(userId: string, displayName: string) {
  return supabase.from('profiles').update({ display_name: displayName }).eq('id', userId);
}

export function subscribeToProfile(userId: string, onUpdate: (profile: UserProfile) => void) {
  return supabase
    .channel('profiles-change')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload) => onUpdate(payload.new as UserProfile)
    )
    .subscribe();
}

export async function getBattleStats(userId: string): Promise<BattleStats> {
  const { data: participations } = await supabase
    .from('battle_participants')
    .select('battle_id, is_winner, battles!inner(status)')
    .eq('user_id', userId);

  if (!participations) return { wins: 0, losses: 0, challenges: 0 };

  const completed = participations.filter(
    (p) => (p as { battles?: { status?: string } }).battles?.status === 'resolved'
  );
  const wins = completed.filter((p) => (p as { is_winner?: boolean }).is_winner === true).length;
  const losses = completed.filter((p) => (p as { is_winner?: boolean }).is_winner === false).length;
  const challenges = participations.length;

  return { wins, losses, challenges };
}

export async function getCrewCounts(userId: string) {
  const [crewResult, pendingResult] = await Promise.all([
    supabase.from('crew_members').select('crew_user_id').eq('user_id', userId),
    supabase
      .from('crew_requests')
      .select('id')
      .eq('requested_id', userId)
      .eq('status', 'pending'),
  ]);

  return {
    crewCount: crewResult.data?.length || 0,
    pendingCount: pendingResult.data?.length || 0,
    error: crewResult.error || pendingResult.error,
  };
}
