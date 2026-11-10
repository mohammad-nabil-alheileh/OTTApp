/// <reference lib="dom" />
import { useEffect } from 'react';

const KEYS: Record<string, 'up' | 'down'> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
};

// Calls onKey for arrow up/down while enabled (browser / LG webOS).
// Capture phase + preventDefault keeps the spatial-navigation polyfill from
// moving focus out of an open menu onto the overlapping seekbar.
export const useMenuKeys = (
  onKey: (key: 'up' | 'down') => void,
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