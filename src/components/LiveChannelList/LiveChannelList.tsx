import React from 'react';
import { View, Text, Image, Pressable, FlatList, ListRenderItem } from 'react-native';
import { LiveChannel } from '../../types/live';
import { styles } from './LiveChannelList.styles';
import { LiveChannelListProps } from './LiveChannelList.types';

export const LiveChannelList: React.FC<LiveChannelListProps> = ({
  channels,
  onSelectChannel,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading live channels...</Text>
      </View>
    );
  }

  const renderChannel: ListRenderItem<LiveChannel> = ({ item }) => (
    <Pressable
      onPress={() => onSelectChannel(item)}
      style={({ focused }) => [styles.channelCard, focused && styles.channelCardFocused]}
    >
      <Image source={{ uri: item.banner }} style={styles.banner} resizeMode="cover" />
      {item.isLive && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>● LIVE</Text>
        </View>
      )}
      <View style={styles.channelInfo}>
        <Image source={{ uri: item.icon }} style={styles.icon} resizeMode="cover" />
        <View style={styles.textInfo}>
          <Text style={styles.channelName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Live Channels</Text>
      <FlatList
        data={channels}
        renderItem={renderChannel}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
