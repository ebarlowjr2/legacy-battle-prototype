import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Insets,
  ViewStyle,
  View,
} from 'react-native';
import { colors, spacing, radii, borderWidths, fontWeights } from '@/shared/theme';
import { FontFamily } from '@/shared/theme';
import { AppText } from '../atoms';
import type { ButtonVariant, ButtonProps } from '@/shared/types';

const DEFAULT_HIT_SLOP: Insets = { top: 8, bottom: 8, left: 8, right: 8 };

function labelColor(variant: ButtonVariant): string {
  if (variant === 'ghost') return colors.primary;
  if (variant === 'outline') return colors.text;
  if (variant === 'secondary') return colors.white;
  return colors.white;
}

function spinnerColor(variant: ButtonVariant): string {
  if (variant === 'ghost' || variant === 'outline' || variant === 'secondary') {
    return colors.primary;
  }
  return colors.white;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  children,
  leftIcon,
  rightIcon,
  style,
  hitSlop = DEFAULT_HIT_SLOP,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const pressing = useRef(false);

  const handlePress = useCallback(() => {
    if (pressing.current) return;
    pressing.current = true;
    onPress();
    setTimeout(() => {
      pressing.current = false;
    }, 400);
  }, [onPress]);

  const hasIcons = leftIcon != null || rightIcon != null;

  const stringLabel =
    typeof children === 'string' ? (
      <AppText
        variant={variant === 'outline' ? 'body1' : 'h6'}
        color={labelColor(variant)}
        style={
          variant === 'outline'
            ? styles.outlineLabel
            : variant === 'ghost'
              ? styles.labelMontserratSemibold
              : styles.labelMontserratBold
        }
      >
        {children}
      </AppText>
    ) : null;

  const inner = loading ? (
    <ActivityIndicator color={spinnerColor(variant)} />
  ) : typeof children === 'string' ? (
    hasIcons ? (
      <View style={styles.contentRow}>
        {leftIcon != null ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        {stringLabel}
        {rightIcon != null ? <View style={styles.iconSlot}>{rightIcon}</View> : null}
      </View>
    ) : (
      stringLabel
    )
  ) : hasIcons ? (
    <View style={styles.contentRow}>
      {leftIcon != null ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
      <View style={styles.childGrow}>{children}</View>
      {rightIcon != null ? <View style={styles.iconSlot}>{rightIcon}</View> : null}
    </View>
  ) : (
    children
  );

  return (
    <TouchableOpacity
      style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      hitSlop={hitSlop}
    >
      {inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    gap: spacing[2],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  iconSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  childGrow: {
    flexShrink: 1,
  },
  disabled: {
    opacity: 0.7,
  },
  outlineLabel: {
    fontWeight: fontWeights.medium,
    fontFamily: FontFamily.montserratMedium,
  },
  /** h6 token is already Montserrat; explicit family keeps labels consistent if token changes. */
  labelMontserratBold: {
    fontFamily: FontFamily.montserratBold,
  },
  labelMontserratSemibold: {
    fontFamily: FontFamily.montserratSemiBold,
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: borderWidths.hairline,
    borderColor: colors.primary,
  },
};
