import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { WinnerCardProps } from '@/shared/types';

export function WinnerCard({ battle, winnerName, pendingResolution }: WinnerCardProps) {
  return (
    <>
      {battle.status === 'completed' && (
        <View style={styles.winnerCard}>
          <Ionicons name="trophy" size={32} color={colors.gold} />
          <AppText variant="h4" style={styles.winnerTitle}>Battle Resolved</AppText>
          <AppText variant="label" color={colors.gold} style={styles.winnerName}>
            Winner: {winnerName}
          </AppText>
          {battle.final_outcome &&
            (() => {
              const outcome = battle.final_outcome as {
                home_team?: string;
                home_score?: number | string | null;
                away_team?: string;
                away_score?: number | string | null;
              };
              return (
                <View style={styles.outcomeDetails}>
                  <AppText variant="captionSm" color={colors.textSecondary} style={styles.outcomeText}>
                    {outcome.home_team ?? 'Home'}: {outcome.home_score ?? '-'}
                  </AppText>
                  <AppText variant="captionSm" color={colors.textSecondary} style={styles.outcomeText}>
                    {outcome.away_team ?? 'Away'}: {outcome.away_score ?? '-'}
                  </AppText>
                </View>
              );
            })()}
        </View>
      )}

      {pendingResolution && (
        <View style={styles.autoResolveNotice}>
          <Ionicons name="hourglass-outline" size={20} color={colors.warning} />
          <AppText variant="label" color={colors.warning}>
            Game finished. Auto-resolving shortly...
          </AppText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  winnerCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4] * 1.5,
    marginBottom: spacing[4],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  winnerTitle: {
    marginTop: spacing[2],
  },
  winnerName: {
    marginTop: spacing[2],
  },
  outcomeDetails: {
    marginTop: spacing[4],
    alignItems: 'center',
  },
  outcomeText: {
    marginTop: 4,
  },
  autoResolveNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningTint,
    borderWidth: 1,
    borderColor: colors.warning,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    gap: spacing[2],
    marginBottom: spacing[4],
  },
});
