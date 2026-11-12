import React, { useEffect } from 'react';
import { FlatList, Image, ListRenderItem, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { VODItem } from '../../types/vod';
import { formatDuration } from '../../utils/time';
import { PlayerUpNextProps } from './PlayerUpNext.types';
import { styles } from './PlayerUpNext.styles';

// Suggestions inside the player: a full-screen rail over the last frame when
// a VOD finishes, or a compact shelf beneath the controls while paused. Picking
// a card swaps the stream instead of leaving the player.
export const PlayerUpNext: React.FC<PlayerUpNextProps> = ({
  items,
  onSelectVOD,
  variant = 'fullScreen',
  autoFocus = false,
}) => {
  const { containerRef, getItemProps, activeIndex, focusFirst } = useFocusGroup(
    'player-upnext',
    items.length,
  );

  // hasTVPreferredFocus is native-only, so the web needs an explicit focus.
  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus, focusFirst]);

  if (items.length === 0) {
    return null;
  }

  const isFullScreen = variant === 'fullScreen';

  const renderItem: ListRenderItem<VODItem> = ({ item, index }) => (
    <Pressable
      {...getItemProps(index)}
      hasTVPreferredFocus={autoFocus && index === 0}
      onPress={() => onSelectVOD(item)}
      accessibilityRole="button"
      accessibilityLabel={`Play ${item.title}, rated ${
        item.rating
      } out of 5, ${formatDuration(item.duration)}`}
      accessibilityHint="Starts playback"
      style={({ focused }) => [
        styles.card,
        isFullScreen ? styles.overlayCard : styles.bottomCard,
        focused && styles.cardFocused,
      ]}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
        aria-hidden
      />
      <View style={styles.cardOverlay} aria-hidden>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          <Text style={styles.star}>★</Text> {item.rating} ·{' '}
          {formatDuration(item.duration)}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View
      style={isFullScreen ? styles.fullScreen : styles.bottom}
      ref={containerRef}
    >
      {isFullScreen ? (
        <Text style={styles.title} accessibilityRole="header">
          Up Next
        </Text>
      ) : (
        <View style={styles.bottomHeader}>
          <View style={styles.accent} aria-hidden />
          <Text style={styles.bottomTitle} accessibilityRole="header">
            Recommended
          </Text>
        </View>
      )}
      <FlatList
        style={styles.list}
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
