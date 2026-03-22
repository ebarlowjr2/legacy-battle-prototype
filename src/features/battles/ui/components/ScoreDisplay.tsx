import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { ScoreDisplayProps } from '@/shared/types';

export function ScoreDisplay({ gameScore, isCompleted }: ScoreDisplayProps) {
  return (
    <View style={styles.scoreCard}>
      <AppText variant="buttonMd" style={styles.scoreSectionTitle}>
        {isCompleted ? 'Final Score' : 'Live Score'}
      </AppText>
      <View style={styles.scoreDisplay}>
        <View style={styles.teamScore}>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.teamName}>
            {gameScore.strHomeTeam}
          </AppText>
          <AppText variant="h2">{gameScore.intHomeScore ?? '-'}</AppText>
        </View>
        <AppText variant="body2" color={colors.textSecondary} style={styles.scoreDivider}>
          vs
        </AppText>
        <View style={styles.teamScore}>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.teamName}>
            {gameScore.strAwayTeam}
          </AppText>
          <AppText variant="h2">{gameScore.intAwayScore ?? '-'}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  scoreSectionTitle: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  scoreDivider: {
    marginHorizontal: spacing[2],
  },
});
