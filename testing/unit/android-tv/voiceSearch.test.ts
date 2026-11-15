import { NativeModules } from 'react-native';

// voiceSearch.ts reads NativeModules.VoiceSearch when it loads, so each test
// installs the fake module first and then loads a fresh copy.
const loadWith = (nativeModule: object | undefined) => {
  NativeModules.VoiceSearch = nativeModule;
  let service!: typeof import('../../../src/services/voiceSearch');
  jest.isolateModules(() => {
    service = require('../../../src/services/voiceSearch');
  });
  return service;
};

afterEach(() => {
  delete NativeModules.VoiceSearch;
});

describe('voice search (android-tv native module)', () => {
  it('reports what the native recognizer says', async () => {
    const yes = loadWith({ isAvailable: jest.fn(async () => true) });
    await expect(yes.isVoiceSearchAvailable()).resolves.toBe(true);

    const no = loadWith({ isAvailable: jest.fn(async () => false) });
    await expect(no.isVoiceSearchAvailable()).resolves.toBe(false);
  });

  it('is unavailable when the native module is missing or throws', async () => {
    await expect(loadWith(undefined).isVoiceSearchAvailable()).resolves.toBe(
      false,
    );
    const broken = loadWith({
      isAvailable: jest.fn(async () => {
        throw new Error('no recognizer');
      }),
    });
    await expect(broken.isVoiceSearchAvailable()).resolves.toBe(false);
  });

  it('trims the transcript and turns an empty one into null', async () => {
    const startListening = jest
      .fn()
      .mockResolvedValueOnce('  big buck bunny ')
      .mockResolvedValueOnce('   ');
    const service = loadWith({ startListening });

    await expect(service.startVoiceListening()).resolves.toBe('big buck bunny');
    await expect(service.startVoiceListening()).resolves.toBeNull();
  });

  it('sends only serialisable options over the bridge', async () => {
    const startListening = jest.fn(async () => 'x');
    const service = loadWith({ startListening });

    await service.startVoiceListening({
      locale: 'en-GB',
      prompt: 'Say a title',
      onPartial: () => {},
    });

    expect(startListening).toHaveBeenCalledWith({
      locale: 'en-GB',
      prompt: 'Say a title',
    });
  });

  it('resolves null when recognition fails', async () => {
    const service = loadWith({
      startListening: jest.fn(async () => {
        throw new Error('cancelled');
      }),
    });
    await expect(service.startVoiceListening()).resolves.toBeNull();
  });
});
