import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { postRegisterDevice } from '@/features/auth/data/api/devicesApi';
import {
  registerForPushNotificationsAsync,
  setupAndroidNotificationChannel,
  setupNotificationHandler,
} from '@/shared/lib/pushNotifications';

/**
 * Configures Expo notification presentation, ensures the Android default channel exists,
 * and registers the device push token with `POST /devices` when the user is fully signed in.
 */
export const PushNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const needsUsername = useAuthStore((s) => s.needsUsername);
  const setExpoPushToken = useAuthStore((s) => s.setExpoPushToken);

  useEffect(() => {
    setupNotificationHandler();
    void setupAndroidNotificationChannel();
  }, []);

  useEffect(() => {
    if (!accessToken || !isAuthenticated || needsUsername) {
      return;
    }

    let cancelled = false;

    const register = async () => {
      const token = await registerForPushNotificationsAsync();
      if (cancelled || !token) return;

      const name = Device.modelName ?? Device.deviceName ?? 'Unknown Device';
      const result = await postRegisterDevice({
        token,
        type: Platform.OS,
        name,
      });

      if (cancelled) return;

      if (result.success) {
        setExpoPushToken(token);
      }
    };

    void register();

    return () => {
      cancelled = true;
    };
  }, [accessToken, isAuthenticated, needsUsername, setExpoPushToken]);

  return <>{children}</>;
};
