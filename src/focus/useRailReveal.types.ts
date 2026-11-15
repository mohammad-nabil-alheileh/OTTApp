import { RefObject } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FocusGroupItemProps } from './useFocusGroup.types';

export interface RailListProps<T> {
  ref: RefObject<FlatList<T> | null>;
  onLayout?: (event: LayoutChangeEvent) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
}

export interface RailReveal<T> {
  // Spread on the rail's FlatList.
  listProps: RailListProps<T>;
  withReveal: (props: FocusGroupItemProps, index: number) => FocusGroupItemProps;
}
