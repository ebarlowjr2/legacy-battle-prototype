/** Level info for XP progression display */
export interface LevelInfo {
  level: string;
  nextLevel: string;
  progress: number;
  nextXp: number;
}

/** Profile store connection status */
export type ConnectionStatus = 'idle' | 'ok' | 'error' | 'testing';
