import React from 'react';
import {
  AccessibilityActionEvent,
  Platform,
  Pressable,
  PressableProps,
  View,
} from 'react-native';

const ACTIVATE = 'activate';

// On Android TV, TalkBack takes the D-pad center key for itself and sends an
// accessibility click instead, which Pressable ignores on TV. Declaring the
// "activate" action routes that click to onAccessibilityAction, where it is
// turned back into onPress. Without TalkBack the action never fires, so normal
// remote presses are not doubled.
export const AppPressable: React.FC<
  PressableProps & { ref?: React.Ref<View> }
> = ({ accessibilityActions, onAccessibilityAction, onPress, ...props }) => {
  if (Platform.OS !== 'android' || !onPress) {
    return (
      <Pressable
        {...props}
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
      onPress={onPress}
      accessibilityActions={[{ name: ACTIVATE }, ...(accessibilityActions ?? [])]}
      onAccessibilityAction={handleAccessibilityAction}
    />
  );
};
