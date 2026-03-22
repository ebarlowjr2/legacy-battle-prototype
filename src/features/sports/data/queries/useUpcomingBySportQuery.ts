import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '../keys';
import { getUpcomingBySport } from '../api/sports.api';
import type { SportFilter } from '../keys';

export function useUpcomingBySportQuery(sport: SportFilter) {
  return useQuery({
    queryKey: sportsKeys.upcomingBySport(sport),
    queryFn: () => getUpcomingBySport(sport),
  });
}
