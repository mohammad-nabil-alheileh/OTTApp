import { NativeModules } from 'react-native';
import {
  isVoiceSearchAvailable,
  startVoiceListening,
} from '../../../src/services/voiceSearch';

// tvOS has no in-app voice search: Siri dictation goes through the system
// keyboard, so the service must report unavailable even if a module exists.
describe('voice search (apple-tv)', () => {
  it('is never available', async () => {
    NativeModules.VoiceSearch = { isAvailable: jest.fn(async () => true) };
    await expect(isVoiceSearchAvailable()).resolves.toBe(false);
    delete NativeModules.VoiceSearch;
  });

  it('resolves null instead of listening', async () => {
    await expect(startVoiceListening()).resolves.toBeNull();
  });
});
