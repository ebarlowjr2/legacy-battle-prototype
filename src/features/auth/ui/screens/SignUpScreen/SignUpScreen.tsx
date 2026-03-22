import { View, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Input,
  AuthHeader,
  PatternBackground,
  AuthOrGoogleFooter,
  Button,
} from '@/shared/ui';
import { colors, spacing, fontSizes, sizes } from '@/shared/constants/theme';
import type { SignUpScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseSignupReturn } from '../../hooks/hooks.types';

export type SignUpViewProps = SignUpScreenProps & UseSignupReturn;

export function SignUpScreen({
  navigation: _navigation,
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  onGooglePress,
  onFooterLinkPress,
  loginScreenStrings,
  signUpScreenStrings,
}: SignUpViewProps) {
  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          title={signUpScreenStrings.authHeader.welcomeTitle}
          subtitle={
            <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
              {signUpScreenStrings.authHeader.createAccountSubtitle}
            </AppText>
          }
        />

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={signUpScreenStrings.form.emailLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={signUpScreenStrings.form.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
                error={errors.email?.message}
                leftComponent={
                  <Ionicons name="mail-outline" size={sizes.icon20} color={colors.textSecondary} />
                }
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={signUpScreenStrings.form.passwordLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={signUpScreenStrings.form.passwordPlaceholder}
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
                label={signUpScreenStrings.form.confirmPasswordLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={signUpScreenStrings.form.passwordPlaceholder}
                isPassword
                editable={!isSubmitting}
                error={errors.confirmPassword?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <AppText variant="captionSm" color={colors.textSecondary} style={styles.termsText}>
            {signUpScreenStrings.legal.termsLeadIn}{' '}
            <AppText variant="captionSm" color={colors.primary} style={styles.termsLink}>
              {signUpScreenStrings.legal.termsWord}
            </AppText>{' '}
            {signUpScreenStrings.legal.termsConnector}{' '}
            <AppText variant="captionSm" color={colors.primary} style={styles.termsLink}>
              {signUpScreenStrings.legal.conditionsWord}
            </AppText>
          </AppText>

          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            onPress={onSubmit}
            rightIcon={<Ionicons name="arrow-forward" size={sizes.icon20} color={colors.white} />}
          >
            {signUpScreenStrings.primaryCta.signUp}
          </Button>

          <AuthOrGoogleFooter
            orLabel={signUpScreenStrings.divider.or}
            googleButtonLabel={signUpScreenStrings.social.continueWithGoogle}
            footerLeadText={`${signUpScreenStrings.footer.hasAccountPrompt} `}
            footerLinkLabel={signUpScreenStrings.footer.logInCta}
            onGooglePress={onGooglePress}
            onFooterLinkPress={onFooterLinkPress}
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
  subtitle: {
    fontSize: fontSizes.sm,
  },
  form: {
    gap: spacing[4],
  },
  inputContainer: {
    gap: spacing[2],
  },
  termsText: {
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
