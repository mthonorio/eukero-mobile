import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@eukero:auth';

type AuthStorage = {
  user: any;
  token: string;
  refreshToken: string;
};

export async function saveAuthStorage(data: AuthStorage) {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export async function getAuthStorage() {
  const storage = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!storage) {
    return null;
  }

  return JSON.parse(storage);
}

export async function removeAuthStorage() {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}
