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
import {
  getSportIcon,
  formatEventTime,
  AVAILABLE_SPORTS,
} from '@/features/sports/data/api/sports.api';
import { useAllUpcomingGames } from '../hooks/useAllUpcomingGames';
import type { SportFilter } from '@/shared/types';
import type { AllUpcomingGamesScreenProps } from '@/shared/types';

const UpcomingGameCard = ({ event, onBattle }: { event: SportsEvent; onBattle: () => void }) => {
  return (
    <View style={styles.gameCard}>
      <View style={styles.gameHeader}>
        <View style={styles.gameLeft}>
          <View style={styles.sportIcon}>
            <AppText style={{ fontSize: 20 }}>{getSportIcon(event.strSport)}</AppText>
          </View>
          <View style={styles.gameInfo}>
            <AppText variant="h6" numberOfLines={1}>
              {event.strHomeTeam.split(' ').pop()} vs {event.strAwayTeam.split(' ').pop()}
            </AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              {event.strLeague}
            </AppText>
          </View>
        </View>
        <View style={styles.teamLogos}>
          {event.strHomeTeamBadge && (
            <Image source={{ uri: event.strHomeTeamBadge }} style={styles.teamBadge} />
          )}
          {event.strAwayTeamBadge && (
            <Image source={{ uri: event.strAwayTeamBadge }} style={styles.teamBadge} />
          )}
        </View>
      </View>

      <View style={styles.gameDetails}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <AppText variant="label">{formatEventTime(event)}</AppText>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <AppText variant="captionSm" color={colors.textSecondary}>
            {formatShortDate(event.strTimestamp || event.dateEvent)}
          </AppText>
        </View>
      </View>

      <View style={styles.gameFooter}>
        <View style={styles.venueContainer}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ maxWidth: 180 }}
            numberOfLines={1}
          >
            {event.strVenue || 'TBD'}
          </AppText>
        </View>
        <TouchableOpacity style={styles.battleButton} onPress={onBattle}>
          <Ionicons name="flash" size={16} color={colors.white} />
          <AppText variant="buttonMd" color={colors.white}>
            Battle
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AllUpcomingGamesScreen({ navigation, route }: AllUpcomingGamesScreenProps) {
  const { initialSport } = route?.params || {};

  const {
    games,
    gamesLoading,
    gamesRefreshing,
    gamesSelectedSport,
    setGamesSelectedSport,
    refetch,
  } = useAllUpcomingGames(initialSport as SportFilter | undefined);

  const handleSportChange = (sport: SportFilter) => {
    setGamesSelectedSport(sport);
  };

  const onRefresh = () => {
    refetch();
  };

  const handleBattle = (event: SportsEvent) => {
    navigation.navigate('BattleVisibility', {
      prefillTitle: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
      prefillEventId: event.idEvent,
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
    });
  };

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h4">Upcoming Games</AppText>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color={colors.text} />
        </TouchableOpacity>
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
            style={[styles.filterTab, gamesSelectedSport === sport.id && styles.filterTabActive]}
            onPress={() => handleSportChange(sport.id as SportFilter)}
            >
              <AppText style={{ fontSize: 16 }}>{sport.icon}</AppText>
              <AppText
                variant="label"
                color={gamesSelectedSport === sport.id ? colors.white : colors.textSecondary}
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
            refreshing={gamesRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {gamesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="body2" color={colors.textSecondary} style={{ marginTop: spacing[2] }}>
              Loading games...
            </AppText>
          </View>
        ) : games.length > 0 ? (
          <>
            {games.some((e) => e.strStatus === 'live') && (
              <>
                <AppText variant="h6" color={colors.success} style={styles.sectionTitle}>
                  Live Now
                </AppText>
                {games
                  .filter((e) => e.strStatus === 'live')
                  .map((event) => (
                    <UpcomingGameCard
                      key={event.idEvent}
                      event={event}
                      onBattle={() => handleBattle(event)}
                    />
                  ))}
              </>
            )}
            <AppText variant="h6" style={styles.sectionTitle}>
              Upcoming
            </AppText>
            {games
              .filter((e) => e.strStatus !== 'live')
              .map((event) => (
                <UpcomingGameCard
                  key={event.idEvent}
                  event={event}
                  onBattle={() => handleBattle(event)}
                />
              ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <AppText
              variant="body2"
              color={colors.textSecondary}
              style={{ marginTop: spacing[4] }}
            >
              No upcoming games
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
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
  gameCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: colors.primary,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  gameLeft: {
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
  gameInfo: {
    flex: 1,
  },
  teamLogos: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: spacing[2],
  },
  teamBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  battleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: 4,
  },
});
