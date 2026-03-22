import { useQuery } from '@tanstack/react-query';
import { sportsKeys } from '../keys';
import { getResultByEventId } from '../api/sports.api';

export function useResultByEventIdQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: sportsKeys.result(eventId ?? ''),
    queryFn: async () => {
      const { data, error } = await getResultByEventId(eventId!);
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
    refetchInterval: 60000,
  });
}
