import { postLogout } from './api/authApi';
import { deleteRegisteredDevice } from './api/devicesApi';
import { logout as logoutBiometrics } from '../lib/biometrics';
import { useAuthStore } from './store/auth.store';

/**
 * Unregisters push (while the access token is still valid), notifies `POST /auth/logout`,
 * wipes biometric keys and SecureStore flags, then clears local auth state.
 */
export async function logoutSession(): Promise<void> {
  const { expoPushToken, accessToken } = useAuthStore.getState();

  if (accessToken && expoPushToken) {
    try {
      await deleteRegisteredDevice(expoPushToken);
    } catch {
      // Still sign out locally if unregister fails (network, etc.).
    }
  }

  if (accessToken) {
    try {
      await postLogout();
    } catch {
      // Still clear local session if the server call fails.
    }
  }

  await logoutBiometrics();
  useAuthStore.getState().logout();
}
