import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { AppText } from '../atoms';
import type { EmptyStateProps } from '@/shared/types';

export function EmptyState({ title, message, children }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {message ? <AppText variant="body2" style={styles.message}>{message}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
