import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { LevelCardProps } from '@/shared/types';

export function LevelCard({ levelInfo, xp }: LevelCardProps) {
  return (
    <View style={styles.rankCard}>
      <View style={styles.rankHeader}>
        <AppText variant="label" style={styles.rankTitle}>Legacy Rank</AppText>
        <AppText variant="h5" style={styles.rankLevel}>{levelInfo.level}</AppText>
      </View>
      <View style={styles.rankProgressContainer}>
        <View style={styles.rankProgressBar}>
          <View style={[styles.rankProgress, { width: `${levelInfo.progress}%` }]} />
        </View>
      </View>
      <View style={styles.rankFooter}>
        <AppText variant="captionSm" style={styles.rankXpText}>
          {xp.toLocaleString()} XP
        </AppText>
        <AppText variant="captionSm" style={styles.rankNextText}>
          {levelInfo.nextLevel}: {levelInfo.nextXp.toLocaleString()} XP
        </AppText>
      </View>

      <TouchableOpacity style={styles.invitationBanner}>
        <AppText variant="body2" style={styles.invitationText}>
          You Have Pending Battle Invites
        </AppText>
        <Ionicons name="arrow-forward" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rankCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  rankTitle: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  rankLevel: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  rankProgressContainer: {
    marginBottom: spacing[2],
  },
  rankProgressBar: {
    height: spacing[2],
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: radii.sm,
  },
  rankProgress: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.sm,
  },
  rankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  rankXpText: {
    color: colors.white,
    fontSize: fontSizes.xs,
  },
  rankNextText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSizes.xs,
  },
  invitationBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.lg,
    padding: spacing[4],
  },
  invitationText: {
    color: colors.white,
    fontSize: fontSizes.sm,
  },
});
