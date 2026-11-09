import { useEffect } from 'react';
import { BackHandler, Platform, TVEventControl } from 'react-native';

// On Apple TV the Menu/Back button goes to the OS (exits the app) unless the
// menu key is enabled, and only then does BackHandler receive it. We enable it
// while at least one handler is active, so Back on the home screen still
// exits the app like a native tvOS app.
let activeHandlers = 0;

const retainMenuKey = () => {
  if (Platform.OS === 'ios' && activeHandlers++ === 0) {
    TVEventControl.enableTVMenuKey();
  }
};

const releaseMenuKey = () => {
  if (Platform.OS === 'ios' && --activeHandlers === 0) {
    TVEventControl.disableTVMenuKey();
  }
};

// Runs handler on the remote's Back key while enabled. Handlers registered
// later run first; returning true stops older handlers (e.g. the player's
// "exit to home") from also running.
export const useBackHandler = (handler: () => boolean, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    retainMenuKey();
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => {
      sub.remove();
      releaseMenuKey();
    };
  }, [handler, enabled]);
};
