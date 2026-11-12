import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ott:boldText';

// Storage is async, so the provider seeds from this sync snapshot instead.
let cache: boolean | null = null;

export const loadBoldTextPreference = async (): Promise<boolean | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw === 'true' ? true : raw === 'false' ? false : null;
  } catch {
    cache = null;
  }
  return cache;
};

export const getBoldTextPreference = (): boolean | null => cache;

export const saveBoldTextPreference = (enabled: boolean): void => {
  cache = enabled;
  AsyncStorage.setItem(STORAGE_KEY, String(enabled)).catch(() => {
    // Storage full or blocked; the in-memory copy still works this session.
  });
};
