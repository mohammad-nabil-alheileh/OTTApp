import fs from 'fs';
import path from 'path';

// Level 3 for the native TVs: the installed app on an emulator/simulator or
// device, driven through Appium with real remote key events.
//
//   E2E_PLATFORM=android-tv npm run test:e2e:native   (Linux/macOS)
//   E2E_PLATFORM=apple-tv   npm run test:e2e:native   (macOS + Xcode only)
//
// Android TV: needs a running TV emulator/device (adb devices) and the
//   uiautomator2 driver (npx appium driver install uiautomator2). Uses the
//   release APK if it exists, so no Metro bundler is needed; override with
//   E2E_ANDROID_APK=/path/to.apk.
// Apple TV: needs the xcuitest driver (npx appium driver install xcuitest),
//   a booted "Apple TV" simulator and a build; point E2E_TVOS_APP at the
//   .app (e.g. from `npm run ios`, under ~/Library/Developer/Xcode/DerivedData).

const root = path.resolve(__dirname, '../../..');
// Same id on both platforms (android applicationId / iOS bundle identifier).
const APP_ID = 'com.otttvapp';

const platform = process.env.E2E_PLATFORM ?? 'android-tv';

const releaseApk = path.join(
  root,
  'android/app/build/outputs/apk/release/app-release.apk',
);

const capabilities: Record<string, WebdriverIO.Capabilities> = {
  'android-tv': {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.E2E_ANDROID_DEVICE ?? 'Android TV',
    'appium:appPackage': APP_ID,
    'appium:appActivity': '.MainActivity',
    ...(fs.existsSync(process.env.E2E_ANDROID_APK ?? releaseApk)
      ? { 'appium:app': process.env.E2E_ANDROID_APK ?? releaseApk }
      : {}),
    // Clears app data at session start so saved history/favorites don't leak in.
    'appium:noReset': false,
    'appium:newCommandTimeout': 120,
  },
  'apple-tv': {
    platformName: 'tvOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.E2E_TVOS_DEVICE ?? 'Apple TV',
    'appium:bundleId': APP_ID,
    ...(process.env.E2E_TVOS_APP ? { 'appium:app': process.env.E2E_TVOS_APP } : {}),
    'appium:noReset': false,
    'appium:newCommandTimeout': 120,
  },
};

if (!capabilities[platform]) {
  throw new Error(
    `E2E_PLATFORM must be one of: ${Object.keys(capabilities).join(', ')}`,
  );
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./specs/**/*.e2e.ts'],
  maxInstances: 1,
  capabilities: [capabilities[platform]],
  logLevel: 'warn',
  outputDir: path.join(root, 'test-results/e2e-native'),
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,
  services: [
    [
      'appium',
      {
        command: path.join(root, 'node_modules/.bin/appium'),
        args: { relaxedSecurity: true },
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 120000 },
};
