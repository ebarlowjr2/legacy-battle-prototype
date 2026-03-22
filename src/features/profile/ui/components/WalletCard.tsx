import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { WalletCardProps } from '@/shared/types';

export function WalletCard({ walletBalance }: WalletCardProps) {
  return (
    <View style={styles.bcCard}>
      <View style={styles.bcLeft}>
        <AppText variant="label" style={styles.bcLabel}>Total Bc</AppText>
        <AppText variant="h4" style={styles.bcValue}>
          {Number(walletBalance).toLocaleString()} BC
        </AppText>
      </View>
      <View style={styles.bcRight}>
        <TouchableOpacity>
          <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewMoreButton}>
          <AppText variant="captionLg" style={styles.viewMoreText}>View More</AppText>
          <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bcCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  bcLeft: {},
  bcLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing[1],
  },
  bcValue: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
  bcRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  viewMoreText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
});
