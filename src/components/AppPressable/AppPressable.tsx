import React, { useCallback, useRef } from 'react';
import {
  AccessibilityActionEvent,
  Platform,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { useAccessibilityFocusOnMount } from '../../accessibility/useAccessibilityFocusOnMount';

const ACTIVATE = 'activate';

// On Android TV, TalkBack takes the D-pad center key for itself and sends an
// accessibility click instead, which Pressable ignores on TV. Declaring the
// "activate" action routes that click to onAccessibilityAction, where it is
// turned back into onPress. Without TalkBack the action never fires, so normal
// remote presses are not doubled.
//
// The "activate" action must not reach a view without an accessibilityRole:
// React Native's accessibility delegate force-casts the role when handling
// custom actions and crashes the app on null. Pressables default to "button".
//
// hasTVPreferredFocus moves only the remote's focus. When a screen or overlay
// appears, TalkBack puts its own focus on the first thing it can read (often
// a heading), so the two highlights end up on different elements. Whenever
// this pressable claims the remote's focus, TalkBack's focus is moved here too.
export const AppPressable: React.FC<
  PressableProps & { ref?: React.Ref<View> }
> = ({
  accessibilityActions,
  onAccessibilityAction,
  onPress,
  ref,
  ...props
}) => {
  const viewRef = useRef<View | null>(null);
  const setRef = useCallback(
    (node: View | null) => {
      viewRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<View | null>).current = node;
      }
    },
    [ref],
  );
  useAccessibilityFocusOnMount(viewRef, !!props.hasTVPreferredFocus);

  if (Platform.OS !== 'android' || !onPress) {
    return (
      <Pressable
        {...props}
        ref={setRef}
        onPress={onPress}
        accessibilityActions={accessibilityActions}
        onAccessibilityAction={onAccessibilityAction}
      />
    );
  }

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === ACTIVATE) {
      if (!props.disabled) {
        onPress(event as never);
      }
      return;
    }
    onAccessibilityAction?.(event);
  };

  return (
    <Pressable
      {...props}
      ref={setRef}
      // `role` only sets a different tag and still takes precedence when
      // set, so this fallback is always safe to add.
      accessibilityRole={props.accessibilityRole ?? 'button'}
      onPress={onPress}
      accessibilityActions={[{ name: ACTIVATE }, ...(accessibilityActions ?? [])]}
      onAccessibilityAction={handleAccessibilityAction}
    />
  );
};
