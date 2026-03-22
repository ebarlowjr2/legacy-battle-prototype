import { useQuery } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { getBattleWithParticipants } from '../api/battles.api';

export function useBattleQuery(battleId: string | undefined) {
  return useQuery({
    queryKey: battlesKeys.detail(battleId ?? ''),
    queryFn: () => getBattleWithParticipants(battleId!),
    enabled: !!battleId,
  });
}
