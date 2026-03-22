import { useQuery } from '@tanstack/react-query';
import { profileKeys } from '../keys';
import {
  getProfileById,
  getBattleStats,
  getCrewCounts,
} from '../api/profile.api';
import type { UserProfile } from '@/shared/types';

async function fetchProfileWithStats(userId: string) {
  const { data: profile, error } = await getProfileById(userId);
  if (error) throw error;

  const [battleStats, crewCounts] = await Promise.all([
    getBattleStats(userId),
    getCrewCounts(userId),
  ]);

  return {
    profile: profile as UserProfile,
    battleStats,
    crewCount: crewCounts.crewCount,
    pendingCrewCount: crewCounts.pendingCount,
  };
}

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ''),
    queryFn: () => fetchProfileWithStats(userId!),
    enabled: !!userId,
  });
}
