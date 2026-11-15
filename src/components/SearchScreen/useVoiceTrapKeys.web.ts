/// <reference lib="dom" />
import { useEffect } from 'react';

const ARROWS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

// While the microphone is live the voice bar is the whole surface: arrows are
// swallowed and focus is put back on the mic, so the spatial-navigation
// polyfill cannot move it into the dimmed results or keyboard behind.
export const useVoiceTrapKeys = (enabled: boolean, focus: () => void) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const listener = (event: KeyboardEvent) => {
      if (!ARROWS.has(event.key)) {
        return;
      }
      event.preventDefault();
      focus();
    };
    window.addEventListener('keydown', listener, true);
    return () => window.removeEventListener('keydown', listener, true);
  }, [enabled, focus]);
};
