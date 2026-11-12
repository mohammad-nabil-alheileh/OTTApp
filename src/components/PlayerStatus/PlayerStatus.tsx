import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { colors } from '../../styles/theme';
import { styles, SPINNER_SIZE } from './PlayerStatus.styles';
import { PlayerStatusProps } from './PlayerStatus.types';

// Centre of the player: error > loading spinner > "Paused".
export const PlayerStatus: React.FC<PlayerStatusProps> = ({ error, buffering, paused }) => {
  let content: React.ReactNode = null;
  if (error) {
    content = (
      <Text style={styles.statusText} accessibilityRole="alert">
        {error}
      </Text>
    );
  } else if (buffering) {
    content = (
      <View style={styles.spinnerBackdrop}>
        <ActivityIndicator
          size={SPINNER_SIZE}
          color={colors.text}
          accessibilityLabel="Loading"
        />
      </View>
    );
  } else if (paused) {
    content = <Text style={styles.statusText}>❚❚ Paused</Text>;
  }

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {content}
    </View>
  );
};
