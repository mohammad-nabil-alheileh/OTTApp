// Remote-control facts per platform, shared by every test level so unit,
// integration and E2E tests agree on what each button sends.

export type Platform = 'android-tv' | 'apple-tv' | 'lg-webos' | 'samsung-tizen';
export type WebPlatform = 'lg-webos' | 'samsung-tizen';

export const USER_AGENTS: Record<WebPlatform, string> = {
  'lg-webos':
    'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 WebAppManager',
  'samsung-tizen':
    'Mozilla/5.0 (SMART-TV; LINUX; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) 76.0.3809.146/6.0 TV Safari/537.36',
};

// keyCode of the remote's Back button in the web runtimes.
export const WEB_BACK_KEY_CODE: Record<WebPlatform, number> = {
  'lg-webos': 461,
  'samsung-tizen': 10009,
};

// Android KeyEvent codes for the D-pad (used by Appium pressKeyCode).
export const ANDROID_KEYCODES = {
  up: 19,
  down: 20,
  left: 21,
  right: 22,
  select: 23,
  back: 4,
} as const;

// XCUITest `mobile: pressButton` names on tvOS.
export const TVOS_BUTTONS = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  select: 'select',
  back: 'menu',
} as const;

export type RemoteButton = keyof typeof ANDROID_KEYCODES;
