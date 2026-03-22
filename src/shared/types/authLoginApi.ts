/**
 * Sign-in request body for `/auth/signin`.
 * Used by {@link normalizeLoginResponse} when mapping pending-verification responses.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Normalized sign-in success payload after {@link normalizeLoginResponse}.
 * Matches the union the app uses for routing (OTP vs main app vs username flow).
 */
export type LoginResponseData =
  | { outcome: 'AUTHENTICATED'; accessToken: string; refreshToken: string; hasUsername: boolean }
  | { outcome: 'PENDING_VERIFICATION'; reference: string; email: string };
