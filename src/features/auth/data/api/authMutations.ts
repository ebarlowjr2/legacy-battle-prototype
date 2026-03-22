import { useMutation } from '@tanstack/react-query';
import {
  postForgotPassword,
  postLogin,
  postRefreshToken,
  postResendOtp,
  postResendResetOtp,
  postResetPassword,
  postSignup,
  postVerifyOtp,
  postVerifyResetOtp,
} from './authApi';
import { postGoogleSocialAuth } from './googleSocialAuthApi';
import type {
  ApiResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponseData,
  GoogleSocialAuthRequest,
  GoogleSocialAuthResponseData,
  LoginRequest,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ResendOtpRequest,
  ResendOtpResponseData,
  ResendResetOtpRequest,
  ResendResetOtpResponseData,
  ResetPasswordRequest,
  ResetPasswordResponseData,
  SignupRequest,
  SignupResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
  VerifyResetOtpRequest,
  VerifyResetOtpResponseData,
} from './types';

export function useLoginMutation() {
  return useMutation<ApiResponse<LoginResponseData>, Error, LoginRequest>({
    mutationFn: (payload: LoginRequest) => postLogin(payload),
  });
}

export function useGoogleSocialAuthMutation() {
  return useMutation<
    ApiResponse<GoogleSocialAuthResponseData>,
    Error,
    GoogleSocialAuthRequest
  >({
    mutationFn: (payload: GoogleSocialAuthRequest) => postGoogleSocialAuth(payload),
  });
}

export function useSignupMutation() {
  return useMutation<ApiResponse<SignupResponseData>, Error, SignupRequest>({
    mutationFn: (payload: SignupRequest) => postSignup(payload),
  });
}

export function useVerifyOtpMutation() {
  return useMutation<ApiResponse<VerifyOtpResponseData>, Error, VerifyOtpRequest>({
    mutationFn: (payload: VerifyOtpRequest) => postVerifyOtp(payload),
  });
}

export function useResendOtpMutation() {
  return useMutation<ApiResponse<ResendOtpResponseData>, Error, ResendOtpRequest>({
    mutationFn: (payload: ResendOtpRequest) => postResendOtp(payload),
  });
}

export function useRefreshTokenMutation() {
  return useMutation<ApiResponse<RefreshTokenResponseData>, Error, RefreshTokenRequest>({
    mutationFn: (payload: RefreshTokenRequest) => postRefreshToken(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation<ApiResponse<ForgotPasswordResponseData>, Error, ForgotPasswordRequest>({
    mutationFn: (payload: ForgotPasswordRequest) => postForgotPassword(payload),
  });
}

export function useVerifyResetOtpMutation() {
  return useMutation<ApiResponse<VerifyResetOtpResponseData>, Error, VerifyResetOtpRequest>({
    mutationFn: (payload: VerifyResetOtpRequest) => postVerifyResetOtp(payload),
  });
}

export function useResendResetOtpMutation() {
  return useMutation<ApiResponse<ResendResetOtpResponseData>, Error, ResendResetOtpRequest>({
    mutationFn: (payload: ResendResetOtpRequest) => postResendResetOtp(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation<ApiResponse<ResetPasswordResponseData>, Error, ResetPasswordRequest>({
    mutationFn: (payload: ResetPasswordRequest) => postResetPassword(payload),
  });
}
