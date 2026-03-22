import { useCrewStore } from '../../data/store/crew.store';
import { useSearchUsersQuery } from '../../data/queries/useSearchUsersQuery';
import { useSendRequestById } from '../../data/mutations/useCrewMutations';

export function useAddFriend(userId: string | undefined) {
  const { searchQuery, searchedQuery, hasSearched, setSearchQuery, setSearchedQuery } =
    useCrewStore();
  const searchQueryResult = useSearchUsersQuery(searchedQuery, userId);
  const sendRequestMutation = useSendRequestById(userId);

  const searchResults = searchQueryResult.data ?? [];
  const searching = searchQueryResult.isLoading;

  const handleSearch = () => {
    setSearchedQuery(searchQuery);
  };

  const handleAddFriend = async (friendId: string) => {
    return sendRequestMutation.mutateAsync(friendId);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    hasSearched,
    handleSearch,
    handleAddFriend,
  };
}
