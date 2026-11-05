import { useCallback, useEffect, useRef, useState } from 'react';
import { useRemoteActivity } from './useRemoteActivity';

const HIDE_AFTER_MS = 5000;

// Player overlay visibility: shown on any remote activity, hidden after
// HIDE_AFTER_MS without any. Stays visible while keepVisible (e.g. paused).
export const useAutoHide = (keepVisible: boolean) => {
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const keepVisibleRef = useRef(keepVisible);
  keepVisibleRef.current = keepVisible;

  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!keepVisibleRef.current) {
        setVisible(false);
      }
    }, HIDE_AFTER_MS);
  }, []);

  useRemoteActivity(show);

  // Pausing shows the overlay; resuming restarts the countdown.
  useEffect(() => {
    show();
  }, [keepVisible, show]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  return { visible, show };
};
