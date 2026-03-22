import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radii } from '@/shared/theme';
import type { CardProps } from '@/shared/types';

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
  },
});
