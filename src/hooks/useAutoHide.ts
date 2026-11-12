import { useCallback, useEffect, useRef, useState } from 'react';
import { useScreenReaderEnabled } from '../accessibility/useScreenReaderEnabled';
import { useRemoteActivity } from './useRemoteActivity';

const HIDE_AFTER_MS = 5000;
// A screen reader needs time to read each control, so give it longer.
const SCREEN_READER_HIDE_AFTER_MS = 15000;

// Player overlay visibility: shown on any remote activity, hidden after a
// timeout without any. Stays visible while keepVisible (e.g. paused).
export const useAutoHide = (keepVisible: boolean) => {
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const keepVisibleRef = useRef(keepVisible);
  keepVisibleRef.current = keepVisible;
  const screenReaderEnabled = useScreenReaderEnabled();
  const hideAfterMs = screenReaderEnabled
    ? SCREEN_READER_HIDE_AFTER_MS
    : HIDE_AFTER_MS;

  const show = useCallback(() => {
    visibleRef.current = true;
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!keepVisibleRef.current) {
        visibleRef.current = false;
        setVisible(false);
      }
    }, hideAfterMs);
  }, [hideAfterMs]);

  // Moving between controls keeps them up (that is all TalkBack users
  // produce), but focus landing on the idle catcher as the overlay hides
  // must not bring it straight back.
  const extend = useCallback(() => {
    if (visibleRef.current) {
      show();
    }
  }, [show]);

  useRemoteActivity(show, extend);

  // Pausing shows the overlay; resuming restarts the countdown.
  useEffect(() => {
    show();
  }, [keepVisible, show]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  return { visible, show };
};
