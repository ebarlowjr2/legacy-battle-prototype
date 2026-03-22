import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  type TextInput as RNTextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes, sizes } from '@/shared/theme';
import { AppText } from '../atoms';
import type { InputProps } from '@/shared/types';

const InputComponent = (
  {
    label,
    error,
    required,
    isPassword,
    leftComponent,
    rightComponent,
    containerStyle,
    wrapperStyle,
    inputTextStyle,
    showSuccessBorder,
    isFocused,
    style: _style,
    secureTextEntry: secureTextEntryProp,
    ...rest
  }: InputProps,
  ref: React.Ref<RNTextInput>
) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const hasError = Boolean(error);
  const showSuccess = Boolean(showSuccessBorder && rest.value && rest.value.length > 0);

  const wrapperDynamic =
    hasError || showSuccess || isFocused
      ? [
          hasError && styles.wrapperError,
          showSuccess && styles.wrapperSuccess,
          isFocused && !hasError && !showSuccess && styles.wrapperFocused,
        ].filter(Boolean)
      : [];

  const secureTextEntry = isPassword ? !passwordVisible : secureTextEntryProp;

  const resolvedLeft = isPassword ? (
    <Ionicons name="lock-closed-outline" size={sizes.icon20} color={colors.textSecondary} />
  ) : (
    leftComponent
  );

  const resolvedRight = isPassword ? (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={() => setPasswordVisible((v) => !v)}
    >
      <Ionicons
        name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
        size={sizes.icon20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  ) : (
    rightComponent
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label != null && label !== '' ? (
        <AppText variant="label" color={colors.textSecondary} style={styles.label}>
          {label}
          {required ? ' *' : ''}
        </AppText>
      ) : null}
      <View style={[styles.wrapper, ...wrapperDynamic, wrapperStyle]}>
        {resolvedLeft != null ? <View style={styles.slot}>{resolvedLeft}</View> : null}
        <TextInput
          ref={ref}
          style={[styles.input, inputTextStyle]}
          placeholderTextColor={colors.muted}
          {...rest}
          secureTextEntry={secureTextEntry}
        />
        {resolvedRight != null ? <View style={styles.slot}>{resolvedRight}</View> : null}
      </View>
      {hasError ? (
        <AppText variant="error" color={colors.error} style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

export const Input = forwardRef<RNTextInput, InputProps>(InputComponent);

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  label: {
    marginBottom: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  wrapperError: {
    borderColor: colors.error,
  },
  wrapperSuccess: {
    borderColor: colors.success,
  },
  wrapperFocused: {
    borderColor: colors.primary,
  },
  slot: {},
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.md,
    paddingVertical: spacing[4],
  },
  errorText: {
    marginTop: 0,
  },
});
