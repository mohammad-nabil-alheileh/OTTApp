import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { failureCopy } from '../../utils/loadFailure';
import { PageStatusProps } from './PageStatus.types';
import { styles } from './PageStatus.styles';

// Whole-page state for a screen whose content could not load at all. Screens
// use it only when there is nothing else to show; a single failed rail keeps
// the rest of its page and renders RailStatus instead.
export const PageStatus: React.FC<PageStatusProps> = ({
  groupId,
  kind,
  subject,
  retrying,
  onRetry,
  autoFocus = true,
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
      <View style={styles.panel}>
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
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
        >
          {copy.title}
        </Text>
        <Text style={styles.message}>{copy.message}</Text>
        <Pressable
          {...getItemProps(0)}
          hasTVPreferredFocus={autoFocus}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retrying ? 'Retrying' : 'Try again'}
          accessibilityHint="Tries loading the page again"
          accessibilityState={{ busy: retrying }}
          style={({ focused }) => [
            styles.retry,
            focused && styles.retryFocused,
          ]}
        >
          <Text style={styles.retryText}>
            {retrying ? 'Retrying…' : 'Try again'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
