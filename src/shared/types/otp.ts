import type { MutableRefObject } from 'react';
import type { TextInput } from 'react-native';
import type { ReactNode } from 'react';

export interface OTPInputProps {
  length: number;
  label?: string;
  onComplete: (otp: string) => void;
  onChange?: (otp: string) => void;
  errors?: ReactNode;
  autoFocus?: boolean;
  disabled?: boolean;
  testID?: string;
}

export interface UseOTPInputOptions {
  length: number;
  onComplete: (otp: string) => void;
  onChange?: (otp: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export interface UseOTPInputReturn {
  otp: string[];
  inputRefs: MutableRefObject<Array<TextInput | null>>;
  handleChange: (text: string, index: number) => void;
  handleKeyPress: (key: string, index: number) => void;
  handleFocus: (index: number) => Promise<void>;
}
