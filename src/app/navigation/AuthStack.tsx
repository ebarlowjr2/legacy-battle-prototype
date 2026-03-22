import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { getBiometricsEnrolled } from '@/features/auth/data/biometricSecureStorage';
import { AuthStackParamList } from './types';
import {
  LoginWelcomeScreen,
  EmailLoginScreen,
  LoginWithBiometricsScreen,
  SignUpScreen,
  OTPVerificationScreen,
  ForgotPasswordScreen,
  VerifyResetOTPScreen,
  ResetPasswordScreen,
  CreateUsernameScreen,
  useAuthStore,
} from '@/features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const headerOptions: NativeStackNavigationOptions = { headerShown: false };

type AuthEntryRoute = 'CreateUsername' | 'LoginWithBiometrics' | 'EmailLogin';

const AuthStack = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const needsUsername = useAuthStore((s) => s.needsUsername);
  const [initialRouteName, setInitialRouteName] = useState<AuthEntryRoute | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (accessToken && needsUsername) {
        if (!cancelled) setInitialRouteName('CreateUsername');
        return;
      }
      const enrolled = await getBiometricsEnrolled();
      if (cancelled) return;
      setInitialRouteName(enrolled ? 'LoginWithBiometrics' : 'EmailLogin');
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, needsUsername]);

  if (initialRouteName === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={headerOptions}>
      <Stack.Screen name="Login" component={LoginWelcomeScreen} />
      <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
      <Stack.Screen name="LoginWithBiometrics" component={LoginWithBiometricsScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyResetOTP" component={VerifyResetOTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="CreateUsername" component={CreateUsernameScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
