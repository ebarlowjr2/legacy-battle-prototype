import type { ResetPasswordScreenProps } from '@/shared/types';
import { useResetPassword } from '../../hooks/useResetPassword';
import { ResetPasswordScreen } from './ResetPasswordScreen';

export default function ResetPasswordScreenContainer(props: ResetPasswordScreenProps) {
  const resetPassword = useResetPassword();
  return <ResetPasswordScreen {...props} {...resetPassword} />;
}
