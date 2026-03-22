import { create } from 'zustand';
import type { StatDuelPlayer, StatDuelStatCategory, StatDuelOpponent } from '@/shared/types';

interface StatDuelState {
  visibility: 'public' | 'private' | 'crew' | null;
  battleMode: 'STANDARD' | 'FANTASY' | 'BOTH_PICKS' | null;
  sport: string | null;
  game: { id: string; name: string } | null;
  position: string | null;
  positionName: string | null;
  player: StatDuelPlayer | null;
  statCategory: StatDuelStatCategory | null;
  stake: string;
  direction: string | null;
  opponent: StatDuelOpponent | null;

  selectedSport: string | null;
  selectedGame: string | null;
  selectedPosition: string | null;
  startTime: string;
  endTime: string;
  showSportModal: boolean;
  showGameModal: boolean;
  showPositionModal: boolean;

  showPlayerModal: boolean;
  showStatModal: boolean;
  showStakeModal: boolean;
  showDirectionModal: boolean;
  playerSearch: string;

  opponentSearchQuery: string;
  selectedOpponent: StatDuelOpponent | null;

  isSubmitting: boolean;
}

interface StatDuelActions {
  setVisibility: (v: StatDuelState['visibility']) => void;
  setBattleMode: (m: StatDuelState['battleMode']) => void;
  setSport: (sport: string) => void;
  setGame: (game: StatDuelState['game']) => void;
  setPosition: (code: string, name: string) => void;
  setPlayer: (player: StatDuelPlayer) => void;
  setStatCategory: (cat: StatDuelStatCategory) => void;
  setStake: (stake: string) => void;
  setDirection: (dir: string) => void;
  setOpponent: (opponent: StatDuelOpponent) => void;

  setSelectedSport: (v: string | null) => void;
  setSelectedGame: (v: string | null) => void;
  setSelectedPosition: (v: string | null) => void;
  setStartTime: (v: string) => void;
  setEndTime: (v: string) => void;
  setShowSportModal: (v: boolean) => void;
  setShowGameModal: (v: boolean) => void;
  setShowPositionModal: (v: boolean) => void;

  setShowPlayerModal: (v: boolean) => void;
  setShowStatModal: (v: boolean) => void;
  setShowStakeModal: (v: boolean) => void;
  setShowDirectionModal: (v: boolean) => void;
  setPlayerSearch: (v: string) => void;

  setOpponentSearchQuery: (v: string) => void;
  setSelectedOpponent: (v: StatDuelOpponent | null) => void;

  setIsSubmitting: (v: boolean) => void;

  reset: () => void;
}

const INITIAL_STATE: StatDuelState = {
  visibility: null,
  battleMode: null,
  sport: null,
  game: null,
  position: null,
  positionName: null,
  player: null,
  statCategory: null,
  stake: '50',
  direction: null,
  opponent: null,
  selectedSport: null,
  selectedGame: null,
  selectedPosition: null,
  startTime: 'Auto',
  endTime: 'Auto',
  showSportModal: false,
  showGameModal: false,
  showPositionModal: false,
  showPlayerModal: false,
  showStatModal: false,
  showStakeModal: false,
  showDirectionModal: false,
  playerSearch: '',
  opponentSearchQuery: '',
  selectedOpponent: null,
  isSubmitting: false,
};

export const useStatDuelStore = create<StatDuelState & StatDuelActions>((set) => ({
  ...INITIAL_STATE,

  setVisibility: (visibility) => set({ visibility }),
  setBattleMode: (battleMode) => set({ battleMode }),
  setSport: (sport) => set({ sport }),
  setGame: (game) => set({ game }),
  setPosition: (position, positionName) => set({ position, positionName }),
  setPlayer: (player) => set({ player }),
  setStatCategory: (statCategory) => set({ statCategory }),
  setStake: (stake) => set({ stake }),
  setDirection: (direction) => set({ direction }),
  setOpponent: (opponent) => set({ opponent }),

  setSelectedSport: (selectedSport) => set({ selectedSport }),
  setSelectedGame: (selectedGame) => set({ selectedGame }),
  setSelectedPosition: (selectedPosition) => set({ selectedPosition }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setShowSportModal: (showSportModal) => set({ showSportModal }),
  setShowGameModal: (showGameModal) => set({ showGameModal }),
  setShowPositionModal: (showPositionModal) => set({ showPositionModal }),

  setShowPlayerModal: (showPlayerModal) => set({ showPlayerModal }),
  setShowStatModal: (showStatModal) => set({ showStatModal }),
  setShowStakeModal: (showStakeModal) => set({ showStakeModal }),
  setShowDirectionModal: (showDirectionModal) => set({ showDirectionModal }),
  setPlayerSearch: (playerSearch) => set({ playerSearch }),

  setOpponentSearchQuery: (opponentSearchQuery) => set({ opponentSearchQuery }),
  setSelectedOpponent: (selectedOpponent) => set({ selectedOpponent }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  reset: () => set(INITIAL_STATE),
}));
