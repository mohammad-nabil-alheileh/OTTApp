import React from 'react';
import { View, Image, FlatList, ListRenderItem } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { LiveChannel } from '../../types/live';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { useRailEndStop } from '../../focus/useRailEndStop';
import { useRailReveal } from '../../focus/useRailReveal';
import { withHomeRow } from '../../hooks/useHomeBack';
import { railLayout, styles } from './LiveChannelList.styles';
import { LiveChannelListProps } from './LiveChannelList.types';
import { RailStatus } from '../RailStatus/RailStatus';

export const LiveChannelList: React.FC<LiveChannelListProps> = ({
  channels,
  onSelectChannel,
  isLoading,
  failure,
  onRetry,
  homeRow,
}) => {
  const { containerRef, getItemProps, activeIndex } = useFocusGroup(
    'live-rail',
    channels.length,
  );
  const { endStopProps, withEndStop } = useRailEndStop(channels.length);
  const { listProps, withReveal } = useRailReveal<LiveChannel>(railLayout);

  if (failure) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Live Channels
        </Text>
        <RailStatus
          groupId="live-rail-status"
          kind={failure.kind}
          subject="live channels"
          retrying={isLoading}
          onRetry={onRetry}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText} accessibilityLiveRegion="polite">
          Loading live channels...
        </Text>
      </View>
    );
  }

  const renderChannel: ListRenderItem<LiveChannel> = ({ item, index }) => (
    <Pressable
      {...withEndStop(
        withReveal(withHomeRow(getItemProps(index), index, homeRow), index),
        index,
      )}
      onPress={() => onSelectChannel(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.category}${
        item.isLive ? ', live' : ''
      }`}
      accessibilityHint="Plays channel"
      style={({ focused }) => [styles.channelCard, focused && styles.channelCardFocused]}
    >
      <Image
        source={{ uri: item.banner }}
        style={styles.banner}
        resizeMode="cover"
        aria-hidden
      />
      {item.isLive && (
        <View style={styles.liveBadge} aria-hidden>
          <Text style={styles.liveText}>● LIVE</Text>
        </View>
      )}
      <Image
        source={{ uri: item.icon }}
        style={styles.icon}
        resizeMode="cover"
        aria-hidden
      />
      <View style={styles.cardOverlay} aria-hidden>
        <Text style={styles.channelName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        Live Channels
      </Text>
      <FlatList
        {...endStopProps}
        {...listProps}
        data={channels}
        renderItem={renderChannel}
        keyExtractor={item => item.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
