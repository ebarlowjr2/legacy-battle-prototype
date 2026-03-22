import { useExploreBattlesQuery } from '../../data/queries';
import { useBattlesStore } from '../../data/store/battles.store';

export function useExploreBattles() {
  const { exploreActiveTab, setExploreActiveTab } = useBattlesStore();
  const exploreQuery = useExploreBattlesQuery(exploreActiveTab);

  return {
    exploreBattles: exploreQuery.data ?? [],
    exploreLoading: exploreQuery.isLoading,
    exploreActiveTab,
    setExploreActiveTab,
  };
}
