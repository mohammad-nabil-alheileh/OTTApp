import { createProgressStore } from '../../src/services/progressStore';
import { mockStore } from '../mocks/asyncStorage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('../mocks/asyncStorage'),
);

const KEY = 'test-progress';

beforeEach(() => {
  mockStore.clear();
});

describe('createProgressStore', () => {
  it('starts empty when storage has nothing', async () => {
    const store = createProgressStore(KEY, 5);
    expect(await store.load()).toEqual([]);
    expect(store.get()).toEqual([]);
  });

  it('keeps the most recent entry first and does not duplicate ids', () => {
    const store = createProgressStore(KEY, 5);
    store.save('a', 10, 100);
    store.save('b', 20, 100);
    store.save('a', 30, 100);
    expect(store.get()).toEqual([
      { id: 'a', position: 30, duration: 100 },
      { id: 'b', position: 20, duration: 100 },
    ]);
  });

  it('caps the history at maxEntries', () => {
    const store = createProgressStore(KEY, 2);
    store.save('a', 1, 100);
    store.save('b', 1, 100);
    store.save('c', 1, 100);
    expect(store.get().map(entry => entry.id)).toEqual(['c', 'b']);
  });

  it('persists saves and clears under its storage key', () => {
    const store = createProgressStore(KEY, 5);
    store.save('a', 10, 100);
    store.save('b', 20, 100);
    store.clear('a');
    expect(JSON.parse(mockStore.get(KEY) ?? '[]')).toEqual([
      { id: 'b', position: 20, duration: 100 },
    ]);
  });

  it('drops malformed stored entries on load', async () => {
    mockStore.set(
      KEY,
      JSON.stringify([
        { id: 'ok', position: 5, duration: 100 },
        { id: 'neg', position: -1, duration: 100 },
        { id: 'zero-duration', position: 5, duration: 0 },
        { position: 5, duration: 100 },
        'junk',
      ]),
    );
    const store = createProgressStore(KEY, 5);
    expect(await store.load()).toEqual([
      { id: 'ok', position: 5, duration: 100 },
    ]);
  });

  it('recovers from corrupt JSON', async () => {
    mockStore.set(KEY, '{not json');
    const store = createProgressStore(KEY, 5);
    expect(await store.load()).toEqual([]);
  });
});
