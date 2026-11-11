import { View } from 'react-native';

export interface FocusGroupItemProps {
  ref?: (node: View | null) => void;
  onFocus?: () => void;
  tabIndex?: 0 | -1;
}

export interface FocusGroup {
  containerRef: (node: View | null) => void;
  getItemProps: (index: number) => FocusGroupItemProps;
  activeIndex: number;
  focusFirst: () => void;
}
