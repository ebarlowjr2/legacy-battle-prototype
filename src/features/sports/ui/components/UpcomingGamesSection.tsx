import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import { UpcomingGameCard } from './UpcomingGameCard';
import type { UpcomingGamesSectionProps } from '@/shared/types';

export const UpcomingGamesSection = ({
  upcomingGames,
  loading,
  onRefresh,
  onViewAll,
  onJoin,
}: UpcomingGamesSectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <AppText variant="h3" style={styles.sectionTitle}>Upcoming Games</AppText>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.seeAllButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={14} color={colors.textSecondary} />
          <AppText variant="captionLg" style={styles.seeAllText}>Refresh</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeAllButton} onPress={onViewAll}>
          <AppText variant="captionLg" style={styles.seeAllText}>View All</AppText>
          <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText variant="body2" style={styles.loadingText}>Loading live sports data...</AppText>
      </View>
    ) : upcomingGames.length > 0 ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {upcomingGames.map((event) => (
          <UpcomingGameCard
            key={event.idEvent}
            event={event}
            onJoin={() => onJoin(event)}
          />
        ))}
      </ScrollView>
    ) : (
      <View style={styles.emptyContainer}>
        <AppText variant="body2" style={styles.emptyText}>No upcoming games found</AppText>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
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
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginTop: spacing[2],
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
