import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, ScrollView } from 'react-native';
import { AppPressable as Pressable } from './components/AppPressable/AppPressable';
import { AppText as Text } from './components/AppText/AppText';
import { BoldTextProvider } from './accessibility/BoldTextProvider';
import { SettingsScreen } from './components/SettingsScreen/SettingsScreen';
import { VODList } from './components/VODList/VODList';
import { ContinueWatchingRail } from './components/ContinueWatchingRail/ContinueWatchingRail';
import { ContinueWatchingItem } from './components/ContinueWatchingRail/ContinueWatchingRail.types';
import { FavoritesRail } from './components/FavoritesRail/FavoritesRail';
import {
  getWatchHistory,
  loadWatchHistory,
  saveProgress,
  WatchProgress,
} from './services/watchHistory';
import { loadFavorites, toggleFavorite } from './services/favorites';
import { LiveChannelList } from './components/LiveChannelList/LiveChannelList';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { ShowDetails } from './components/ShowDetails/ShowDetails';
import { FocusGroup } from './components/FocusGroup/FocusGroup';
import { useFocusGroup } from './focus/useFocusGroup';
import { useHomeBack, withHomeRow } from './hooks/useHomeBack';
import { SearchScreen } from './components/SearchScreen/SearchScreen';
import { ListenScreen } from './components/ListenScreen/ListenScreen';
import { PodcastDetails } from './components/PodcastDetails/PodcastDetails';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
import { getListenHistory, loadListenHistory } from './services/listenHistory';
import { getContinueListening, toAudioPlayable } from './services/podcasts';
import {
  mockVODData,
  mockLiveChannels,
  mockPodcasts,
} from './services/mockData';
import { VODItem } from './types/vod';
import { LiveChannel } from './types/live';
import { AudioPlayable, Podcast, PodcastEpisode } from './types/podcast';
import { SelectedContent } from './App.types';
import { styles } from './App.styles';

export default function App() {
  return (
    <BoldTextProvider>
      <AppContent />
    </BoldTextProvider>
  );
}

const AppContent = () => {
  const [vodList, setVodList] = useState<VODItem[]>([]);
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // VOD whose details screen is open; it stays set while playing, so Back
  // from the player returns to the details screen.
  const [detailsItem, setDetailsItem] = useState<VODItem | null>(null);
  const [selected, setSelected] = useState<SelectedContent>(null);
  // Saved playback positions, most recently watched first.
  const [watchHistory, setWatchHistory] = useState<WatchProgress[]>([]);
  // Favorite VOD ids, most recently added first.
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  // Search overlay state.
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  // Audio: the Listen landing page, then a podcast's details, then the player.
  // Each stays set under the next, so Back steps out one screen at a time.
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [listenVisible, setListenVisible] = useState(false);
  const [podcastDetails, setPodcastDetails] = useState<Podcast | null>(null);
  const [playingAudio, setPlayingAudio] = useState<AudioPlayable | null>(null);
  // Saved episode positions, most recently played first.
  const [listenHistory, setListenHistory] = useState<WatchProgress[]>([]);

  const { containerRef: headerContainerRef, getItemProps: getHeaderItemProps } =
    useFocusGroup('header-bar', 3);

  useEffect(() => {
    loadWatchHistory().then(setWatchHistory);
    loadFavorites().then(setFavoriteIds);
    loadListenHistory().then(setListenHistory);
  }, []);

  // The audio player saves its final position while unmounting.
  useEffect(() => {
    if (!playingAudio) {
      setListenHistory(getListenHistory());
    }
  }, [playingAudio]);

  const continueListening = useMemo(
    () => getContinueListening(listenHistory, podcasts),
    [listenHistory, podcasts],
  );

  const playEpisode = useCallback(
    (podcast: Podcast, episode: PodcastEpisode) => {
      const saved = getListenHistory().find(entry => entry.id === episode.id);
      setPlayingAudio(toAudioPlayable(podcast, episode, saved?.position));
    },
    [],
  );

  // The player writes its final position while unmounting; passive effects
  // run after that, so returning home picks up the latest progress.
  useEffect(() => {
    if (!selected) {
      setWatchHistory(getWatchHistory());
    }
  }, [selected]);

  const continueWatchingItems = useMemo(
    () =>
      watchHistory
        .map(entry => {
          const vod = vodList.find(item => item.id === entry.id);
          return vod
            ? { vod, position: entry.position, duration: entry.duration }
            : null;
        })
        .filter((item): item is ContinueWatchingItem => item !== null),
    [watchHistory, vodList],
  );

  const favoriteItems = useMemo(
    () =>
      favoriteIds
        .map(id => vodList.find(item => item.id === id))
        .filter((vod): vod is VODItem => vod !== undefined),
    [favoriteIds, vodList],
  );

  // The service keeps the sync cache and storage in step, so the returned ids
  // are safe to render immediately.
  const handleToggleFavorite = useCallback((vod: VODItem) => {
    setFavoriteIds(toggleFavorite(vod.id));
  }, []);

  const playVOD = useCallback((vod: VODItem) => {
    const saved = getWatchHistory().find(entry => entry.id === vod.id);
    setWatchHistory(
      saveProgress(
        vod.id,
        saved?.position ?? 0,
        saved?.duration ?? vod.duration,
      ),
    );
    setSelected({
      title: vod.title,
      url: vod.url,
      isLive: false,
      adBreaks: vod.adBreaks,
      id: vod.id,
      startPosition: saved && saved.position > 0 ? saved.position : undefined,
    });
  }, []);

  useEffect(() => {
    // Simulates network latency; swap for a real fetch when an API exists.
    const timer = setTimeout(() => {
      setVodList(mockVODData);
      setChannels(mockLiveChannels);
      setPodcasts(mockPodcasts);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Home rows top to bottom; Back returns focus to the first one before it
  // exits the app.
  const homeScrollRef = useRef<ScrollView>(null);
  const homeRowKeys = useMemo(
    () => [
      ...(continueWatchingItems.length > 0 ? ['continue'] : []),
      ...(favoriteItems.length > 0 ? ['favorites'] : []),
      'vod',
      'live',
    ],
    [continueWatchingItems.length, favoriteItems.length],
  );
  const isHomeVisible =
    !selected &&
    !playingAudio &&
    !podcastDetails &&
    !detailsItem &&
    !settingsVisible &&
    !searchVisible &&
    !listenVisible;
  const { getRow: getHomeRow } = useHomeBack(
    homeRowKeys,
    homeScrollRef,
    isHomeVisible,
  );

  const handleBack = useCallback(() => setSelected(null), []);
  const handleDetailsBack = useCallback(() => setDetailsItem(null), []);

  const handleAudioBack = useCallback(() => setPlayingAudio(null), []);
  const handlePodcastBack = useCallback(() => setPodcastDetails(null), []);
  const handleOpenListen = useCallback(() => setListenVisible(true), []);
  const handleCloseListen = useCallback(() => setListenVisible(false), []);

  const handleOpenSearch = useCallback(() => setSearchVisible(true), []);
  const handleCloseSearch = useCallback(() => {
    setSearchVisible(false);
    setSearchQuery('');
  }, []);

  const handleOpenSettings = useCallback(() => setSettingsVisible(true), []);
  const handleCloseSettings = useCallback(() => setSettingsVisible(false), []);

  if (selected) {
    return <VideoPlayer item={selected} onBack={handleBack} />;
  }

  if (playingAudio) {
    return <AudioPlayer item={playingAudio} onBack={handleAudioBack} />;
  }

  if (podcastDetails) {
    return (
      <PodcastDetails
        key={podcastDetails.id}
        podcast={podcastDetails}
        listenHistory={listenHistory}
        onPlayEpisode={playEpisode}
        onBack={handlePodcastBack}
      />
    );
  }

  if (detailsItem) {
    return (
      // Keyed by show so opening another one from the carousel remounts the
      // screen: focus returns to Play and the carousel scrolls back to start.
      <ShowDetails
        key={detailsItem.id}
        item={detailsItem}
        relatedItems={vodList.filter(vod => vod.id !== detailsItem.id)}
        onSelectVOD={setDetailsItem}
        isFavorite={favoriteIds.includes(detailsItem.id)}
        onToggleFavorite={handleToggleFavorite}
        resumePosition={
          watchHistory.find(entry => entry.id === detailsItem.id)?.position
        }
        onBack={handleDetailsBack}
        onPlay={playVOD}
        onPlayTrailer={vod =>
          vod.trailer &&
          setSelected({
            title: `${vod.title} – Trailer`,
            url: vod.trailer.url,
            isLive: false,
          })
        }
      />
    );
  }

  if (settingsVisible) {
    return <SettingsScreen onBack={handleCloseSettings} />;
  }

  if (searchVisible) {
    return (
      <SearchScreen
        videos={vodList}
        isLoading={isLoading}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSelectVOD={setDetailsItem}
        onBack={handleCloseSearch}
      />
    );
  }

  if (listenVisible) {
    return (
      <ListenScreen
        podcasts={podcasts}
        isLoading={isLoading}
        continueListening={continueListening}
        onSelectPodcast={setPodcastDetails}
        onPlayEpisode={playEpisode}
        onBack={handleCloseListen}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FocusGroup style={styles.header}>
        <View ref={headerContainerRef} style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title} accessibilityRole="header">
              OTT TV App
            </Text>
            <Text style={styles.subtitle}>
              Videos, Live Channels & Podcasts
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              {...withHomeRow(
                getHeaderItemProps(0),
                0,
                getHomeRow('header'),
              )}
              onPress={handleOpenListen}
              accessibilityRole="button"
              accessibilityLabel="Listen"
              accessibilityHint="Opens podcasts"
              style={({ focused }) => [
                styles.searchButton,
                styles.headerButtonSpacing,
                focused && styles.searchButtonFocused,
              ]}
            >
              <Text style={styles.searchButtonIcon}>🎧</Text>
              <Text style={styles.searchButtonLabel}>Listen</Text>
            </Pressable>
            <Pressable
              {...withHomeRow(
                getHeaderItemProps(1),
                1,
                getHomeRow('header'),
              )}
              onPress={handleOpenSearch}
              accessibilityRole="button"
              accessibilityLabel="Search"
              accessibilityHint="Opens search"
              style={({ focused }) => [
                styles.searchButton,
                styles.searchButtonSpacing,
                focused && styles.searchButtonFocused,
              ]}
            >
              <Text style={styles.searchButtonIcon}>🔍</Text>
              <Text style={styles.searchButtonLabel}>Search</Text>
            </Pressable>
            <Pressable
              {...withHomeRow(
                getHeaderItemProps(2),
                2,
                getHomeRow('header'),
              )}
              onPress={handleOpenSettings}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              accessibilityHint="Opens settings"
              style={({ focused }) => [
                styles.iconButton,
                focused && styles.searchButtonFocused,
              ]}
            >
              <Text style={styles.settingsIcon}>{'\u2699\uFE0E'}</Text>
            </Pressable>
          </View>
        </View>
      </FocusGroup>

      <ScrollView
        ref={homeScrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {continueWatchingItems.length > 0 && (
          <FocusGroup>
            <ContinueWatchingRail
              items={continueWatchingItems}
              onSelectVOD={setDetailsItem}
              homeRow={getHomeRow('continue')}
            />
          </FocusGroup>
        )}
        {favoriteItems.length > 0 && (
          <FocusGroup>
            <FavoritesRail
              items={favoriteItems}
              onSelectVOD={setDetailsItem}
              homeRow={getHomeRow('favorites')}
            />
          </FocusGroup>
        )}
        <FocusGroup>
          <VODList
            vodList={vodList}
            isLoading={isLoading}
            onSelectVOD={setDetailsItem}
            homeRow={getHomeRow('vod')}
          />
        </FocusGroup>
        <FocusGroup>
          <LiveChannelList
            channels={channels}
            isLoading={isLoading}
            homeRow={getHomeRow('live')}
            onSelectChannel={channel =>
              setSelected({
                title: channel.name,
                url: channel.streamUrl,
                isLive: channel.isLive,
              })
            }
          />
        </FocusGroup>
      </ScrollView>
    </View>
  );
};
