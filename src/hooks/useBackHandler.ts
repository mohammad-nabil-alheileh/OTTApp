import { useEffect } from 'react';
import { BackHandler } from 'react-native';

// Runs handler on the remote's Back key while enabled. Handlers registered
// later run first; returning true stops older handlers (e.g. the player's
// "exit to home") from also running.
export const useBackHandler = (handler: () => boolean, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => sub.remove();
  }, [handler, enabled]);
};
