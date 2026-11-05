import { useCallback } from 'react';
import { HWEvent, useTVEventHandler } from 'react-native';

// Calls onActivity for any remote key press (Android TV).
export const useRemoteActivity = (onActivity: () => void) => {
  const handleEvent = useCallback(
    (evt: HWEvent) => {
      // 'focus'/'blur' come through the same channel but are not key presses.
      if (evt.eventType !== 'focus' && evt.eventType !== 'blur') {
        onActivity();
      }
    },
    [onActivity],
  );
  useTVEventHandler(handleEvent);
};
