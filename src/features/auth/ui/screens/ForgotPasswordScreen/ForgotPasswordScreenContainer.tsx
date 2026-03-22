import type { ForgotPasswordScreenProps } from '@/shared/types';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';

export default function ForgotPasswordScreenContainer(props: ForgotPasswordScreenProps) {
  const forgotPassword = useForgotPassword();
  return <ForgotPasswordScreen {...props} {...forgotPassword} />;
}
