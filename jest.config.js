// Jest runs levels 1 (unit) and 2 (integration) of the test pyramid, once per
// runtime. Level 3 (E2E) lives in testing/e2e and uses Playwright / Appium.
// See testing/README.md for the full matrix.
//
//   npx jest --selectProjects android-tv      one platform
//   npx jest testing/integration              one level
//
// Projects:
//   shared         platform-agnostic logic, run once
//   android-tv     react-native-tvos, Platform.OS = 'android', isTV
//   apple-tv       react-native-tvos, Platform.OS = 'ios', isTV / isTVOS
//   lg-webos       react-native-web in jsdom, webOS user agent
//   samsung-tizen  react-native-web in jsdom, Tizen user agent

const T = '<rootDir>/testing';
const testExt = '*.test.{ts,tsx}';

// react-native-tvos ships its lists as @react-native-tvos/virtualized-lists
// (untranspiled Flow), which the preset's default pattern doesn't cover.
const nativeTransformIgnore = [
  'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-tvos)/)',
];

const nativeProject = (name, platform) => ({
  displayName: name,
  preset: 'react-native',
  transformIgnorePatterns: nativeTransformIgnore,
  haste: { defaultPlatform: platform, platforms: ['android', 'ios', 'native'] },
  setupFiles: [`${T}/setup/${name}.ts`],
  testMatch: [
    `${T}/unit/native/**/${testExt}`,
    `${T}/unit/${name}/**/${testExt}`,
    `${T}/integration/native/**/${testExt}`,
    `${T}/integration/${name}/**/${testExt}`,
  ],
});

const webProject = name => ({
  displayName: name,
  testEnvironment: 'jsdom',
  // Same resolution order as webpack.config.js: *.web.* wins.
  moduleFileExtensions: ['web.tsx', 'web.ts', 'web.js', 'tsx', 'ts', 'js', 'json'],
  moduleNameMapper: { '^react-native$': 'react-native-web' },
  setupFiles: [`${T}/setup/${name}.ts`],
  testMatch: [
    '<rootDir>/src/**/*.web.test.{ts,tsx}',
    `${T}/unit/web/**/${testExt}`,
    `${T}/unit/${name}/**/${testExt}`,
    `${T}/integration/web/**/${testExt}`,
    `${T}/integration/${name}/**/${testExt}`,
  ],
});

module.exports = {
  projects: [
    {
      displayName: 'shared',
      preset: 'react-native',
      transformIgnorePatterns: nativeTransformIgnore,
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', `${T}/unit/shared/**/${testExt}`],
      testPathIgnorePatterns: ['/node_modules/', '\\.web\\.test\\.'],
    },
    nativeProject('android-tv', 'android'),
    nativeProject('apple-tv', 'ios'),
    webProject('lg-webos'),
    webProject('samsung-tizen'),
  ],
};
