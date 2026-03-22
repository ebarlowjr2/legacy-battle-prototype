import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import type { StatDuelDetailsScreenProps } from '@/shared/types';
import { STAT_DUEL_SPORTS, MOCK_GAMES, POSITIONS_BY_SPORT } from '@/shared/constants';

export default function StatDuelDetailsScreen({ navigation, route }: StatDuelDetailsScreenProps) {
  const { visibility, battleMode: routeBattleMode } = route?.params || {};

  const battleMode = useStatDuelStore((s) => s.battleMode);
  const selectedSport = useStatDuelStore((s) => s.selectedSport);
  const selectedGame = useStatDuelStore((s) => s.selectedGame);
  const selectedPosition = useStatDuelStore((s) => s.selectedPosition);
  const startTime = useStatDuelStore((s) => s.startTime);
  const endTime = useStatDuelStore((s) => s.endTime);
  const showSportModal = useStatDuelStore((s) => s.showSportModal);
  const showGameModal = useStatDuelStore((s) => s.showGameModal);
  const showPositionModal = useStatDuelStore((s) => s.showPositionModal);
  const setVisibility = useStatDuelStore((s) => s.setVisibility);
  const setBattleMode = useStatDuelStore((s) => s.setBattleMode);
  const setSelectedSport = useStatDuelStore((s) => s.setSelectedSport);
  const setSelectedGame = useStatDuelStore((s) => s.setSelectedGame);
  const setSelectedPosition = useStatDuelStore((s) => s.setSelectedPosition);
  const setShowSportModal = useStatDuelStore((s) => s.setShowSportModal);
  const setShowGameModal = useStatDuelStore((s) => s.setShowGameModal);
  const setShowPositionModal = useStatDuelStore((s) => s.setShowPositionModal);

  const effectiveBattleMode = battleMode ?? routeBattleMode;
  const isStandardMode = effectiveBattleMode === 'STANDARD' || effectiveBattleMode === 'BOTH_PICKS';
  const isFantasyMode = effectiveBattleMode === 'FANTASY';

  useEffect(() => {
    if (visibility) setVisibility(visibility);
    if (routeBattleMode) setBattleMode(routeBattleMode);
  }, [visibility, routeBattleMode]);

  const filteredGames = selectedSport
    ? MOCK_GAMES.filter((g) => g.sport === selectedSport)
    : [...MOCK_GAMES];

  const availablePositions = selectedSport ? POSITIONS_BY_SPORT[selectedSport] || [] : [];

  const selectedSportData = STAT_DUEL_SPORTS.find((s) => s.id === selectedSport);
  const selectedGameData = MOCK_GAMES.find((g) => g.id === selectedGame);
  const selectedPositionData = availablePositions.find((p) => p.id === selectedPosition);

  const handleContinue = () => {
    navigation.navigate('StatDuelChampion', {
      visibility,
      battleMode: effectiveBattleMode,
      sport: selectedSport,
      game: isStandardMode ? selectedGameData : null,
      position: selectedPosition,
      positionName: selectedPositionData?.name,
    });
  };

  const canContinue = isStandardMode
    ? selectedSport && selectedGame && selectedPosition
    : selectedSport && selectedPosition;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelMode', { visibility });
    }
  };

  const DropdownButton = ({
    label,
    value,
    placeholder,
    onPress,
    required = false,
  }: {
    label: string;
    value: string | null;
    placeholder: string;
    onPress: () => void;
    required?: boolean;
  }) => (
    <View style={styles.dropdownContainer}>
      <AppText variant="captionSm" color={colors.textSecondary}>
        {label}
        {required && ' *'}{' '}
        <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
      </AppText>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <AppText variant="body2" color={value ? colors.text : colors.textMuted}>
          {value || placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <AppText variant="h4">Create Battle</AppText>
            <View style={styles.headerIcon}>
              <Ionicons name="globe-outline" size={18} color={colors.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <AppText variant="label">3/6</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h3">Create Battle</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {isFantasyMode
              ? 'Select Sport And Position For Fantasy Battle'
              : 'Select Event And Position For Standard Battle'}
          </AppText>
        </View>

        <View style={styles.modeIndicator}>
          <AppText variant="captionSm" style={{ fontWeight: '600' }}>
            Mode:{' '}
            {effectiveBattleMode === 'STANDARD'
              ? 'Standard'
              : effectiveBattleMode === 'FANTASY'
                ? 'Fantasy'
                : 'Both Picks'}
          </AppText>
        </View>

        <DropdownButton
          label="Choose Sport"
          value={selectedSportData ? `${selectedSportData.icon} ${selectedSportData.name}` : null}
          placeholder="Select Sport"
          onPress={() => setShowSportModal(true)}
          required
        />

        {isStandardMode && (
          <DropdownButton
            label="Choose Event"
            value={selectedGameData?.name || null}
            placeholder="Select Event"
            onPress={() => setShowGameModal(true)}
            required
          />
        )}

        <DropdownButton
          label="Choose Position"
          value={selectedPositionData?.name || null}
          placeholder="Select Position"
          onPress={() => setShowPositionModal(true)}
          required
        />

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <AppText variant="captionSm" color={colors.textSecondary} style={styles.dropdownLabel}>
              Start Time <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown}>
              <AppText variant="body2">{startTime}</AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.timeColumn}>
            <AppText variant="captionSm" color={colors.textSecondary} style={styles.dropdownLabel}>
              End Time <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown}>
              <AppText variant="body2">{endTime}</AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lockTimeContainer}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <AppText variant="captionSm">
            {isStandardMode
              ? 'Lock Time: Locks At Game Kickoff'
              : 'Lock Time: Locks At Earliest Kickoff This Week'}
          </AppText>
        </View>

        {isFantasyMode && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <AppText
              variant="captionSm"
              color={colors.textSecondary}
              style={{ flex: 1, lineHeight: 18 }}
            >
              In Fantasy Mode, you can pick any player from the selected sport and position. Your
              opponent can also pick any player of the same sport and position.
            </AppText>
          </View>
        )}
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
          <View style={styles.continueIcon}>
            <AppText style={styles.continueIconText}>⚔</AppText>
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={showSportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="h4">Select Sport</AppText>
              <TouchableOpacity onPress={() => setShowSportModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {STAT_DUEL_SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedSport(sport.id);
                  setSelectedGame(null);
                  setSelectedPosition(null);
                  setShowSportModal(false);
                }}
              >
                <AppText style={styles.modalOptionIcon}>{sport.icon}</AppText>
                <AppText variant="body2" style={{ flex: 1 }}>
                  {sport.name}
                </AppText>
                {selectedSport === sport.id && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showGameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="h4">Select Event</AppText>
              <TouchableOpacity onPress={() => setShowGameModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedGame(game.id);
                    setShowGameModal(false);
                  }}
                >
                  <AppText variant="body2" style={{ flex: 1 }}>
                    {game.name}
                  </AppText>
                  {selectedGame === game.id && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <AppText variant="body2" color={colors.textSecondary} style={styles.noOptionsText}>
                Select a sport first
              </AppText>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showPositionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="h4">Select Position</AppText>
              <TouchableOpacity onPress={() => setShowPositionModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {availablePositions.length > 0 ? (
              availablePositions.map((position) => (
                <TouchableOpacity
                  key={position.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedPosition(position.id);
                    setShowPositionModal(false);
                  }}
                >
                  <AppText variant="body2" style={{ flex: 1 }}>
                    {position.name}
                  </AppText>
                  {selectedPosition === position.id && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <AppText variant="body2" color={colors.textSecondary} style={styles.noOptionsText}>
                Select a sport first
              </AppText>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
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
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  titleSection: {
    marginBottom: spacing[4],
  },
  modeIndicator: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[2],
    marginBottom: spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dropdownContainer: {
    marginBottom: spacing[4],
  },
  dropdownLabel: {
    marginBottom: spacing[2],
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
  timeRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  timeColumn: {
    flex: 1,
  },
  lockTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
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
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueIconText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.lg * 2,
    borderTopRightRadius: radii.lg * 2,
    padding: spacing[4],
    maxHeight: '60%',
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
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    gap: spacing[2],
  },
  modalOptionIcon: {
    fontSize: 20,
  },
  noOptionsText: {
    textAlign: 'center',
    paddingVertical: spacing[4] * 2,
  },
});
