import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes } from '@/shared/theme';

export const HomeHeader = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <AppText variant="body1" style={styles.avatarText}>LB</AppText>
        </View>
      </View>
      <View style={styles.welcomeContainer}>
        <AppText variant="captionLg" style={styles.welcomeText}>Welcome Back</AppText>
        <AppText variant="h4" style={styles.usernameText}>Champion</AppText>
      </View>
    </View>
    <TouchableOpacity style={styles.notificationButton}>
      <Ionicons name="notifications-outline" size={24} color={colors.text} />
      <View style={styles.notificationBadge} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  welcomeContainer: {},
  welcomeText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  usernameText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
