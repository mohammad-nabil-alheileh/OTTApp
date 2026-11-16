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
  ViewProps,
} from 'react-native';
import { AppPressable as Pressable } from '../AppPressable/AppPressable';
import { AppText as Text } from '../AppText/AppText';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useFocusGroup } from '../../focus/useFocusGroup';
import { useRailCache } from '../../hooks/useRailCache';
import { SearchInputMethod, trackSearch } from '../../services/analytics';
import { getRecommendedVideos, searchVideos } from '../../services/search';
import {
  clearSearchHistory,
  getSearchHistory,
  loadSearchHistory,
  rememberSearch,
} from '../../services/searchHistory';
import { VODItem } from '../../types/vod';
import { runtimeLabel } from '../../services/series';
import { PageStatus } from '../PageStatus/PageStatus';
import { SearchHistory } from '../SearchHistory/SearchHistory';
import { SearchKeyboard } from '../SearchKeyboard/SearchKeyboard';
import { SearchNoResults } from '../SearchNoResults/SearchNoResults';
import { SearchScreenProps } from './SearchScreen.types';
import { useSearchTyping } from './useSearchTyping';
import { useVoiceSearch } from './useVoiceSearch';
import { useVoiceTrapKeys } from './useVoiceTrapKeys';
import { styles } from './SearchScreen.styles';

type FocusedArea = 'back' | 'mic' | 'keyboard' | 'results' | 'recommended';

// react-native-tvos narrows focusSearch to the container's children whenever a
// trapFocus* prop is set, on any native view, but its types declare them only
// on TVFocusGuideView.
const TRAP_FOCUS = {
  trapFocusUp: true,
  trapFocusDown: true,
  trapFocusLeft: true,
  trapFocusRight: true,
} as unknown as ViewProps;

// While the microphone is live the rest of the screen leaves TalkBack's
// reading order, so a swipe cannot wander off the voice session.
const OUTSIDE_VOICE_SESSION: ViewProps = {
  importantForAccessibility: 'no-hide-descendants',
  'aria-hidden': true,
};

export const SearchScreen: React.FC<SearchScreenProps> = ({
  videos,
  isLoading,
  failure,
  onRetry,
  query,
  onQueryChange,
  onSelectVOD,
  onBack,
}) => {
  // The rail keeps its last loaded results, so a failure while results are on
  // screen does not replace them with the page error.
  const rail = useRailCache(videos, failure);
  const results = useMemo(
    () => searchVideos(rail.items, query),
    [rail.items, query],
  );
  const recommended = useMemo(
    () => getRecommendedVideos(rail.items),
    [rail.items],
  );
  // Only an empty rail shows the placeholder; a retry over cached results
  // keeps them on screen while the request runs.
  const showLoading = isLoading && rail.items.length === 0;
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
    stop: stopVoice,
  } = useVoiceSearch();

  const [focusedArea, setFocusedArea] = useState<FocusedArea>('keyboard');
  const [keyboardFocusRequest, setKeyboardFocusRequest] = useState(0);
  const [recommendedFocusRequest, setRecommendedFocusRequest] = useState(0);
  const [history, setHistory] = useState<string[]>(getSearchHistory);
  // Which input produced the current query, reported with search analytics.
  const inputMethod = useRef<SearchInputMethod>('typed');

  useEffect(() => {
    let mounted = true;
    loadSearchHistory().then(entries => {
      if (mounted) {
        setHistory(entries);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Keep the query once the user acts on it (opens a result or leaves the
  // screen), but not for every keystroke, which would bury real searches.
  const rememberQuery = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      setHistory(rememberSearch(trimmed));
    }
  }, [query]);

  // Back belongs to the live session: it stops the recognizer instead of
  // closing Search out from under it.
  const handleBack = useCallback(() => {
    if (voiceListening) {
      stopVoice();
      return true;
    }
    rememberQuery();
    onBack();
    return true;
  }, [onBack, rememberQuery, stopVoice, voiceListening]);
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

  const selectHistoryEntry = useCallback(
    (entry: string) => {
      inputMethod.current = 'typed';
      // Focus lands on the fresh results rather than the chip being removed.
      setFocusedArea('results');
      onQueryChange(() => entry);
    },
    [onQueryChange],
  );

  const handleClearHistory = useCallback(() => {
    setHistory(clearSearchHistory());
    // The section unmounts under the focused button; land on the rail below
    // rather than leaving focus nowhere.
    setFocusedArea('results');
    focusFirstResult();
  }, [focusFirstResult]);

  const handleVoiceSearch = useCallback(() => {
    if (!voiceAvailable || voiceListening) {
      return;
    }
    // The mic becomes the session's only stop; hand focus to it before the
    // recognizer takes over so TalkBack reads "Listening".
    focusFirstMic();
    startVoice().then(text => {
      if (text) {
        inputMethod.current = 'voice';
        // Results replace the session; land on them like a history pick.
        setFocusedArea('results');
        onQueryChange(() => text);
        return;
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
  useVoiceTrapKeys(voiceListening, focusFirstMic);

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
        onPress={() => {
          rememberQuery();
          onSelectVOD(item);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, rated ${item.rating} out of 5, ${runtimeLabel(item)}`}
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
            ★ {item.rating} · {runtimeLabel(item)}
          </Text>
        </View>
      </Pressable>
    );
  };

  const header = (
    <View style={styles.header}>
      <View ref={backContainerRef}>
        <Pressable
          {...backItemProps}
          onFocus={() => {
            backItemProps.onFocus?.();
            setFocusedArea('back');
          }}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint={voiceListening ? 'Stops voice search' : 'Closes search'}
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
      <Text style={styles.hint} accessibilityLiveRegion="polite">
        {voiceListening
          ? voiceCapturing
            ? 'Listening… speak now'
            : 'Starting microphone… allow access if asked'
          : 'Arrows to move · Enter to select · Back to close'}
      </Text>
    </View>
  );

  // Only a rail with nothing cached steps aside; loaded results stay on screen
  // when the catalogue fails later.
  if (rail.failure) {
    return (
      <View style={styles.container}>
        {header}
        <PageStatus
          groupId="search-status"
          kind={rail.failure.kind}
          subject="search results"
          retrying={isLoading}
          onRetry={onRetry}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}

      <View style={styles.body}>
        <View
          style={[styles.queryBar, hasQuery && styles.queryBarActive]}
          {...(voiceListening ? TRAP_FOCUS : {})}
        >
          <View style={styles.queryIconBadge} aria-hidden>
            <Text
              style={styles.queryIcon}
              accessible={false}
              importantForAccessibility="no"
              accessibilityElementsHidden
            >
              🔍
            </Text>
          </View>
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
                hasTVPreferredFocus={voiceListening}
                onFocus={() => {
                  micItemProps.onFocus?.();
                  setFocusedArea('mic');
                }}
                onPress={handleVoiceSearch}
                accessibilityRole="button"
                accessibilityLabel={
                  voiceListening ? 'Listening' : 'Search by voice'
                }
                accessibilityHint={
                  voiceListening ? 'Back stops listening' : 'Starts voice search'
                }
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

        <View
          style={styles.resultsSection}
          {...(voiceListening ? OUTSIDE_VOICE_SESSION : {})}
        >
          {!hasQuery && history.length > 0 && (
            <SearchHistory
              entries={history}
              onSelect={selectHistoryEntry}
              onClear={handleClearHistory}
            />
          )}

          {/* The rail owns its own focus group, so it must sit after the
              history block in the tree: Up/Down then follows the screen. */}
          <View ref={resultsContainerRef} style={styles.resultsBlock}>
            {(showLoading || results.length > 0) && (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle} accessibilityRole="header">
                  {hasQuery ? 'Results' : 'All Videos'}
                </Text>
                {!showLoading && (
                  <Text
                    style={styles.resultsCount}
                    accessibilityLiveRegion="polite"
                  >
                    {results.length} {results.length === 1 ? 'video' : 'videos'}
                  </Text>
                )}
              </View>
            )}

            {showLoading ? (
              <View style={styles.emptyState}>
                <Text
                  style={styles.emptyTitle}
                  accessibilityLiveRegion="polite"
                >
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
                style={styles.resultsListBox}
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

        <View
          style={styles.footer}
          {...(voiceListening ? OUTSIDE_VOICE_SESSION : {})}
        >
          <View style={styles.keyboardWrap}>
            <SearchKeyboard
              onKeyPress={appendChar}
              onDelete={deleteLast}
              onClear={clearQuery}
              onFocus={() => setFocusedArea('keyboard')}
              focusRequest={keyboardFocusRequest}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
