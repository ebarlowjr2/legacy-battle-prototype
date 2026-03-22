export const crewKeys = {
  all: ['crew'] as const,
  friends: (userId: string) => [...crewKeys.all, 'friends', userId] as const,
  search: (query: string, userId: string) =>
    [...crewKeys.all, 'search', query, userId] as const,
};
