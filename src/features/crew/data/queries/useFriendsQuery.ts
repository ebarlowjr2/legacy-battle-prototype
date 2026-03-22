import { useQuery } from '@tanstack/react-query';
import { crewKeys } from '../keys';
import {
  getCrewMembers,
  getPendingReceived,
  getBattleSuggestions,
} from '../api/crew.api';

async function fetchFriendsData(userId: string) {
  const [membersRes, pendingRes, suggestionsRes] = await Promise.all([
    getCrewMembers(userId),
    getPendingReceived(userId),
    getBattleSuggestions(userId),
  ]);

  return {
    crewMembers: membersRes.data || [],
    pendingReceived: pendingRes.data || [],
    suggestions: suggestionsRes.data || [],
  };
}

export function useFriendsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: crewKeys.friends(userId ?? ''),
    queryFn: () => fetchFriendsData(userId!),
    enabled: !!userId,
  });
}
