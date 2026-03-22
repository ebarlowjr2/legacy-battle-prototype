import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText } from '../atoms';
import type { ErrorStateProps } from '@/shared/types';

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {message ? <AppText variant="body2" style={styles.message}>{message}</AppText> : null}
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <AppText variant="buttonMd" color={colors.white} style={styles.retryText}>Try Again</AppText>
        </TouchableOpacity>
      ) : null}
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
  retryButton: {
    marginTop: spacing[3],
    backgroundColor: colors.primary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[5],
    borderRadius: radii.md,
  },
  retryText: {},
});
