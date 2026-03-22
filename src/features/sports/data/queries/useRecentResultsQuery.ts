import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '../keys';
import { getRecentResults } from '../api/sports.api';

export function useRecentResultsQuery() {
  return useQuery({
    queryKey: sportsKeys.recent(),
    queryFn: getRecentResults,
  });
}
