const STORAGE_KEY = 'ott:watchHistory';
const MAX_ENTRIES = 10;

// In-memory fallback for platforms without localStorage (native TV).
// History then lasts for the app session only.
let memoryHistory: string[] = [];

const hasLocalStorage = (): boolean => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

export const getWatchHistory = (): string[] => {
  if (!hasLocalStorage()) {
    return [...memoryHistory];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

// Records a view, most recent first, and returns the updated history.
export const recordWatch = (id: string): string[] => {
  const history = [id, ...getWatchHistory().filter(existing => existing !== id)].slice(
    0,
    MAX_ENTRIES,
  );
  memoryHistory = history;
  if (hasLocalStorage()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage full or blocked; in-memory copy still works.
    }
  }
  return history;
};
