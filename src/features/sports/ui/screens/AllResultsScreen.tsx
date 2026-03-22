import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { formatShortDate } from '@/shared/utils';
import type { SportsEvent } from '@/shared/types';
import { getSportIcon, AVAILABLE_SPORTS } from '@/features/sports/data/api/sports.api';
import { useAllResults } from '../hooks/useAllResults';
import type { SportFilter } from '@/shared/types';
import type { AllResultsScreenProps } from '@/shared/types';

const ResultCard = ({ event }: { event: SportsEvent }) => {
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <View style={styles.resultLeft}>
          <View style={styles.sportIcon}>
            <AppText style={{ fontSize: 20 }}>{getSportIcon(event.strSport)}</AppText>
          </View>
          <View style={styles.resultInfo}>
            <AppText variant="h6" numberOfLines={1}>
              {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              {event.strLeague}
            </AppText>
          </View>
        </View>
        <View style={styles.finalBadge}>
          <AppText variant="captionSm" color={colors.white} style={{ fontSize: 10 }}>
            Final
          </AppText>
        </View>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.scoreContainer}>
          {event.strHomeTeamBadge && (
            <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
          )}
          <AppText variant="h4">
            {event.intHomeScore || '0'} - {event.intAwayScore || '0'}
          </AppText>
          {event.strAwayTeamBadge && (
            <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
          )}
        </View>
        <View style={styles.venueInfo}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ maxWidth: 120 }}
            numberOfLines={1}
          >
            {event.strVenue || 'TBD'}
          </AppText>
        </View>
      </View>

      <View style={styles.resultFooter}>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary}>
            {formatShortDate(event.strTimestamp || event.dateEvent)}
          </AppText>
        </View>
        <View style={styles.sportBadge}>
          <AppText variant="captionSm" color={colors.textSecondary} style={{ fontSize: 10 }}>
            {event.strSport}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default function AllResultsScreen({ navigation }: AllResultsScreenProps) {
  const {
    results,
    resultsLoading,
    resultsRefreshing,
    resultsSelectedSport,
    setResultsSelectedSport,
    refetch,
  } = useAllResults();

  const handleSportChange = (sport: SportFilter) => {
    setResultsSelectedSport(sport);
  };

  const onRefresh = () => {
    refetch();
  };

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h4">All Results</AppText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {AVAILABLE_SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport.id}
            style={[styles.filterTab, resultsSelectedSport === sport.id && styles.filterTabActive]}
            onPress={() => handleSportChange(sport.id as SportFilter)}
            >
              <AppText style={{ fontSize: 16 }}>{sport.icon}</AppText>
              <AppText
                variant="label"
                color={resultsSelectedSport === sport.id ? colors.white : colors.textSecondary}
              >
                {sport.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={resultsRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <AppText variant="h6" style={styles.sectionTitle}>
          Last 7 Days
        </AppText>

        {resultsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="body2" color={colors.textSecondary} style={{ marginTop: spacing[2] }}>
              Loading results...
            </AppText>
          </View>
        ) : results.length > 0 ? (
          results.map((event) => <ResultCard key={event.idEvent} event={event} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={colors.textSecondary} />
            <AppText
              variant="body2"
              color={colors.textSecondary}
              style={{ marginTop: spacing[4] }}
            >
              No results found
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary} style={{ marginTop: 4 }}>
              Try selecting a different sport
            </AppText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  filterScroll: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: spacing[2] / 2,
    marginRight: spacing[2],
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  sectionTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  loadingContainer: {
    padding: spacing[4] * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: spacing[4] * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  finalBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: spacing[2],
  },
  scoreSection: {
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
  teamBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sportBadge: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
  },
});
