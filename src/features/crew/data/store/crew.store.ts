import { create } from 'zustand';
import type { CrewMember } from '@/shared/types';

interface CrewStore {
  searchQuery: string;
  searchedQuery: string;
  hasSearched: boolean;
  setSearchQuery: (v: string) => void;
  setSearchedQuery: (v: string) => void;
  setHasSearched: (v: boolean) => void;
}

export const useCrewStore = create<CrewStore>((set) => ({
  searchQuery: '',
  searchedQuery: '',
  hasSearched: false,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchedQuery: (searchedQuery) => set({ searchedQuery, hasSearched: true }),
  setHasSearched: (hasSearched) => set({ hasSearched }),
}));
