import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TextInput } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { getBiometricSecureItem } from '../../data/biometricSecureStorage';
import { useAuthStore } from '../../data/store/auth.store';
import { useLoginMutation } from '../../data/api/authMutations';
import { signInWithBiometrics } from '../../lib/biometrics';
import type { AuthStackParamList } from '@/shared/types';
import { loginScreenStrings } from '../../string';
import {
  biometricPasswordLoginSchema,
  type BiometricPasswordLoginFormValues,
} from './validations';

function formatDisplayNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? email;
  if (!local) return email;
  const words = local.replace(/[._-]+/g, ' ').split(' ');
  return words
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useLoginWithBiometrics() {
  const passwordRef = useRef<TextInput>(null);
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const setAuthTokens = useAuthStore((s) => s.setAuthTokens);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const loginMutation = useLoginMutation();

  const [displayName, setDisplayName] = useState('');
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const autoAttempted = useRef(false);
  const biometricInFlight = useRef(false);

  const form = useForm<BiometricPasswordLoginFormValues>({
    resolver: yupResolver(biometricPasswordLoginSchema),
    mode: 'onChange',
    defaultValues: { password: '' },
  });

  useEffect(() => {
    void (async () => {
      const email = await getBiometricSecureItem('biometric_email');
      if (!email) {
        navigation.replace('EmailLogin');
        return;
      }
      setAccountEmail(email);
      setDisplayName(formatDisplayNameFromEmail(email));
    })();
  }, [navigation]);

  const applyAuthSuccess = useCallback(
    (accessToken: string, refreshToken: string, hasUsername: boolean) => {
      setAuthTokens(accessToken, refreshToken);
      if (!hasUsername) {
        setNeedsUsername(true);
        navigation.navigate('CreateUsername');
        return;
      }
      setNeedsUsername(false);
    },
    [navigation, setAuthTokens, setNeedsUsername],
  );

  const runBiometricSignIn = useCallback(async () => {
    if (biometricInFlight.current || loginMutation.isPending) return;
    biometricInFlight.current = true;
    setBiometricBusy(true);
    try {
      const outcome = await signInWithBiometrics();
      if (!outcome.ok) {
        if (outcome.reason === 'error') {
          showToast('fail', loginScreenStrings.loginWithBiometricsScreen.biometricSignInFailed);
        }
        return;
      }
      applyAuthSuccess(outcome.accessToken, outcome.refreshToken, outcome.hasUsername);
    } finally {
      biometricInFlight.current = false;
      setBiometricBusy(false);
    }
  }, [applyAuthSuccess, loginMutation.isPending, showToast]);

  useEffect(() => {
    if (!accountEmail || autoAttempted.current) return;
    autoAttempted.current = true;
    void runBiometricSignIn();
  }, [accountEmail, runBiometricSignIn]);

  const onPasswordSubmit = async (values: BiometricPasswordLoginFormValues) => {
    if (!accountEmail) return;
    const result = await loginMutation.mutateAsync({
      email: accountEmail,
      password: values.password,
    });
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
      applyAuthSuccess(
        result.data.accessToken,
        result.data.refreshToken,
        result.data.hasUsername,
      );
    }
  };

  const onUsePasswordInstead = () => {
    passwordRef.current?.focus();
  };

  return {
    passwordRef,
    displayName,
    accountEmail,
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onPasswordSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || loginMutation.isPending,
    biometricBusy,
    onBiometricLoginPress: runBiometricSignIn,
    onUsePasswordInstead,
    loginScreenStrings,
  };
}
