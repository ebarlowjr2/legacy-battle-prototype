import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Screen, ScreenHeader, ProgressBar } from '@/shared/ui';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import { getBattleModeLabel } from '@/shared/utils';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import type { StatDuelConfirmScreenProps } from '@/shared/types';

export default function StatDuelConfirmScreen({ navigation, route }: StatDuelConfirmScreenProps) {
  const {
    visibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    opponent,
  } = route?.params || {};

  const isSubmitting = useStatDuelStore((s) => s.isSubmitting);
  const setIsSubmitting = useStatDuelStore((s) => s.setIsSubmitting);
  const reset = useStatDuelStore((s) => s.reset);

  const handleCreateBattle = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      reset();
      Alert.alert(
        'Battle Created!',
        'Your Stat Duel has been created successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('MainTabs') }],
      );
    }, 1500);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelOpponent', { visibility, battleMode, sport, game, player, statCategory, stake });
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

        <View style={styles.progressRow}>
          <ProgressBar progress={1} />
          <AppText variant="label">6/6</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h4">Confirm Challenge Details</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            Confirm The Details Of Your Battle
          </AppText>
        </View>

        <View style={styles.card}>
          <SummaryRow label="Stat Category:" value={`${statCategory?.name || 'Passing Yards'} (H2H)`} />
          <SummaryRow label="Game/Event:" value={game?.name || 'Chiefs vs Bills, Week 5'} />
          <SummaryRow label="Player:" value={player?.name || 'Mahomes'} valueColor={colors.primary} />
        </View>

        <View style={styles.lockTimeBanner}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <AppText variant="captionSm">Lock: "Locks At Kickoff — Sun 8:00 PM</AppText>
        </View>

        <View style={styles.card}>
          <AppText variant="label">Official Rules</AppText>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.rulesText}>
            Tie Rule: If Both QBs Have Same Passing Yards — Tie.{'\n'}
            Minimum Attempts: x10 Passes Required For Each QB.{'\n'}
            Evidence: Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.{'\n'}
            Info Note: *Rules Are Automatically Enforced At Resolution
          </AppText>
        </View>

        <View style={styles.oracleCard}>
          <View style={styles.oracleIcon}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          </View>
          <View style={styles.oracleContent}>
            <AppText variant="label">Oracle Verified</AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.
            </AppText>
          </View>
        </View>

        <View style={styles.card}>
          <DetailRow label="Battle Mode" value={getBattleModeLabel(battleMode ?? 'STANDARD')} />
          <DetailRow label="Visibility" value={visibility === 'private' ? 'Private' : 'Public'} />
          <DetailRow label="Stake" value={`${stake} BC`} />
          {opponent ? <DetailRow label="Opponent" value={opponent.display_name} /> : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.lockTimeFooter}>
          <Ionicons name="lock-closed" size={14} color={colors.primary} />
          <AppText variant="captionSm" color={colors.primary}>
            Lock Time: Locks At Kickoff (8:00 PM)
          </AppText>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]}
          onPress={handleCreateBattle}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <AppText variant="buttonLg" color={colors.white}>Continue</AppText>
              <AppText variant="body1">⚔</AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function SummaryRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={summaryStyles.row}>
      <View style={summaryStyles.dot} />
      <AppText variant="captionSm" color={colors.textSecondary}>{label}</AppText>
      <AppText variant="label" color={valueColor}>{value}</AppText>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={detailStyles.row}>
      <AppText variant="body2" color={colors.textSecondary}>{label}</AppText>
      <AppText variant="label">{value}</AppText>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
  },
});

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
});

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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  titleSection: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
    gap: spacing[2],
  },
  lockTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  rulesText: {
    lineHeight: 20,
  },
  oracleCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing[4],
  },
  oracleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oracleContent: {
    flex: 1,
    gap: spacing[1],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  lockTimeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    marginBottom: spacing[4],
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
    opacity: 0.7,
  },
});
