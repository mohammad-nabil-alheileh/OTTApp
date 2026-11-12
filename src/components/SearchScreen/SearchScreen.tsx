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
  View,
} from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { SearchInputMethod, trackSearch } from '../../services/analytics';
import { getRecommendedVideos, searchVideos } from '../../services/search';
import { VODItem } from '../../types/vod';
import { formatDuration } from '../../utils/time';
import { SearchKeyboard } from '../SearchKeyboard/SearchKeyboard';
import { SearchNoResults } from '../SearchNoResults/SearchNoResults';
import { SearchScreenProps } from './SearchScreen.types';
import { useSearchTyping } from './useSearchTyping';
import { useVoiceSearch } from './useVoiceSearch';
import { styles } from './SearchScreen.styles';

type FocusedArea = 'back' | 'mic' | 'keyboard' | 'results' | 'recommended';

export const SearchScreen: React.FC<SearchScreenProps> = ({
  videos,
  isLoading,
  query,
  onQueryChange,
  onSelectVOD,
  onBack,
}) => {
  const results = useMemo(() => searchVideos(videos, query), [videos, query]);
  const recommended = useMemo(() => getRecommendedVideos(videos), [videos]);
  const hasQuery = query.trim().length > 0;

  const { containerRef: backContainerRef, getItemProps: getBackItemProps } =
    useFocusGroup('search-back', 1);
  const {
    containerRef: micContainerRef,
    getItemProps: getMicItemProps,
    focusFirst: focusFirstMic,
  } = useFocusGroup('search-mic', 1);
  const {
    containerRef: resultsContainerRef,
    getItemProps: getResultItemProps,
    activeIndex: activeResultIndex,
    focusFirst: focusFirstResult,
  } = useFocusGroup('search-results', results.length);

  const {
    available: voiceAvailable,
    listening: voiceListening,
    capturing: voiceCapturing,
    partial: voicePartial,
    start: startVoice,
  } = useVoiceSearch();

  const [focusedArea, setFocusedArea] = useState<FocusedArea>('keyboard');
  const [keyboardFocusRequest, setKeyboardFocusRequest] = useState(0);
  const [recommendedFocusRequest, setRecommendedFocusRequest] = useState(0);
  // Which input produced the current query, reported with search analytics.
  const inputMethod = useRef<SearchInputMethod>('typed');

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  const appendChar = useCallback(
    (char: string) => {
      inputMethod.current = 'typed';
      onQueryChange(previous => previous + char);
    },
    [onQueryChange],
  );
  const deleteLast = useCallback(() => {
    inputMethod.current = 'typed';
    onQueryChange(previous => previous.slice(0, -1));
  }, [onQueryChange]);
  const clearQuery = useCallback(() => {
    inputMethod.current = 'typed';
    onQueryChange(() => '');
  }, [onQueryChange]);

  const handleVoiceSearch = useCallback(() => {
    if (!voiceAvailable || voiceListening) {
      return;
    }
    startVoice().then(text => {
      if (text) {
        inputMethod.current = 'voice';
        onQueryChange(() => text);
      }
      // Cancel and no-match land back on the mic, ready to try again.
      focusFirstMic();
    });
  }, [
    focusFirstMic,
    onQueryChange,
    startVoice,
    voiceAvailable,
    voiceListening,
  ]);

  useSearchTyping(true, appendChar, deleteLast);

  // Filtering shrinks the rail while it has focus. Move focus to whatever
  // replaced it, so it never snaps back to the top of the keyboard.
  const previousResults = useRef(results);
  useEffect(() => {
    const changed = previousResults.current !== results;
    previousResults.current = results;
    if (!changed) {
      return;
    }
    if (focusedArea === 'results') {
      if (results.length > 0) {
        focusFirstResult();
      } else if (recommended.length > 0) {
        setFocusedArea('recommended');
        setRecommendedFocusRequest(request => request + 1);
      } else {
        setFocusedArea('keyboard');
        setKeyboardFocusRequest(request => request + 1);
      }
    } else if (focusedArea === 'recommended' && results.length > 0) {
      setFocusedArea('results');
      focusFirstResult();
    }
  }, [results, focusedArea, focusFirstResult, recommended.length]);

  // Report the query once typing or speaking pauses, tagged with how it was
  // entered so voice searches can be measured separately.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) {
      return;
    }
    const timer = setTimeout(() => {
      trackSearch({
        query: trimmed,
        resultCount: results.length,
        inputMethod: inputMethod.current,
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [query, results, isLoading]);

  const backItemProps = getBackItemProps(0);
  const micItemProps = getMicItemProps(0);

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
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, rated ${item.rating} out of 5, ${formatDuration(
          item.duration,
        )}`}
        accessibilityHint="Opens details"
        style={({ focused }) => [
          styles.resultCard,
          focused && styles.resultCardFocused,
        ]}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.resultThumbnail}
          resizeMode="cover"
          aria-hidden
        />
        <View style={styles.resultOverlay} aria-hidden>
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
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityHint="Closes search"
            style={({ focused }) => [
              styles.backButton,
              focused && styles.backButtonFocused,
            ]}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Search
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.queryBar}>
          <Text
            style={styles.queryIcon}
            accessible={false}
            importantForAccessibility="no"
            accessibilityElementsHidden
          >
            🔍
          </Text>
          <View style={styles.queryField}>
            {voiceListening && voicePartial ? (
              <Text
                style={[styles.queryText, styles.queryPartial]}
                numberOfLines={1}
              >
                {voicePartial}
                <Text style={styles.caret}>|</Text>
              </Text>
            ) : hasQuery ? (
              <Text style={styles.queryText} numberOfLines={1}>
                {query}
                <Text style={styles.caret}>|</Text>
              </Text>
            ) : (
              <Text style={styles.placeholder} numberOfLines={1}>
                {voiceListening
                  ? voiceCapturing
                    ? 'Listening…'
                    : 'Starting microphone…'
                  : 'Search videos…'}
              </Text>
            )}
          </View>
          {voiceAvailable && (
            <View ref={micContainerRef}>
              <Pressable
                {...micItemProps}
                onFocus={() => {
                  micItemProps.onFocus?.();
                  setFocusedArea('mic');
                }}
                onPress={handleVoiceSearch}
                accessibilityRole="button"
                accessibilityLabel={
                  voiceListening ? 'Listening' : 'Search by voice'
                }
                accessibilityHint="Starts voice search"
                accessibilityState={{ busy: voiceListening }}
                aria-busy={voiceListening}
                style={({ focused }) => [
                  styles.micButton,
                  focused && styles.micButtonFocused,
                  voiceListening && styles.micButtonListening,
                ]}
              >
                <Text style={styles.micIcon}>🎤</Text>
              </Pressable>
            </View>
          )}
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

        <Text style={styles.hint} accessibilityLiveRegion="polite">
          {voiceListening
            ? voiceCapturing
              ? 'Listening… speak now'
              : 'Starting microphone… allow access if asked'
            : 'Arrows to move · Enter to select · Back to close'}
        </Text>

        <View style={styles.resultsSection} ref={resultsContainerRef}>
          {(isLoading || results.length > 0) && (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle} accessibilityRole="header">
                {hasQuery ? 'Results' : 'All Videos'}
              </Text>
              {!isLoading && (
                <Text
                  style={styles.resultsCount}
                  accessibilityLiveRegion="polite"
                >
                  {results.length} {results.length === 1 ? 'video' : 'videos'}
                </Text>
              )}
            </View>
          )}

          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle} accessibilityLiveRegion="polite">
                Loading videos…
              </Text>
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
            <SearchNoResults
              query={query}
              recommended={recommended}
              onSelectVOD={onSelectVOD}
              recommendedFocusRequest={recommendedFocusRequest}
              onRecommendedFocus={() => setFocusedArea('recommended')}
            />
          )}
        </View>
      </View>
    </View>
  );
};
