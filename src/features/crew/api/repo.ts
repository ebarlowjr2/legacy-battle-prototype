import { supabase } from '@/shared/lib/supabaseClient';
import type { CrewMember, CrewRequest } from '@/shared/types';
import type { CrewRequestWithProfile } from '@/shared/types';

export const CrewRepo = {
  getCrewMembers: async (userId: string): Promise<{ data: CrewMember[]; error: unknown }> => {
    const { data: members, error } = await supabase
      .from('crew_members')
      .select('crew_user_id')
      .eq('user_id', userId);

    if (error || !members || members.length === 0) {
      return { data: [], error };
    }

    const memberIds = members.map((m) => m.crew_user_id);

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', memberIds);

    return { data: (profiles || []) as CrewMember[], error: profileError };
  },

  getPendingReceived: async (userId: string): Promise<{ data: CrewRequestWithProfile[]; error: unknown }> => {
    const { data, error } = await supabase
      .from('crew_requests')
      .select('*')
      .eq('requested_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [], error };
    }

    const requesterIds = data.map((r) => r.requester_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', requesterIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enriched: CrewRequestWithProfile[] = data.map((r) => ({
      ...(r as CrewRequest),
      sender: profileMap.get(r.requester_id) as CrewMember | undefined,
    }));

    return { data: enriched, error: null };
  },

  getPendingSent: async (userId: string): Promise<{ data: CrewRequestWithProfile[]; error: unknown }> => {
    const { data, error } = await supabase
      .from('crew_requests')
      .select('*')
      .eq('requester_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: [], error };
    }

    const requestedIds = data.map((r) => r.requested_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', requestedIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enriched: CrewRequestWithProfile[] = data.map((r) => ({
      ...(r as CrewRequest),
      receiver: profileMap.get(r.requested_id) as CrewMember | undefined,
    }));

    return { data: enriched, error: null };
  },

  getRequestStatus: async (userId: string, otherUserId: string): Promise<CrewRequest | null> => {
    const { data } = await supabase
      .from('crew_requests')
      .select('*')
      .or(
        `and(requester_id.eq.${userId},requested_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},requested_id.eq.${userId})`
      )
      .in('status', ['pending', 'accepted'])
      .limit(1)
      .maybeSingle();

    return (data as CrewRequest) || null;
  },

  getBattleSuggestions: async (userId: string): Promise<{ data: CrewMember[]; error: unknown }> => {
    const { data: participants, error: partError } = await supabase
      .from('battle_participants')
      .select('battle_id')
      .eq('user_id', userId);

    if (partError || !participants || participants.length === 0) {
      return { data: [], error: partError };
    }

    const battleIds = participants.map((p) => p.battle_id);

    const { data: coParticipants, error: coError } = await supabase
      .from('battle_participants')
      .select('user_id')
      .in('battle_id', battleIds)
      .neq('user_id', userId);

    if (coError || !coParticipants || coParticipants.length === 0) {
      return { data: [], error: coError };
    }

    const uniqueUserIds = [...new Set(coParticipants.map((p) => p.user_id))];

    const { data: crewRows } = await supabase
      .from('crew_members')
      .select('crew_user_id')
      .eq('user_id', userId);

    const { data: pendingRequests } = await supabase
      .from('crew_requests')
      .select('requester_id, requested_id')
      .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
      .in('status', ['pending', 'accepted']);

    const connectedIds = new Set<string>();
    (crewRows || []).forEach((r) => connectedIds.add(r.crew_user_id));
    (pendingRequests || []).forEach((r) => {
      connectedIds.add(r.requester_id === userId ? r.requested_id : r.requester_id);
    });

    const suggestableIds = uniqueUserIds.filter((id) => !connectedIds.has(id));

    if (suggestableIds.length === 0) {
      return { data: [], error: null };
    }

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', suggestableIds)
      .limit(10);

    return { data: (profiles || []) as CrewMember[], error: profileError };
  },

  searchUsers: async (query: string, currentUserId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .neq('id', currentUserId)
      .limit(10);

    return { data: (data || []) as CrewMember[], error };
  },
};
