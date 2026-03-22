import { create } from 'zustand';
import type { TabType, ExploreTab, BattleType, OutcomeType } from '@/shared/types';

interface BattlesStore {
  listActiveTab: TabType;
  setListActiveTab: (tab: TabType) => void;

  exploreActiveTab: ExploreTab;
  setExploreActiveTab: (tab: ExploreTab) => void;

  pick: string;
  setPick: (pick: string) => void;

  title: string;
  eventId: string;
  stake: string;
  selectedTeam: string | null;
  selectedOutcome: OutcomeType | null;
  showTeamPicker: boolean;
  showOutcomePicker: boolean;
  setTitle: (v: string) => void;
  setEventId: (v: string) => void;
  setStake: (v: string) => void;
  setSelectedTeam: (v: string | null) => void;
  setSelectedOutcome: (v: OutcomeType | null) => void;
  setShowTeamPicker: (v: boolean) => void;
  setShowOutcomePicker: (v: boolean) => void;
  initCreateBattle: (prefill?: { title?: string; eventId?: string }) => void;
  resetCreateBattle: () => void;

  selectedSport: string | null;
  setSelectedSport: (v: string | null) => void;

  selectedType: BattleType | null;
  setSelectedType: (v: BattleType | null) => void;
}

const INITIAL_CREATE = {
  title: '',
  eventId: '',
  stake: '0',
  selectedTeam: null as string | null,
  selectedOutcome: null as OutcomeType | null,
  showTeamPicker: false,
  showOutcomePicker: false,
};

export const useBattlesStore = create<BattlesStore>((set) => ({
  listActiveTab: 'open',
  setListActiveTab: (listActiveTab) => set({ listActiveTab }),

  exploreActiveTab: 'Trending',
  setExploreActiveTab: (exploreActiveTab) => set({ exploreActiveTab }),

  pick: '',
  setPick: (pick) => set({ pick }),

  ...INITIAL_CREATE,
  setTitle: (title) => set({ title }),
  setEventId: (eventId) => set({ eventId }),
  setStake: (stake) => set({ stake }),
  setSelectedTeam: (selectedTeam) => set({ selectedTeam }),
  setSelectedOutcome: (selectedOutcome) => set({ selectedOutcome }),
  setShowTeamPicker: (showTeamPicker) => set({ showTeamPicker }),
  setShowOutcomePicker: (showOutcomePicker) => set({ showOutcomePicker }),
  initCreateBattle: (prefill) =>
    set({
      ...INITIAL_CREATE,
      title: prefill?.title || '',
      eventId: prefill?.eventId || '',
    }),
  resetCreateBattle: () => set(INITIAL_CREATE),

  selectedSport: null,
  setSelectedSport: (selectedSport) => set({ selectedSport }),

  selectedType: null,
  setSelectedType: (selectedType) => set({ selectedType }),
}));
