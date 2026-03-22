import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, EmptyState } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { MyBattlesSectionProps } from '@/shared/types';

export const MyBattlesSection = ({ myBattles, onViewAll, onBattlePress }: MyBattlesSectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <AppText variant="h3" style={styles.sectionTitle}>My Battles</AppText>
      <TouchableOpacity style={styles.seeAllButton} onPress={onViewAll}>
        <AppText variant="captionLg" style={styles.seeAllText}>View All</AppText>
        <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
    {myBattles.length > 0 ? (
      myBattles.map((battle) => (
        <TouchableOpacity
          key={battle.id}
          style={styles.myBattleItem}
          onPress={() => onBattlePress(battle.id)}
        >
          <View style={styles.myBattleItemLeft}>
            <View style={styles.battleIcon}>
              <Ionicons name="trophy" size={20} color={colors.primary} />
            </View>
            <View style={styles.myBattleItemInfo}>
              <AppText variant="h6" style={styles.myBattleItemTitle} numberOfLines={1}>
                {battle.title}
              </AppText>
              <AppText variant="captionLg" style={styles.myBattleItemStake}>{battle.stake} BC</AppText>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              battle.status === 'active' ? styles.statusActive : styles.statusCompleted,
            ]}
          >
            <AppText variant="captionSm" style={styles.statusText}>
              {battle.status === 'active' ? 'Active' : 'Completed'}
            </AppText>
          </View>
        </TouchableOpacity>
      ))
    ) : (
      <EmptyState
        title="No active battles"
        message="Join or create a battle to get started."
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  seeAllText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  myBattleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  myBattleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  battleIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myBattleItemInfo: {
    flex: 1,
  },
  myBattleItemTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  myBattleItemStake: {
    color: colors.primary,
    fontSize: fontSizes.xs,
  },
  statusBadge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  statusActive: {
    backgroundColor: colors.primary,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
