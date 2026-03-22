import type { ApiError, ApiResponse } from '@/shared/types/apiEnvelope';
import type { LoginRequest, LoginResponseData } from '@/shared/types/authLoginApi';
import { NormalizedCheckUsername } from '../types/ui';

/**
 * Extracts up to `maxDigits` numeric characters from an arbitrary string.
 */
export const extractOTPDigits = (value: string, maxDigits: number): string[] =>
  (value.match(/\d/g) ?? []).slice(0, maxDigits);

/**
 * Returns true only when every slot is filled with a single digit.
 */
export const isOTPComplete = (slots: string[]): boolean =>
  slots.every((s) => s.length === 1);

/**
 * Reads numeric digits from the clipboard.
 * Returns an empty array if clipboard is empty, inaccessible, or contains no digits.
 */
export const getOTPFromClipboard = async (length: number): Promise<string[]> => {
  try {
    const { hasStringAsync, getStringAsync } = await import("expo-clipboard");

    const hasContent = await hasStringAsync();
    if (!hasContent) return [];

    const content = await getStringAsync();
    return extractOTPDigits(content, length);
  } catch {
    return [];
  }
};

/**
 * Canonical username for API checks and set-username: lowercase, runs of whitespace → single `_`, trimmed.
 *
 * @example "The Legend Killer" → "the_legend_killer"
 */
export function formatUsernameForApi(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/** Formats seconds as `M:SS` (e.g. countdown timers). */
export function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Maps the inner `data` object from a successful check-username API response into a stable
 * `{ available, message }` shape for screens and hooks.
 *
 * Supported input shapes include:
 * - `{ available: boolean }` (no `message`) — common success payload.
 * - `{ available: boolean, message: string }` — when the backend sends a custom message.
 * - Legacy: `isAvailable: true` if `available` is not a boolean.
 *
 * When `message` is missing or empty, a short default English string is used based on `available`.
 *
 * @param data - Raw `data` field from the API envelope (`{ success: true, data: { ... } }`).
 * @returns Normalized availability flag and user-facing message.
 */
export function normalizeCheckUsernameData(data: Record<string, unknown>): NormalizedCheckUsername {
  const available =
    typeof data.available === 'boolean'
      ? data.available
      : data.isAvailable === true;

  const fromApi = data.message;
  if (typeof fromApi === 'string' && fromApi.length > 0) {
    return { available, message: fromApi };
  }

  return {
    available,
    message: available ? 'Username is available' : 'Username is not available',
  };
}

/**
 * Parses a JSON body from an HTTP response into the app's standard `{ success, data | error }` envelope.
 * When the body is missing or not a valid envelope, returns a synthetic failure with HTTP `status`.
 *
 * @param path - Request path (stored on the error object for debugging).
 * @param status - HTTP status code from the transport layer.
 * @param body - Parsed JSON body (often `response.data` from axios).
 */
export function parseApiResponse<T>(
  path: string,
  status: number,
  body: object | null | undefined,
): ApiResponse<T> {
  if (body !== null && body !== undefined && typeof body === 'object' && 'success' in body) {
    const r = body as ApiResponse<T>;
    if (r.success === true) {
      return r;
    }
    if (r.success === false && 'error' in r) {
      return r;
    }
  }
  return {
    success: false,
    error: {
      statusCode: status,
      message: 'Invalid response from server',
      timestamp: new Date().toISOString(),
      path,
    },
  };
}

/**
 * Builds a failure envelope when the request fails before a normal HTTP envelope is returned
 * (e.g. network error, timeout, thrown exception).
 *
 * @param path - Request path (stored on the error object).
 * @param message - Human-readable error message (often `error.message`).
 */
export function networkFailure(path: string, message: string): ApiError {
  return {
    success: false,
    error: {
      statusCode: 0,
      message,
      timestamp: new Date().toISOString(),
      path,
    },
  };
}

/**
 * Normalizes a successful sign-in API `data` payload into the `LoginResponseData` union used by the app.
 *
 * Handles:
 * - Pending verification: `outcome` or `status` === `PENDING_VERIFICATION`, plus `reference` / `email`.
 * - Authenticated: tokens + optional `hasUsername` (defaults to `true` if omitted).
 * - Bare `accessToken` + `refreshToken` without `outcome` (treated as authenticated).
 *
 * @param body - Original login request (used for email when the API omits it on pending flows).
 * @param parsed - Result of {@link parseApiResponse} for the same response; error envelopes are returned unchanged.
 */
export function normalizeLoginResponse(
  body: LoginRequest,
  parsed: ApiResponse<LoginResponseData>,
): ApiResponse<LoginResponseData> {
  if (!parsed.success) {
    return parsed;
  }

  const d = parsed.data as Record<string, unknown>;

  const pendingByOutcome = d.outcome === 'PENDING_VERIFICATION';
  const pendingByStatus = d.status === 'PENDING_VERIFICATION';

  if (pendingByOutcome || pendingByStatus) {
    const reference = typeof d.reference === 'string' ? d.reference : '';
    const emailFromApi = typeof d.email === 'string' && d.email.length > 0 ? d.email : body.email;
    return {
      success: true,
      data: {
        outcome: 'PENDING_VERIFICATION',
        reference,
        email: emailFromApi,
      },
    };
  }
  if (d.outcome === 'AUTHENTICATED') {
    if (typeof d.accessToken !== 'string' || typeof d.refreshToken !== 'string') {
      return parsed;
    }
    const hasUsername =
      typeof d.hasUsername === 'boolean'
        ? d.hasUsername
        : true;
    return {
      success: true,
      data: {
        outcome: 'AUTHENTICATED',
        accessToken: d.accessToken,
        refreshToken: d.refreshToken,
        hasUsername,
      },
    };
  }

  if (typeof d.accessToken === 'string' && typeof d.refreshToken === 'string') {
    const hasUsername =
      typeof d.hasUsername === 'boolean'
        ? d.hasUsername
        : true;
    return {
      success: true,
      data: {
        outcome: 'AUTHENTICATED',
        accessToken: d.accessToken,
        refreshToken: d.refreshToken,
        hasUsername,
      },
    };
  }

  return parsed;
}
