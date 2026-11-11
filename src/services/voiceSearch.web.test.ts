/// <reference lib="dom" />
import {
  isVoiceSearchAvailable,
  startVoiceListening,
  stopVoiceListening,
} from './voiceSearch.web';

class FakeRecognition {
  static instances: FakeRecognition[] = [];

  lang = '';
  continuous = true;
  interimResults = false;
  maxAlternatives = 0;
  onstart: (() => void) | null = null;
  onaudiostart: (() => void) | null = null;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  started = 0;
  aborted = 0;

  constructor() {
    FakeRecognition.instances.push(this);
  }

  start() {
    this.started += 1;
  }

  abort() {
    this.aborted += 1;
  }
}

const latest = () =>
  FakeRecognition.instances[FakeRecognition.instances.length - 1];

const globalWithWindow = globalThis as unknown as { window?: unknown };

const installWindow = (constructor: unknown, secure = true) => {
  globalWithWindow.window = {
    isSecureContext: secure,
    SpeechRecognition: constructor,
  };
};

// Starting now asks for microphone permission first (async), so the recognizer
// only exists after a couple of microtasks.
const begin = async (options?: Parameters<typeof startVoiceListening>[0]) => {
  const listening = startVoiceListening(options);
  await Promise.resolve();
  await Promise.resolve();
  return { listening, recognition: latest() };
};

describe('voice search (web)', () => {
  beforeEach(() => {
    FakeRecognition.instances = [];
    installWindow(FakeRecognition);
  });

  afterEach(() => {
    stopVoiceListening();
    delete globalWithWindow.window;
  });

  it('is available when the browser exposes SpeechRecognition', async () => {
    await expect(isVoiceSearchAvailable()).resolves.toBe(true);
  });

  it('is unavailable without the API or outside a secure context', async () => {
    installWindow(undefined);
    await expect(isVoiceSearchAvailable()).resolves.toBe(false);

    installWindow(FakeRecognition, false);
    await expect(isVoiceSearchAvailable()).resolves.toBe(false);
  });

  it('returns the trimmed transcript once the result is final', async () => {
    const { listening, recognition } = await begin({ locale: 'en-GB' });

    expect(recognition.lang).toBe('en-GB');
    expect(recognition.started).toBe(1);
    expect(recognition.interimResults).toBe(true);

    recognition.onresult?.({
      results: {
        0: { 0: { transcript: '  big bunny  ' }, isFinal: true },
        length: 1,
      },
      resultIndex: 0,
    });

    await expect(listening).resolves.toBe('big bunny');
  });

  it('streams partial transcripts without resolving', async () => {
    const partials: string[] = [];
    let settled = false;
    const { listening: pending, recognition } = await begin({
      onPartial: text => partials.push(text),
    });
    const listening = pending.then(text => {
      settled = true;
      return text;
    });

    recognition.onresult?.({
      results: {
        0: { 0: { transcript: ' big ' }, isFinal: false },
        length: 1,
      },
    });
    await Promise.resolve();
    expect(partials).toEqual(['big']);
    expect(settled).toBe(false);

    recognition.onresult?.({
      results: {
        0: { 0: { transcript: ' big bunny ' }, isFinal: true },
        length: 1,
      },
      resultIndex: 0,
    });

    await expect(listening).resolves.toBe('big bunny');
    expect(partials).toEqual(['big']);
  });

  it('joins all result segments before resolving', async () => {
    const { listening, recognition } = await begin();
    recognition.onresult?.({
      results: {
        0: { 0: { transcript: 'tears of' }, isFinal: true },
        1: { 0: { transcript: ' steel' }, isFinal: true },
        length: 2,
      },
    });

    await expect(listening).resolves.toBe('tears of steel');
  });

  it('keeps interim words out of the final result when cancelled', async () => {
    const partials: string[] = [];
    const { listening, recognition } = await begin({
      onPartial: text => partials.push(text),
    });

    recognition.onresult?.({
      results: {
        0: { 0: { transcript: ' half spoken' }, isFinal: false },
        length: 1,
      },
    });
    recognition.onerror?.({ error: 'aborted' });

    await expect(listening).resolves.toBeNull();
    expect(partials).toEqual(['half spoken']);
  });

  it('resolves null on cancel or no match instead of surfacing an error', async () => {
    const { listening, recognition } = await begin();
    recognition.onerror?.({ error: 'no-speech' });

    await expect(listening).resolves.toBeNull();
  });

  it('resolves null when recognition ends without a result', async () => {
    const { listening, recognition } = await begin();
    recognition.onend?.();

    await expect(listening).resolves.toBeNull();
  });

  it('reports when audio capture has actually started', async () => {
    let starts = 0;
    const { listening, recognition } = await begin({
      onStart: () => (starts += 1),
    });

    expect(starts).toBe(0);
    recognition.onstart?.();
    recognition.onaudiostart?.();
    expect(starts).toBe(2);

    recognition.onend?.();
    await expect(listening).resolves.toBeNull();
  });

  it('aborts the active recognition when stopped', async () => {
    const { listening, recognition } = await begin();

    stopVoiceListening();

    await expect(listening).resolves.toBeNull();
    expect(recognition.aborted).toBe(1);
  });

  it('refuses a second session while one is already listening', async () => {
    const { listening, recognition } = await begin();
    await expect(startVoiceListening()).resolves.toBeNull();

    recognition.onend?.();
    await expect(listening).resolves.toBeNull();
    expect(FakeRecognition.instances).toHaveLength(1);
  });
});
