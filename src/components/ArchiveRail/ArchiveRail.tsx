import React from 'react';
import { FlatList, Image, ListRenderItem, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { RailStatus } from '../RailStatus/RailStatus';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { useRailEndStop } from '../../focus/useRailEndStop';
import { useRailReveal } from '../../focus/useRailReveal';
import { withHomeRow } from '../../hooks/useHomeBack';
import { archiveAccessibilityLabel, formatAiredAt } from '../../services/archive';
import { ArchiveProgramme } from '../../types/live';
import { formatDuration } from '../../utils/time';
import { railLayout, styles } from './ArchiveRail.styles';
import { ArchiveRailProps } from './ArchiveRail.types';

const TITLE = 'Catch-up';

export const ArchiveRail: React.FC<ArchiveRailProps> = ({
  programmes,
  channels,
  onSelectProgramme,
  isLoading,
  failure,
  onRetry,
  homeRow,
  now,
}) => {
  const { containerRef, getItemProps, activeIndex } = useFocusGroup(
    'archive-rail',
    programmes.length,
  );
  const { endStopProps, withEndStop } = useRailEndStop(programmes.length);
  const { listProps, withReveal } = useRailReveal<ArchiveProgramme>(railLayout);

  if (failure) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {TITLE}
        </Text>
        <RailStatus
          groupId="archive-rail-status"
          kind={failure.kind}
          subject="catch-up"
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
          Loading catch-up...
        </Text>
      </View>
    );
  }

  if (programmes.length === 0) {
    return null;
  }

  const channelName = (id: string) =>
    channels.find(channel => channel.id === id)?.name ?? 'Live TV';

  const renderProgramme: ListRenderItem<ArchiveProgramme> = ({ item, index }) => {
    const channel = channelName(item.channelId);
    return (
      <Pressable
        {...withEndStop(
          withReveal(withHomeRow(getItemProps(index), index, homeRow), index),
          index,
        )}
        onPress={() => onSelectProgramme(item, channel)}
        accessibilityRole="button"
        accessibilityLabel={archiveAccessibilityLabel(item, channel, now)}
        accessibilityHint="Plays recording"
        style={({ focused }) => [styles.card, focused && styles.cardFocused]}
      >
        <View aria-hidden>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{formatDuration(item.duration)}</Text>
          </View>
        </View>
        <View style={styles.cardBody} aria-hidden>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {`${channel} · ${formatAiredAt(item.airedAt, now)}`}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {TITLE}
      </Text>
      <FlatList
        {...endStopProps}
        {...listProps}
        data={programmes}
        renderItem={renderProgramme}
        keyExtractor={item => item.id}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
