import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  ScreenHeader,
  IconCircle,
  PatternBackground,
  SVGWrapper,
  Button,
  OTPInput,
} from '@/shared/ui';
import { OTP_LENGTH } from '@/shared/constants';
import {
  colors,
  spacing,
  sizes,
  fontSizes,
  fontWeights,
} from '@/shared/constants/theme';
import type { VerifyResetOTPScreenProps } from '@/shared/types';
import { formatMmSs } from '@/shared/utils/helpers';
import type { UseVerifyResetOtpReturn } from '../../hooks/hooks.types';

export type VerifyResetOTPViewProps = VerifyResetOTPScreenProps & UseVerifyResetOtpReturn;

export function VerifyResetOTPScreen({
  navigation,
  onCodeChange,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  onResend,
  resendDisabled,
  cooldownSec,
  displayEmail,
  loginScreenStrings,
  forgotPasswordFlowStrings,
}: VerifyResetOTPViewProps) {
  const copy = forgotPasswordFlowStrings.verifyResetOtp;

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <View style={styles.iconContainer}>
          <IconCircle size={sizes.iconHero} backgroundColor={colors.card}>
            <SVGWrapper name="ChatBubble" width={sizes.icon40} height={sizes.icon40} />
          </IconCircle>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">{copy.title}</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            {copy.codeSentLeadIn}
            {'\n'}
            <AppText variant="body1" color={colors.text}>
              {displayEmail}
            </AppText>
          </AppText>
        </View>

        <View style={styles.otpSection}>
          <OTPInput
            length={OTP_LENGTH}
            onChange={onCodeChange}
            onComplete={() => {
              void onSubmit();
            }}
            errors={errors.otp?.message}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.resendBlock}>
          <AppText variant="body2" color={colors.textSecondary} style={styles.resendPrompt}>
            {copy.resendPrompt}
          </AppText>
          {cooldownSec > 0 ? (
            <View style={styles.countdownRow} accessibilityLiveRegion="polite">
              <AppText variant="body2" color={colors.textSecondary}>
                {copy.resendAvailableIn}{' '}
              </AppText>
              <AppText
                variant="body1"
                color={colors.primary}
                style={styles.countdownDigits}
                accessibilityLabel={`Resend available in ${formatMmSs(cooldownSec)}`}
              >
                {formatMmSs(cooldownSec)}
              </AppText>
            </View>
          ) : (
            <TouchableOpacity onPress={() => void onResend()} disabled={resendDisabled} style={styles.resendCta}>
              <AppText variant="label" color={resendDisabled ? colors.textSecondary : colors.primary}>
                {copy.resendCta}
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        <Button
          variant="primary"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          onPress={onSubmit}
          style={styles.verifyButton}
          rightIcon={<Ionicons name="shield-checkmark-outline" size={sizes.icon20} color={colors.white} />}
        >
          {copy.verifyCta}
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing[2],
  },
  otpSection: {
    marginBottom: spacing[6],
  },
  resendBlock: {
    alignItems: 'center',
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  resendPrompt: {
    textAlign: 'center',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  countdownDigits: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    fontVariant: ['tabular-nums'],
  },
  resendCta: {
    paddingVertical: spacing[1],
  },
  verifyButton: {
    marginTop: spacing[2],
  },
});
