import type { OTPVerificationScreenProps } from '@/shared/types';
import { useOtpVerification } from '../../hooks/useOtpVerification';
import { OTPVerificationScreen } from './OTPVerificationScreen';

export default function OTPVerificationScreenContainer(props: OTPVerificationScreenProps) {
  const otp = useOtpVerification();
  return <OTPVerificationScreen {...props} {...otp} />;
}
