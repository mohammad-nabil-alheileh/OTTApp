import {
  clearProgress,
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
  await loadWatchHistory();
});

describe('watchHistory', () => {
  it('returns empty history when nothing is stored', async () => {
    expect(await loadWatchHistory()).toEqual([]);
  });

  it('saves positions most recent first', () => {
    saveProgress('vod-1', 30, 600);
    saveProgress('vod-2', 45, 600);
    expect(getWatchHistory().map(entry => entry.id)).toEqual(['vod-2', 'vod-1']);
  });

  it('updates an existing entry instead of duplicating it', () => {
    saveProgress('vod-1', 30, 600);
    saveProgress('vod-2', 45, 600);
    saveProgress('vod-1', 90, 600);
    expect(getWatchHistory()).toEqual([
      { id: 'vod-1', position: 90, duration: 600 },
      { id: 'vod-2', position: 45, duration: 600 },
    ]);
  });

  it('keeps at most 10 entries', () => {
    for (let i = 0; i < 12; i++) {
      saveProgress(`vod-${i}`, i, 600);
    }
    const history = getWatchHistory();
    expect(history).toHaveLength(10);
    expect(history[0].id).toBe('vod-11');
    expect(history.some(entry => entry.id === 'vod-0')).toBe(false);
  });

  it('clears finished content', () => {
    saveProgress('vod-1', 30, 600);
    saveProgress('vod-2', 45, 600);
    clearProgress('vod-1');
    expect(getWatchHistory().map(entry => entry.id)).toEqual(['vod-2']);
  });

  it('persists across a reload', async () => {
    saveProgress('vod-1', 125.5, 600);
    expect(await loadWatchHistory()).toEqual([
      { id: 'vod-1', position: 125.5, duration: 600 },
    ]);
  });

  it('drops corrupt entries and legacy id-only history', async () => {
    mockStore.set(
      'ott:watchHistory',
      JSON.stringify([
        'vod-legacy',
        { id: 'vod-ok', position: 10, duration: 600 },
        { id: 'vod-bad', position: -5, duration: 600 },
        { id: 'vod-nan', position: 'NaN', duration: 600 },
        null,
      ]),
    );
    expect(await loadWatchHistory()).toEqual([
      { id: 'vod-ok', position: 10, duration: 600 },
    ]);
  });

  it('survives unparseable storage', async () => {
    mockStore.set('ott:watchHistory', 'not json');
    expect(await loadWatchHistory()).toEqual([]);
  });
});