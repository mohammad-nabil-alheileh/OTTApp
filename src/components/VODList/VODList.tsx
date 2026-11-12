import React, { useEffect } from 'react';
import { View, Image, Pressable, FlatList, ListRenderItem } from 'react-native';
import { AppText as Text } from '../AppText/AppText';
import { VODItem } from '../../types/vod';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { formatDuration } from '../../utils/time';
import { styles } from './VODList.styles';
import { VODListProps } from './VODList.types';

export const VODList: React.FC<VODListProps> = ({ vodList, onSelectVOD, isLoading }) => {
  const { containerRef, getItemProps, activeIndex, focusFirst } =
    useFocusGroup('vod-rail', vodList.length);

  // Native uses hasTVPreferredFocus below; on web this is a no-op until the
  // data arrives, then it puts focus on the rail.
  useEffect(() => {
    if (!isLoading) {
      focusFirst();
    }
  }, [isLoading, focusFirst]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText} accessibilityLiveRegion="polite">
          Loading VODs...
        </Text>
      </View>
    );
  }

  const renderVODItem: ListRenderItem<VODItem> = ({ item, index }) => (
    <Pressable
      {...getItemProps(index)}
      hasTVPreferredFocus={index === 0}
      onPress={() => onSelectVOD(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, rated ${item.rating} out of 5, ${formatDuration(
        item.duration,
      )}`}
      accessibilityHint="Opens details"
      style={({ focused }) => [styles.vodItem, focused && styles.vodItemFocused]}
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
        Videos On Demand
      </Text>
      <FlatList
        data={vodList}
        renderItem={renderVODItem}
        keyExtractor={item => item.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
