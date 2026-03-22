import type { SportFilter } from '@/shared/types';

export type { SportFilter };
export const sportsKeys = {
  all: ['sports'] as const,
  upcoming: () => [...sportsKeys.all, 'upcoming'] as const,
  recent: () => [...sportsKeys.all, 'recent'] as const,
  upcomingBySport: (sport: SportFilter) => [...sportsKeys.all, 'upcoming', sport] as const,
  resultsBySport: (sport: SportFilter) => [...sportsKeys.all, 'results', sport] as const,
  result: (eventId: string) => [...sportsKeys.all, 'result', eventId] as const,
};
