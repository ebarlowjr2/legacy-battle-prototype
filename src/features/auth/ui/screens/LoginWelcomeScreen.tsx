import { View, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Screen, AppText, AuthHeader, PatternBackground, Button } from '@/shared/ui';
import { borderWidths, colors, spacing, sizes, scaleLayout } from '@/shared/constants/theme';
import { authStrings, loginScreenStrings } from '../../string';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { LoginWelcomeScreenProps } from '@/shared/types';

export default function LoginWelcomeScreen({ navigation }: LoginWelcomeScreenProps) {
  const handleSocialLogin = (provider: string) => {
    Alert.alert(authStrings.comingSoon.alertTitle, authStrings.comingSoon.loginMessage(provider));
  };

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />

      <View style={styles.content}>
        <AuthHeader
          variant={AuthHeaderVariant.Center}
          showTitleHand
          style={styles.authHeader}
          title={
            <AppText variant="h1" style={styles.loginTitle}>
              {loginScreenStrings.authHeader.titleLeadingWord}{' '}
              <AppText variant="h1" color={colors.primary}>
                {loginScreenStrings.authHeader.titleAccentWord}
              </AppText>
            </AppText>
          }
          subtitle={loginScreenStrings.authHeader.subtitleTagline}
        />

        <View style={styles.buttonsContainer}>
          <Button
            variant="outline"
            onPress={() => handleSocialLogin('Apple')}
            leftIcon={<Ionicons name="logo-apple" size={sizes.icon20} color={colors.text} />}
            style={styles.socialButton}
          >
            {loginScreenStrings.social.continueWithApple}
          </Button>

          <Button
            variant="outline"
            onPress={() => handleSocialLogin('Facebook')}
            leftIcon={<FontAwesome name="facebook" size={sizes.icon20} color={colors.brandFacebook} />}
            style={styles.socialButton}
          >
            {loginScreenStrings.social.continueWithFacebook}
          </Button>

          <Button
            variant="outline"
            onPress={() => handleSocialLogin('Google')}
            leftIcon={
              <Image
                source={{ uri: 'https://www.google.com/favicon.ico' }}
                style={styles.googleIcon}
              />
            }
            style={styles.socialButton}
          >
            {loginScreenStrings.social.continueWithGoogle}
          </Button>

          <Button
            variant="outline"
            onPress={() => navigation.navigate('EmailLogin')}
            leftIcon={<Ionicons name="mail-outline" size={sizes.icon20} color={colors.text} />}
            style={styles.socialButton}
          >
            {loginScreenStrings.social.continueWithEmail}
          </Button>

          <Button
            variant="primary"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.createAccountButton}
          >
            {loginScreenStrings.primaryCta.createAccount}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: scaleLayout(40),
    paddingHorizontal: spacing[6],
    justifyContent: 'center',
  },
  authHeader: {
    marginBottom: spacing[6] + spacing[4],
  },
  loginTitle: {
    textAlign: 'center',
    width: '100%',
  },

  buttonsContainer: {
    gap: spacing[3],
  },
  socialButton: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    borderWidth: borderWidths.hairline,
  },
  googleIcon: {
    width: sizes.googleIcon,
    height: sizes.googleIcon,
  },
  createAccountButton: {
    marginTop: spacing[2],
  },
});
