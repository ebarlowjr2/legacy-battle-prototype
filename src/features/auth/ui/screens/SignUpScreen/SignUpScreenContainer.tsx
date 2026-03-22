import type { SignUpScreenProps } from '@/shared/types';
import { useSignup } from '../../hooks/useSignup';
import { SignUpScreen } from './SignUpScreen';

export default function SignUpScreenContainer(props: SignUpScreenProps) {
  const signup = useSignup();
  return <SignUpScreen {...props} {...signup} />;
}
