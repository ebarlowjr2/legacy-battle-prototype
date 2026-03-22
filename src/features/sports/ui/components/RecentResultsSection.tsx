import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { RecentResultCard } from './RecentResultCard';
import type { RecentResultsSectionProps } from '@/shared/types';

export const RecentResultsSection = ({
  recentResults,
  loading,
  onViewAll,
}: RecentResultsSectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <AppText variant="h3" style={styles.sectionTitle}>Recent Results</AppText>
      <TouchableOpacity style={styles.seeAllButton} onPress={onViewAll}>
        <AppText variant="captionLg" style={styles.seeAllText}>See All</AppText>
        <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    ) : recentResults.length > 0 ? (
      recentResults.map((event) => <RecentResultCard key={event.idEvent} event={event} />)
    ) : (
      <View style={styles.emptyContainer}>
        <AppText variant="body2" style={styles.emptyText}>No recent results</AppText>
      </View>
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
  loadingContainer: {
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});
