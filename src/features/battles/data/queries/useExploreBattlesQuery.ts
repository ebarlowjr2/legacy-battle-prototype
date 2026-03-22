import { useQuery } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { getExploreBattles } from '../api/battles.api';
import type { ExploreTab } from '../types';

export function useExploreBattlesQuery(tab: ExploreTab) {
  return useQuery({
    queryKey: battlesKeys.explore(tab),
    queryFn: async () => {
      const { data, error } = await getExploreBattles(tab);
      if (error) throw error;
      return data;
    },
  });
}
