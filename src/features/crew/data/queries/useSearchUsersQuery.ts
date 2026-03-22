import { useQuery } from '@tanstack/react-query';
import { crewKeys } from '../keys';
import { searchUsers, getRequestStatus } from '../api/crew.api';
import type { CrewMemberWithStatus } from '@/shared/types';

export function useSearchUsersQuery(query: string, userId: string | undefined) {
  return useQuery({
    queryKey: crewKeys.search(query, userId ?? ''),
    queryFn: async (): Promise<CrewMemberWithStatus[]> => {
      const { data, error } = await searchUsers(query, userId!);
      if (error) throw error;
      const profiles = data ?? [];
      const enriched: CrewMemberWithStatus[] = [];
      for (const profile of profiles) {
        const existing = await getRequestStatus(userId!, profile.id);
        enriched.push({ ...profile, requestStatus: existing?.status });
      }
      return enriched;
    },
    enabled: !!userId && !!query.trim(),
  });
}
