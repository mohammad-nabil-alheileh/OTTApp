import {
  getBoldTextPreference,
  loadBoldTextPreference,
  saveBoldTextPreference,
} from './boldText';

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
  await loadBoldTextPreference();
});

describe('bold text preference', () => {
  it('has no preference when nothing is stored', async () => {
    expect(getBoldTextPreference()).toBeNull();
    expect(await loadBoldTextPreference()).toBeNull();
  });

  it('saves and restores an enabled preference', async () => {
    saveBoldTextPreference(true);
    expect(getBoldTextPreference()).toBe(true);
    expect(await loadBoldTextPreference()).toBe(true);
  });

  it('saves and restores a disabled preference', async () => {
    saveBoldTextPreference(false);
    expect(getBoldTextPreference()).toBe(false);
    expect(await loadBoldTextPreference()).toBe(false);
  });

  it('ignores malformed stored data', async () => {
    mockStore.set('ott:boldText', 'yes');
    expect(await loadBoldTextPreference()).toBeNull();
  });
});
