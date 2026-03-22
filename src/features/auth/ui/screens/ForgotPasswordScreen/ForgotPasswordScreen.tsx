import { View, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Input,
  AuthHeader,
  PatternBackground,
  Button,
} from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { ForgotPasswordScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseForgotPasswordReturn } from '../../hooks/hooks.types';

export type ForgotPasswordViewProps = ForgotPasswordScreenProps & UseForgotPasswordReturn;

export function ForgotPasswordScreen({
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  onBeforeBack,
  forgotPasswordFlowStrings,
  loginScreenStrings,
}: ForgotPasswordViewProps) {
  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          onBeforeBack={onBeforeBack}
          title={forgotPasswordFlowStrings.forgotPassword.title}
          subtitle={forgotPasswordFlowStrings.forgotPassword.subtitle}
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
                placeholder={forgotPasswordFlowStrings.forgotPassword.emailPlaceholder}
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

          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            onPress={onSubmit}
            style={styles.submitButton}
          >
            {forgotPasswordFlowStrings.forgotPassword.submitCta}
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
