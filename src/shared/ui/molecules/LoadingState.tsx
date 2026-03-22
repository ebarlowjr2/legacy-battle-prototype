import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '../atoms';
import type { LoadingStateProps } from '@/shared/types';

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="body2" style={styles.message}>{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: spacing[3],
    color: colors.textSecondary,
  },
});
