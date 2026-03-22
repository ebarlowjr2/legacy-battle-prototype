import * as SecureStore from 'expo-secure-store';

const PREFIX = '@legacy-battle/biometric/';

/** Single place for biometric-related SecureStore keys. */
export const BIOMETRIC_SECURE_KEYS = {
  biometrics_requested: `${PREFIX}biometrics_requested`,
  biometrics_enrolled: `${PREFIX}biometrics_enrolled`,
  biometric_email: `${PREFIX}biometric_email`,
  biometric_public_key: `${PREFIX}biometric_public_key`,
} as const;

export type BiometricSecureKey = keyof typeof BIOMETRIC_SECURE_KEYS;

export async function getBiometricSecureItem(key: BiometricSecureKey): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(BIOMETRIC_SECURE_KEYS[key]);
  } catch {
    return null;
  }
}

export async function setBiometricSecureItem(key: BiometricSecureKey, value: string): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_SECURE_KEYS[key], value);
}

export async function deleteBiometricSecureItem(key: BiometricSecureKey): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(BIOMETRIC_SECURE_KEYS[key]);
  } catch {
    // ignore
  }
}

export async function clearAllBiometricSecureItems(): Promise<void> {
  await Promise.all(
    (Object.keys(BIOMETRIC_SECURE_KEYS) as BiometricSecureKey[]).map((k) => deleteBiometricSecureItem(k)),
  );
}

export async function getBiometricsRequested(): Promise<boolean> {
  const v = await getBiometricSecureItem('biometrics_requested');
  return v === 'true';
}

export async function setBiometricsRequested(value: boolean): Promise<void> {
  if (value) {
    await setBiometricSecureItem('biometrics_requested', 'true');
  } else {
    await deleteBiometricSecureItem('biometrics_requested');
  }
}

export async function getBiometricsEnrolled(): Promise<boolean> {
  const v = await getBiometricSecureItem('biometrics_enrolled');
  return v === 'true';
}
