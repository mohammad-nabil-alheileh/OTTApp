import { useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FocusGroupItemProps } from './useFocusGroup.types';
import { RailLayout, revealOffset } from './railReveal';
import { RailReveal } from './useRailReveal.types';

// Android TV scrolls a rail only until the focused card touches the screen
// edge, which clips its border and focus scale. Re-scroll so the rail's
// padding stays visible as a gutter, as revealWithGutter does on the web.
export const useRailReveal = <T>(layout: RailLayout): RailReveal<T> => {
  const listRef = useRef<FlatList<T> | null>(null);
  const scrollOffset = useRef(0);
  const viewport = useRef(0);

  const listProps = useMemo(
    () => ({
      ref: listRef,
      onLayout: (event: LayoutChangeEvent) => {
        viewport.current = event.nativeEvent.layout.width;
      },
      onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffset.current = event.nativeEvent.contentOffset.x;
      },
      scrollEventThrottle: 16,
    }),
    [],
  );

  const withReveal = useCallback(
    (props: FocusGroupItemProps, index: number): FocusGroupItemProps => ({
      ...props,
      onFocus: () => {
        props.onFocus?.();
        const offset = revealOffset(
          index,
          layout,
          scrollOffset.current,
          viewport.current,
        );
        if (offset !== null) {
          // Fast presses arrive before onScroll catches up with this scroll.
          scrollOffset.current = offset;
          // Animated, it fought Android's own focus scroll: 15 quick Rights
          // stopped at card 6 of 16 on the emulator. Unanimated, all landed.
          listRef.current?.scrollToOffset({ offset, animated: false });
        }
      },
    }),
    [layout],
  );

  return { listProps, withReveal };
};
