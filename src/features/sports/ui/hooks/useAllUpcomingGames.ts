import { useEffect } from 'react';
import { useUpcomingBySportQuery } from '../../data/queries/useUpcomingBySportQuery';
import { useSportsStore } from '../../data/store/sports.store';
import type { SportFilter } from '../../data/keys';

export function useAllUpcomingGames(initialSport?: SportFilter) {
  const { gamesSelectedSport, setGamesSelectedSport } = useSportsStore();

  useEffect(() => {
    if (initialSport) {
      setGamesSelectedSport(initialSport);
    }
  }, [initialSport, setGamesSelectedSport]);

  const query = useUpcomingBySportQuery(gamesSelectedSport);

  const handleSportChange = (sport: SportFilter) => {
    setGamesSelectedSport(sport);
  };

  return {
    games: query.data ?? [],
    gamesLoading: query.isLoading,
    gamesRefreshing: query.isFetching,
    gamesSelectedSport,
    setGamesSelectedSport: handleSportChange,
    refetch: query.refetch,
  };
}
