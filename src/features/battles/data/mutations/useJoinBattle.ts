import { useMutation, useQueryClient } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { joinBattle } from '../api/battles.api';
import type { JoinBattleParams } from '@/shared/types';

export function useJoinBattle(battleId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: JoinBattleParams) => joinBattle(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: battlesKeys.lists() });
      if (battleId) {
        queryClient.invalidateQueries({ queryKey: battlesKeys.detail(battleId) });
      }
    },
  });
}
