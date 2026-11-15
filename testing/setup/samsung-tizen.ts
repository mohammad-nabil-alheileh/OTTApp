// Samsung Tizen: Chromium-based web runtime. Remote keys other than the
// arrows/Enter/Back must be registered through window.tizen.tvinputdevice
// before the app receives them, so a stub of that API is installed here.
import { setUserAgent } from './web';
import { USER_AGENTS } from '../helpers/remote';

setUserAgent(USER_AGENTS['samsung-tizen']);

const registered = new Set<string>();
Object.defineProperty(window, 'tizen', {
  configurable: true,
  value: {
    tvinputdevice: {
      registerKey: jest.fn((name: string) => registered.add(name)),
      unregisterKey: jest.fn((name: string) => registered.delete(name)),
      getSupportedKeys: jest.fn(() => []),
      // Test-only: which keys the app asked for.
      __registered: registered,
    },
  },
});
