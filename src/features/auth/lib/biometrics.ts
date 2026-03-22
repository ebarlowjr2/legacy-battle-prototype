import * as Device from 'expo-device';
import ReactNativeBiometrics from 'react-native-biometrics';
import {
  clearAllBiometricSecureItems,
  deleteBiometricSecureItem,
  getBiometricSecureItem,
  setBiometricSecureItem,
} from '@/features/auth/data/biometricSecureStorage';
import {
  postBiometricChallenge,
  postBiometricEnroll,
  postBiometricVerify,
} from '@/features/auth/data/api/biometricApi';

const rnBiometrics = new ReactNativeBiometrics();

/** Hardware keys + all biometric SecureStore keys — call before clearing auth session on logout. */
export async function logout(): Promise<void> {
  try {
    await rnBiometrics.deleteKeys();
  } catch {
    // ignore
  }
  await clearAllBiometricSecureItems();
}

export type BiometricsAvailability = {
  available: boolean;
  biometryType?: string;
};

export async function checkBiometricsAvailable(): Promise<BiometricsAvailability> {
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  return { available, biometryType };
}

/**
 * After password login when user requested biometrics — generates keys, enrolls on server, persists flags.
 */
export async function enrollBiometrics(
  _accessToken: string,
  userEmail: string,
  deviceName: string,
  deviceToken: string,
): Promise<{ ok: boolean }> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      await deleteBiometricSecureItem('biometrics_requested');
      return { ok: false };
    }

    const { publicKey } = await rnBiometrics.createKeys();

    const result = await postBiometricEnroll({
      publicKey,
      deviceName,
      deviceToken: deviceToken || '',
    });

    if (!result.success) {
      await deleteBiometricSecureItem('biometrics_requested');
      return { ok: false };
    }

    await setBiometricSecureItem('biometrics_enrolled', 'true');
    await setBiometricSecureItem('biometric_public_key', publicKey);
    await setBiometricSecureItem('biometric_email', userEmail);
    await deleteBiometricSecureItem('biometrics_requested');
    return { ok: true };
  } catch {
    await deleteBiometricSecureItem('biometrics_requested');
    return { ok: false };
  }
}

/**
 * Challenge → Face ID / Touch ID signature → verify with backend → tokens.
 */
export async function signInWithBiometrics(): Promise<
  | { ok: true; accessToken: string; refreshToken: string; hasUsername: boolean }
  | { ok: false; reason: 'cancelled' | 'error' }
> {
  try {
    const userEmail = await getBiometricSecureItem('biometric_email');
    const savedPublicKey = await getBiometricSecureItem('biometric_public_key');

    if (!userEmail || !savedPublicKey) {
      return { ok: false, reason: 'error' };
    }

    const challengeRes = await postBiometricChallenge({ email: userEmail });
    if (!challengeRes.success) {
      return { ok: false, reason: 'error' };
    }

    const challengeString = challengeRes.data.challenge;

    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: 'Sign in to Legacy Battle',
      payload: challengeString,
    });

    if (!success || !signature) {
      return { ok: false, reason: 'cancelled' };
    }

    const verifyRes = await postBiometricVerify({
      email: userEmail,
      challenge: challengeString,
      signature,
      publicKey: savedPublicKey,
    });

    if (!verifyRes.success) {
      return { ok: false, reason: 'error' };
    }

    const { accessToken, refreshToken, hasUsername } = verifyRes.data;
    return {
      ok: true,
      accessToken,
      refreshToken,
      hasUsername: hasUsername ?? true,
    };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

/** User turns off biometrics in settings — keys + server enrollment cleared locally. */
export async function disableBiometrics(): Promise<void> {
  await rnBiometrics.deleteKeys();
  await deleteBiometricSecureItem('biometrics_enrolled');
  await deleteBiometricSecureItem('biometric_email');
  await deleteBiometricSecureItem('biometric_public_key');
}

/** Default device label for enroll payload. */
export function getDefaultBiometricDeviceName(): string {
  return Device.deviceName ?? Device.modelName ?? 'Unknown device';
}
