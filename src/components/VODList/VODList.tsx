import React from 'react';
import { View, Image, FlatList, ListRenderItem } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { VODItem } from '../../types/vod';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { usePreferredFocus } from '../../focus/usePreferredFocus';
import { withHomeRow } from '../../hooks/useHomeBack';
import { formatDuration } from '../../utils/time';
import { styles } from './VODList.styles';
import { VODListProps } from './VODList.types';
import { RailStatus } from '../RailStatus/RailStatus';

export const VODList: React.FC<VODListProps> = ({
  vodList,
  onSelectVOD,
  isLoading,
  failure,
  onRetry,
  homeRow,
  preferredFocusIndex = 0,
}) => {
  const { containerRef, getItemProps, activeIndex, focusIndex } =
    useFocusGroup('vod-rail', vodList.length);
  const initialNumToRender = usePreferredFocus(
    preferredFocusIndex,
    focusIndex,
    !isLoading && !failure,
  );

  // A failed rail keeps its title and takes only its own row; the rest of the
  // home page keeps working. Retry is the row's only focus stop.
  if (failure) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Videos On Demand
        </Text>
        <RailStatus
          groupId="vod-rail-status"
          kind={failure.kind}
          subject="videos"
          retrying={isLoading}
          onRetry={onRetry}
          autoFocus={preferredFocusIndex !== null}
        />
      </View>
    );
  }

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
      {...withHomeRow(getItemProps(index), index, homeRow)}
      hasTVPreferredFocus={index === preferredFocusIndex}
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
        initialNumToRender={initialNumToRender}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
