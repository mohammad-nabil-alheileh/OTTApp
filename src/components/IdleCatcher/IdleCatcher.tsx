import React, { useEffect, useRef } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { styles } from './IdleCatcher.styles';
import { IdleCatcherProps } from './IdleCatcher.types';

// Holds focus while the player controls are hidden, so the first OK press
// only wakes the controls instead of pausing or seeking by surprise.
export const IdleCatcher: React.FC<IdleCatcherProps> = ({ onWake }) => {
  const ref = useRef<View>(null);

  // hasTVPreferredFocus is native-only, so the web focuses it explicitly.
  useEffect(() => {
    if (Platform.OS === 'web') {
      ref.current?.focus();
    }
  }, []);

  return (
    <Pressable
      ref={ref}
      hasTVPreferredFocus
      style={styles.catcher}
      onPress={onWake}
      accessibilityRole="button"
      accessibilityLabel="Show playback controls"
    />
  );
};
