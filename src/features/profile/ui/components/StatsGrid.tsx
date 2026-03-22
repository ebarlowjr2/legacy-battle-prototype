import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { StatsGridProps } from '@/shared/types';

export function StatsGrid({ battleStats, walletBalance }: StatsGridProps) {
  return (
    <View style={styles.statsRow}>
      <View style={[styles.statBox, styles.statBoxGreen]}>
        <AppText variant="h5" style={[styles.statValue, styles.statValueGreen]}>
          {battleStats.wins}
        </AppText>
        <AppText variant="label" style={styles.statLabel}>Wins</AppText>
      </View>
      <View style={[styles.statBox, styles.statBoxRed]}>
        <AppText variant="h5" style={[styles.statValue, styles.statValueRed]}>
          {battleStats.losses}
        </AppText>
        <AppText variant="label" style={styles.statLabel}>Losses</AppText>
      </View>
      <View style={[styles.statBox, styles.statBoxBlue]}>
        <AppText variant="h5" style={[styles.statValue, styles.statValueBlue]}>
          {battleStats.challenges}
        </AppText>
        <AppText variant="label" style={styles.statLabel}>Challenges</AppText>
      </View>
      <View style={[styles.statBox, styles.statBoxGray]}>
        <AppText variant="h5" style={styles.statValue}>
          {Number(walletBalance).toLocaleString()}
        </AppText>
        <AppText variant="label" style={styles.statLabel}>BC Coins</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    borderWidth: 1,
  },
  statBoxGreen: {
    borderColor: '#22c55e',
  },
  statBoxRed: {
    borderColor: colors.primary,
  },
  statBoxBlue: {
    borderColor: '#3b82f6',
  },
  statBoxGray: {
    borderColor: colors.inputBorder,
  },
  statValue: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statValueGreen: {
    color: '#22c55e',
  },
  statValueRed: {
    color: colors.primary,
  },
  statValueBlue: {
    color: '#3b82f6',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 10,
  },
});
