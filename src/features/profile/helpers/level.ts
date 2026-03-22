import type { LevelInfo } from '@/shared/types';

export function getLevelInfo(xp: number): LevelInfo {
  if (xp >= 3000) return { level: 'Legend', nextLevel: 'Legend', progress: 100, nextXp: 3000 };
  if (xp >= 2000)
    return {
      level: 'Champion',
      nextLevel: 'Legend',
      progress: ((xp - 2000) / 1000) * 100,
      nextXp: 3000,
    };
  if (xp >= 1000)
    return {
      level: 'Veteran',
      nextLevel: 'Champion',
      progress: ((xp - 1000) / 1000) * 100,
      nextXp: 2000,
    };
  if (xp >= 500)
    return {
      level: 'Challenger',
      nextLevel: 'Veteran',
      progress: ((xp - 500) / 500) * 100,
      nextXp: 1000,
    };
  return { level: 'Rookie', nextLevel: 'Challenger', progress: (xp / 500) * 100, nextXp: 500 };
}

export function getLevelNumber(xp: number): number {
  if (xp >= 3000) return 15;
  if (xp >= 2000) return 12;
  if (xp >= 1000) return 8;
  if (xp >= 500) return 4;
  return 1;
}
