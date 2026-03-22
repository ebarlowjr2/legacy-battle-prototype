import { authHttp, authenticatedHttp } from '@/shared/lib/httpClient';
import {
  normalizeCheckUsernameData,
  normalizeLoginResponse,
  networkFailure,
  parseApiResponse,
} from '@/shared/utils/helpers';
import type {
  ApiResponse,
  CheckUsernameResponseData,
  LoginRequest,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ResendOtpRequest,
  ResendOtpResponseData,
  SignupRequest,
  SignupResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
  SetUsernameRequest,
  SetUsernameResponseData,
  LogoutResponseData,
  ForgotPasswordRequest,
  ForgotPasswordResponseData,
  VerifyResetOtpRequest,
  VerifyResetOtpResponseData,
  ResendResetOtpRequest,
  ResendResetOtpResponseData,
  ResetPasswordRequest,
  ResetPasswordResponseData,
} from './types';

export async function postLogin(body: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
  const path = '/auth/signin';
  try {
    const res = await authHttp.post(path, body);
    const parsed = parseApiResponse<LoginResponseData>(path, res.status, res.data as object);
    return normalizeLoginResponse(body, parsed);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postSignup(body: SignupRequest): Promise<ApiResponse<SignupResponseData>> {
  const path = '/auth/signup';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<SignupResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postVerifyOtp(body: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponseData>> {
  const path = '/auth/verify-otp';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<VerifyOtpResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postResendOtp(body: ResendOtpRequest): Promise<ApiResponse<ResendOtpResponseData>> {
  const path = '/auth/resend-otp';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<ResendOtpResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postRefreshToken(
  body: RefreshTokenRequest,
): Promise<ApiResponse<RefreshTokenResponseData>> {
  const path = '/auth/refresh';
  try {
    /** Bearer access token is required; `authenticatedHttp` attaches it from the store. */
    const res = await authenticatedHttp.post(path, body);
    return parseApiResponse<RefreshTokenResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postSetUsername(
  body: SetUsernameRequest,
): Promise<ApiResponse<SetUsernameResponseData>> {
  const path = '/auth/set-username';
  try {
    const res = await authenticatedHttp.post(path, body);
    return parseApiResponse<SetUsernameResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postForgotPassword(
  body: ForgotPasswordRequest,
): Promise<ApiResponse<ForgotPasswordResponseData>> {
  const path = '/auth/forgot-password';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<ForgotPasswordResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postVerifyResetOtp(
  body: VerifyResetOtpRequest,
): Promise<ApiResponse<VerifyResetOtpResponseData>> {
  const path = '/auth/verify-reset-otp';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<VerifyResetOtpResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postResendResetOtp(
  body: ResendResetOtpRequest,
): Promise<ApiResponse<ResendResetOtpResponseData>> {
  const path = '/auth/resend-reset-otp';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<ResendResetOtpResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postResetPassword(
  body: ResetPasswordRequest,
): Promise<ApiResponse<ResetPasswordResponseData>> {
  const path = '/auth/reset-password';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<ResetPasswordResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postLogout(): Promise<ApiResponse<LogoutResponseData>> {
  const path = '/auth/logout';
  try {
    const res = await authenticatedHttp.post(path);
    const body = res.data != null && typeof res.data === 'object' ? (res.data as object) : {};
    return parseApiResponse<LogoutResponseData>(path, res.status, body);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getCheckUsername(
  username: string,
): Promise<ApiResponse<CheckUsernameResponseData>> {
  const path = `/auth/check-username?username=${encodeURIComponent(username)}`;
  try {
    const res = await authenticatedHttp.get(path);
    const parsed = parseApiResponse<Record<string, unknown>>(path, res.status, res.data as object);
    if (!parsed.success) {
      return parsed;
    }

    return {
      success: true,
      data: normalizeCheckUsernameData(parsed.data as Record<string, unknown>),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
