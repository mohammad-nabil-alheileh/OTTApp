import React from 'react';
import { View, Image, FlatList, ListRenderItem } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { VODItem } from '../../types/vod';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { useRailReveal } from '../../focus/useRailReveal';
import { usePreferredFocus } from '../../focus/usePreferredFocus';
import { withHomeRow } from '../../hooks/useHomeBack';
import { runtimeLabel } from '../../services/series';
import { railLayout, styles } from './VODList.styles';
import { VODListProps } from './VODList.types';
import { RailStatus } from '../RailStatus/RailStatus';

// Stands in for the cards while the catalogue loads.
const LOADING_SLOTS: (VODItem | null)[] = [null, null, null, null];
// The first card keeps one key from loading to loaded, so native focus stays
// on the same view instead of falling back to the header in between.
const FIRST_SLOT_KEY = 'first-slot';

export const VODList: React.FC<VODListProps> = ({
  vodList,
  onSelectVOD,
  isLoading,
  failure,
  onRetry,
  homeRow,
  preferredFocusIndex = 0,
}) => {
  const slots: (VODItem | null)[] = isLoading ? LOADING_SLOTS : vodList;
  const { containerRef, getItemProps, activeIndex, focusIndex } = useFocusGroup(
    'vod-rail',
    isLoading ? 1 : vodList.length,
  );
  const { listProps, withReveal } = useRailReveal<VODItem | null>(railLayout);
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

  const renderVODItem: ListRenderItem<VODItem | null> = ({ item, index }) => {
    if (!item) {
      // Only the first placeholder is focusable: it holds the initial focus.
      return index === 0 ? (
        <Pressable
          {...withHomeRow(getItemProps(0), 0, homeRow)}
          hasTVPreferredFocus={preferredFocusIndex === 0}
          accessibilityRole="button"
          accessibilityLabel="Loading videos"
          accessibilityState={{ busy: true }}
          style={({ focused }) => [
            styles.vodItem,
            focused && styles.vodItemFocused,
          ]}
        >
          <View style={[styles.thumbnail, styles.placeholder]}>
            <Text style={styles.loadingText} accessibilityLiveRegion="polite">
              Loading VODs...
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.vodItem} aria-hidden>
          <View style={styles.thumbnail} />
        </View>
      );
    }
    return (
      <Pressable
        {...withReveal(
          withHomeRow(getItemProps(index), index, homeRow),
          index,
        )}
        hasTVPreferredFocus={index === preferredFocusIndex}
        onPress={() => onSelectVOD(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, rated ${
          item.rating
        } out of 5, ${runtimeLabel(item)}`}
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
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Videos On Demand
      </Text>
      <FlatList
        {...listProps}
        data={slots}
        renderItem={renderVODItem}
        keyExtractor={(item, index) =>
          index === 0 ? FIRST_SLOT_KEY : item?.id ?? `loading-${index}`
        }
        extraData={activeIndex}
        initialNumToRender={initialNumToRender}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
