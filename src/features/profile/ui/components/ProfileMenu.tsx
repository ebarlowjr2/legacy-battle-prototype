import React from 'react';
import { View, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, MenuRow } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { ProfileMenuProps } from '@/shared/types';

function Badge({ count, variant = 'default' }: { count: number; variant?: 'default' | 'pending' }) {
  return (
    <View style={[styles.menuBadge, variant === 'pending' && styles.menuBadgePending]}>
      <AppText variant="captionSm" style={styles.menuBadgeText}>{count}</AppText>
    </View>
  );
}

export function ProfileMenu({
  crewCount,
  pendingCrewCount,
  themeMode,
  onToggleTheme,
  onCrewPress,
  onLogout,
}: ProfileMenuProps) {
  return (
    <>
      <View style={styles.menuSection}>
        <MenuRow icon="trophy-outline" label="Achievements" rightSlot={<Badge count={12} />} />

        <MenuRow icon="stats-chart-outline" label="Statistics" />

        <MenuRow
          icon="people-outline"
          label="Crew"
          onPress={onCrewPress}
          rightSlot={
            <>
              {pendingCrewCount > 0 && <Badge count={pendingCrewCount} variant="pending" />}
              <Badge count={crewCount} />
            </>
          }
        />

        <MenuRow icon="wallet-outline" label="Wallet" />

        <MenuRow icon="notifications-outline" label="Notifications" />

        <MenuRow icon="help-circle-outline" label="Help & Support" />

        <MenuRow
          icon={themeMode === 'dark' ? 'moon-outline' : 'sunny-outline'}
          label={themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          showChevron={false}
          rightSlot={
            <Switch
              value={themeMode === 'light'}
              onValueChange={onToggleTheme}
              trackColor={{ false: colors.inputBorder, true: colors.primary }}
              thumbColor={colors.white}
            />
          }
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.primary} />
        <AppText variant="buttonMd" style={styles.logoutText}>Log Out</AppText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing[4],
    overflow: 'hidden',
  },
  menuBadge: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minWidth: 28,
    alignItems: 'center',
  },
  menuBadgePending: {
    backgroundColor: colors.warning,
  },
  menuBadgeText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    marginBottom: spacing[6],
  },
  logoutText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
});
