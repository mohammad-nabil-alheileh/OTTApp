import {
  clearSearchHistory,
  getSearchHistory,
  loadSearchHistory,
  rememberSearch,
} from './searchHistory';

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
  await loadSearchHistory();
});

describe('search history', () => {
  it('returns no history when nothing is stored', async () => {
    expect(await loadSearchHistory()).toEqual([]);
  });

  it('keeps the newest search first', () => {
    rememberSearch('tears');
    rememberSearch('bunny');
    expect(getSearchHistory()).toEqual(['bunny', 'tears']);
  });

  it('trims whitespace and ignores blank queries', () => {
    rememberSearch('  tears of steel  ');
    rememberSearch('   ');
    expect(getSearchHistory()).toEqual(['tears of steel']);
  });

  it('moves a repeated search to the front instead of duplicating it', () => {
    rememberSearch('tears');
    rememberSearch('bunny');
    rememberSearch('TEARS');
    expect(getSearchHistory()).toEqual(['TEARS', 'bunny']);
  });

  it('restores history from storage', async () => {
    rememberSearch('tears');
    rememberSearch('bunny');
    expect(await loadSearchHistory()).toEqual(['bunny', 'tears']);
  });

  it('ignores malformed stored data', async () => {
    mockStore.set('ott:searchHistory', JSON.stringify(['tears', 42, null, '']));
    expect(await loadSearchHistory()).toEqual(['tears']);
  });

  it('keeps at most 10 entries', () => {
    for (let i = 0; i < 14; i++) {
      rememberSearch(`query ${i}`);
    }
    const history = getSearchHistory();
    expect(history).toHaveLength(10);
    expect(history[0]).toBe('query 13');
    expect(history).not.toContain('query 0');
  });

  it('clears every entry', () => {
    rememberSearch('tears');
    expect(clearSearchHistory()).toEqual([]);
    expect(getSearchHistory()).toEqual([]);
  });
});
