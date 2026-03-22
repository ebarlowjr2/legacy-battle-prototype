import { authHttp, authenticatedHttp } from '@/shared/lib/httpClient';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';
import type {
  ApiResponse,
  BiometricChallengeRequest,
  BiometricChallengeResponseData,
  BiometricEnrollRequest,
  BiometricEnrollResponseData,
  BiometricVerifyRequest,
  BiometricVerifyResponseData,
} from './types';

export async function postBiometricEnroll(
  body: BiometricEnrollRequest,
): Promise<ApiResponse<BiometricEnrollResponseData>> {
  const path = '/auth/biometric/enroll';
  try {
    const res = await authenticatedHttp.post(path, body);
    return parseApiResponse<BiometricEnrollResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postBiometricChallenge(
  body: BiometricChallengeRequest,
): Promise<ApiResponse<BiometricChallengeResponseData>> {
  const path = '/auth/biometric/challenge';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<BiometricChallengeResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function postBiometricVerify(
  body: BiometricVerifyRequest,
): Promise<ApiResponse<BiometricVerifyResponseData>> {
  const path = '/auth/biometric/verify';
  try {
    const res = await authHttp.post(path, body);
    return parseApiResponse<BiometricVerifyResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
