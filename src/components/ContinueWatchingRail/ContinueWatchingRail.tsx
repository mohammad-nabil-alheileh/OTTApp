import React from 'react';
import { View, Image, Pressable, FlatList, ListRenderItem } from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { clamp, formatDuration } from '../../utils/time';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { styles } from './ContinueWatchingRail.styles';
import {
  ContinueWatchingItem,
  ContinueWatchingRailProps,
} from './ContinueWatchingRail.types';

export const ContinueWatchingRail: React.FC<ContinueWatchingRailProps> = ({
  items,
  onSelectVOD,
}) => {
  const { containerRef, getItemProps, activeIndex } = useFocusGroup(
    'continue-rail',
    items.length,
  );

  if (items.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<ContinueWatchingItem> = ({ item, index }) => {
    const { vod, position, duration } = item;
    const percent = duration > 0 ? clamp((position / duration) * 100, 0, 100) : 0;
    // Whole seconds: a fractional position would leak a decimal into "sec".
    const remaining = Math.round(Math.max(0, duration - position));
    return (
      <Pressable
        {...getItemProps(index)}
        onPress={() => onSelectVOD(vod)}
        accessibilityRole="button"
        accessibilityLabel={`${vod.title}, ${formatDuration(
          remaining,
        )} left, ${Math.round(percent)} percent watched`}
        accessibilityHint="Opens details"
        style={({ focused }) => [styles.vodItem, focused && styles.vodItemFocused]}
      >
        <View aria-hidden>
          <Image source={{ uri: vod.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
        <View style={styles.cardOverlay} aria-hidden>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {vod.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.remaining}>
              {formatDuration(remaining)} left
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Continue Watching
      </Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.vod.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};