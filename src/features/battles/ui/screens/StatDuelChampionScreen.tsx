import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Screen, ScreenHeader, ProgressBar, Avatar, SearchInput } from '@/shared/ui';
import { SelectionModal, type SelectionOption } from '@/shared/ui';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import { getInitials } from '@/shared/utils';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import type { StatDuelChampionScreenProps, StatDuelPlayer } from '@/shared/types';
import {
  MOCK_PLAYERS,
  DIRECTION_OPTIONS,
  STAT_CATEGORIES_BY_SPORT,
  STAKE_OPTIONS,
} from '@/shared/constants';

export default function StatDuelChampionScreen({ navigation, route }: StatDuelChampionScreenProps) {
  const { visibility, battleMode, sport, game, position, positionName } = route?.params || {};

  const player = useStatDuelStore((s) => s.player);
  const statCategory = useStatDuelStore((s) => s.statCategory);
  const stake = useStatDuelStore((s) => s.stake);
  const direction = useStatDuelStore((s) => s.direction);
  const showPlayerModal = useStatDuelStore((s) => s.showPlayerModal);
  const showStatModal = useStatDuelStore((s) => s.showStatModal);
  const showStakeModal = useStatDuelStore((s) => s.showStakeModal);
  const showDirectionModal = useStatDuelStore((s) => s.showDirectionModal);
  const playerSearch = useStatDuelStore((s) => s.playerSearch);
  const setPlayer = useStatDuelStore((s) => s.setPlayer);
  const setStatCategory = useStatDuelStore((s) => s.setStatCategory);
  const setStake = useStatDuelStore((s) => s.setStake);
  const setDirection = useStatDuelStore((s) => s.setDirection);
  const setShowPlayerModal = useStatDuelStore((s) => s.setShowPlayerModal);
  const setShowStatModal = useStatDuelStore((s) => s.setShowStatModal);
  const setShowStakeModal = useStatDuelStore((s) => s.setShowStakeModal);
  const setShowDirectionModal = useStatDuelStore((s) => s.setShowDirectionModal);
  const setPlayerSearch = useStatDuelStore((s) => s.setPlayerSearch);

  const isStandardMode = battleMode === 'STANDARD' || battleMode === 'BOTH_PICKS';
  const isFantasyMode = battleMode === 'FANTASY';

  const filteredPlayers = MOCK_PLAYERS.filter((p) => {
    if (sport && p.sport !== sport) return false;
    if (position && p.positionCode !== position) return false;
    return (
      p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.team.toLowerCase().includes(playerSearch.toLowerCase())
    );
  });

  const statCategories = STAT_CATEGORIES_BY_SPORT[sport ?? 'NFL'] ?? STAT_CATEGORIES_BY_SPORT.NFL;
  const statOptions: SelectionOption[] = statCategories.map((s: { id: string; name: string }) => ({ key: s.id, label: s.name }));
  const selectedStatData = statCategories.find((s: { id: string; name: string }) => s.id === (statCategory?.id ?? ''));
  const selectedDirectionData = DIRECTION_OPTIONS.find((d) => d.key === (direction ?? ''));

  const handleContinue = () => {
    navigation.navigate('StatDuelOpponent', {
      visibility,
      battleMode,
      sport,
      game,
      position,
      positionName,
      player,
      statCategory,
      stake,
      direction,
      directionName: selectedDirectionData?.label,
    });
  };

  const canContinue = isStandardMode
    ? player && statCategory && stake && direction
    : player && statCategory && stake;

  const getStatDescription = () => {
    if (!statCategory || !player) return '';
    return `Compare Total ${statCategory.name} For Both Players`;
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelDetails', { visibility, battleMode });
    }
  };

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Create Battle"
          onBack={handleBack}
          rightSlot={
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          }
        />

        <View style={styles.progressContainer}>
          <ProgressBar progress={0.66} />
          <AppText variant="label">4/6</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h4">Choose Your Champion And The Dueling Stats</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            Choose Stats To Battle On
          </AppText>
        </View>

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            Pick Player *{' '}
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowPlayerModal(true)}>
            <AppText variant="body2" color={player ? colors.text : colors.muted}>
              {player ? player.name : 'pick players'}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            Stat Category *{' '}
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStatModal(true)}>
            <AppText variant="body2" color={statCategory ? colors.text : colors.muted}>
              {statCategory?.name || 'Select stat category'}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isStandardMode ? (
          <View style={styles.dropdownContainer}>
            <AppText variant="label" color={colors.textSecondary}>
              Choose Direction *{' '}
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowDirectionModal(true)}>
              <AppText variant="body2" color={direction ? colors.text : colors.muted}>
                {selectedDirectionData?.label || 'Select direction (Most/Least)'}
              </AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            Stake BC{' '}
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStakeModal(true)}>
            <AppText variant="body2">{stake} BC</AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {player && statCategory ? (
          <View style={styles.infoCard}>
            <AppText variant="label">Stat Description</AppText>
            <AppText variant="body2" color={colors.textSecondary}>
              {getStatDescription()}
            </AppText>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <AppText variant="label">Official Rules</AppText>
          <AppText variant="captionSm" color={colors.textSecondary}>
            Tie Rule: If Both QBs Have Same Passing Yards — Tie.{'\n'}
            Minimum Attempts: x10 Passes Required For Each QB.
          </AppText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <AppText variant="buttonLg" color={colors.white}>
            Continue
          </AppText>
          <AppText variant="body1">⚔</AppText>
        </TouchableOpacity>
      </View>

      {/* Player Selection Modal */}
      <Modal visible={showPlayerModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlayerModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <AppText variant="h5">Search Player/Teams</AppText>
              <TouchableOpacity onPress={() => setShowPlayerModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <SearchInput
              value={playerSearch}
              onChangeText={setPlayerSearch}
              placeholder="Search players..."
              style={styles.searchSpacing}
            />

            <View style={styles.filterTabs}>
              <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
                <Ionicons name="person-outline" size={16} color={colors.white} />
                <AppText variant="captionSm" color={colors.white}>
                  Ps
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Ionicons name="filter-outline" size={16} color={colors.textSecondary} />
                <AppText variant="captionSm" color={colors.textSecondary}>
                  Filter
                </AppText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.playerList}>
              {filteredPlayers.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerOption}
                  onPress={() => {
                    setPlayer(player as StatDuelPlayer);
                    setShowPlayerModal(false);
                    setPlayerSearch('');
                  }}
                >
                  <Avatar
                    initials={getInitials(player.name)}
                    size="sm"
                    backgroundColor={colors.primary}
                    borderColor={colors.primary}
                    textColor={colors.white}
                  />
                  <View style={styles.playerInfo}>
                    <AppText variant="label">{player.name}</AppText>
                    <AppText variant="captionSm" color={colors.textSecondary}>
                      {player.position}
                    </AppText>
                  </View>
                  <View style={styles.playerTeamBadge}>
                    <AppText variant="captionSm">{player.team}</AppText>
                    <View style={styles.activeIndicator}>
                      <View style={styles.activeDot} />
                      <AppText variant="captionSm" color={colors.success}>
                        Active
                      </AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <SelectionModal
        visible={showStatModal}
        title="Select Stat Category"
        options={statOptions}
        selectedKey={statCategory?.id ?? undefined}
        onSelect={(key) => {
          const cat = statCategories.find((s: { id: string; name: string }) => s.id === key);
          if (cat) setStatCategory(cat);
          setShowStatModal(false);
        }}
        onClose={() => setShowStatModal(false)}
      />

      <SelectionModal
        visible={showStakeModal}
        title="Select Stake"
        options={STAKE_OPTIONS}
        selectedKey={stake}
        onSelect={(key) => {
          setStake(key);
          setShowStakeModal(false);
        }}
        onClose={() => setShowStakeModal(false)}
      />

      <SelectionModal
        visible={showDirectionModal}
        title="Select Direction"
        options={DIRECTION_OPTIONS}
        selectedKey={direction || undefined}
        onSelect={(key) => {
          setDirection(key);
          setShowDirectionModal(false);
        }}
        onClose={() => setShowDirectionModal(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  titleSection: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  dropdownContainer: {
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
    gap: spacing[2],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(16),
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing[4],
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  searchSpacing: {
    marginBottom: spacing[4],
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: spacing[1],
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  playerList: {
    maxHeight: 400,
  },
  playerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    gap: spacing[2],
  },
  playerInfo: {
    flex: 1,
  },
  playerTeamBadge: {
    alignItems: 'flex-end',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
});
