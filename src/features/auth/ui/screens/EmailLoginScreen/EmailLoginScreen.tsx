import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Input,
  AuthHeader,
  PatternBackground,
  AuthOrGoogleFooter,
  Button,
  AppText,
  LabeledSwitch,
} from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { EmailLoginScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseLoginReturn } from '../../hooks/hooks.types';

export type EmailLoginViewProps = EmailLoginScreenProps & UseLoginReturn;

export function EmailLoginScreen({
  navigation: _navigation,
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  isGoogleLoading,
  onBeforeBack,
  onGooglePress,
  onFooterLinkPress,
  onForgotPasswordPress,
  biometricsEnabled,
  onBiometricsToggle,
  loginScreenStrings,
  signUpScreenStrings,
}: EmailLoginViewProps) {
  const formDisabled = isSubmitting || isGoogleLoading;

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          onBeforeBack={onBeforeBack}
          title={loginScreenStrings.emailLoginScreen.title}
          subtitle={loginScreenStrings.emailLoginScreen.subtitle}
        />

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={loginScreenStrings.emailLoginForm.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!formDisabled}
                error={errors.email?.message}
                leftComponent={
                  <Ionicons name="mail-outline" size={sizes.icon20} color={colors.textSecondary} />
                }
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={loginScreenStrings.emailLoginForm.passwordPlaceholder}
                  isPassword
                  editable={!formDisabled}
                  error={errors.password?.message}
                  containerStyle={styles.inputContainer}
                />
              )}
            />
            <View style={styles.forgotPasswordRow}>
              <TouchableOpacity
                onPress={onForgotPasswordPress}
                disabled={formDisabled}
                accessibilityRole="button"
                accessibilityLabel={loginScreenStrings.emailLoginForm.forgotPassword}
              >
                <AppText variant="body2" color={colors.primary}>
                  {loginScreenStrings.emailLoginForm.forgotPassword}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <LabeledSwitch
            label={loginScreenStrings.emailLoginForm.enableBiometrics}
            value={biometricsEnabled}
            onValueChange={onBiometricsToggle}
            disabled={formDisabled}
          />

          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={!isValid || formDisabled}
            onPress={onSubmit}
            style={styles.submitButton}
          >
            {loginScreenStrings.emailLoginForm.submitLogIn}
          </Button>

          <AuthOrGoogleFooter
            orLabel={signUpScreenStrings.divider.or}
            googleButtonLabel={signUpScreenStrings.social.continueWithGoogle}
            footerLeadText={loginScreenStrings.emailLoginForm.footerLeadNoAccount}
            footerLinkLabel={loginScreenStrings.emailLoginForm.navigateToSignUp}
            onGooglePress={() => void onGooglePress()}
            onFooterLinkPress={onFooterLinkPress}
            googleLoading={isGoogleLoading}
            googleDisabled={formDisabled}
          />
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
  form: {
    gap: spacing[3],
  },
  inputContainer: {
    gap: spacing[2],
  },
  forgotPasswordRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginTop: spacing[3],
  },
  submitButton: {
    marginTop: spacing[2],
  },
});
