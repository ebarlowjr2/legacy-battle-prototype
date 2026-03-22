import { useQuery } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { getQuickPickBattles } from '../api/battles.api';

export function useQuickPickBattlesQuery(userId: string | undefined, limit = 5) {
  return useQuery({
    queryKey: battlesKeys.quickPicks(userId ?? ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await getQuickPickBattles(userId, limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });
}
