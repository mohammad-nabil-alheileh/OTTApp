/// <reference lib="dom" />
import { useEffect } from 'react';
import { RemoteKey } from '../types/remote';

const KEYS: Record<string, RemoteKey> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

// Calls onKey for arrow left/right while enabled (browser / LG webOS).
// Capture phase + preventDefault keeps the spatial-navigation polyfill
// from also moving focus.
export const useRemoteKeys = (
  onKey: (key: RemoteKey) => void,
  enabled: boolean,
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const listener = (e: KeyboardEvent) => {
      const key = KEYS[e.key];
      if (key) {
        e.preventDefault();
        e.stopPropagation();
        onKey(key);
      }
    };
    window.addEventListener('keydown', listener, true);
    return () => window.removeEventListener('keydown', listener, true);
  }, [enabled, onKey]);
};
