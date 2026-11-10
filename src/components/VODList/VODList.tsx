import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, FlatList, ListRenderItem, Platform } from 'react-native';
import { VODItem } from '../../types/vod';
import { formatDuration } from '../../utils/time';
import { styles } from './VODList.styles';
import { VODListProps } from './VODList.types';

export const VODList: React.FC<VODListProps> = ({ vodList, onSelectVOD, isLoading }) => {
  const firstItemRef = useRef<View>(null);

  // hasTVPreferredFocus is native-only, so the web needs an explicit focus.
  useEffect(() => {
    if (Platform.OS === 'web' && !isLoading) {
      firstItemRef.current?.focus();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading VODs...</Text>
      </View>
    );
  }

  const renderVODItem: ListRenderItem<VODItem> = ({ item, index }) => (
    <Pressable
      ref={index === 0 ? firstItemRef : undefined}
      hasTVPreferredFocus={index === 0}
      onPress={() => onSelectVOD(item)}
      style={({ focused }) => [styles.vodItem, focused && styles.vodItemFocused]}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.vodInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.rating}>★ {item.rating}</Text>
        <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Videos On Demand</Text>
      <FlatList
        data={vodList}
        renderItem={renderVODItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
