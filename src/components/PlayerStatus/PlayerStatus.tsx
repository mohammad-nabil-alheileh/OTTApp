import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { colors } from '../../styles/theme';
import { styles, SPINNER_SIZE } from './PlayerStatus.styles';
import { PlayerStatusProps } from './PlayerStatus.types';

// Centre of the player: error > loading spinner > "Paused".
export const PlayerStatus: React.FC<PlayerStatusProps> = ({
  error,
  buffering,
  paused,
  onRetry,
}) => {
  const retryRef = useRef<View>(null);

  // While the error shows, the transport controls are gone, so the retry
  // button has to claim focus on the web (native uses hasTVPreferredFocus).
  useEffect(() => {
    if (error && onRetry && Platform.OS === 'web') {
      retryRef.current?.focus();
    }
  }, [error, onRetry]);

  let content: React.ReactNode = null;
  if (error) {
    content = (
      <View style={styles.errorPanel}>
        <Text style={styles.statusText} accessibilityRole="alert">
          {error}
        </Text>
        {onRetry && (
          <Pressable
            ref={retryRef}
            hasTVPreferredFocus
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            accessibilityHint="Reloads the video from where it stopped"
            style={({ focused }) => [
              styles.retry,
              focused && styles.retryFocused,
            ]}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        )}
      </View>
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
