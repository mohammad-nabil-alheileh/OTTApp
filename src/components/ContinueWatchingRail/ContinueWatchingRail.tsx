import React from 'react';
import { View, Text, Image, Pressable, FlatList, ListRenderItem } from 'react-native';
import { VODItem } from '../../types/vod';
import { formatDuration } from '../../utils/time';
import { styles } from '../VODList/VODList.styles';
import { ContinueWatchingRailProps } from './ContinueWatchingRail.types';

export const ContinueWatchingRail: React.FC<ContinueWatchingRailProps> = ({
  items,
  onSelectVOD,
}) => {
  if (items.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<VODItem> = ({ item }) => (
    <Pressable
      onPress={() => onSelectVOD(item)}
      style={({ focused }) => [styles.vodItem, focused && styles.vodItemFocused]}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.vodInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.rating}>★ {item.rating}</Text>
        <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Continue Watching</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
