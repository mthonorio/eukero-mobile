import * as Keychain from 'react-native-keychain';

import type { AuthStorage } from '../types/user.type';

const AUTH_STORAGE_SERVICE = 'com.eukeroapp.auth';

type GetAuthStorageOptions = {
  promptMessage?: string;
};

export async function saveAuthStorage(data: AuthStorage) {
  await Keychain.setGenericPassword(
    AUTH_STORAGE_SERVICE,
    JSON.stringify(data),
    {
      service: AUTH_STORAGE_SERVICE,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  );
}

export async function getAuthStorage(options?: GetAuthStorageOptions) {
  const credentials = await Keychain.getGenericPassword({
    service: AUTH_STORAGE_SERVICE,
    authenticationPrompt: options?.promptMessage
      ? {
          title: options.promptMessage,
          subtitle:
            'Use Face ID, digital ou a senha do dispositivo para continuar.',
        }
      : undefined,
  });

  if (!credentials) {
    return null;
  }

  return JSON.parse(credentials.password) as AuthStorage;
}

export async function removeAuthStorage() {
  await Keychain.resetGenericPassword({
    service: AUTH_STORAGE_SERVICE,
  });
}
