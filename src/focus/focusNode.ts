import { AccessibilityInfo, Platform, View } from 'react-native';

/** Moves the remote's focus, and the screen reader's with it, to `node`. */
export const focusNode = (node: View) => {
  if (Platform.OS === 'web') {
    (node as unknown as HTMLElement).focus();
    return;
  }
  (node as unknown as { requestTVFocus?: () => void }).requestTVFocus?.();
  // TalkBack's focus doesn't follow requestTVFocus; tvOS VoiceOver does.
  if (Platform.OS === 'android') {
    AccessibilityInfo.sendAccessibilityEvent(node, 'focus');
  }
};
