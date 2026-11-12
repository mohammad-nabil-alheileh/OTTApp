import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { colors, sharedStyles } from '../../styles/theme';
import { formatTime } from '../../utils/time';
import { styles } from './AdOverlay.styles';
import { AdOverlayProps } from './AdOverlay.types';

const MAX_ADVERTISER_LENGTH = 400;

// Ad feeds are inconsistent about Unicode forms, so compose the text into a
// predictable shape before it reaches the info panel, and keep it to a
// sensible length so long names don't push the panel off screen.
const normalizeAdText = (text: string): string => {
  const normalized = text
    .normalize('NFKD')
    .replace(/[^\w\s.,'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return normalized.length > MAX_ADVERTISER_LENGTH
    ? `${normalized.slice(0, MAX_ADVERTISER_LENGTH - 1)}…`
    : normalized;
};

// "Ad 1 of 2 · 0:12" badge, an ad info button (bottom left) and a Skip
// button (bottom right) over the ad video.
export const AdOverlay: React.FC<AdOverlayProps> = ({
  ad,
  index,
  count,
  position,
  duration,
  loaded,
  onSkip,
}) => {
  const skipRef = useRef<View>(null);
  const infoRef = useRef<View>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const skippable = ad.skipOffset !== undefined;
  const skipIn = skippable ? Math.ceil((ad.skipOffset ?? 0) - position) : 0;
  const canSkip = skippable && loaded && skipIn <= 0;

  // Computed once per ad rather than on every position tick.
  const advertiserText = useMemo(
    () => (ad.advertiser ? normalizeAdText(ad.advertiser) : ''),
    [ad.advertiser],
  );
  const infoText = advertiserText
    ? `This ad is from ${advertiserText}.`
    : 'This is a sponsored message.';

  // Each ad starts with its details collapsed.
  useEffect(() => setInfoOpen(false), [ad.id, index]);

  // Skip takes focus when there is one, otherwise the info button does, so
  // the remote always has somewhere to land. hasTVPreferredFocus is
  // native-only, so the web focuses explicitly.
  useEffect(() => {
    if (Platform.OS === 'web') {
      (skippable ? skipRef : infoRef).current?.focus();
    }
  }, [skippable]);

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeLabel}>Ad </Text>
        <Text style={styles.badgeText}>
          {count > 1 ? `${index + 1} of ${count} · ` : ''}
          {loaded ? formatTime(duration - position) : ''}
        </Text>
        {!loaded && <ActivityIndicator color={colors.text} />}
      </View>
      <View style={styles.footer}>
        <View style={styles.infoColumn}>
          {infoOpen && (
            <View style={styles.infoPanel}>
              <Text style={styles.infoCaption}>Sponsored</Text>
              <Text style={styles.infoPanelText}>{infoText}</Text>
            </View>
          )}
          <Pressable
            ref={infoRef}
            hasTVPreferredFocus={!skippable}
            style={({ focused }) => [
              sharedStyles.controlButton,
              styles.infoButton,
              focused && sharedStyles.controlButtonFocused,
            ]}
            onPress={() => setInfoOpen(open => !open)}
            accessibilityRole="button"
            accessibilityLabel={`Ad details: ${ad.title}`}
            accessibilityState={{ expanded: infoOpen }}
            aria-expanded={infoOpen}
          >
            <Text style={sharedStyles.controlButtonText} numberOfLines={1}>
              {ad.title}
            </Text>
          </Pressable>
        </View>
        {skippable && (
          // Always focusable so the remote has somewhere to land; it only
          // acts once the skip offset has passed.
          <Pressable
            ref={skipRef}
            hasTVPreferredFocus
            style={({ focused }) => [
              sharedStyles.controlButton,
              styles.skipButton,
              focused && canSkip && sharedStyles.controlButtonFocused,
            ]}
            onPress={canSkip ? onSkip : undefined}
            accessibilityRole="button"
            accessibilityLabel={
              canSkip ? 'Skip ad' : `Skip ad in ${Math.max(skipIn, 1)} seconds`
            }
            accessibilityHint={
              canSkip ? undefined : 'Available after the countdown'
            }
          >
            <Text
              style={[
                sharedStyles.controlButtonText,
                !canSkip && styles.skipText,
              ]}
            >
              {canSkip ? 'Skip Ad ▶▶' : `Skip in ${Math.max(skipIn, 1)}`}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};