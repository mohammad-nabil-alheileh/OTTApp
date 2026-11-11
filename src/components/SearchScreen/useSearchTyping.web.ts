/// <reference lib="dom" />
import { useEffect, useRef } from 'react';

// Physical keyboards on the web can type straight into the query. Backspace is
// swallowed here so the shared Back handler does not also close the screen.
export const useSearchTyping = (
  enabled: boolean,
  onChar: (char: string) => void,
  onBackspace: () => void,
) => {
  const onCharRef = useRef(onChar);
  onCharRef.current = onChar;
  const onBackspaceRef = useRef(onBackspace);
  onBackspaceRef.current = onBackspace;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onBackspaceRef.current();
        return;
      }

      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onCharRef.current(' ');
        return;
      }

      if (event.key.length === 1) {
        event.preventDefault();
        onCharRef.current(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [enabled]);
};
