import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface FocusGroupProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  trapFocusDown?: boolean;
}
