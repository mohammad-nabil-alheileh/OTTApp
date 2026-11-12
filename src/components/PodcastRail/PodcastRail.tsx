import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { Podcast } from '../../types/podcast';
import { styles } from './PodcastRail.styles';
import { PodcastRailProps } from './PodcastRail.types';

export const PodcastRail: React.FC<PodcastRailProps> = ({
  groupId,
  title,
  podcasts,
  onSelectPodcast,
  autoFocus = false,
}) => {
  const { containerRef, getItemProps, activeIndex, focusFirst } = useFocusGroup(
    groupId,
    podcasts.length,
  );

  // Native uses hasTVPreferredFocus below; the web needs an explicit focus.
  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus, focusFirst]);

  if (podcasts.length === 0) {
    return null;
  }

  const renderItem: ListRenderItem<Podcast> = ({ item, index }) => (
    <Pressable
      {...getItemProps(index)}
      hasTVPreferredFocus={autoFocus && index === 0}
      onPress={() => onSelectPodcast(item)}
      style={({ focused }) => [
        styles.podcastItem,
        focused && styles.vodItemFocused,
      ]}
    >
      <Image
        source={{ uri: item.artwork }}
        style={styles.artwork}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {item.author}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={podcasts}
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
