import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import type { StatDuelModeScreenProps, BattleModeOption, BattleMode } from '@/shared/types';
import { BATTLE_MODES_RAW } from '@/shared/constants';

const BATTLE_MODES: BattleModeOption[] = BATTLE_MODES_RAW.map((m) => ({
  id: m.id,
  name: m.name,
  description: m.description,
  features: m.features.map((f) => ({
    color: (colors as Record<string, string>)[f.colorKey] ?? f.colorKey,
    text: f.text,
  })),
  borderColor: (colors as Record<string, string>)[m.borderColorKey] ?? m.borderColorKey,
}));

export default function StatDuelModeScreen({ navigation, route }: StatDuelModeScreenProps) {
  const { visibility } = route?.params || {};
  const battleMode = useStatDuelStore((s) => s.battleMode);
  const setBattleMode = useStatDuelStore((s) => s.setBattleMode);

  const handleSelectMode = (mode: BattleMode) => {
    setBattleMode(mode);
  };

  const handleContinue = () => {
    if (battleMode) {
      navigation.navigate('StatDuelDetails', { 
        visibility,
        battleMode,
      });
    }
  };

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
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
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <AppText variant="label">2/6</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h3">Select Battle Mode</AppText>
          <AppText variant="body2" color={colors.textSecondary}>Choose How Your Battle Will Be Resolved</AppText>
        </View>

        {BATTLE_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeCard,
              battleMode === mode.id && styles.modeCardSelected,
              { borderColor: battleMode === mode.id ? colors.primary : mode.borderColor === colors.primary ? colors.primary : colors.inputBorder },
            ]}
            onPress={() => handleSelectMode(mode.id)}
          >
            <View style={styles.modeCardHeader}>
              <View style={styles.modeInfo}>
                <AppText variant="h5">{mode.name}</AppText>
                <AppText variant="captionSm" color={colors.textSecondary} style={{ lineHeight: 18 }}>{mode.description}</AppText>
              </View>
              <View style={[
                styles.radioButton,
                battleMode === mode.id && styles.radioButtonSelected,
              ]}>
                {battleMode === mode.id && <View style={styles.radioButtonInner} />}
              </View>
            </View>

            {mode.features.length > 0 && (
              <View style={styles.featuresList}>
                {mode.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureDot, { backgroundColor: feature.color }]} />
                    <AppText variant="body2" color={colors.textSecondary}>{feature.text}</AppText>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !battleMode && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!battleMode}
        >
          <AppText variant="buttonLg" color={colors.white}>Continue</AppText>
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
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
  },
  modeCardSelected: {
    borderWidth: 2,
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modeInfo: {
    flex: 1,
    marginRight: spacing[4],
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  featuresList: {
    marginTop: spacing[4],
    gap: spacing[2],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
