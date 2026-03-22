import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen, SearchInput } from '@/shared/ui';
import { getInitials } from '@/shared/utils';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import type { StatDuelOpponentScreenProps } from '@/shared/types';
import { MOCK_OPPONENTS } from '@/shared/constants';

export default function StatDuelOpponentScreen({ navigation, route }: StatDuelOpponentScreenProps) {
  const { visibility, battleMode, sport, game, player, statCategory, stake } = route?.params || {};

  const opponentSearchQuery = useStatDuelStore((s) => s.opponentSearchQuery);
  const selectedOpponent = useStatDuelStore((s) => s.selectedOpponent);
  const setOpponentSearchQuery = useStatDuelStore((s) => s.setOpponentSearchQuery);
  const setSelectedOpponent = useStatDuelStore((s) => s.setSelectedOpponent);

  const filteredOpponents = MOCK_OPPONENTS.filter(
    (o) =>
      o.display_name.toLowerCase().includes(opponentSearchQuery.toLowerCase()) ||
      (o.username?.toLowerCase().includes(opponentSearchQuery.toLowerCase()) ?? false),
  );

  const handleContinue = () => {
    navigation.navigate('StatDuelConfirm', {
      visibility,
      battleMode,
      sport,
      game,
      player,
      statCategory,
      stake,
      opponent: selectedOpponent,
    });
  };

  const canContinue = selectedOpponent || visibility === 'public';

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelChampion', { visibility, battleMode, sport, game });
    }
  };

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
            <View style={[styles.progressFill, { width: '83%' }]} />
          </View>
          <AppText variant="label">5/6</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h4">Pick An Opponent For Battle</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            Pick Your Opponent And Players To Battle On.
          </AppText>
        </View>

        {visibility === 'private' ? (
          <>
            <SearchInput
              value={opponentSearchQuery}
              onChangeText={setOpponentSearchQuery}
              placeholder="search opponent"
              label="Add Opponent"
              style={styles.searchInput}
            />

            {opponentSearchQuery.length > 0 && (
              <View style={styles.searchResults}>
                {filteredOpponents.map((opponent) => (
                  <TouchableOpacity
                    key={opponent.id}
                    style={[
                      styles.opponentItem,
                      selectedOpponent?.id === opponent.id && styles.opponentItemSelected,
                    ]}
                    onPress={() => setSelectedOpponent(opponent)}
                  >
                    <View style={styles.opponentAvatar}>
                      <AppText
                        variant="captionSm"
                        color={colors.white}
                        style={{ fontWeight: 'bold' }}
                      >
                        {getInitials(opponent.display_name)}
                      </AppText>
                    </View>
                    <View style={styles.opponentInfo}>
                      <AppText variant="label">{opponent.display_name}</AppText>
                      <AppText variant="captionSm" color={colors.textSecondary}>
                        @{opponent.username}
                      </AppText>
                    </View>
                    {selectedOpponent?.id === opponent.id && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedOpponent && (
              <View style={styles.selectedOpponentCard}>
                <AppText
                  variant="captionSm"
                  color={colors.textSecondary}
                  style={styles.selectedLabel}
                >
                  Selected Opponent
                </AppText>
                <View style={styles.selectedOpponentRow}>
                  <View style={styles.opponentAvatar}>
                    <AppText
                      variant="captionSm"
                      color={colors.white}
                      style={{ fontWeight: 'bold' }}
                    >
                      {getInitials(selectedOpponent.display_name)}
                    </AppText>
                  </View>
                  <View style={styles.opponentInfo}>
                    <AppText variant="label">{selectedOpponent.display_name}</AppText>
                    <AppText variant="captionSm" color={colors.textSecondary}>
                      @{selectedOpponent.username}
                    </AppText>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOpponent(null)}>
                    <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.publicBattleInfo}>
            <Ionicons name="globe-outline" size={48} color={colors.primary} />
            <AppText variant="h4" style={styles.publicBattleTitle}>
              Public Battle
            </AppText>
            <AppText variant="body2" color={colors.textSecondary} style={styles.publicBattleText}>
              This battle will be visible to all users on the Explore page. Anyone can join and
              accept your challenge.
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
  searchInput: {
    marginBottom: spacing[4],
  },
  searchResults: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing[4],
  },
  opponentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    gap: spacing[2],
  },
  opponentItemSelected: {
    backgroundColor: colors.primaryTint,
  },
  opponentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentInfo: {
    flex: 1,
  },
  selectedOpponentCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedLabel: {
    marginBottom: spacing[2],
  },
  selectedOpponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  publicBattleInfo: {
    alignItems: 'center',
    paddingVertical: spacing[4] * 3,
  },
  publicBattleTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  publicBattleText: {
    textAlign: 'center',
    lineHeight: 22,
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
});
