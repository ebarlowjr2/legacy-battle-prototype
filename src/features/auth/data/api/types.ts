export type {
  ApiSuccess,
  ApiErrorBody,
  ApiError,
  ApiResponse,
} from '@/shared/types/apiEnvelope';
export type { LoginRequest, LoginResponseData } from '@/shared/types/authLoginApi';

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponseData {
  reference: string;
  email: string;
}

export interface VerifyOtpRequest {
  reference: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponseData {
  sent: boolean;
}

export interface CheckUsernameResponseData {
  message: string;
  available: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface SetUsernameRequest {
  username: string;
  displayName: string;
}

/** Backend may extend this; we only require success envelope handling. */
export type SetUsernameResponseData = Record<string, unknown>;

/** POST /auth/logout — no request body. */
export type LogoutResponseData = Record<string, unknown>;

/** POST /devices — register Expo push token for the current user. */
export interface RegisterDeviceRequest {
  token: string;
  /** Typically `ios` | `android` from `Platform.OS`. */
  type: string;
  /** Human-readable device label (e.g. model name). */
  name: string;
}

export type RegisterDeviceResponseData = Record<string, unknown>;

export type ListDevicesResponseData = unknown[];

/** POST /auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponseData {
  message: string;
  reference: string;
}

/** POST /auth/verify-reset-otp */
export interface VerifyResetOtpRequest {
  otp: string;
  reference: string;
}

export interface VerifyResetOtpResponseData {
  message: string;
  reference: string;
}

/** POST /auth/resend-reset-otp */
export interface ResendResetOtpRequest {
  email: string;
}

export interface ResendResetOtpResponseData {
  message?: string;
  sent?: boolean;
}

/** POST /auth/reset-password */
export interface ResetPasswordRequest {
  reference: string;
  newPassword: string;
}

export interface ResetPasswordResponseData {
  message: string;
  reference: string;
}

/** POST /auth/biometric/enroll (authenticated) */
export interface BiometricEnrollRequest {
  publicKey: string;
  deviceName: string;
  deviceToken: string;
}

export type BiometricEnrollResponseData = Record<string, unknown>;

/** POST /auth/biometric/challenge */
export interface BiometricChallengeRequest {
  email: string;
}

export interface BiometricChallengeResponseData {
  challenge: string;
}

/** POST /auth/biometric/verify */
export interface BiometricVerifyRequest {
  email: string;
  challenge: string;
  signature: string;
  publicKey: string;
}

export interface BiometricVerifyResponseData {
  accessToken: string;
  refreshToken: string;
  hasUsername?: boolean;
}

/** POST /auth/social/google */
export interface GoogleSocialAuthRequest {
  idToken: string;
}

export interface GoogleSocialAuthResponseData {
  accessToken: string;
  refreshToken: string;
  hasUsername: boolean;
}
