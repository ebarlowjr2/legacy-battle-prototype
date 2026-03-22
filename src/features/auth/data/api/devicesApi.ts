import { useAuthStore } from '../store/auth.store';
import { authenticatedHttp } from '@/shared/lib/httpClient';
import { networkFailure, parseApiResponse } from '@/shared/utils/helpers';

import type {
  ApiResponse,
  ListDevicesResponseData,
  RegisterDeviceRequest,
  RegisterDeviceResponseData,
} from './types';
import { baseURL } from '@/shared/constants';

export async function postRegisterDevice(
  body: RegisterDeviceRequest,
): Promise<ApiResponse<RegisterDeviceResponseData>> {
  const path = '/devices';
  try {
    const res = await authenticatedHttp.post(path, body);
    return parseApiResponse<RegisterDeviceResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

/**
 * Uses `fetch` (not `authenticatedHttp`) so a 401 does not trigger the refresh interceptor
 * while we are tearing down the session in {@link logoutSession}.
 */
export async function deleteRegisteredDevice(pushToken: string): Promise<ApiResponse<RegisterDeviceResponseData>> {
  const encoded = encodeURIComponent(pushToken);
  const path = `/devices/${encoded}`;
  const accessToken = useAuthStore.getState().accessToken?.trim();
  try {
    const res = await fetch(`${baseURL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
    let data: object | null = null;
    try {
      data = (await res.json()) as object;
    } catch {
      data = {};
    }
    return parseApiResponse<RegisterDeviceResponseData>(path, res.status, data ?? {});
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}

export async function getRegisteredDevices(): Promise<ApiResponse<ListDevicesResponseData>> {
  const path = '/devices';
  try {
    const res = await authenticatedHttp.get(path);
    return parseApiResponse<ListDevicesResponseData>(path, res.status, res.data as object);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return networkFailure(path, message);
  }
}
