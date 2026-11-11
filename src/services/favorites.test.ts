import { getFavorites, loadFavorites, toggleFavorite } from './favorites';

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
  await loadFavorites();
});

describe('favorites', () => {
  it('returns no favorites when nothing is stored', async () => {
    expect(await loadFavorites()).toEqual([]);
  });

  it('adds an item first and removes it on a second toggle', () => {
    toggleFavorite('vod-1');
    expect(getFavorites()).toEqual(['vod-1']);

    toggleFavorite('vod-1');
    expect(getFavorites()).toEqual([]);
  });

  it('keeps the most recently added item first', () => {
    toggleFavorite('vod-1');
    toggleFavorite('vod-2');
    expect(getFavorites()).toEqual(['vod-2', 'vod-1']);
  });

  it('restores favorites from storage', async () => {
    toggleFavorite('vod-1');
    toggleFavorite('vod-2');
    expect(await loadFavorites()).toEqual(['vod-2', 'vod-1']);
  });

  it('ignores malformed stored data', async () => {
    mockStore.set('ott:favorites', JSON.stringify(['vod-1', 42, null, '']));
    expect(await loadFavorites()).toEqual(['vod-1']);
  });

  it('keeps at most 20 entries', () => {
    for (let i = 0; i < 24; i++) {
      toggleFavorite(`vod-${i}`);
    }
    const favorites = getFavorites();
    expect(favorites).toHaveLength(20);
    expect(favorites[0]).toBe('vod-23');
    expect(favorites).not.toContain('vod-0');
  });
});
