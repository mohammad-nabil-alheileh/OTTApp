import { createProgressStore } from './progressStore';

// Podcast episode positions for Continue Listening, kept apart from video
// history so episodes never push videos out of Continue Watching.
export const listenHistoryStore = createProgressStore('ott:listenHistory', 20);

export const loadListenHistory = listenHistoryStore.load;
export const getListenHistory = listenHistoryStore.get;
export const saveListenProgress = listenHistoryStore.save;
