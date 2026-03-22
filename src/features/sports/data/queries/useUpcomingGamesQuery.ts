import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '../keys';
import { getUpcomingGames } from '../api/sports.api';

export function useUpcomingGamesQuery() {
  return useQuery({
    queryKey: sportsKeys.upcoming(),
    queryFn: getUpcomingGames,
  });
}
