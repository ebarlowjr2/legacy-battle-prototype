import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { useBattlesStore } from '@/features/battles/data/store/battles.store';
import type { BattleTypeScreenProps, BattleTypeOption } from '@/shared/types';
import { BATTLE_TYPES } from '@/shared/constants';

const resolveBattleTypes = (): BattleTypeOption[] =>
  BATTLE_TYPES.map((t) => ({
    ...t,
    iconColor: t.iconColor in colors ? (colors as Record<string, string>)[t.iconColor] : t.iconColor,
    badgeColor: t.badgeColor in colors ? (colors as Record<string, string>)[t.badgeColor] : t.badgeColor,
  })) as BattleTypeOption[];

const BATTLE_TYPES_RESOLVED = resolveBattleTypes();

export default function BattleTypeScreen({ navigation }: BattleTypeScreenProps) {
  const selectedType = useBattlesStore((s) => s.selectedType);
  const setSelectedType = useBattlesStore((s) => s.setSelectedType);

  const handleSelectType = (type: BattleTypeOption) => {
    if (!type.enabled) {
      return;
    }
    setSelectedType(type.id);

    if (type.id === 'GAME_DUEL') {
      navigation.navigate('StartBattle');
    } else if (type.id === 'STAT_DUEL') {
      navigation.navigate('StatDuelMode');
    }
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText variant="h4">Create Battle</AppText>
          <View style={styles.headerIcon}>
            <Ionicons name="globe-outline" size={20} color={colors.text} />
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '16.67%' }]} />
        </View>
        <AppText variant="label">1/6</AppText>
      </View>

      <View style={styles.titleSection}>
        <AppText variant="h2" style={styles.sectionTitle}>
          Choose Battle Type
        </AppText>
        <AppText variant="body2" color={colors.textSecondary}>
          Choose The Type Of Battle You Want To Create
        </AppText>
      </View>

      {BATTLE_TYPES_RESOLVED.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeCard,
            selectedType === type.id && styles.typeCardSelected,
            !type.enabled && styles.typeCardDisabled,
          ]}
          onPress={() => handleSelectType(type)}
          activeOpacity={type.enabled ? 0.7 : 1}
        >
          <View style={styles.typeCardHeader}>
            <View style={[styles.badge, { backgroundColor: `${type.badgeColor}20` }]}>
              <Ionicons
                name={type.id === 'SKILL_BATTLE' ? 'eye' : 'shield-checkmark'}
                size={12}
                color={type.badgeColor}
              />
              <AppText variant="captionSm" color={type.badgeColor}>
                {type.badge}
              </AppText>
            </View>
            <View
              style={[styles.radioButton, selectedType === type.id && styles.radioButtonSelected]}
            >
              {selectedType === type.id && <View style={styles.radioButtonInner} />}
            </View>
          </View>

          <View style={styles.typeCardContent}>
            <View style={styles.typeIconContainer}>
              <AppText variant="h2">{type.icon}</AppText>
            </View>
            <View style={styles.typeInfo}>
              <AppText variant="h4">{type.name}</AppText>
              <AppText variant="captionSm" color={colors.textSecondary}>
                {type.description}
              </AppText>
            </View>
          </View>

          <View style={styles.featuresList}>
            {type.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={14} color={colors.primary} />
                <AppText variant="body2" color={colors.textSecondary}>
                  {feature.text}
                </AppText>
              </View>
            ))}
          </View>

          {!type.enabled && (
            <View style={styles.comingSoonOverlay}>
              <AppText variant="captionSm" color={colors.white}>
                Coming Soon
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.oracleInfo}>
        <View style={styles.oracleIconContainer}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
        </View>
        <View style={styles.oracleTextContainer}>
          <AppText variant="buttonMd" style={styles.oracleTitle}>
            Oracle Verified
          </AppText>
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={styles.oracleDescription}
          >
            Winner Decided By Official Data Source. Attesters Only Activate If Data Is Delayed.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
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
  sectionTitle: {
    marginBottom: spacing[1],
  },
  typeCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  typeCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  typeCardDisabled: {
    opacity: 0.6,
  },
  typeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.lg,
    gap: 4,
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
  typeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeInfo: {
    flex: 1,
  },
  featuresList: {
    gap: spacing[2],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.lg,
  },
  oracleInfo: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4] * 2,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing[4],
  },
  oracleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oracleTextContainer: {
    flex: 1,
  },
  oracleTitle: {
    marginBottom: 4,
  },
  oracleDescription: {
    lineHeight: 18,
  },
});
