import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '../keys';
import { getResultsBySport } from '../api/sports.api';
import type { SportFilter } from '../keys';

export function useResultsBySportQuery(sport: SportFilter) {
  return useQuery({
    queryKey: sportsKeys.resultsBySport(sport),
    queryFn: () => getResultsBySport(sport),
  });
}
