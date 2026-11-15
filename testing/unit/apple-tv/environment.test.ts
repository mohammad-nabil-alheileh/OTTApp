import { Platform } from 'react-native';

// Guards the harness itself: if this fails, every other apple-tv test is
// running against the wrong platform code.
describe('apple-tv test environment', () => {
  it('resolves iOS modules and reports tvOS', () => {
    expect(Platform.OS).toBe('ios');
    expect(Platform.isTV).toBe(true);
    expect(Platform.isTVOS).toBe(true);
  });
});
