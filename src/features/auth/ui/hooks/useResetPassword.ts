import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useToast } from '@/app/providers/useToast';
import { useResetPasswordMutation } from '../../data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { forgotPasswordFlowStrings, loginScreenStrings } from '../../string';
import { resetPasswordSchema, type ResetPasswordFormValues } from './validations';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;
type ResetPasswordRoute = RouteProp<AuthStackParamList, 'ResetPassword'>;

export function useResetPassword() {
  const navigation = useNavigation<AuthNav>();
  const route = useRoute<ResetPasswordRoute>();
  const { showToast } = useToast();
  const resetMutation = useResetPasswordMutation();
  const missingRef = useRef(false);

  const reference = route.params?.reference ?? '';

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (missingRef.current) return;
    if (!reference) {
      missingRef.current = true;
      showToast('fail', 'Missing reset session');
      navigation.goBack();
    }
  }, [navigation, reference, showToast]);

  const onValidSubmit = async (data: ResetPasswordFormValues) => {
    const result = await resetMutation.mutateAsync({
      reference,
      newPassword: data.password,
    });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    showToast('success', result.data.message);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || resetMutation.isPending,
    forgotPasswordFlowStrings,
    loginScreenStrings,
  };
}
