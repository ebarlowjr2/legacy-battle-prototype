import * as profileApi from '../data/api/profile.api';

export const ProfileRepo = {
  getProfileById: profileApi.getProfileById,
  updateDisplayName: profileApi.updateDisplayName,
  subscribeToProfile: profileApi.subscribeToProfile,
  getBattleStats: profileApi.getBattleStats,
  getCrewCounts: profileApi.getCrewCounts,
};
