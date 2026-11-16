// Shared setup for the react-native-web projects (lg-webos, samsung-tizen).
import { configure } from '@testing-library/dom';

export const setUserAgent = (userAgent: string) => {
  Object.defineProperty(window.navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });
};

// Each *ByRole pass costs 0.3-1 s here (jsdom's getComputedStyle walks ~250 RNW rules per
// node), so findBy*'s 1 s window can close after one poll. App flows hit the 5 s test limit.
configure({ asyncUtilTimeout: 10000 });
jest.setTimeout(20000);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('../mocks/asyncStorage'),
);

// Never let a test reach the real reachability probe.
jest.mock('../../src/services/network', () =>
  require('../mocks/network').onlineNetwork,
);

// jsdom does no layout: the rail focus code scrolls focused cards into view.
Element.prototype.scrollIntoView = jest.fn();

// jsdom has no media playback; keep <video>/<audio> calls from throwing.
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: jest.fn(() => Promise.resolve()),
});
Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: jest.fn(),
});
Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: jest.fn(),
});
