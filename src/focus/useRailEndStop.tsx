import React, { useCallback, useMemo, useRef } from 'react';
import { Platform, View } from 'react-native';
import { useScreenReaderEnabled } from '../accessibility/useScreenReaderEnabled';
import {
  RailEndStop,
  railEndStopFooterStyle,
} from '../components/RailEndStop/RailEndStop';
import { focusNode } from './focusNode';
import { FocusGroupItemProps } from './useFocusGroup.types';

export interface RailEndStopApi {
  // Spread on the rail's FlatList.
  endStopProps: {
    ListFooterComponent?: React.ReactElement;
    ListFooterComponentStyle?: typeof railEndStopFooterStyle;
  };
  // Wrap each card's props so the stop knows the last card.
  withEndStop: (
    props: FocusGroupItemProps,
    index: number,
  ) => FocusGroupItemProps;
}

// Keeps TalkBack's Right on a rail's last card (Android TV only; tvOS VoiceOver
// and the web focus groups already stop there).
export const useRailEndStop = (itemCount: number): RailEndStopApi => {
  const screenReaderEnabled = useScreenReaderEnabled();
  const active = Platform.OS === 'android' && screenReaderEnabled;
  const lastItem = useRef<View | null>(null);

  const withEndStop = useCallback(
    (props: FocusGroupItemProps, index: number): FocusGroupItemProps => {
      if (!active || index !== itemCount - 1) {
        return props;
      }
      return {
        ...props,
        ref: (node: View | null) => {
          props.ref?.(node);
          lastItem.current = node;
        },
      };
    },
    [active, itemCount],
  );

  const endStopProps = useMemo(() => {
    if (!active) {
      return {};
    }
    const backToLast = () => {
      if (lastItem.current) {
        focusNode(lastItem.current);
      }
    };
    return {
      ListFooterComponent: <RailEndStop onFocus={backToLast} />,
      ListFooterComponentStyle: railEndStopFooterStyle,
    };
  }, [active]);

  return { endStopProps, withEndStop };
};
