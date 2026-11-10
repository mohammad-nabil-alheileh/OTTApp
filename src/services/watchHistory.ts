import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchProgress {
  id: string;
  // Playback position in seconds.
  position: number;
  // Stream duration in seconds, as reported by the player.
  duration: number;
}

const STORAGE_KEY = 'ott:watchHistory';
const MAX_ENTRIES = 10;

// Storage is async, so renders read this sync snapshot instead.
let cache: WatchProgress[] = [];

const isWatchProgress = (value: unknown): value is WatchProgress => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.position === 'number' &&
    Number.isFinite(entry.position) &&
    entry.position >= 0 &&
    typeof entry.duration === 'number' &&
    Number.isFinite(entry.duration) &&
    entry.duration > 0
  );
};

export const loadWatchHistory = async (): Promise<WatchProgress[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? parsed.filter(isWatchProgress).slice(0, MAX_ENTRIES)
      : [];
  } catch {
    cache = [];
  }
  return cache;
};

export const getWatchHistory = (): WatchProgress[] => cache;

const persist = () => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache)).catch(() => {
    // Storage full or blocked; the in-memory copy still works this session.
  });
};

// Records a position, most recent first, and returns the updated history.
export const saveProgress = (
  id: string,
  position: number,
  duration: number,
): WatchProgress[] => {
  cache = [
    { id, position, duration },
    ...cache.filter(entry => entry.id !== id),
  ].slice(0, MAX_ENTRIES);
  persist();
  return cache;
};

// Finished content drops out of Continue Watching.
export const clearProgress = (id: string): WatchProgress[] => {
  cache = cache.filter(entry => entry.id !== id);
  persist();
  return cache;
};