import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
} from 'react-native';
import { AppText } from '../atoms';
import { useOTPInput } from '@/shared/hooks/useOTPInput';
import type { OTPInputProps } from '@/shared/types';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  borderWidths,
  sizes,
} from '@/shared/constants/theme';

export function OTPInput({
  length,
  onComplete,
  onChange,
  label,
  errors,
  autoFocus = true,
  disabled = false,
  testID,
}: OTPInputProps) {
  const { otp, inputRefs, handleChange, handleKeyPress, handleFocus } = useOTPInput({
    length,
    onComplete,
    onChange,
    autoFocus,
    disabled,
  });

  return (
    <View testID={testID}>
      {label ? <AppText variant="label">{label}</AppText> : null}

      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.input,
                errors ? styles.inputError : digit !== '' && styles.inputFilled,
                disabled && styles.inputDisabled,
              ]}
              keyboardType="number-pad"
              maxLength={Platform.OS === 'ios' ? 1 : length}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
                handleKeyPress(e.nativeEvent.key, index)
              }
              onFocus={() => {
                void handleFocus(index);
              }}
              textContentType={index === 0 ? 'oneTimeCode' : undefined}
              editable={!disabled}
              caretHidden={false}
              selectTextOnFocus
              contextMenuHidden={false}
              accessibilityLabel={`OTP digit ${index + 1} of ${length}`}
              testID={`otp-input-${index}`}
            />
          ))}
        </View>
      </View>

      {errors ? (
        <View style={styles.errorContainer}>
          <AppText variant="error" color={colors.error}>
            {errors}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[2],
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[2],
  },
  input: {
    width: sizes.otpInputWidth,
    height: sizes.otpInputHeight,
    borderRadius: radii.lg,
    borderWidth: borderWidths.thick,
    borderColor: colors.inputBorder,
    textAlign: 'center',
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    paddingVertical: 0,
  },
  inputFilled: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorContainer: {
    marginTop: spacing[3],
  },
});
