import { useMutation, useQueryClient } from '@tanstack/react-query';
import { battlesKeys } from '../keys';
import { createBattle } from '../api/battles.api';
import type { CreateBattleParams } from '@/shared/types';

export function useCreateBattle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateBattleParams) => createBattle(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: battlesKeys.lists() });
    },
  });
}
