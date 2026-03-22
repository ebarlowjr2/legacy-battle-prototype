import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from '@/app/providers/useToast';
import {
  getBiometricsRequested,
  setBiometricsRequested,
} from '../../data/biometricSecureStorage';
import { useAuthStore } from '../../data/store/auth.store';
import { useGoogleSocialAuthMutation, useLoginMutation } from '../../data/api/authMutations';
import { enrollBiometrics, getDefaultBiometricDeviceName } from '../../lib/biometrics';
import { requestGoogleIdToken } from '../../lib/googleSignIn';
import type { AuthStackParamList } from '@/shared/types';
import { loginScreenStrings, signUpScreenStrings } from '../../string';
import { loginSchema, type LoginFormValues } from './validations';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useLogin() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const expoPushToken = useAuthStore((s) => s.expoPushToken);
  const loginMutation = useLoginMutation();
  const googleSocialMutation = useGoogleSocialAuthMutation();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [googleFlowLoading, setGoogleFlowLoading] = useState(false);
  /** Prevents async hydration from overwriting the switch after the user has toggled it. */
  const biometricsTouchedByUser = useRef(false);

  useEffect(() => {
    void (async () => {
      const requested = await getBiometricsRequested();
      if (biometricsTouchedByUser.current) return;
      setBiometricsEnabled(requested);
    })();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onValidSubmit = async (data: LoginFormValues) => {
    const result = await loginMutation.mutateAsync(data);

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    if (result.data.outcome === 'PENDING_VERIFICATION') {
      navigation.navigate('OTPVerification', {
        email: result.data.email,
        reference: result.data.reference,
      });
      return;
    }

    if (result.data.outcome === 'AUTHENTICATED') {
      setAuthTokens(result.data.accessToken, result.data.refreshToken);

      const wantBiometrics = await getBiometricsRequested();
      if (wantBiometrics) {
        const enroll = await enrollBiometrics(
          result.data.accessToken,
          data.email,
          getDefaultBiometricDeviceName(),
          expoPushToken ?? '',
        );
        if (!enroll.ok) {
          showToast('fail', loginScreenStrings.emailLoginForm.biometricsEnrollCancelledToast);
        }
      }

      if (!result.data.hasUsername) {
        setNeedsUsername(true);
        navigation.navigate('CreateUsername');
        return;
      }
      setNeedsUsername(false);
    }
  };

  const onBeforeBack = () => {
    form.reset();
  };

  const onGooglePress = async () => {
    setGoogleFlowLoading(true);
    try {
      const tokenResult = await requestGoogleIdToken();
      if (!tokenResult.ok) {
        if (tokenResult.cancelled) return;
        showToast('fail', tokenResult.message);
        return;
      }

      const result = await googleSocialMutation.mutateAsync({ idToken: tokenResult.idToken });
      if (!result.success) {
        showToast('fail', result.error.message);
        return;
      }

      setAuthTokens(result.data.accessToken, result.data.refreshToken);
      if (!result.data.hasUsername) {
        setNeedsUsername(true);
        navigation.navigate('CreateUsername');
        return;
      }
      setNeedsUsername(false);
    } finally {
      setGoogleFlowLoading(false);
    }
  };

  const onFooterLinkPress = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  const onBiometricsToggle = (enabled: boolean) => {
    biometricsTouchedByUser.current = true;
    // Update state synchronously so the controlled <Switch /> tracks the gesture (async persist alone causes snap-back).
    setBiometricsEnabled(enabled);
    void setBiometricsRequested(enabled);
  };

  const isSubmitting = form.formState.isSubmitting || loginMutation.isPending;
  const isGoogleLoading = googleFlowLoading || googleSocialMutation.isPending;

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
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
  };
}
