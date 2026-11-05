import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { styles } from './VODList.styles';
import { VODListProps } from './VODList.types';

export const VODList: React.FC<VODListProps> = ({
  vodList,
  onSelectVOD,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading VODs...</Text>
      </View>
    );
  }

  const renderVODItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.vodItem}
      onPress={() => onSelectVOD(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.vodInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <Text style={styles.duration}>
          {Math.floor(item.duration / 60)} min
        </Text>
      </View>
    </TouchableOpacity>
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
