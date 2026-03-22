import { useQuery } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { getBattles } from '../api/battles.api';

export function useBattlesQuery() {
  return useQuery({
    queryKey: battlesKeys.lists(),
    queryFn: async () => {
      const { data, error } = await getBattles();
      if (error) throw error;
      return data ?? [];
    },
  });
}
