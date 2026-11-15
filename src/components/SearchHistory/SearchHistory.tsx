import React from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { SearchHistoryProps } from './SearchHistory.types';
import { styles } from './SearchHistory.styles';

// Past queries shown while the field is empty, so a repeat search is one
// press away instead of retyping on the remote.
export const SearchHistory: React.FC<SearchHistoryProps> = ({
  entries,
  onSelect,
  onClear,
}) => {
  // The clear button shares the group so Up/Down treats the whole block as one
  // stop: keyboard -> history -> results, instead of catching "Clear all".
  const { containerRef, getItemProps, activeIndex } = useFocusGroup(
    'search-history',
    entries.length + 1,
  );

  const clearItemProps = getItemProps(entries.length);

  const renderEntry: ListRenderItem<string> = ({ item, index }) => {
    const itemProps = getItemProps(index);
    return (
      <Pressable
        {...itemProps}
        onPress={() => onSelect(item)}
        accessibilityRole="button"
        accessibilityLabel={`Search for ${item}`}
        accessibilityHint="Fills the search field"
        style={({ focused }) => [styles.chip, focused && styles.chipFocused]}
      >
        <Text style={styles.chipText} numberOfLines={1}>
          {item}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.section} ref={containerRef}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Recent searches
        </Text>
        <Pressable
          {...clearItemProps}
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear search history"
          style={({ focused }) => [
            styles.clearButton,
            focused && styles.clearButtonFocused,
          ]}
        >
          {({ focused }) => (
            <Text
              style={[styles.clearText, focused && styles.clearTextFocused]}
            >
              Clear all
            </Text>
          )}
        </Pressable>
      </View>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item}
        extraData={activeIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
