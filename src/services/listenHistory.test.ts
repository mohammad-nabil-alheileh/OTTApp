import {
  getListenHistory,
  listenHistoryStore,
  loadListenHistory,
  saveListenProgress,
} from './listenHistory';
import {
  getWatchHistory,
  loadWatchHistory,
  saveProgress,
} from './watchHistory';

const mockStore = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockStore.set(key, value);
    }),
  },
}));

beforeEach(async () => {
  mockStore.clear();
  await loadListenHistory();
  await loadWatchHistory();
});

describe('listenHistory', () => {
  it('saves episode positions most recent first', () => {
    saveListenProgress('ep-1', 30, 300);
    saveListenProgress('ep-2', 45, 300);
    expect(getListenHistory().map(entry => entry.id)).toEqual(['ep-2', 'ep-1']);
  });

  it('is kept apart from video watch history', () => {
    saveListenProgress('ep-1', 30, 300);
    saveProgress('vod-1', 60, 600);
    expect(getListenHistory().map(entry => entry.id)).toEqual(['ep-1']);
    expect(getWatchHistory().map(entry => entry.id)).toEqual(['vod-1']);
  });

  it('does not evict videos when many episodes are played', () => {
    saveProgress('vod-1', 60, 600);
    for (let i = 0; i < 15; i += 1) {
      saveListenProgress(`ep-${i}`, 30, 300);
    }
    expect(getWatchHistory().map(entry => entry.id)).toEqual(['vod-1']);
  });

  it('persists under its own key and reloads', async () => {
    saveListenProgress('ep-1', 30, 300);
    await Promise.resolve();
    expect(JSON.parse(mockStore.get('ott:listenHistory') ?? '[]')).toEqual([
      { id: 'ep-1', position: 30, duration: 300 },
    ]);
    expect(await loadListenHistory()).toEqual([
      { id: 'ep-1', position: 30, duration: 300 },
    ]);
  });

  it('clears finished episodes', () => {
    saveListenProgress('ep-1', 30, 300);
    listenHistoryStore.clear('ep-1');
    expect(getListenHistory()).toEqual([]);
  });
});
