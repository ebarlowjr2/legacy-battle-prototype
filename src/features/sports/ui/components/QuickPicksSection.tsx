import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, EmptyState } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { QuickPicksSectionProps } from '@/shared/types';

export const QuickPicksSection = ({ quickPicks, onViewAll, onPickPress }: QuickPicksSectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <AppText variant="h3" style={styles.sectionTitle}>Quick Picks</AppText>
      <TouchableOpacity style={styles.seeAllButton} onPress={onViewAll}>
        <AppText variant="captionLg" style={styles.seeAllText}>View All</AppText>
        <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
    {quickPicks.length > 0 ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {quickPicks.map((battle) => (
          <TouchableOpacity
            key={battle.id}
            style={styles.quickPickCard}
            onPress={() => onPickPress(battle.id)}
          >
            <View style={styles.quickPickHeader}>
              <View style={styles.quickPickIcon}>
                <Ionicons name="flash" size={20} color={colors.primary} />
              </View>
              <View style={[styles.statusBadge, styles.statusOpen]}>
                <AppText variant="captionSm" style={styles.statusText}>Open</AppText>
              </View>
            </View>
            <AppText variant="h6" style={styles.quickPickTitle} numberOfLines={2}>
              {battle.title}
            </AppText>
            <View style={styles.quickPickFooter}>
              <AppText variant="label" style={styles.quickPickStake}>{battle.stake} BC</AppText>
              <TouchableOpacity
                style={styles.quickPickJoin}
                onPress={() => onPickPress(battle.id)}
              >
                <AppText variant="buttonMd" style={styles.quickPickJoinText}>Join</AppText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
      <EmptyState title="No open battles" message="Check back soon for new challenges." />
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
  quickPickCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginRight: spacing[2],
    width: 180,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  quickPickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  quickPickIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickPickTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    marginBottom: spacing[2],
    minHeight: 40,
  },
  quickPickFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickPickStake: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  quickPickJoin: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    borderRadius: radii.lg,
  },
  quickPickJoinText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  statusOpen: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
