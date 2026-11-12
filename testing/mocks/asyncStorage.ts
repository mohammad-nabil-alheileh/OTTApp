// In-memory stand-in for @react-native-async-storage/async-storage.
//
// Usage in a test:
//   jest.mock('@react-native-async-storage/async-storage', () =>
//     require('<relative path>/testing/mocks/asyncStorage'),
//   );
//   import { mockStore } from '<relative path>/testing/mocks/asyncStorage';
//   beforeEach(() => mockStore.clear());
//
// The factory and the import resolve to the same module instance, so the
// test can seed or inspect `mockStore` directly.

export const mockStore = new Map<string, string>();

const AsyncStorage = {
  getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    mockStore.set(key, value);
  }),
  removeItem: jest.fn(async (key: string) => {
    mockStore.delete(key);
  }),
  clear: jest.fn(async () => {
    mockStore.clear();
  }),
};

export default AsyncStorage;
