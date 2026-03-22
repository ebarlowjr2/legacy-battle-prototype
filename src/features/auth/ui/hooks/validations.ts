import * as yup from 'yup';
import { OTP_LENGTH } from '@/shared/constants';

/** Same rules as sign-up; reused by reset-password flow. */
export const passwordRules = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Za-z]/, 'Password must contain at least one letter')
  .matches(/\d/, 'Password must contain at least one number');

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const biometricPasswordLoginSchema = yup.object({
  password: yup.string().required('Password is required'),
});

export type BiometricPasswordLoginFormValues = yup.InferType<typeof biometricPasswordLoginSchema>;

export const signUpSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: passwordRules,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('Code is required')
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`),
});

export type OtpFormValues = yup.InferType<typeof otpSchema>;

export const createUsernameSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .transform((val) => (typeof val === 'string' ? val.trim() : val))
    .min(3, 'Username must be at least 3 characters'),
});

export type CreateUsernameFormValues = yup.InferType<typeof createUsernameSchema>;

export const forgotPasswordEmailSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordEmailSchema>;

export const resetPasswordSchema = yup.object({
  password: passwordRules,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;
