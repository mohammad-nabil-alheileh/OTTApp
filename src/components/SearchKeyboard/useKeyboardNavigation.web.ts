/// <reference lib="dom" />
import { useEffect, useRef, useState } from 'react';
import {
  INITIAL_FOCUS_POS,
  KeyboardFocusPos,
  moveFocus,
} from './keyboardNavigation.types';

export interface UseKeyboardNavigationOptions {
  visible: boolean;
  onClose: () => void;
  onSelect: (pos: KeyboardFocusPos) => void;
  onChar: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
}

export const useKeyboardNavigation = ({
  visible,
  onClose,
  onSelect,
  onChar,
  onBackspace,
  onSpace,
}: UseKeyboardNavigationOptions) => {
  const [focusPos, setFocusPos] = useState<KeyboardFocusPos>(INITIAL_FOCUS_POS);

  const focusPosRef = useRef(focusPos);
  focusPosRef.current = focusPos;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const onCharRef = useRef(onChar);
  onCharRef.current = onChar;

  const onBackspaceRef = useRef(onBackspace);
  onBackspaceRef.current = onBackspace;

  const onSpaceRef = useRef(onSpace);
  onSpaceRef.current = onSpace;

  // Reset focus to initial position whenever overlay opens
  useEffect(() => {
    if (visible) {
      setFocusPos(INITIAL_FOCUS_POS);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setFocusPos(prev => moveFocus(prev, 'left'));
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setFocusPos(prev => moveFocus(prev, 'right'));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setFocusPos(prev => moveFocus(prev, 'up'));
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setFocusPos(prev => moveFocus(prev, 'down'));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onSelectRef.current(focusPosRef.current);
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onBackspaceRef.current();
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // If focused on an action key other than space, execute that action; otherwise space
        const current = focusPosRef.current;
        if (current.row === 4 && current.col !== 1) {
          onSelectRef.current(current);
        } else {
          onSpaceRef.current();
        }
        return;
      }

      // Typing printable characters
      if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
        onCharRef.current(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [visible]);

  return { focusPos, setFocusPos };
};
