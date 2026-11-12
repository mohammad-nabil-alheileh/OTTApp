import React, { useEffect, useMemo } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ListRenderItem,
  View,
} from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { scaleSize } from '../../styles/theme';
import { VODItem } from '../../types/vod';
import { formatDuration } from '../../utils/time';
import { SearchRecommendedRailProps } from './SearchRecommendedRail.types';
import { styles } from './SearchRecommendedRail.styles';

// Fractions of the shared entrance clock. The heading lands before the cards
// so the eye is led down into the rail; the stagger caps after the first few
// cards because the rest start off-screen.
const TITLE_FADE = [0.1, 0.32];
const TITLE_RISE = [0.1, 0.4];
const CARD_START = 0.2;
const CARD_STAGGER = 0.075;
const MAX_STAGGERED_CARDS = 5;
const CARD_SPAN = 0.42;
const CARD_RISE = scaleSize(28);

// Shown under the no-results message so a dead-end search still has content
// to browse and a place for focus to go.
export const SearchRecommendedRail: React.FC<SearchRecommendedRailProps> = ({
  items,
  onSelectVOD,
  onFocus,
  focusRequest,
  entranceProgress,
}) => {
  const { containerRef, getItemProps, activeIndex, focusFirst } = useFocusGroup(
    'search-recommended',
    items.length,
  );

  useEffect(() => {
    if (focusRequest) {
      focusFirst();
    }
  }, [focusRequest, focusFirst]);

  // Styles are interpolated once per rail render. A card that mounts later
  // (FlatList virtualisation) picks up the finished clock and appears settled.
  const entrance = useMemo(() => {
    const cardStyle = (index: number) => {
      const start =
        CARD_START + Math.min(index, MAX_STAGGERED_CARDS) * CARD_STAGGER;
      const end = Math.min(start + CARD_SPAN, 1);
      return {
        opacity: entranceProgress.interpolate({
          inputRange: [start, end],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            translateY: entranceProgress.interpolate({
              inputRange: [start, end],
              outputRange: [CARD_RISE, 0],
              extrapolate: 'clamp',
            }),
          },
          {
            scale: entranceProgress.interpolate({
              inputRange: [start, end],
              outputRange: [0.9, 1],
              extrapolate: 'clamp',
            }),
          },
        ],
      };
    };

    return {
      title: {
        opacity: entranceProgress.interpolate({
          inputRange: TITLE_FADE,
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            translateY: entranceProgress.interpolate({
              inputRange: TITLE_RISE,
              outputRange: [scaleSize(10), 0],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
      cards: items.map((_, index) => cardStyle(index)),
    };
  }, [items, entranceProgress]);

  if (items.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<VODItem> = ({ item, index }) => {
    const itemProps = getItemProps(index);
    return (
      <Animated.View style={[styles.cardShell, entrance.cards[index]]}>
        <Pressable
          {...itemProps}
          onFocus={() => {
            itemProps.onFocus?.();
            onFocus?.();
          }}
          onPress={() => onSelectVOD(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, rated ${item.rating} out of 5, ${formatDuration(
            item.duration,
          )}`}
          accessibilityHint="Opens details"
          style={({ focused }) => [styles.card, focused && styles.cardFocused]}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
            aria-hidden
          />
          <View style={styles.overlay} aria-hidden>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              ★ {item.rating} · {formatDuration(item.duration)}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <Animated.View style={entrance.title}>
        <Text style={styles.title} accessibilityRole="header">
          Recommended
        </Text>
      </Animated.View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
