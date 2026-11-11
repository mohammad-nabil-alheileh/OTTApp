import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ott:favorites';
const MAX_ENTRIES = 20;

// Storage is async, so renders read this sync snapshot instead.
let cache: string[] = [];

const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

export const loadFavorites = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? parsed.filter(isId).slice(0, MAX_ENTRIES)
      : [];
  } catch {
    cache = [];
  }
  return cache;
};

export const getFavorites = (): string[] => cache;

const persist = () => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache)).catch(() => {
    // Storage full or blocked; the in-memory copy still works this session.
  });
};

export const isFavorite = (id: string): boolean => cache.includes(id);

// Adding puts the item first; toggling an existing item removes it.
export const toggleFavorite = (id: string): string[] => {
  cache = isFavorite(id)
    ? cache.filter(entry => entry !== id)
    : [id, ...cache].slice(0, MAX_ENTRIES);
  persist();
  return cache;
};
