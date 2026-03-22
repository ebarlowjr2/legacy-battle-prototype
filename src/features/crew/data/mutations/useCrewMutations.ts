import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CrewService } from '../api/crew.api';
import { crewKeys } from '../keys';

export function useAcceptRequest(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => CrewService.acceptRequest(requestId),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: crewKeys.friends(userId) });
      }
    },
  });
}

export function useDeclineRequest(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => CrewService.declineRequest(requestId),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: crewKeys.friends(userId) });
      }
    },
  });
}

export function useSendRequestById(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) => CrewService.sendRequestById(receiverId),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: crewKeys.friends(userId) });
      }
    },
  });
}
