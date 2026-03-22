import React from 'react';
import { View, Switch, StyleSheet, type ViewStyle } from 'react-native';
import { AppText } from '../atoms';
import { colors, spacing } from '@/shared/theme';
import type { LabeledSwitchProps } from '@/shared/types';

export function LabeledSwitch({
  label,
  value,
  onValueChange,
  disabled = false,
  style,
  accessibilityLabel,
}: LabeledSwitchProps) {
  return (
    <View style={[styles.row, style]} accessibilityLabel={accessibilityLabel ?? label}>
      <AppText variant="body2" color={colors.text} style={styles.label}>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.inputBorder, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  label: {
    flex: 1,
  },
});
