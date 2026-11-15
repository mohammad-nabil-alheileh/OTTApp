import path from 'path';
import { pathToFileURL } from 'url';
import { Page, TestInfo } from '@playwright/test';
import { WEB_BACK_KEY_CODE, WebPlatform } from '../../helpers/remote';

export const APP_URL = pathToFileURL(
  path.resolve(__dirname, '../../../dist/index.html'),
).href;

export const platformOf = (testInfo: TestInfo) =>
  testInfo.project.name as WebPlatform;

// D-pad and OK arrive as ordinary keys on both TVs.
export const press = (page: Page, key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Enter') =>
  page.keyboard.press(key);

// The remote's Back button only has a keyCode (461 on LG, 10009 on Samsung),
// which page.keyboard can't produce, so dispatch it like the TV runtime does.
export const pressRemoteBack = (page: Page, platform: WebPlatform) =>
  page.evaluate(keyCode => {
    const target = document.activeElement ?? document.body;
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'keyCode', { get: () => keyCode });
    Object.defineProperty(event, 'which', { get: () => keyCode });
    target.dispatchEvent(event);
  }, WEB_BACK_KEY_CODE[platform]);

// Accessible name of the element that has DOM focus.
export const focusedName = (page: Page) =>
  page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? '');
