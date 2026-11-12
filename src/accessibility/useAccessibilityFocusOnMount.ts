import { RefObject, useEffect } from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';
import { useScreenReaderEnabled } from './useScreenReaderEnabled';

// Lets the native view lay out before TalkBack is pointed at it.
const FOCUS_DELAY_MS = 100;

// hasTVPreferredFocus moves the remote's focus, but TalkBack's own focus does
// not always follow, leaving two highlights on different elements. This puts
// TalkBack's focus on the same view when it mounts.
export const useAccessibilityFocusOnMount = (ref: RefObject<View | null>) => {
  const screenReaderEnabled = useScreenReaderEnabled();

  useEffect(() => {
    if (!screenReaderEnabled || Platform.OS !== 'android') {
      return;
    }
    const timer = setTimeout(() => {
      if (ref.current) {
        AccessibilityInfo.sendAccessibilityEvent(ref.current, 'focus');
      }
    }, FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [screenReaderEnabled, ref]);
};
