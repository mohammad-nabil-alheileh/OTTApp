import { FocusGroup } from './useFocusGroup.types';

const noop = () => {};

const nativeGroup: FocusGroup = {
  containerRef: noop,
  getItemProps: () => ({}),
  activeIndex: 0,
  focusFirst: noop,
};

// Android TV / Apple TV have their own focus engine (and TV focus groups), so
// the rails need no extra focus management there.
export const useFocusGroup = (
  _groupId: string,
  _itemCount: number,
): FocusGroup => nativeGroup;
