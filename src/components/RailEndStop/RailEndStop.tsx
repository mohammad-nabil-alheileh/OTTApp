import React from 'react';
import { View } from 'react-native';
import { styles } from './RailEndStop.styles';
import { RailEndStopProps } from './RailEndStop.types';

// TalkBack picks Right's target by screen position and ignores trapFocus*, so
// from a rail's last card it would jump to the header. This invisible stop is
// nearer, and passes focus straight back.
export const RailEndStop: React.FC<RailEndStopProps> = ({ onFocus }) => (
  <View
    focusable
    accessible
    accessibilityLabel="End of row"
    onFocus={onFocus}
    style={styles.stop}
  />
);

export const railEndStopFooterStyle = styles.footer;
