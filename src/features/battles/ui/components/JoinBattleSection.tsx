import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '@/shared/ui';
import type { JoinBattleSectionProps } from '@/shared/types';

export function JoinBattleSection({
  canJoin,
  alreadyJoined,
  isCreator,
  isHeadToHeadBattle,
  isHeadToHeadReady,
  creatorWinningTeam,
  joinerWinningTeam,
  homeTeamName,
  awayTeamName,
  pick,
  onPickChange,
  joining,
  onJoin,
}: JoinBattleSectionProps) {
  if (alreadyJoined && !isCreator) {
    return (
      <View style={styles.joinedBadge}>
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        <AppText variant="label" color={colors.success}>
          You have joined this battle
        </AppText>
      </View>
    );
  }

  if (!canJoin) return null;

  return (
    <View style={styles.joinSection}>
      <AppText variant="buttonMd" style={styles.sectionTitle}>Join This Battle</AppText>
      <View style={styles.joinCard}>
        {isHeadToHeadReady ? (
          <>
            <View style={styles.challengeInfo}>
              <AppText variant="captionSm" color={colors.textSecondary} style={styles.challengeLabel}>
                Creator's prediction:
              </AppText>
              <View style={styles.predictionBox}>
                <Ionicons name="person" size={16} color={colors.primary} />
                <AppText variant="label">{creatorWinningTeam} will win</AppText>
              </View>
            </View>
            <View style={styles.challengeInfo}>
              <AppText variant="captionSm" color={colors.textSecondary} style={styles.challengeLabel}>
                Your side (if you accept):
              </AppText>
              <View style={[styles.predictionBox, styles.yourPredictionBox]}>
                <Ionicons name="flash" size={16} color={colors.success} />
                <AppText variant="label" color={colors.success}>
                  {joinerWinningTeam} will win
                </AppText>
              </View>
            </View>
          </>
        ) : homeTeamName && awayTeamName ? (
          <>
            <AppText variant="label" style={styles.joinLabel}>Pick the winner:</AppText>
            <View style={styles.teamPickContainer}>
              <TouchableOpacity
                style={[
                  styles.teamPickButton,
                  pick === homeTeamName && styles.teamPickButtonSelected,
                ]}
                onPress={() => onPickChange(homeTeamName)}
              >
                <AppText
                  variant="buttonMd"
                  color={pick === homeTeamName ? colors.primary : colors.text}
                  style={styles.teamPickText}
                >
                  {homeTeamName}
                </AppText>
                <AppText variant="captionSm" color={colors.textSecondary} style={styles.teamPickLabel}>
                  Home
                </AppText>
              </TouchableOpacity>
              <AppText variant="buttonMd" color={colors.textSecondary}>vs</AppText>
              <TouchableOpacity
                style={[
                  styles.teamPickButton,
                  pick === awayTeamName && styles.teamPickButtonSelected,
                ]}
                onPress={() => onPickChange(awayTeamName)}
              >
                <AppText
                  variant="buttonMd"
                  color={pick === awayTeamName ? colors.primary : colors.text}
                  style={styles.teamPickText}
                >
                  {awayTeamName}
                </AppText>
                <AppText variant="captionSm" color={colors.textSecondary} style={styles.teamPickLabel}>
                  Away
                </AppText>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <AppText variant="body2" color={colors.textSecondary} style={styles.loadingPickText}>
            Unable to determine teams for this battle
          </AppText>
        )}
        <TouchableOpacity
          style={[
            styles.joinButton,
            (joining || (!pick && !isHeadToHeadReady)) && styles.joinButtonDisabled,
          ]}
          onPress={onJoin}
          disabled={joining || (!pick && !isHeadToHeadReady)}
        >
          {joining ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="enter-outline" size={20} color={colors.white} />
              <AppText variant="buttonMd" color={colors.white}>
                {isHeadToHeadBattle ? 'Accept Challenge' : 'Join Battle'}
              </AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  joinSection: {
    marginBottom: spacing[4] * 2,
  },
  sectionTitle: {
    marginBottom: spacing[4],
  },
  joinCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
  },
  joinLabel: {
    marginBottom: spacing[2],
  },
  teamPickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  teamPickButton: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  teamPickButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  teamPickText: {
    textAlign: 'center',
  },
  teamPickLabel: {
    marginTop: 4,
  },
  loadingPickText: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    gap: spacing[2],
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4] * 2,
  },
  challengeInfo: {
    marginBottom: spacing[4],
  },
  challengeLabel: {
    marginBottom: spacing[2],
  },
  predictionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.inputBackground,
    padding: spacing[4],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  yourPredictionBox: {
    borderColor: colors.success,
    backgroundColor: colors.successTint,
  },
});
