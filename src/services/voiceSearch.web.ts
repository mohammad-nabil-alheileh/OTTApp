/// <reference lib="dom" />
import { VoiceSearchService } from './voiceSearch.types';

interface RecognitionAlternative {
  transcript: string;
}

interface RecognitionResult {
  readonly length: number;
  readonly isFinal?: boolean;
  readonly [index: number]: RecognitionAlternative | undefined;
}

interface RecognitionEvent {
  readonly results: {
    readonly length: number;
    readonly [index: number]: RecognitionResult | undefined;
  };
  readonly resultIndex?: number;
}

interface RecognitionErrorEvent {
  readonly error?: string;
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

type RecognitionConstructor = new () => Recognition;

const readConstructor = (): RecognitionConstructor | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const speechWindow = window as typeof window & {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return (
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition ??
    null
  );
};

const isSupported = () =>
  readConstructor() !== null && window.isSecureContext !== false;

let activeRecognition: Recognition | null = null;
let settle: ((value: string | null) => void) | null = null;

// Resolve once, detach handlers, and drop the reference so late events from the
// browser (abort triggers error + end) cannot resolve the promise twice.
const finish = (value: string | null) => {
  const resolve = settle;
  settle = null;
  if (activeRecognition) {
    activeRecognition.onresult = null;
    activeRecognition.onerror = null;
    activeRecognition.onend = null;
    activeRecognition = null;
  }
  resolve?.(value);
};

export const isVoiceSearchAvailable: VoiceSearchService['isAvailable'] =
  async () => isSupported();

export const startVoiceListening: VoiceSearchService['startListening'] = (
  options = {},
) => {
  if (!isSupported() || settle !== null) {
    return Promise.resolve(null);
  }

  const Constructor = readConstructor();
  if (!Constructor) {
    return Promise.resolve(null);
  }

  const recognition = new Constructor();
  activeRecognition = recognition;
  recognition.lang =
    options.locale ??
    (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  recognition.continuous = false;
  // Interim results echo words into the query bar as they are spoken; the
  // service can take seconds to finalize after the user stops talking.
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  return new Promise<string | null>(resolve => {
    settle = resolve;

    recognition.onresult = event => {
      let transcript = '';
      let isFinal = false;
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result) {
          continue;
        }
        transcript += result[0]?.transcript ?? '';
        if (result.isFinal) {
          isFinal = true;
        }
      }

      const text = transcript.trim();
      if (!isFinal) {
        if (text) {
          options.onPartial?.(text);
        }
        return;
      }

      finish(text ? text : null);
      try {
        recognition.abort();
      } catch {
        // Recognition already stopped.
      }
    };
    // Cancelling, silence, no match, denied permission, offline: all become
    // "no result" so the search screen never shows an error.
    recognition.onerror = () => finish(null);
    recognition.onend = () => finish(null);

    try {
      recognition.start();
    } catch {
      finish(null);
    }
  });
};

export const stopVoiceListening: VoiceSearchService['stopListening'] = () => {
  if (settle === null) {
    return;
  }
  const recognition = activeRecognition;
  finish(null);
  try {
    recognition?.abort();
  } catch {
    // Recognition already stopped.
  }
};
