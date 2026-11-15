import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ott:searchHistory';
const MAX_ENTRIES = 10;

// Storage is async, so renders read this sync snapshot instead.
let cache: string[] = [];

const normalize = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export const loadSearchHistory = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? parsed
          .map(normalize)
          .filter(query => query.length > 0)
          .slice(0, MAX_ENTRIES)
      : [];
  } catch {
    cache = [];
  }
  return cache;
};

export const getSearchHistory = (): string[] => cache;

const persist = () => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache)).catch(() => {
    // Storage full or blocked; the in-memory copy still works this session.
  });
};

// Newest first, deduped case-insensitively so re-running a search moves it up
// instead of adding a second copy of the same words.
export const rememberSearch = (query: string): string[] => {
  const trimmed = query.trim();
  if (!trimmed) {
    return cache;
  }
  const key = trimmed.toLowerCase();
  cache = [
    trimmed,
    ...cache.filter(entry => entry.toLowerCase() !== key),
  ].slice(0, MAX_ENTRIES);
  persist();
  return cache;
};

export const clearSearchHistory = (): string[] => {
  cache = [];
  persist();
  return cache;
};
