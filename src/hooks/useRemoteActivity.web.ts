/// <reference lib="dom" />
import { useEffect } from 'react';

// Calls onActivity for any key press or pointer movement (browser / LG webOS,
// whose Magic Remote moves a mouse pointer). Focus only moves on a key press
// here, which is already counted, so onFocusMove is not needed.
export const useRemoteActivity = (
  onActivity: (key: string) => void,
  _onFocusMove?: () => void,
) => {
  useEffect(() => {
    const events = ['keydown', 'mousemove', 'mousedown'] as const;
    // Same key names as the native TV events, so callers can tell Up apart.
    const handle = (event: Event) =>
      onActivity(
        event instanceof KeyboardEvent && event.key === 'ArrowUp'
          ? 'up'
          : event.type,
      );
    // Capture phase: see the key even if a component stops it from bubbling.
    events.forEach(name => window.addEventListener(name, handle, true));
    return () =>
      events.forEach(name => window.removeEventListener(name, handle, true));
  }, [onActivity]);
};
