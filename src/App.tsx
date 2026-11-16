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
import { AccountScreen } from './components/AccountScreen/AccountScreen';
import { MOCK_ACCOUNT, initialsOf } from './services/account';
import { ContinueWatchingRail } from './components/ContinueWatchingRail/ContinueWatchingRail';
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
import { HOME_HEADER_ROW, useHomeBack, withHomeRow } from './hooks/useHomeBack';
import { SearchScreen } from './components/SearchScreen/SearchScreen';
import { ListenScreen } from './components/ListenScreen/ListenScreen';
import { PodcastDetails } from './components/PodcastDetails/PodcastDetails';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
import { PageStatus } from './components/PageStatus/PageStatus';
import { getListenHistory, loadListenHistory } from './services/listenHistory';
import { getContinueListening, toAudioPlayable } from './services/podcasts';
import {
  loadArchive,
  loadLiveChannels,
  loadPodcasts,
  loadVods,
} from './services/catalog';
import { getAvailableArchive, toArchivePlayable } from './services/archive';
import { ArchiveRail } from './components/ArchiveRail/ArchiveRail';
import { useRemoteData } from './hooks/useRemoteData';
import { buildContinueWatching } from './services/continueWatching';
import {
  EpisodeRef,
  findSeriesEpisode,
  isSeries,
  Series,
  toEpisodePlayable,
  toPlayable,
} from './services/series';
import { VODItem } from './types/vod';
import { ArchiveProgramme, LiveChannel } from './types/live';
import { SavedPlayable } from './types/playable';
import { LoadFailure } from './types/load';
import { AudioPlayable, Podcast, PodcastEpisode } from './types/podcast';
import { SelectedContent } from './App.types';
import { HomeFocusTarget, resolveHomeFocus } from './utils/homeFocus';
import { styles } from './App.styles';

const NO_VODS: VODItem[] = [];
const NO_CHANNELS: LiveChannel[] = [];
const NO_PODCASTS: Podcast[] = [];
const NO_ARCHIVE: ArchiveProgramme[] = [];

export default function App() {
  return (
    <BoldTextProvider>
      <AppContent />
    </BoldTextProvider>
  );
}

const AppContent = () => {
  // Each dataset loads on its own, so one failed rail never blanks the page:
  // the home screen keeps its other rows and every screen keeps its chrome.
  const vods = useRemoteData(loadVods, NO_VODS);
  const live = useRemoteData(loadLiveChannels, NO_CHANNELS);
  const podcastCatalog = useRemoteData(loadPodcasts, NO_PODCASTS);
  const archive = useRemoteData(loadArchive, NO_ARCHIVE);
  const vodList = vods.data;
  const channels = live.data;
  // VOD whose details screen is open; it stays set while playing, so Back
  // from the player returns to the details screen.
  const [detailsItem, setDetailsItem] = useState<VODItem | null>(null);
  const [selected, setSelected] = useState<SelectedContent>(null);
  // Home card that opened Details. Home is rebuilt on return, so focus goes
  // back to it by video id; only changed while Home is hidden.
  const [homeFocusTarget, setHomeFocusTarget] =
    useState<HomeFocusTarget | null>(null);
  // Saved playback positions, most recently watched first.
  const [watchHistory, setWatchHistory] = useState<WatchProgress[]>([]);
  // Favorite VOD ids, most recently added first.
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  // Search overlay state.
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  // Audio: the Listen landing page, then a podcast's details, then the player.
  // Each stays set under the next, so Back steps out one screen at a time.
  const [listenVisible, setListenVisible] = useState(false);
  const [podcastDetails, setPodcastDetails] = useState<Podcast | null>(null);
  const [playingAudio, setPlayingAudio] = useState<AudioPlayable | null>(null);
  // Saved episode positions, most recently played first.
  const [listenHistory, setListenHistory] = useState<WatchProgress[]>([]);

  const {
    containerRef: headerContainerRef,
    getItemProps: getHeaderItemProps,
    focusFirst: focusFirstHeader,
  } = useFocusGroup('header-bar', 5);

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
    () => getContinueListening(listenHistory, podcastCatalog.data),
    [listenHistory, podcastCatalog.data],
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
    () => buildContinueWatching(watchHistory, vodList),
    [watchHistory, vodList],
  );

  const favoriteItems = useMemo(
    () =>
      favoriteIds
        .map(id => vodList.find(item => item.id === id))
        .filter((vod): vod is VODItem => vod !== undefined),
    [favoriteIds, vodList],
  );

  const homeFocus = useMemo(
    () =>
      resolveHomeFocus(homeFocusTarget, {
        continue: continueWatchingItems.map(item => item.vod.id),
        favorites: favoriteItems.map(vod => vod.id),
        vod: vodList.map(vod => vod.id),
      }),
    [homeFocusTarget, continueWatchingItems, favoriteItems, vodList],
  );
  // The wordmark owns the initial focus, so rails only claim a card when Home
  // is returning to one (after Details); the fallback row is not a target.
  const titleIsFirstStop = homeFocusTarget === null;
  const homeFocusIndex = (row: string) =>
    !titleIsFirstStop && homeFocus.row === row ? homeFocus.index : undefined;

  const openFromHome = useMemo(() => {
    const open = (row: string) => (vod: VODItem) => {
      setHomeFocusTarget({ row, videoId: vod.id });
      setDetailsItem(vod);
    };
    return {
      continue: open('continue'),
      favorites: open('favorites'),
      vod: open('vod'),
    };
  }, []);

  // The service keeps the sync cache and storage in step, so the returned ids
  // are safe to render immediately.
  const handleToggleFavorite = useCallback((vod: VODItem) => {
    setFavoriteIds(toggleFavorite(vod.id));
  }, []);

  // Only when no row has anything to show: otherwise each failed rail carries
  // its own message and the rest of the page stays exactly as it was.
  const homeFailure: LoadFailure | null =
    continueWatchingItems.length === 0 &&
    favoriteItems.length === 0 &&
    vods.failure !== null &&
    live.failure !== null
      ? {
          kind:
            vods.failure.kind === 'offline' && live.failure.kind === 'offline'
              ? 'offline'
              : 'error',
        }
      : null;

  const retryVods = vods.retry;
  const retryLive = live.retry;
  const retryHome = useCallback(() => {
    retryVods();
    retryLive();
  }, [retryVods, retryLive]);

  // Saving first moves the title (or episode) to the front of the history.
  const startPlayable = useCallback(
    (playable: SavedPlayable, duration: number) => {
      const { id } = playable;
      const saved = getWatchHistory().find(entry => entry.id === id);
      setWatchHistory(
        saveProgress(id, saved?.position ?? 0, saved?.duration ?? duration),
      );
      setSelected(playable);
    },
    [],
  );

  // A series resumes its current episode rather than playing the series url.
  const playVOD = useCallback(
    (vod: VODItem) => {
      const playable = toPlayable(vod, getWatchHistory());
      const episode = isSeries(vod)
        ? findSeriesEpisode([vod], playable.id)?.episode
        : undefined;
      startPlayable(playable, episode?.duration ?? vod.duration);
    },
    [startPlayable],
  );

  const playArchive = useCallback(
    (programme: ArchiveProgramme, channelName: string) => {
      setHomeFocusTarget(null);
      const saved = getWatchHistory().find(e => e.id === programme.id);
      startPlayable(
        toArchivePlayable(programme, channelName, saved?.position),
        programme.duration,
      );
    },
    [startPlayable],
  );

  const playVODEpisode = useCallback(
    (series: Series, ref: EpisodeRef) => {
      const saved = getWatchHistory().find(e => e.id === ref.episode.id);
      startPlayable(
        toEpisodePlayable(series, ref, saved?.position),
        ref.episode.duration,
      );
    },
    [startPlayable],
  );

  // Recomputed with the catalogue; expiry is checked again on the next load.
  const archiveOnOffer = useMemo(
    () => getAvailableArchive(archive.data),
    [archive.data],
  );
  const showArchive =
    archiveOnOffer.length > 0 || archive.isLoading || archive.failure !== null;

  // Back from any home row returns focus to the header before it exits.
  const homeScrollRef = useRef<ScrollView>(null);
  const isHomeVisible =
    !selected &&
    !playingAudio &&
    !podcastDetails &&
    !detailsItem &&
    !settingsVisible &&
    !searchVisible &&
    !listenVisible &&
    !accountVisible;
  const { getRow: getHomeRow } = useHomeBack(homeScrollRef, isHomeVisible);

  // Entering Home starts on the wordmark. On TV the view claims it through
  // hasTVPreferredFocus; on web there is no such prop, so focus it directly.
  const titleItemProps = getHeaderItemProps(0);
  useEffect(() => {
    if (isHomeVisible && titleIsFirstStop) {
      focusFirstHeader();
    }
  }, [focusFirstHeader, isHomeVisible, titleIsFirstStop]);

  const handleBack = useCallback(() => setSelected(null), []);
  const handleDetailsBack = useCallback(() => setDetailsItem(null), []);

  const handleAudioBack = useCallback(() => setPlayingAudio(null), []);
  const handlePodcastBack = useCallback(() => setPodcastDetails(null), []);
  const handleOpenListen = useCallback(() => {
    setHomeFocusTarget(null);
    setListenVisible(true);
  }, []);
  const handleCloseListen = useCallback(() => setListenVisible(false), []);

  const handleOpenSearch = useCallback(() => {
    setHomeFocusTarget(null);
    setSearchVisible(true);
  }, []);
  const handleCloseSearch = useCallback(() => {
    setSearchVisible(false);
    setSearchQuery('');
  }, []);

  const handleOpenSettings = useCallback(() => {
    setHomeFocusTarget(null);
    setSettingsVisible(true);
  }, []);
  const handleCloseSettings = useCallback(() => setSettingsVisible(false), []);

  const handleOpenAccount = useCallback(() => {
    setHomeFocusTarget(null);
    setAccountVisible(true);
  }, []);
  const handleCloseAccount = useCallback(() => setAccountVisible(false), []);

  if (selected) {
    return (
      // Keyed by content so playing another title starts from a clean player
      // (position, finished state, controls).
      <VideoPlayer
        key={selected.id ?? selected.url}
        item={selected}
        recommendedItems={vodList.filter(vod => vod.id !== selected.id)}
        onSelectRecommended={playVOD}
        onBack={handleBack}
      />
    );
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
        watchHistory={watchHistory}
        onPlayEpisode={playVODEpisode}
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

  if (accountVisible) {
    return (
      // Details opened from the favorites rail stack on top, so Back from a
      // title returns here instead of all the way home.
      <AccountScreen
        profile={MOCK_ACCOUNT}
        favorites={favoriteItems}
        onSelectVOD={setDetailsItem}
        onBack={handleCloseAccount}
      />
    );
  }

  if (searchVisible) {
    return (
      <SearchScreen
        videos={vodList}
        isLoading={vods.isLoading}
        failure={vods.failure}
        onRetry={vods.retry}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSelectVOD={setDetailsItem}
        onPlayEpisode={playVODEpisode}
        watchHistory={watchHistory}
        onBack={handleCloseSearch}
      />
    );
  }

  if (listenVisible) {
    return (
      <ListenScreen
        podcasts={podcastCatalog.data}
        isLoading={podcastCatalog.isLoading}
        failure={podcastCatalog.failure}
        onRetry={podcastCatalog.retry}
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
          <Pressable
            {...withHomeRow(titleItemProps, 0, getHomeRow(HOME_HEADER_ROW))}
            accessible
            accessibilityRole="header"
            hasTVPreferredFocus={titleIsFirstStop}
            style={({ focused }) => [
              styles.headerText,
              focused && styles.headerTextFocused,
            ]}
          >
            <Text style={styles.title}>OTT TV App</Text>
            <Text style={styles.subtitle}>
              Videos, Live Channels & Podcasts
            </Text>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              {...withHomeRow(
                getHeaderItemProps(1),
                1,
                getHomeRow(HOME_HEADER_ROW),
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
                getHeaderItemProps(2),
                2,
                getHomeRow(HOME_HEADER_ROW),
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
                getHeaderItemProps(3),
                3,
                getHomeRow(HOME_HEADER_ROW),
              )}
              onPress={handleOpenAccount}
              accessibilityRole="button"
              accessibilityLabel="Account"
              accessibilityHint="Opens account details"
              style={({ focused }) => [
                styles.iconButton,
                styles.headerButtonSpacing,
                focused && styles.searchButtonFocused,
              ]}
            >
              <Text style={styles.accountInitials} aria-hidden>
                {initialsOf(MOCK_ACCOUNT.name)}
              </Text>
            </Pressable>
            <Pressable
              {...withHomeRow(
                getHeaderItemProps(4),
                4,
                getHomeRow(HOME_HEADER_ROW),
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

      {homeFailure ? (
        <PageStatus
          groupId="home-status"
          kind={homeFailure.kind}
          subject="videos"
          retrying={vods.isLoading || live.isLoading}
          onRetry={retryHome}
        />
      ) : (
        <ScrollView
          ref={homeScrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {continueWatchingItems.length > 0 && (
            <FocusGroup>
              <ContinueWatchingRail
                items={continueWatchingItems}
                onSelectVOD={openFromHome.continue}
                homeRow={getHomeRow('continue')}
                preferredFocusIndex={homeFocusIndex('continue')}
              />
            </FocusGroup>
          )}
          {favoriteItems.length > 0 && (
            <FocusGroup>
              <FavoritesRail
                items={favoriteItems}
                onSelectVOD={openFromHome.favorites}
                homeRow={getHomeRow('favorites')}
                preferredFocusIndex={homeFocusIndex('favorites')}
              />
            </FocusGroup>
          )}
          <FocusGroup>
            <VODList
              vodList={vodList}
              isLoading={vods.isLoading}
              failure={vods.failure}
              onRetry={vods.retry}
              onSelectVOD={openFromHome.vod}
              homeRow={getHomeRow('vod')}
              preferredFocusIndex={homeFocusIndex('vod') ?? null}
            />
          </FocusGroup>
          {/* The last row traps Down so focus never leaves the page. */}
          <FocusGroup trapFocusDown={!showArchive}>
            <LiveChannelList
              channels={channels}
              isLoading={live.isLoading}
              failure={live.failure}
              onRetry={live.retry}
              homeRow={getHomeRow('live')}
              onSelectChannel={channel => {
                setHomeFocusTarget(null);
                setSelected({
                  title: channel.name,
                  url: channel.streamUrl,
                  isLive: channel.isLive,
                });
              }}
            />
          </FocusGroup>
          {showArchive && (
            <FocusGroup trapFocusDown>
              <ArchiveRail
                programmes={archiveOnOffer}
                channels={channels}
                isLoading={archive.isLoading}
                failure={archive.failure}
                onRetry={archive.retry}
                homeRow={getHomeRow('archive')}
                onSelectProgramme={playArchive}
              />
            </FocusGroup>
          )}
        </ScrollView>
      )}
    </View>
  );
};
