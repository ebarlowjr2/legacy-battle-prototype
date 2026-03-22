import { create } from 'zustand';
import type { SportFilter } from '../keys';

interface SportsStore {
  gamesSelectedSport: SportFilter;
  resultsSelectedSport: SportFilter;
  gamesRefreshing: boolean;
  resultsRefreshing: boolean;
  setGamesSelectedSport: (v: SportFilter) => void;
  setResultsSelectedSport: (v: SportFilter) => void;
  setGamesRefreshing: (v: boolean) => void;
  setResultsRefreshing: (v: boolean) => void;
}

export const useSportsStore = create<SportsStore>((set) => ({
  gamesSelectedSport: 'ALL',
  resultsSelectedSport: 'ALL',
  gamesRefreshing: false,
  resultsRefreshing: false,
  setGamesSelectedSport: (gamesSelectedSport) => set({ gamesSelectedSport }),
  setResultsSelectedSport: (resultsSelectedSport) => set({ resultsSelectedSport }),
  setGamesRefreshing: (gamesRefreshing) => set({ gamesRefreshing }),
  setResultsRefreshing: (resultsRefreshing) => set({ resultsRefreshing }),
}));
