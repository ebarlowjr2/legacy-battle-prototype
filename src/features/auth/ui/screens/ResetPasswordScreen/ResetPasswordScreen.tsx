import { View, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Input,
  AuthHeader,
  PatternBackground,
  Button,
  AppText,
} from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { ResetPasswordScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseResetPasswordReturn } from '../../hooks/hooks.types';

export type ResetPasswordViewProps = ResetPasswordScreenProps & UseResetPasswordReturn;

export function ResetPasswordScreen({
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  forgotPasswordFlowStrings,
  loginScreenStrings,
}: ResetPasswordViewProps) {
  const copy = forgotPasswordFlowStrings.resetPassword;

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          title={copy.title}
          subtitle={
            <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
              {copy.subtitle}
            </AppText>
          }
        />

        <View style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={copy.newPasswordLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={copy.passwordPlaceholder}
                isPassword
                editable={!isSubmitting}
                error={errors.password?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={copy.confirmPasswordLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={copy.passwordPlaceholder}
                isPassword
                editable={!isSubmitting}
                error={errors.confirmPassword?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            onPress={onSubmit}
            style={styles.submitButton}
            rightIcon={<Ionicons name="lock-closed-outline" size={sizes.icon20} color={colors.white} />}
          >
            {copy.submitCta}
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  subtitle: {
    marginTop: spacing[1],
  },
  form: {
    gap: spacing[3],
  },
  inputContainer: {
    gap: spacing[2],
  },
  submitButton: {
    marginTop: spacing[2],
  },
});
