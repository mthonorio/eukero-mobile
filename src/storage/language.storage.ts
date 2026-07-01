import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@eukero:settings:language';

export type LanguageCode = 'pt-BR' | 'en-US' | 'es';

export const DEFAULT_LANGUAGE: LanguageCode = 'pt-BR';

export async function saveLanguagePreference(code: LanguageCode) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
}

export async function getLanguagePreference(): Promise<LanguageCode> {
  const storage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return (storage as LanguageCode) ?? DEFAULT_LANGUAGE;
}
