import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from '@/app/providers/useToast';
import { useForgotPasswordMutation } from '../../data/api/authMutations';
import type { AuthStackParamList } from '@/shared/types';
import { forgotPasswordFlowStrings, loginScreenStrings } from '../../string';
import { forgotPasswordEmailSchema, type ForgotPasswordFormValues } from './validations';

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

export function useForgotPassword() {
  const navigation = useNavigation<AuthNav>();
  const { showToast } = useToast();
  const forgotMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordEmailSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const onValidSubmit = async (data: ForgotPasswordFormValues) => {
    const result = await forgotMutation.mutateAsync({ email: data.email.trim() });

    if (!result.success) {
      showToast('fail', result.error.message);
      return;
    }

    navigation.navigate('VerifyResetOTP', {
      email: data.email.trim(),
      reference: result.data.reference,
    });
  };

  const onBeforeBack = () => {
    form.reset();
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit: form.handleSubmit(onValidSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting || forgotMutation.isPending,
    onBeforeBack,
    forgotPasswordFlowStrings,
    loginScreenStrings,
  };
}
