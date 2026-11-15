import { Platform } from 'react-native';

// Guards the harness itself: if this fails, every other android-tv test is
// running against the wrong platform code.
describe('android-tv test environment', () => {
  it('resolves Android modules and reports a TV', () => {
    expect(Platform.OS).toBe('android');
    expect(Platform.isTV).toBe(true);
  });
});
