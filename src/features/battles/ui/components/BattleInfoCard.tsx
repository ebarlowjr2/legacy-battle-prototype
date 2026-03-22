import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, StatusBadge } from '@/shared/ui';
import { getStatusColor, formatFullDate } from '@/shared/utils';
import type { BattleInfoCardProps } from '@/shared/types';

export function BattleInfoCard({ battle, isCreator }: BattleInfoCardProps) {
  return (
    <View style={styles.battleCard}>
      <View style={styles.battleHeader}>
        <View style={styles.battleIcon}>
          <AppText variant="h4" color={colors.white} style={styles.battleIconText}>
            LB
          </AppText>
        </View>
        <StatusBadge label={battle.status} color={getStatusColor(battle.status)} />
      </View>

      <AppText variant="h4" style={styles.battleTitle}>{battle.title}</AppText>

      {battle.description && (
        <AppText variant="body2" color={colors.textSecondary} style={styles.battleDescription}>
          {battle.description}
        </AppText>
      )}

      <View style={styles.battleMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="flash" size={16} color={colors.primary} />
          <AppText variant="captionSm" color={colors.textSecondary}>Stake:</AppText>
          <AppText variant="label">{battle.stake} BC</AppText>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary}>Created:</AppText>
          <AppText variant="label">{formatFullDate(battle.created_at)}</AppText>
        </View>
        {battle.event_id && (
          <View style={styles.metaItem}>
            <Ionicons name="football-outline" size={16} color={colors.textSecondary} />
            <AppText variant="captionSm" color={colors.textSecondary}>Event:</AppText>
            <AppText variant="label">{battle.event_id}</AppText>
          </View>
        )}
      </View>

      {isCreator && (
        <View style={styles.creatorBadge}>
          <Ionicons name="star" size={14} color={colors.primary} />
          <AppText variant="captionSm" color={colors.primary}>
            You created this battle
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  battleCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  battleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleIconText: {
    letterSpacing: 1,
  },
  battleTitle: {
    marginBottom: spacing[2],
  },
  battleDescription: {
    marginBottom: spacing[4],
  },
  battleMeta: {
    gap: spacing[2],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
});
