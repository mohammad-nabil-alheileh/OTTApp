import React from 'react';
import { TVFocusGuideView, View } from 'react-native';
import { useScreenReaderEnabled } from '../../accessibility/useScreenReaderEnabled';
import { FocusGroupProps } from './FocusGroup.types';

export const FocusGroup: React.FC<FocusGroupProps> = ({
  children,
  style,
  trapFocusDown = false,
}) => {
  const screenReaderEnabled = useScreenReaderEnabled();

  // With TalkBack on, react-native-tvos makes every TVFocusGuideView focusable
  // (with a placeholder "FocusGuide" label) and hands its accessibility focus to
  // a child. When that handoff loses a race with scrolling or layout, focus is
  // left on the whole rail instead of a card. TalkBack moves between the cards
  // on its own, so the guide is left out while it runs.
  if (screenReaderEnabled) {
    return <View style={style}>{children}</View>;
  }

  return (
    <TVFocusGuideView autoFocus trapFocusDown={trapFocusDown} style={style}>
      {children}
    </TVFocusGuideView>
  );
};
