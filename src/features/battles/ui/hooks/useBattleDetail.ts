import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBattleQuery } from '../../data/queries';
import { useBattlesStore } from '../../data/store/battles.store';
import { useJoinBattle } from '../../data/mutations/useJoinBattle';
import { useResultByEventIdQuery } from '@/features/sports/data/queries/useResultByEventIdQuery';
import { battlesKeys } from '../../data/keys';
import { subscribeToBattles, subscribeToParticipants, removeChannel } from '../../data/api/battles.api';

export function useBattleDetail(battleId: string | undefined) {
  const queryClient = useQueryClient();
  const battleQuery = useBattleQuery(battleId);
  const { battle, participants, error } = battleQuery.data ?? {
    battle: null,
    participants: [],
    error: null,
  };
  const gameScoreQuery = useResultByEventIdQuery(battle?.event_id ?? undefined);
  const { pick, setPick } = useBattlesStore();
  const joinMutation = useJoinBattle(battleId);

  useEffect(() => {
    if (!battleId) return;

    const battleChannel = subscribeToBattles(() => {
      queryClient.invalidateQueries({ queryKey: battlesKeys.detail(battleId) });
    });
    const participantChannel = subscribeToParticipants(battleId, () => {
      queryClient.invalidateQueries({ queryKey: battlesKeys.detail(battleId) });
    });
    return () => {
      removeChannel(battleChannel);
      removeChannel(participantChannel);
    };
  }, [battleId, queryClient]);

  return {
    battle,
    participants,
    gameScore: gameScoreQuery.data ?? null,
    isLoading: battleQuery.isLoading,
    error,
    pick,
    setPick,
    joinBattle: joinMutation.mutateAsync,
    joining: joinMutation.isPending,
  };
}
