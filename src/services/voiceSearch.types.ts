export interface VoiceSearchOptions {
  /** BCP-47 tag such as "en-US". Defaults to the device locale. */
  locale?: string;
  /** Optional prompt shown by the system recognizer. Ignored on web. */
  prompt?: string;
  /**
   * Live transcript while the user is still speaking. Web only: the Android
   * system overlay already draws its own feedback.
   */
  onPartial?: (text: string) => void;
  /**
   * Fires when the browser actually starts capturing audio. Web only; the
   * first press can spend a while on the permission prompt, so the UI should
   * not invite speech before this.
   */
  onStart?: () => void;
}

export interface VoiceSearchService {
  isAvailable(): Promise<boolean>;
  startListening(options?: VoiceSearchOptions): Promise<string | null>;
  stopListening(): void;
}
