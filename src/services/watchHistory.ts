import { createProgressStore } from './progressStore';

export type { WatchProgress } from './progressStore';

// Video positions for Continue Watching.
export const watchHistoryStore = createProgressStore('ott:watchHistory', 10);

export const loadWatchHistory = watchHistoryStore.load;
export const getWatchHistory = watchHistoryStore.get;
export const saveProgress = watchHistoryStore.save;
export const clearProgress = watchHistoryStore.clear;
