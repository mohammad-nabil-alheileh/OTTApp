import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { searchVideos } from '../../services/search';
import { VODItem } from '../../types/vod';
import { formatDuration } from '../../utils/time';
import { SearchKeyboard } from '../SearchKeyboard/SearchKeyboard';
import { SearchScreenProps } from './SearchScreen.types';
import { useSearchTyping } from './useSearchTyping';
import { styles } from './SearchScreen.styles';

type FocusedArea = 'back' | 'keyboard' | 'results';

export const SearchScreen: React.FC<SearchScreenProps> = ({
  videos,
  isLoading,
  query,
  onQueryChange,
  onSelectVOD,
  onBack,
}) => {
  const results = useMemo(() => searchVideos(videos, query), [videos, query]);
  const hasQuery = query.trim().length > 0;

  const { containerRef: backContainerRef, getItemProps: getBackItemProps } =
    useFocusGroup('search-back', 1);
  const {
    containerRef: resultsContainerRef,
    getItemProps: getResultItemProps,
    activeIndex: activeResultIndex,
    focusFirst: focusFirstResult,
  } = useFocusGroup('search-results', results.length);

  const [focusedArea, setFocusedArea] = useState<FocusedArea>('keyboard');
  const [keyboardFocusRequest, setKeyboardFocusRequest] = useState(0);

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  const appendChar = useCallback(
    (char: string) => onQueryChange(previous => previous + char),
    [onQueryChange],
  );
  const deleteLast = useCallback(
    () => onQueryChange(previous => previous.slice(0, -1)),
    [onQueryChange],
  );
  const clearQuery = useCallback(
    () => onQueryChange(() => ''),
    [onQueryChange],
  );

  useSearchTyping(true, appendChar, deleteLast);

  // Filtering shrinks the rail while it has focus; move focus somewhere valid.
  const previousResults = useRef(results);
  useEffect(() => {
    const changed = previousResults.current !== results;
    previousResults.current = results;
    if (!changed || focusedArea !== 'results') {
      return;
    }
    if (results.length > 0) {
      focusFirstResult();
    } else {
      setFocusedArea('keyboard');
      setKeyboardFocusRequest(request => request + 1);
    }
  }, [results, focusedArea, focusFirstResult]);

  const backItemProps = getBackItemProps(0);

  const renderResult: ListRenderItem<VODItem> = ({ item, index }) => {
    const itemProps = getResultItemProps(index);
    return (
      <Pressable
        {...itemProps}
        onFocus={() => {
          itemProps.onFocus?.();
          setFocusedArea('results');
        }}
        onPress={() => onSelectVOD(item)}
        style={({ focused }) => [
          styles.resultCard,
          focused && styles.resultCardFocused,
        ]}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.resultThumbnail}
          resizeMode="cover"
        />
        <View style={styles.resultOverlay}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.resultMeta} numberOfLines={1}>
            ★ {item.rating} · {formatDuration(item.duration)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View ref={backContainerRef}>
          <Pressable
            {...backItemProps}
            onFocus={() => {
              backItemProps.onFocus?.();
              setFocusedArea('back');
            }}
            onPress={onBack}
            style={({ focused }) => [
              styles.backButton,
              focused && styles.backButtonFocused,
            ]}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.queryBar}>
          <Text style={styles.queryIcon}>🔍</Text>
          <View style={styles.queryField}>
            {hasQuery ? (
              <Text style={styles.queryText} numberOfLines={1}>
                {query}
                <Text style={styles.caret}>|</Text>
              </Text>
            ) : (
              <Text style={styles.placeholder} numberOfLines={1}>
                Search videos…
              </Text>
            )}
          </View>
        </View>

        <View style={styles.keyboardWrap}>
          <SearchKeyboard
            onKeyPress={appendChar}
            onDelete={deleteLast}
            onClear={clearQuery}
            onFocus={() => setFocusedArea('keyboard')}
            focusRequest={keyboardFocusRequest}
          />
        </View>

        <Text style={styles.hint}>
          Arrows to move · Enter to select · Back to close
        </Text>

        <View style={styles.resultsSection} ref={resultsContainerRef}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {hasQuery ? 'Results' : 'All Videos'}
            </Text>
            {!isLoading && (
              <Text style={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'video' : 'videos'}
              </Text>
            )}
          </View>

          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Loading videos…</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderResult}
              keyExtractor={item => item.id}
              extraData={activeResultIndex}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {hasQuery
                  ? `No videos match “${query.trim()}”`
                  : 'No videos available'}
              </Text>
              {hasQuery && (
                <Text style={styles.emptyHint}>
                  Try a different title, description, or year.
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
