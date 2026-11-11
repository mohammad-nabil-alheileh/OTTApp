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
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
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
// Bumped whenever a session starts or stops, so a start still waiting on the
// permission prompt cannot begin capturing after the user moved on.
let session = 0;

// Resolve once, detach handlers, and drop the reference so late events from the
// browser (abort triggers error + end) cannot resolve the promise twice.
const finish = (value: string | null) => {
  const resolve = settle;
  settle = null;
  if (activeRecognition) {
    activeRecognition.onstart = null;
    activeRecognition.onaudiostart = null;
    activeRecognition.onresult = null;
    activeRecognition.onerror = null;
    activeRecognition.onend = null;
    activeRecognition = null;
  }
  resolve?.(value);
};

// Chrome and Safari only grant the microphone through a prompt. Asking here,
// inside the press handler, spends that prompt before recognition starts; the
// first spoken words would otherwise be lost while the user clicks Allow.
const primeMicrophone = async () => {
  if (typeof navigator === 'undefined') {
    return;
  }
  const media = navigator.mediaDevices;
  if (!media?.getUserMedia) {
    return;
  }
  try {
    const permissions = navigator.permissions as
      | { query?: (descriptor: { name: string }) => Promise<{ state: string }> }
      | undefined;
    const status = await permissions?.query?.({ name: 'microphone' });
    if (status?.state === 'granted' || status?.state === 'denied') {
      return;
    }
  } catch {
    // No Permissions API entry for the microphone; fall through to a prompt.
  }
  try {
    const stream = await media.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
  } catch {
    // Denied or unavailable; recognition reports the same thing.
  }
};

export const isVoiceSearchAvailable: VoiceSearchService['isAvailable'] =
  async () => isSupported();

export const startVoiceListening: VoiceSearchService['startListening'] = async (
  options = {},
) => {
  if (!isSupported() || settle !== null) {
    return null;
  }

  const current = (session += 1);
  await primeMicrophone();
  if (current !== session || settle !== null) {
    return null;
  }

  const Constructor = readConstructor();
  if (!Constructor) {
    return null;
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

    // "Speak now" is only honest once the service is capturing audio.
    recognition.onstart = () => options.onStart?.();
    recognition.onaudiostart = () => options.onStart?.();

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
    recognition.onerror = event => {
      if (event.error !== 'aborted') {
        // e.g. no-speech (silent mic), not-allowed (permission), network.
        console.warn('[voiceSearch] recognition error:', event.error);
      }
      finish(null);
    };
    recognition.onend = () => finish(null);

    try {
      recognition.start();
    } catch {
      finish(null);
    }
  });
};

export const stopVoiceListening: VoiceSearchService['stopListening'] = () => {
  session += 1;
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
