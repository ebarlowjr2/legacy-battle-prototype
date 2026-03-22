import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import { updateDisplayName } from '../api/profile.api';

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (displayName: string) => updateDisplayName(userId!, displayName),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      }
    },
  });
}
