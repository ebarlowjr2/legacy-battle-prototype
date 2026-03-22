export const battlesKeys = {
  all: ['battles'] as const,
  lists: () => [...battlesKeys.all, 'list'] as const,
  list: (filters?: { tab?: string }) =>
    filters ? [...battlesKeys.lists(), filters] as const : battlesKeys.lists(),
  details: () => [...battlesKeys.all, 'detail'] as const,
  detail: (id: string) => [...battlesKeys.details(), id] as const,
  explore: (tab: string) => [...battlesKeys.all, 'explore', tab] as const,
  user: (userId: string) => [...battlesKeys.all, 'user', userId] as const,
  quickPicks: (userId: string) => [...battlesKeys.all, 'quickPicks', userId] as const,
  accepted: (userId: string) => [...battlesKeys.all, 'accepted', userId] as const,
};
