import { browser } from '@wdio/globals';
import {
  ANDROID_KEYCODES,
  RemoteButton,
  TVOS_BUTTONS,
} from '../../helpers/remote';

// One remote API over both native TVs, so specs read the same everywhere.
export const isAndroid = () => browser.isAndroid;

export const press = async (button: RemoteButton) => {
  if (browser.isAndroid) {
    await browser.pressKeyCode(ANDROID_KEYCODES[button]);
  } else {
    await browser.execute('mobile: pressButton', { name: TVOS_BUTTONS[button] });
  }
};

// Element whose accessibility label starts with `prefix` (card labels carry
// extra info: "<title>, rated 8.1 out of 5, 10 min").
export const byLabelPrefix = (prefix: string) =>
  browser.isAndroid
    ? $(`android=new UiSelector().descriptionStartsWith("${prefix}")`)
    : $(`-ios predicate string:label BEGINSWITH "${prefix}"`);

export const byLabel = (label: string) => $(`~${label}`);

// Visible text without an explicit accessibility label (e.g. headers).
export const byText = (text: string) =>
  browser.isAndroid
    ? $(`android=new UiSelector().text("${text}")`)
    : $(`-ios predicate string:label == "${text}"`);

export const APP_ID = 'com.otttvapp';

export const hasFocus = async (element: ChainablePromiseElement) => {
  // Android reports the D-pad focus as "focused"; tvOS as "hasFocus".
  const value = await element.getAttribute(
    browser.isAndroid ? 'focused' : 'hasFocus',
  );
  return value === 'true';
};

type ChainablePromiseElement = ReturnType<typeof $>;

export const waitForFocus = (element: ChainablePromiseElement, what: string) =>
  browser.waitUntil(() => hasFocus(element), {
    timeout: 10000,
    timeoutMsg: `${what} never received focus`,
  });
