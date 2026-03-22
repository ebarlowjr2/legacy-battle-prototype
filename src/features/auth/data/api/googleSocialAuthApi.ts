import { authHttp } from '@/shared/lib/httpClient';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';
import type { ApiResponse, GoogleSocialAuthRequest, GoogleSocialAuthResponseData } from './types';

export async function postGoogleSocialAuth(
  body: GoogleSocialAuthRequest,
): Promise<ApiResponse<GoogleSocialAuthResponseData>> {
  const path = '/auth/social/google';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<GoogleSocialAuthResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
