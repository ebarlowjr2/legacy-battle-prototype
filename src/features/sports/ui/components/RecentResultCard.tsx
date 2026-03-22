import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { getSportIcon } from '@/features/sports/data/api/sports.api';
import type { RecentResultCardProps } from '@/shared/types';

export const RecentResultCard = ({ event }: RecentResultCardProps) => (
  <View style={styles.myBattleCard}>
    <View style={styles.myBattleHeader}>
      <View style={styles.myBattleLeft}>
        <View style={styles.battleIcon}>
          <AppText variant="body2" style={styles.battleIconText}>{getSportIcon(event.strSport)}</AppText>
        </View>
        <View style={styles.battleInfo}>
          <AppText variant="h6" style={styles.battleTitle} numberOfLines={1}>
            {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
          </AppText>
          <AppText style={styles.battleSubtitle}>{event.strLeague}</AppText>
        </View>
      </View>
      <View style={[styles.statusBadge, styles.statusCompleted]}>
        <AppText variant="captionSm" style={styles.statusText}>Final</AppText>
      </View>
    </View>
    <View style={styles.myBattleDetails}>
      <View style={styles.scoreContainer}>
        {event.strHomeTeamBadge && (
          <Image source={{ uri: event.strHomeTeamBadge }} style={styles.smallBadge} />
        )}
        <AppText variant="h5" style={styles.scoreText}>
          {event.intHomeScore || '0'} - {event.intAwayScore || '0'}
        </AppText>
        {event.strAwayTeamBadge && (
          <Image source={{ uri: event.strAwayTeamBadge }} style={styles.smallBadge} />
        )}
      </View>
      <View style={styles.timeInfo}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <AppText variant="body2" style={styles.timeText} numberOfLines={1}>
            {event.strVenue || 'TBD'}
          </AppText>
      </View>
    </View>
    <View style={styles.myBattleFooter}>
      <View style={styles.statDuelBadge}>
        <AppText variant="captionLg" style={styles.statDuelText}>{event.strSport}</AppText>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <AppText variant="buttonMd" style={styles.viewButtonText}>View</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  myBattleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  myBattleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  myBattleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  battleIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleIconText: {
    fontSize: 20,
  },
  battleInfo: {},
  battleTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  battleSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  statusBadge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  myBattleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  smallBadge: {
    width: 20,
    height: 20,
    borderRadius: radii.sm,
  },
  scoreText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  myBattleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statDuelBadge: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  statDuelText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
  },
  viewButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
});
