import type { RefObject } from 'react';
import type { TextInput } from 'react-native';
import type { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import {
  createUsernameScreenStrings,
  forgotPasswordFlowStrings,
  loginScreenStrings,
  otpVerificationScreenStrings,
  signUpScreenStrings,
} from '../../string';
import type {
  BiometricPasswordLoginFormValues,
  CreateUsernameFormValues,
  ForgotPasswordFormValues,
  LoginFormValues,
  OtpFormValues,
  ResetPasswordFormValues,
  SignUpFormValues,
} from './validations';

export type UseLoginReturn = {
  control: Control<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<LoginFormValues>>;
  errors: FieldErrors<LoginFormValues>;
  isValid: boolean;
  /** Email/password login in flight. */
  isSubmitting: boolean;
  /** Google Sign-In SDK + backend call in flight. */
  isGoogleLoading: boolean;
  onBeforeBack: () => void;
  onGooglePress: () => Promise<void>;
  onFooterLinkPress: () => void;
  onForgotPasswordPress: () => void;
  biometricsEnabled: boolean;
  onBiometricsToggle: (enabled: boolean) => void;
  loginScreenStrings: typeof loginScreenStrings;
  signUpScreenStrings: typeof signUpScreenStrings;
};

export type UseLoginWithBiometricsReturn = {
  passwordRef: RefObject<TextInput | null>;
  displayName: string;
  accountEmail: string | null;
  control: Control<BiometricPasswordLoginFormValues>;
  handleSubmit: UseFormHandleSubmit<BiometricPasswordLoginFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<BiometricPasswordLoginFormValues>>;
  errors: FieldErrors<BiometricPasswordLoginFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  biometricBusy: boolean;
  onBiometricLoginPress: () => void;
  onUsePasswordInstead: () => void;
  loginScreenStrings: typeof loginScreenStrings;
};

export type UseSignupReturn = {
  control: Control<SignUpFormValues>;
  handleSubmit: UseFormHandleSubmit<SignUpFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<SignUpFormValues>>;
  errors: FieldErrors<SignUpFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onGooglePress: () => void;
  onFooterLinkPress: () => void;
  loginScreenStrings: typeof loginScreenStrings;
  signUpScreenStrings: typeof signUpScreenStrings;
};

export type UseOtpVerificationReturn = {
  control: Control<OtpFormValues>;
  handleSubmit: UseFormHandleSubmit<OtpFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<OtpFormValues>>;
  errors: FieldErrors<OtpFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onResend: () => Promise<void>;
  resendDisabled: boolean;
  cooldownSec: number;
  displayEmail: string;
  onCodeChange: (code: string) => void;
  loginScreenStrings: typeof loginScreenStrings;
  otpVerificationScreenStrings: typeof otpVerificationScreenStrings;
};

export type UseCreateUsernameReturn = {
  control: Control<CreateUsernameFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateUsernameFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<CreateUsernameFormValues>>;
  errors: FieldErrors<CreateUsernameFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  isCheckingUsername: boolean;
  isUsernameAvailable: boolean;
  usernameStatusMessage: string;
  onBackPress: () => void;
  createUsernameScreenStrings: typeof createUsernameScreenStrings;
  loginScreenStrings: typeof loginScreenStrings;
};

export type UseForgotPasswordReturn = {
  control: Control<ForgotPasswordFormValues>;
  handleSubmit: UseFormHandleSubmit<ForgotPasswordFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<ForgotPasswordFormValues>>;
  errors: FieldErrors<ForgotPasswordFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onBeforeBack: () => void;
  forgotPasswordFlowStrings: typeof forgotPasswordFlowStrings;
  loginScreenStrings: typeof loginScreenStrings;
};

export type UseVerifyResetOtpReturn = {
  control: Control<OtpFormValues>;
  handleSubmit: UseFormHandleSubmit<OtpFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<OtpFormValues>>;
  errors: FieldErrors<OtpFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  onResend: () => Promise<void>;
  resendDisabled: boolean;
  cooldownSec: number;
  displayEmail: string;
  onCodeChange: (next: string) => void;
  forgotPasswordFlowStrings: typeof forgotPasswordFlowStrings;
  loginScreenStrings: typeof loginScreenStrings;
};

export type UseResetPasswordReturn = {
  control: Control<ResetPasswordFormValues>;
  handleSubmit: UseFormHandleSubmit<ResetPasswordFormValues>;
  onSubmit: ReturnType<UseFormHandleSubmit<ResetPasswordFormValues>>;
  errors: FieldErrors<ResetPasswordFormValues>;
  isValid: boolean;
  isSubmitting: boolean;
  forgotPasswordFlowStrings: typeof forgotPasswordFlowStrings;
  loginScreenStrings: typeof loginScreenStrings;
};
