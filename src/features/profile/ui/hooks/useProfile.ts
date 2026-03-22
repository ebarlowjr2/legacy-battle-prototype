import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProfileQuery } from '../../data/queries/useProfileQuery';
import { useProfileStore } from '../../data/store/profile.store';
import { useUpdateProfile } from '../../data/mutations/useUpdateProfile';
import { subscribeToProfile } from '../../data/api/profile.api';
import { profileKeys } from '../../data/keys';

export function useProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery(userId);
  const updateMutation = useUpdateProfile(userId);

  const { displayName, setDisplayName, isEditing, setIsEditing } = useProfileStore();

  const data = profileQuery.data;
  const profile = data?.profile ?? null;
  const battleStats = data?.battleStats ?? { wins: 0, losses: 0, challenges: 0 };
  const crewCount = data?.crewCount ?? 0;
  const pendingCrewCount = data?.pendingCrewCount ?? 0;

  useEffect(() => {
    if (!userId) return;
    const channel = subscribeToProfile(userId, (nextProfile) => {
      queryClient.setQueryData(profileKeys.detail(userId), (prev: typeof data) =>
        prev
          ? { ...prev, profile: nextProfile }
          : {
              profile: nextProfile,
              battleStats: { wins: 0, losses: 0, challenges: 0 },
              crewCount: 0,
              pendingCrewCount: 0,
            }
      );
    });
    return () => {
      channel.unsubscribe();
    };
  }, [userId, queryClient]);

  useEffect(() => {
    if (profile?.display_name !== undefined) {
      setDisplayName(profile.display_name || '');
    }
  }, [profile?.display_name]);

  const saveProfile = async (): Promise<{ error?: { message: string } }> => {
    if (!userId) return {};
    try {
      const result = await updateMutation.mutateAsync(displayName);
      const error = (result as { error?: { message: string } })?.error;
      if (!error) {
        setIsEditing(false);
      }
      return { error };
    } catch {
      return { error: { message: 'Update failed' } };
    }
  };

  return {
    profile,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error?.message ?? null,
    displayName,
    setDisplayName,
    saving: updateMutation.isPending,
    isEditing,
    setIsEditing,
    battleStats,
    crewCount,
    pendingCrewCount,
    saveProfile,
    refetch: profileQuery.refetch,
  };
}
