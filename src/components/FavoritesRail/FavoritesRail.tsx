import React from 'react';
import {
  View,
  Image,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { VODItem } from '../../types/vod';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { useRailReveal } from '../../focus/useRailReveal';
import { usePreferredFocus } from '../../focus/usePreferredFocus';
import { withHomeRow } from '../../hooks/useHomeBack';
import { runtimeLabel } from '../../services/series';
import { railLayout, styles } from '../VODList/VODList.styles';
import { FavoritesRailProps } from './FavoritesRail.types';

export const FavoritesRail: React.FC<FavoritesRailProps> = ({
  items,
  onSelectVOD,
  homeRow,
  preferredFocusIndex,
}) => {
  const { containerRef, getItemProps, activeIndex, focusIndex } = useFocusGroup(
    'favorites-rail',
    items.length,
  );
  const { listProps, withReveal } = useRailReveal<VODItem>(railLayout);
  const initialNumToRender = usePreferredFocus(preferredFocusIndex, focusIndex);

  if (items.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<VODItem> = ({ item, index }) => (
    <Pressable
      {...withReveal(withHomeRow(getItemProps(index), index, homeRow), index)}
      hasTVPreferredFocus={index === preferredFocusIndex}
      onPress={() => onSelectVOD(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, favorite, rated ${item.rating} out of 5, ${runtimeLabel(item)}`}
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
          <Text style={styles.duration}>{runtimeLabel(item)}</Text>
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
        {...listProps}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={activeIndex}
        initialNumToRender={initialNumToRender}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
