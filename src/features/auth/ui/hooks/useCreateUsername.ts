import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useToast } from '@/app/providers/useToast';
import { logoutSession } from '../../data/logoutSession';
import { useAuthStore } from '../../data/store/auth.store';
import type { AuthStackParamList } from '@/shared/types';
import { getCheckUsername, postSetUsername } from '../../data/api/authApi';
import { createUsernameScreenStrings, loginScreenStrings } from '../../string';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatUsernameForApi } from '@/shared/utils/helpers';
import { createUsernameSchema, type CreateUsernameFormValues } from './validations';

export function useCreateUsername() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { showToast } = useToast();
  const setUser = useAuthStore((s) => s.setUser);
  const setNeedsUsername = useAuthStore((s) => s.setNeedsUsername);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [usernameStatusMessage, setUsernameStatusMessage] = useState('');

  const form = useForm<CreateUsernameFormValues>({
    resolver: yupResolver(createUsernameSchema),
    mode: 'onChange',
    defaultValues: { username: '' },
  });
  const username = useWatch({ control: form.control, name: 'username' }) ?? '';
  const trimmedUsername = username.trim();
  const debouncedTrimmed = useDebounce(trimmedUsername, 500);
  const formattedForCheck = formatUsernameForApi(debouncedTrimmed);

  useEffect(() => {
    let cancelled = false;

    if (formattedForCheck.length < 3) {
      setIsCheckingUsername(false);
      setIsUsernameAvailable(false);
      setUsernameStatusMessage('');
      return;
    }

    const run = async () => {
      setIsCheckingUsername(true);
      const result = await getCheckUsername(formattedForCheck);
      if (cancelled) return;

      if (!result.success) {
        setIsUsernameAvailable(false);
        setUsernameStatusMessage(result.error.message);
        setIsCheckingUsername(false);
        return;
      }

      setIsUsernameAvailable(result.data.available);
      setUsernameStatusMessage(result.data.message);
      setIsCheckingUsername(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [formattedForCheck]);

  const onValidSubmit = async (data: CreateUsernameFormValues) => {
    if (!isUsernameAvailable) {
      form.setError('username', {
        type: 'manual',
        message: usernameStatusMessage || 'Username is not available',
      });
      return;
    }

    const displayName = data.username.trim();
    const canonicalUsername = formatUsernameForApi(displayName);

    const result = await postSetUsername({
      username: canonicalUsername,
      displayName,
    });

    if (!result.success) {
      form.setError('username', {
        type: 'manual',
        message: result.error.message,
      });
      return;
    }

    showToast('success', createUsernameScreenStrings.successToast);
    setUser({ id: canonicalUsername, email: undefined });
    setNeedsUsername(false);
  };

  const onBackPress = () => {
    Alert.alert(
      'Log out?',
      'Going back now will log you out. Are you sure you want to log out?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await logoutSession();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
    );
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isCheckingUsername,
    isUsernameAvailable,
    usernameStatusMessage,
    onBackPress,
    createUsernameScreenStrings,
    loginScreenStrings,
  };
}
