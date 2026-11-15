import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { failureCopy } from '../../utils/loadFailure';
import { RailStatusProps } from './RailStatus.types';
import { styles } from './RailStatus.styles';

// Inline stand-in for a rail that could not load. The whole card is the retry
// button: one focus stop, a TV-sized target, and the row title above it still
// says which shelf failed.
export const RailStatus: React.FC<RailStatusProps> = ({
  groupId,
  kind,
  subject,
  retrying,
  onRetry,
  autoFocus = false,
}) => {
  const copy = failureCopy(kind, subject);
  const { containerRef, getItemProps, focusFirst } = useFocusGroup(groupId, 1);

  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus, focusFirst]);

  return (
    <View style={styles.container} ref={containerRef}>
      <Pressable
        {...getItemProps(0)}
        hasTVPreferredFocus={autoFocus}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={`${copy.title}. ${copy.message}`}
        accessibilityHint={retrying ? 'Retrying now' : 'Tries loading again'}
        accessibilityState={{ busy: retrying }}
        accessibilityLiveRegion="polite"
        style={({ focused }) => [
          styles.card,
          kind === 'error' && styles.cardError,
          focused && styles.cardFocused,
        ]}
      >
        <View
          style={[styles.badge, kind === 'error' && styles.badgeError]}
          aria-hidden
        >
          <Text
            style={[styles.badgeMark, kind === 'error' && styles.badgeMarkError]}
            accessible={false}
            importantForAccessibility="no"
            accessibilityElementsHidden
          >
            !
          </Text>
        </View>
        <View style={styles.textBlock} aria-hidden>
          <Text style={styles.title} numberOfLines={1}>
            {copy.title}
          </Text>
          <Text style={styles.hint} numberOfLines={2}>
            {retrying ? 'Retrying…' : copy.message}
          </Text>
        </View>
        <View style={styles.retry} aria-hidden>
          <Text style={styles.retryText}>
            {retrying ? 'Retrying…' : 'Try again'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
