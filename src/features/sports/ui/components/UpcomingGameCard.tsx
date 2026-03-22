import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { formatEventTime, getSportIcon } from '@/features/sports/data/api/sports.api';
import type { UpcomingGameCardProps } from '@/shared/types';

export const UpcomingGameCard = ({ event, onJoin }: UpcomingGameCardProps) => (
  <View style={styles.battleCard}>
    <View style={styles.battleCardLeft}>
      <View style={styles.battleIcon}>
        <AppText variant="body2" style={styles.battleIconText}>{getSportIcon(event.strSport)}</AppText>
      </View>
      <View style={styles.battleInfo}>
        <AppText variant="h6" style={styles.battleTitle} numberOfLines={1}>
          {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
        </AppText>
        <AppText variant="body2" style={styles.battleSubtitle}>{event.strLeague}</AppText>
        <AppText variant="body2" style={styles.battleTime}>{formatEventTime(event)}</AppText>
      </View>
    </View>
    <View style={styles.battleCardRight}>
      <View style={styles.teamLogos}>
        {event.strHomeTeamBadge && (
          <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
        )}
        {event.strAwayTeamBadge && (
          <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
        )}
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
        <AppText variant="buttonMd" style={styles.joinButtonText}>Battle</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  battleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing[4],
    marginRight: spacing[2],
    minWidth: 300,
  },
  battleCardLeft: {
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
  battleTime: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  battleCardRight: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  teamLogos: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
});
