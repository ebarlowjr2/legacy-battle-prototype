import { useFriendsQuery } from '../../data/queries/useFriendsQuery';

export function useCrew(userId: string | undefined) {
  const friendsQuery = useFriendsQuery(userId);

  const data = friendsQuery.data;
  const crewMembers = data?.crewMembers ?? [];
  const pendingReceived = data?.pendingReceived ?? [];
  const suggestions = data?.suggestions ?? [];

  return {
    crewMembers,
    pendingReceived,
    suggestions,
    friendsLoading: friendsQuery.isLoading,
    friendsRefreshing: friendsQuery.isFetching,
    refetch: friendsQuery.refetch,
  };
}
