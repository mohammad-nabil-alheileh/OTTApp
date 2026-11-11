import { NativeModules, Platform } from 'react-native';
import { VoiceSearchService } from './voiceSearch.types';

interface NativeVoiceSearchModule {
  isAvailable(): Promise<boolean>;
  startListening(options: {
    locale?: string;
    prompt?: string;
  }): Promise<string | null>;
}

const nativeModule = NativeModules.VoiceSearch as
  | NativeVoiceSearchModule
  | undefined;

export const isVoiceSearchAvailable: VoiceSearchService['isAvailable'] =
  async () => {
    if (Platform.OS !== 'android' || !nativeModule) {
      return false;
    }
    try {
      return await nativeModule.isAvailable();
    } catch {
      return false;
    }
  };

export const startVoiceListening: VoiceSearchService['startListening'] = async (
  options = {},
) => {
  if (Platform.OS !== 'android' || !nativeModule) {
    return null;
  }
  try {
    // onPartial is web-only; keep functions out of the bridge payload.
    const payload: { locale?: string; prompt?: string } = {};
    if (options.locale) {
      payload.locale = options.locale;
    }
    if (options.prompt) {
      payload.prompt = options.prompt;
    }
    const result = await nativeModule.startListening(payload);
    const text = result?.trim();
    return text ? text : null;
  } catch {
    return null;
  }
};

export const stopVoiceListening: VoiceSearchService['stopListening'] = () => {
  // The system recognizer owns its own overlay; nothing to abort from JS.
};
