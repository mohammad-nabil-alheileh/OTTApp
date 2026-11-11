import { useCallback, useEffect, useRef, useState } from 'react';
import { HWEvent, useTVEventHandler } from 'react-native';
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

const KEY_DOWN = 0;
const KEY_UP = 1;

export const useKeyboardNavigation = ({
  visible,
  onClose: _onClose,
  onSelect,
}: UseKeyboardNavigationOptions) => {
  const [focusPos, setFocusPos] = useState<KeyboardFocusPos>(INITIAL_FOCUS_POS);

  const focusPosRef = useRef(focusPos);
  focusPosRef.current = focusPos;

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Reset focus when overlay opens
  useEffect(() => {
    if (visible) {
      setFocusPos(INITIAL_FOCUS_POS);
    }
  }, [visible]);

  const handleTVEvent = useCallback(
    (evt: HWEvent) => {
      if (!visible) {
        return;
      }

      const isAction = evt.eventKeyAction === KEY_UP;
      const isRepeat = evt.eventKeyAction === KEY_DOWN;

      if ((isAction && evt.eventType === 'left') || (isRepeat && evt.eventType === 'longLeft')) {
        setFocusPos(prev => moveFocus(prev, 'left'));
      } else if ((isAction && evt.eventType === 'right') || (isRepeat && evt.eventType === 'longRight')) {
        setFocusPos(prev => moveFocus(prev, 'right'));
      } else if ((isAction && evt.eventType === 'up') || (isRepeat && evt.eventType === 'longUp')) {
        setFocusPos(prev => moveFocus(prev, 'up'));
      } else if ((isAction && evt.eventType === 'down') || (isRepeat && evt.eventType === 'longDown')) {
        setFocusPos(prev => moveFocus(prev, 'down'));
      } else if (isAction && (evt.eventType === 'select' || evt.eventType === 'playPause')) {
        onSelectRef.current(focusPosRef.current);
      }
    },
    [visible],
  );

  useTVEventHandler(handleTVEvent);

  return { focusPos, setFocusPos };
};
