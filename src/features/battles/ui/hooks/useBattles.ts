import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBattlesQuery } from '../../data/queries';
import { useBattlesStore } from '../../data/store/battles.store';
import { battlesKeys } from '../../data/keys';
import { subscribeToBattles, removeChannel } from '../../data/api/battles.api';

export function useBattles() {
  const queryClient = useQueryClient();
  const battlesQuery = useBattlesQuery();
  const { listActiveTab, setListActiveTab } = useBattlesStore();

  useEffect(() => {
    const channel = subscribeToBattles(() => {
      queryClient.invalidateQueries({ queryKey: battlesKeys.lists() });
    });
    return () => removeChannel(channel);
  }, [queryClient]);

  const battles = battlesQuery.data ?? [];
  const filteredBattles = battles.filter((battle) => {
    if (listActiveTab === 'open') return battle.status === 'open';
    if (listActiveTab === 'active') return battle.status === 'active';
    if (listActiveTab === 'completed')
      return battle.status === 'completed' || battle.status === 'canceled';
    return true;
  });

  return {
    battles: filteredBattles,
    isLoading: battlesQuery.isLoading,
    isRefreshing: battlesQuery.isFetching,
    error: battlesQuery.error,
    refetch: battlesQuery.refetch,
    listActiveTab,
    setListActiveTab,
  };
}
