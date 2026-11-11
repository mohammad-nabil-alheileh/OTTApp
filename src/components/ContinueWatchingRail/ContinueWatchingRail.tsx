import React from 'react';
import { View, Text, Image, Pressable, FlatList, ListRenderItem } from 'react-native';
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
    return (
      <Pressable
        {...getItemProps(index)}
        onPress={() => onSelectVOD(vod)}
        style={({ focused }) => [styles.vodItem, focused && styles.vodItemFocused]}
      >
        <View>
          <Image source={{ uri: vod.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
        <View style={styles.cardOverlay}>
          <Text style={styles.title} numberOfLines={1}>
            {vod.title}
          </Text>
          <Text style={styles.remaining} numberOfLines={1}>
            {formatDuration(Math.max(0, duration - position))} left
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle}>Continue Watching</Text>
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