import { useCallback } from 'react';
import { HWEvent, useTVEventHandler } from 'react-native';
import { RemoteKey } from '../types/remote';

const KEY_DOWN = 0;
const KEY_UP = 1;

// react-native-tvos on Android sends a short press as 'left'/'right' on key
// up only, and a held key as repeated 'longLeft'/'longRight' key downs.
const toRemoteKey = (evt: HWEvent): RemoteKey | null => {
  switch (evt.eventType) {
    case 'left':
    case 'right':
      return evt.eventKeyAction === KEY_UP ? evt.eventType : null;
    case 'longLeft':
      return evt.eventKeyAction === KEY_DOWN ? 'left' : null;
    case 'longRight':
      return evt.eventKeyAction === KEY_DOWN ? 'right' : null;
    default:
      return null;
  }
};

// Calls onKey for D-pad left/right while enabled (Android TV).
export const useRemoteKeys = (
  onKey: (key: RemoteKey) => void,
  enabled: boolean,
) => {
  const handleEvent = useCallback(
    (evt: HWEvent) => {
      const key = enabled ? toRemoteKey(evt) : null;
      if (key) {
        onKey(key);
      }
    },
    [enabled, onKey],
  );
  useTVEventHandler(handleEvent);
};
