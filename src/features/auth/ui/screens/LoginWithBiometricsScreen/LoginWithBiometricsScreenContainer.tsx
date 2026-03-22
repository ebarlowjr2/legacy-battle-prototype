import type { LoginWithBiometricsScreenProps } from '@/shared/types';
import { useLoginWithBiometrics } from '../../hooks/useLoginWithBiometrics';
import { LoginWithBiometricsScreen } from './LoginWithBiometricsScreen';

export default function LoginWithBiometricsScreenContainer(props: LoginWithBiometricsScreenProps) {
  const hook = useLoginWithBiometrics();
  return <LoginWithBiometricsScreen {...props} {...hook} />;
}
