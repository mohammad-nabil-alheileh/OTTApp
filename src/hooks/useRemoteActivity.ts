import { useCallback } from 'react';
import { HWEvent, useTVEventHandler } from 'react-native';

// Calls onActivity with the key for any remote press (Android TV), and
// onFocusMove when focus moves. With TalkBack on, TalkBack takes the keys itself, so focus
// moves (and the 'select' it sends for a click) are the only signs of activity.
export const useRemoteActivity = (
  onActivity: (key: string) => void,
  onFocusMove?: () => void,
) => {
  const handleEvent = useCallback(
    (evt: HWEvent) => {
      if (evt.eventType === 'focus') {
        onFocusMove?.();
      } else if (evt.eventType !== 'blur') {
        onActivity(evt.eventType);
      }
    },
    [onActivity, onFocusMove],
  );
  useTVEventHandler(handleEvent);
};
