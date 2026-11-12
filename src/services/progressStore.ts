import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchProgress {
  id: string;
  // Playback position in seconds.
  position: number;
  // Stream duration in seconds, as reported by the player.
  duration: number;
}

export interface ProgressStore {
  load: () => Promise<WatchProgress[]>;
  // Sync snapshot of the stored entries, most recent first.
  get: () => WatchProgress[];
  // Records a position, most recent first, and returns the updated entries.
  save: (id: string, position: number, duration: number) => WatchProgress[];
  // Finished content drops out of the history.
  clear: (id: string) => WatchProgress[];
}

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

// Persisted playback positions under one storage key. Each kind of content
// (video, audio) gets its own store so one can't push the other out.
export const createProgressStore = (
  storageKey: string,
  maxEntries: number,
): ProgressStore => {
  // Storage is async, so renders read this sync snapshot instead.
  let cache: WatchProgress[] = [];

  const persist = () => {
    AsyncStorage.setItem(storageKey, JSON.stringify(cache)).catch(() => {
      // Storage full or blocked; the in-memory copy still works this session.
    });
  };

  return {
    load: async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        cache = Array.isArray(parsed)
          ? parsed.filter(isWatchProgress).slice(0, maxEntries)
          : [];
      } catch {
        cache = [];
      }
      return cache;
    },
    get: () => cache,
    save: (id, position, duration) => {
      cache = [
        { id, position, duration },
        ...cache.filter(entry => entry.id !== id),
      ].slice(0, maxEntries);
      persist();
      return cache;
    },
    clear: id => {
      cache = cache.filter(entry => entry.id !== id);
      persist();
      return cache;
    },
  };
};
