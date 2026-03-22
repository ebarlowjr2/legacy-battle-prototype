import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes } from '@/shared/theme';
import { getLevelInfo, getLevelNumber } from '@/features/profile/helpers/level';
import type { ProfileHeaderProps } from '@/shared/types';

export function ProfileHeader({ displayName, username, email, xp }: ProfileHeaderProps) {
  const avatarInitials = (displayName || username || email || 'U')
    .substring(0, 2)
    .toUpperCase();

  const levelInfo = getLevelInfo(xp);
  const levelNumber = getLevelNumber(xp);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText variant="h3" style={styles.headerTitle}>Profile</AppText>
          <Ionicons name="person-outline" size={18} color={colors.primary} />
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <AppText variant="h1" style={styles.avatarText}>{avatarInitials}</AppText>
          </View>
        </View>

        <AppText variant="h4" style={styles.username}>
          {displayName || username || 'User'}
        </AppText>
        <AppText variant="body2" style={styles.email}>{email}</AppText>

        <View style={styles.levelBadgeContainer}>
          <AppText variant="body1" style={styles.trophyIcon}>🏆</AppText>
          <AppText variant="label" style={styles.levelBadgeText}>
            {levelInfo.level} Level {levelNumber}
          </AppText>
          <AppText variant="body2" style={styles.levelXpText}> {xp.toLocaleString()} XP</AppText>
        </View>
      </View>
    </>
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
    gap: spacing[1],
  },
  headerTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarContainer: {
    marginBottom: spacing[2],
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.inputBorder,
  },
  avatarText: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing[1],
  },
  email: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing[2],
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
  },
  trophyIcon: {
    fontSize: fontSizes.md,
    marginRight: spacing[1],
  },
  levelBadgeText: {
    color: colors.success,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  levelXpText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});
