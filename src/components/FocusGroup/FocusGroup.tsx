import React from 'react';
import { TVFocusGuideView } from 'react-native';
import { FocusGroupProps } from './FocusGroup.types';

export const FocusGroup: React.FC<FocusGroupProps> = ({ children, style }) => (
  <TVFocusGuideView autoFocus style={style}>
    {children}
  </TVFocusGuideView>
);
