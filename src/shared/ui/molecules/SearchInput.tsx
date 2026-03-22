import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { SearchInputProps } from '@/shared/types';

const DEFAULT_LEFT_ICON = (
  <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
);

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSubmit,
  style,
  leftIcon = DEFAULT_LEFT_ICON,
  rightSlot,
  showClearButton = true,
  variant = 'default',
  label,
}: SearchInputProps) {
  const showClear = showClearButton && value.length > 0 && rightSlot == null;
  const isCompact = variant === 'compact';

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <AppText variant="captionSm" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.container, isCompact && styles.containerCompact]}>
        {leftIcon != null ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, isCompact && styles.inputCompact]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
        />
        {rightSlot != null ? (
          <View style={styles.rightSlot}>{rightSlot}</View>
        ) : showClear ? (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[2],
  },
  label: {
    marginBottom: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  containerCompact: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.card,
  },
  leftIcon: {},
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.md,
    paddingVertical: spacing[3],
  },
  inputCompact: {
    fontSize: fontSizes.sm,
    paddingVertical: spacing[2],
  },
  rightSlot: {},
  clearButton: {},
});
