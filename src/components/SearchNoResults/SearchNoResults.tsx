import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  View,
} from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { scaleSize } from '../../styles/theme';
import { SearchRecommendedRail } from '../SearchRecommendedRail/SearchRecommendedRail';
import { SearchNoResultsProps } from './SearchNoResults.types';
import { styles } from './SearchNoResults.styles';

// The panel pops in on a spring (fade + rise + scale settle), the magnifier
// badge twirls in right after, one ping ring expands off the badge, and the
// hint line follows a beat later. The rail cards then cascade on a shared
// timing clock, so the whole sequence looks the same on every platform.
const RAIL_ENTRANCE_MS = 780;
const MESSAGE_RISE = scaleSize(56);
const HINT_RISE = scaleSize(16);
const HINT_DELAY_MS = 220;
const ICON_DELAY_MS = 140;
const PING_DELAY_MS = 320;
const PING_MS = 620;
const BREATH_MS = 1700;
const BREATH_SCALE = 0.04;
const SPRING = { friction: 11, tension: 68 } as const;
const ICON_SPRING = { friction: 6.5, tension: 110 } as const;

// One entrance per empty-state episode: the values live with the mounted
// component, so moving focus down to the rail and back up does not replay it.
const useEntrance = () => {
  const message = useRef(new Animated.Value(0)).current;
  const hint = useRef(new Animated.Value(0)).current;
  const icon = useRef(new Animated.Value(0)).current;
  const ping = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const rail = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    let intro: Animated.CompositeAnimation | null = null;
    let breathing: Animated.CompositeAnimation | null = null;

    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (!mounted) {
        return;
      }
      if (reduceMotion) {
        message.setValue(1);
        hint.setValue(1);
        icon.setValue(1);
        ping.setValue(1);
        rail.setValue(1);
        return;
      }
      const useNativeDriver = Platform.OS !== 'web';
      intro = Animated.parallel([
        Animated.spring(message, {
          ...SPRING,
          toValue: 1,
          useNativeDriver,
        }),
        Animated.sequence([
          Animated.delay(ICON_DELAY_MS),
          Animated.spring(icon, { ...ICON_SPRING, toValue: 1, useNativeDriver }),
        ]),
        Animated.sequence([
          Animated.delay(HINT_DELAY_MS),
          Animated.spring(hint, { ...SPRING, toValue: 1, useNativeDriver }),
        ]),
        Animated.sequence([
          Animated.delay(PING_DELAY_MS),
          Animated.timing(ping, {
            toValue: 1,
            duration: PING_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver,
          }),
        ]),
        Animated.timing(rail, {
          toValue: 1,
          duration: RAIL_ENTRANCE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]);
      intro.start(({ finished }) => {
        if (!mounted || !finished) {
          return;
        }
        breathing = Animated.loop(
          Animated.sequence([
            Animated.timing(breathe, {
              toValue: 1,
              duration: BREATH_MS,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver,
            }),
            Animated.timing(breathe, {
              toValue: 0,
              duration: BREATH_MS,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver,
            }),
          ]),
        );
        breathing.start();
      });
    });

    return () => {
      mounted = false;
      intro?.stop();
      breathing?.stop();
    };
  }, [message, hint, icon, ping, breathe, rail]);

  return { message, hint, icon, ping, breathe, rail };
};

export const SearchNoResults: React.FC<SearchNoResultsProps> = ({
  query,
  recommended,
  onSelectVOD,
  recommendedFocusRequest,
  onRecommendedFocus,
}) => {
  const { message, hint, icon, ping, breathe, rail } = useEntrance();
  const trimmedQuery = query.trim();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.message,
          {
            opacity: message.interpolate({
              inputRange: [0, 0.5],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateY: message.interpolate({
                  inputRange: [0, 1],
                  outputRange: [MESSAGE_RISE, 0],
                }),
              },
              {
                scale: message.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.88, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.iconWrap} aria-hidden>
          <Animated.View
            style={[
              styles.iconPing,
              {
                opacity: ping.interpolate({
                  inputRange: [0, 0.15, 0.6, 1],
                  outputRange: [0, 0.55, 0.18, 0],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    scale: ping.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.55],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={{
              transform: [
                {
                  scale: breathe.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1 + BREATH_SCALE],
                  }),
                },
              ],
            }}
          >
            <Animated.View
              style={[
                styles.iconBadge,
                {
                  opacity: icon.interpolate({
                    inputRange: [0, 0.4],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                  transform: [
                    {
                      rotate: icon.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-90deg', '0deg'],
                      }),
                    },
                    {
                      scale: icon.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.iconLens} />
              <View style={styles.iconHandle} />
            </Animated.View>
          </Animated.View>
        </View>
        <View style={styles.textBlock}>
          <Text
            style={styles.title}
            numberOfLines={1}
            accessibilityLiveRegion="polite"
          >
            {trimmedQuery
              ? `No videos match “${trimmedQuery}”`
              : 'No videos available'}
          </Text>
          {trimmedQuery ? (
            <Animated.View
              style={{
                opacity: hint.interpolate({
                  inputRange: [0, 0.6],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: hint.interpolate({
                      inputRange: [0, 1],
                      outputRange: [HINT_RISE, 0],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.hint}>
                Try a different title, description, or year.
              </Text>
            </Animated.View>
          ) : null}
        </View>
      </Animated.View>
      <SearchRecommendedRail
        items={recommended}
        onSelectVOD={onSelectVOD}
        onFocus={onRecommendedFocus}
        focusRequest={recommendedFocusRequest}
        entranceProgress={rail}
      />
    </View>
  );
};
