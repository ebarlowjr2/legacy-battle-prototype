import type { VerifyResetOTPScreenProps } from '@/shared/types';
import { useVerifyResetOtp } from '../../hooks/useVerifyResetOtp';
import { VerifyResetOTPScreen } from './VerifyResetOTPScreen';

export default function VerifyResetOTPScreenContainer(props: VerifyResetOTPScreenProps) {
  const verifyResetOtp = useVerifyResetOtp();
  return <VerifyResetOTPScreen {...props} {...verifyResetOtp} />;
}
