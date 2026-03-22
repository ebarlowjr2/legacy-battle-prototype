import { useResultsBySportQuery } from '../../data/queries/useResultsBySportQuery';
import { useSportsStore } from '../../data/store/sports.store';

export function useAllResults() {
  const { resultsSelectedSport, setResultsSelectedSport } = useSportsStore();
  const query = useResultsBySportQuery(resultsSelectedSport);

  return {
    results: query.data ?? [],
    resultsLoading: query.isLoading,
    resultsRefreshing: query.isFetching,
    resultsSelectedSport,
    setResultsSelectedSport,
    refetch: query.refetch,
  };
}
