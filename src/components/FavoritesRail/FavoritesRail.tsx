import React from 'react';
import {
  View,
  Image,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { VODItem } from '../../types/vod';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { formatDuration } from '../../utils/time';
import { styles } from '../VODList/VODList.styles';
import { FavoritesRailProps } from './FavoritesRail.types';

export const FavoritesRail: React.FC<FavoritesRailProps> = ({
  items,
  onSelectVOD,
}) => {
  const { containerRef, getItemProps, activeIndex } = useFocusGroup(
    'favorites-rail',
    items.length,
  );

  if (items.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<VODItem> = ({ item, index }) => (
    <Pressable
      {...getItemProps(index)}
      onPress={() => onSelectVOD(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, favorite, rated ${item.rating} out of 5, ${formatDuration(
        item.duration,
      )}`}
      accessibilityHint="Opens details"
      style={({ focused }) => [
        styles.vodItem,
        focused && styles.vodItemFocused,
      ]}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
        aria-hidden
      />
      <View style={styles.cardOverlay} aria-hidden>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.rating}>★ {item.rating}</Text>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Favorites
      </Text>
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
