import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const SCOPES = ['profile', 'email'] as const;

export type RequestGoogleIdTokenResult =
  | { ok: true; idToken: string }
  | { ok: false; cancelled: true }
  | { ok: false; cancelled: false; message: string };

/**
 * Runs native Google Sign-In and returns an ID token for `POST /auth/social/google`.
 * Configure via `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (Web client ID from Google Cloud Console).
 */
export async function requestGoogleIdToken(): Promise<RequestGoogleIdTokenResult> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    return {
      ok: false,
      cancelled: false,
      message: 'Google sign-in is not configured.',
    };
  }

  try {
    GoogleSignin.configure({
      webClientId,
      scopes: [...SCOPES],
    });

    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      return { ok: false, cancelled: true };
    }

    const idToken = response.data.idToken;
    if (!idToken) {
      return {
        ok: false,
        cancelled: false,
        message: 'Could not retrieve Google credentials. Try again.',
      };
    }

    return { ok: true, idToken };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Google sign-in failed';
    return { ok: false, cancelled: false, message };
  }
}
