import { useQuery } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { getMyAcceptedBattles } from '../api/battles.api';

export function useMyAcceptedBattlesQuery(userId: string | undefined, limit = 5) {
  return useQuery({
    queryKey: battlesKeys.accepted(userId ?? ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await getMyAcceptedBattles(userId, limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });
}
