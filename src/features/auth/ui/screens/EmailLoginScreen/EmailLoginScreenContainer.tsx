import type { EmailLoginScreenProps } from '@/shared/types';
import { useLogin } from '../../hooks/useLogin';
import { EmailLoginScreen } from './EmailLoginScreen';

export default function EmailLoginScreenContainer(props: EmailLoginScreenProps) {
  const login = useLogin();
  return <EmailLoginScreen {...props} {...login} />;
}
