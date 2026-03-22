import { getThemeColors } from '@/shared/theme';
import type {
  BattleStatus as DomainBattleStatus,
  BattleMode as DomainBattleMode,
} from '@/shared/types';

const defaultColors = getThemeColors('dark');

/** Battle status for utils (allows string for flexibility) */
export type BattleStatus = DomainBattleStatus | string;

/**
 * Returns a semantic color associated with a battle status.
 *
 * The color values are derived from the current theme palette.
 * This helps keep status indicators visually consistent across the UI.
 *
 * Mappings:
 * - `open` → success color
 * - `active` → primary color
 * - `completed` / `canceled` → secondary text color
 * - unknown values → secondary text color
 *
 * @param {BattleStatus} status - The current battle status.
 * @returns {string} A theme color string corresponding to the status.
 */
export function getStatusColor(status: BattleStatus): string {
  switch (status) {
    case 'open':
      return defaultColors.success;
    case 'active':
      return defaultColors.primary;
    case 'completed':
    case 'canceled':
      return defaultColors.textSecondary;
    default:
      return defaultColors.textSecondary;
  }
}

/**
 * Extracts home and away team names from a match title.
 *
 * Expected format:
 * `"Team A vs Team B"`
 *
 * If the format cannot be parsed or the title is undefined,
 * both returned values will be `undefined`.
 *
 * @param {string | undefined} title - The match title containing team names.
 * @returns {{ home: string | undefined; away: string | undefined }} An object containing parsed team names.
 */
export function deriveTeamsFromTitle(
  title: string | undefined,
): { home: string | undefined; away: string | undefined } {
  if (!title) return { home: undefined, away: undefined };

  const parts = title.split(' vs ');

  if (parts.length === 2) {
    return { home: parts[0].trim(), away: parts[1].trim() };
  }

  return { home: undefined, away: undefined };
}

/** Battle mode for utils (allows string for flexibility) */
export type BattleMode = DomainBattleMode | string;

/**
 * Converts an internal battle mode value into a human-readable label.
 *
 * This is typically used for displaying mode information in the UI.
 *
 * Mappings:
 * - `STANDARD` → "Standard"
 * - `FANTASY` → "Fantasy Mode"
 * - `BOTH_PICKS` → "Both Picks"
 * - unknown values → returned as-is
 *
 * @param {BattleMode} mode - The internal battle mode identifier.
 * @returns {string} A user-friendly label for the battle mode.
 */
export function getBattleModeLabel(mode: BattleMode): string {
  switch (mode) {
    case 'STANDARD':
      return 'Standard';
    case 'FANTASY':
      return 'Fantasy Mode';
    case 'BOTH_PICKS':
      return 'Both Picks';
    default:
      return mode;
  }
}