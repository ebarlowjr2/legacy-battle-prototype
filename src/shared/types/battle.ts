/** Tab filter for battles list */
export type TabType = 'open' | 'active' | 'completed';

/** Tab filter for explore battles */
export type ExploreTab = 'Trending' | 'Ending Soon' | 'New' | 'High Activity';

/** Battle type for store/selection (full set) */
export type BattleType =
  | 'head_to_head'
  | 'stat_duel'
  | 'GAME_DUEL'
  | 'STAT_DUEL'
  | 'SKILL_BATTLE';

/** Battle type option id for BattleTypeScreen */
export type BattleTypeOptionId = 'GAME_DUEL' | 'STAT_DUEL' | 'SKILL_BATTLE';

/** Battle mode for stat duel */
export type BattleMode = 'STANDARD' | 'FANTASY' | 'BOTH_PICKS';

/** Outcome type for battle picks */
export type OutcomeType = 'WIN' | 'LOSE';

/** Sport type for StartBattleScreen */
export type SportType = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'SKILLS';

/** Stat duel player selection */
export interface StatDuelPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  positionCode: string;
  sport: string;
}

/** Stat duel stat category */
export interface StatDuelStatCategory {
  id: string;
  name: string;
}

/** Stat duel opponent */
export interface StatDuelOpponent {
  id: string;
  display_name: string;
  username?: string;
}

/** Sport option for StartBattleScreen */
export interface Sport {
  id: SportType;
  name: string;
  icon: string;
  color: string;
}

/** Battle category for StartBattleScreen */
export interface BattleCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

/** Battle type option for BattleTypeScreen */
export interface BattleTypeOption {
  id: BattleTypeOptionId;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  features: { icon: string; text: string }[];
  enabled: boolean;
}

/** Battle mode option for StatDuelModeScreen */
export interface BattleModeOption {
  id: BattleMode;
  name: string;
  description: string;
  features: { color: string; text: string }[];
  borderColor: string;
}

/** Dropdown option (label/value pair) */
export interface DropdownOption {
  label: string;
  value: string;
}
