import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { VODItem } from '../../types/vod';
import { formatDuration, formatTime } from '../../utils/time';
import { sharedStyles } from '../../styles/theme';
import { styles } from './ShowDetails.styles';
import { ShowDetailsProps } from './ShowDetails.types';

export const ShowDetails: React.FC<ShowDetailsProps> = ({
  item,
  resumePosition,
  relatedItems,
  onPlay,
  onPlayTrailer,
  onSelectVOD,
  isFavorite,
  onToggleFavorite,
  onBack,
}) => {
  const { trailer } = item;

  // On web the buttons and the carousel are separate focus groups, so arrow
  // keys move along each row and Up/Down jump between them. Native TV focus
  // engines handle this on their own (both hooks are no-ops there).
  const buttons = useFocusGroup('details-buttons', trailer ? 3 : 2);
  const related = useFocusGroup('details-related', relatedItems.length);
  const { focusFirst } = buttons;

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  // hasTVPreferredFocus is native-only, so the web needs an explicit focus.
  useEffect(() => {
    focusFirst();
  }, [focusFirst]);

  const renderRelatedItem: ListRenderItem<VODItem> = ({ item: vod, index }) => (
    <Pressable
      {...related.getItemProps(index)}
      onPress={() => onSelectVOD(vod)}
      style={({ focused }) => [
        styles.relatedItem,
        focused && styles.relatedItemFocused,
      ]}
    >
      <Image
        source={{ uri: vod.thumbnail }}
        style={styles.relatedThumbnail}
        resizeMode="cover"
      />
      <View style={styles.relatedOverlay}>
        <Text style={styles.relatedTitle} numberOfLines={1}>
          {vod.title}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Image
          source={{ uri: item.poster }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{item.releaseDate.slice(0, 4)}</Text>
            <Text style={styles.rating}>★ {item.rating}</Text>
            <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
          </View>
          <Text style={styles.description} numberOfLines={4}>
            {item.description}
          </Text>
          <View style={styles.buttons} ref={buttons.containerRef}>
            <Pressable
              {...buttons.getItemProps(0)}
              hasTVPreferredFocus
              style={({ focused }) => [
                sharedStyles.controlButton,
                focused && sharedStyles.controlButtonFocused,
              ]}
              onPress={() => onPlay(item)}
            >
              <Text style={sharedStyles.controlButtonText}>
                {resumePosition !== undefined && resumePosition > 0
                  ? `▶ Resume · ${formatTime(resumePosition)}`
                  : '▶ Play'}
              </Text>
            </Pressable>
            {trailer && (
              <Pressable
                {...buttons.getItemProps(1)}
                style={({ focused }) => [
                  sharedStyles.controlButton,
                  focused && sharedStyles.controlButtonFocused,
                ]}
                onPress={() => onPlayTrailer(item)}
              >
                <Text style={sharedStyles.controlButtonText}>
                  Trailer · {formatTime(trailer.duration)}
                </Text>
              </Pressable>
            )}
            <Pressable
              {...buttons.getItemProps(trailer ? 2 : 1)}
              onPress={() => onToggleFavorite(item)}
              style={({ focused }) => [
                sharedStyles.controlButton,
                focused && sharedStyles.controlButtonFocused,
              ]}
            >
              <Text style={sharedStyles.controlButtonText}>
                {isFavorite ? '♥ Favorited' : '♡ Favorite'}
              </Text>
            </Pressable>
          </View>
          {relatedItems.length > 0 && (
            <View style={styles.related} ref={related.containerRef}>
              <Text style={styles.relatedHeading}>More to Watch</Text>
              <FlatList
                data={relatedItems}
                renderItem={renderRelatedItem}
                keyExtractor={vod => vod.id}
                extraData={related.activeIndex}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedListContent}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
