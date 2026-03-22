import { View, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  ScreenHeader,
  AuthHeader,
  Input,
  PatternBackground,
  Button,
  SVGWrapper,
} from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { CreateUsernameScreenProps } from '@/shared/types';
import { AuthHeaderVariant, IconNameEnum } from '@/shared/utils/enum';
import type { UseCreateUsernameReturn } from '../../hooks/hooks.types';

export type CreateUsernameViewProps = CreateUsernameScreenProps & UseCreateUsernameReturn;

export function CreateUsernameScreen({
  control,
  handleSubmit: _handleSubmit,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  isCheckingUsername,
  isUsernameAvailable,
  usernameStatusMessage,
  onBackPress,
  createUsernameScreenStrings,
  loginScreenStrings,
}: CreateUsernameViewProps) {
  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <View style={styles.content}>
        <ScreenHeader onBack={onBackPress} />

        <AuthHeader
          variant={AuthHeaderVariant.Left}
          style={styles.authHeader}
          title={createUsernameScreenStrings.authHeader.screenTitle}
          subtitle={createUsernameScreenStrings.authHeader.screenSubtitle}
        />

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={createUsernameScreenStrings.form.usernameLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={createUsernameScreenStrings.form.usernamePlaceholder}
                autoCapitalize="none"
                editable={!isSubmitting}
                error={errors.username?.message}
                showSuccessBorder={isUsernameAvailable && !errors.username?.message}
                leftComponent={
                  <Ionicons
                    name="person-outline"
                    size={sizes.icon20}
                    color={colors.textSecondary}
                  />
                }
                rightComponent={
                  isUsernameAvailable ? (
                    <SVGWrapper
                      name={IconNameEnum.CheckValid}
                      width={sizes.icon20}
                      height={sizes.icon20}
                    />
                  ) : undefined
                }
                containerStyle={styles.inputWrapperContainer}
              />
            )}
          />
          {!errors.username?.message && usernameStatusMessage ? (
            <AppText variant="body2" color={isUsernameAvailable ? colors.success : colors.error}>
              {usernameStatusMessage}
            </AppText>
          ) : null}
        </View>

        <Button
          variant="primary"
          loading={isSubmitting || isCheckingUsername}
          disabled={!isValid || isSubmitting || isCheckingUsername || !isUsernameAvailable}
          onPress={onSubmit}
          style={styles.startButton}
          rightIcon={
            <SVGWrapper name={IconNameEnum.BattleHand} width={sizes.icon24} height={sizes.icon24} />
          }
        >
          {createUsernameScreenStrings.primaryCta.startBattle}
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
  authHeader: {
    marginBottom: spacing[6],
  },
  inputContainer: {
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  inputWrapperContainer: {},
  startButton: {
    marginTop: spacing[2],
  },
});
