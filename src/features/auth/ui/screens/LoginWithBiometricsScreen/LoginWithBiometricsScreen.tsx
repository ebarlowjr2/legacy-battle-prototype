import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Screen, Input, AuthHeader, PatternBackground, Button, AppText } from '@/shared/ui';
import { colors, spacing } from '@/shared/constants/theme';
import type { LoginWithBiometricsScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseLoginWithBiometricsReturn } from '../../hooks/hooks.types';

export type LoginWithBiometricsViewProps = LoginWithBiometricsScreenProps &
  UseLoginWithBiometricsReturn;

export function LoginWithBiometricsScreen({
  passwordRef,
  displayName,
  accountEmail,
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  biometricBusy,
  onBiometricLoginPress,
  onUsePasswordInstead,
  loginScreenStrings,
}: LoginWithBiometricsViewProps) {
  const s = loginScreenStrings.loginWithBiometricsScreen;

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Center}
          showTitleHand
          title={
            <AppText variant="h1" style={styles.title}>
              {s.title}
            </AppText>
          }
          subtitle={s.subtitle}
        />

        <View style={styles.hero}>
          <AppText variant="h2" style={styles.displayName}>
            {displayName}
          </AppText>
          {accountEmail ? (
            <AppText variant="body2" color={colors.textSecondary} style={styles.email}>
              {accountEmail}
            </AppText>
          ) : null}
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={passwordRef}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={s.passwordPlaceholder}
                isPassword
                editable={!isSubmitting && !biometricBusy}
                error={errors.password?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Button
            variant="primary"
            loading={biometricBusy}
            disabled={isSubmitting || biometricBusy}
            onPress={onBiometricLoginPress}
            style={styles.button}
          >
            {s.loginWithBiometrics}
          </Button>

          <TouchableOpacity
            onPress={onUsePasswordInstead}
            disabled={isSubmitting || biometricBusy}
            accessibilityRole="button"
            accessibilityLabel={s.usePasswordInstead}
          >
            <AppText variant="body2" color={colors.primary} style={styles.link}>
              {s.usePasswordInstead}
            </AppText>
          </TouchableOpacity>

          <Button
            variant="outline"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting || biometricBusy}
            onPress={onSubmit}
            style={styles.button}
          >
            {s.submitLogIn}
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
  title: {
    textAlign: 'center',
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  displayName: {
    textAlign: 'center',
  },
  email: {
    textAlign: 'center',
  },
  form: {
    gap: spacing[3],
  },
  inputContainer: {
    gap: spacing[2],
  },
  button: {
    marginTop: spacing[1],
  },
  link: {
    textAlign: 'center',
    paddingVertical: spacing[2],
  },
});
