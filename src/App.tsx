import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { VODList } from './components/VODList/VODList';
import { ContinueWatchingRail } from './components/ContinueWatchingRail/ContinueWatchingRail';
import { ContinueWatchingItem } from './components/ContinueWatchingRail/ContinueWatchingRail.types';
import {
  getWatchHistory,
  loadWatchHistory,
  saveProgress,
  WatchProgress,
} from './services/watchHistory';
import { LiveChannelList } from './components/LiveChannelList/LiveChannelList';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { ShowDetails } from './components/ShowDetails/ShowDetails';
import { FocusGroup } from './components/FocusGroup/FocusGroup';
import { useFocusGroup } from './focus/useFocusGroup';
import { SearchKeyboard } from './components/SearchKeyboard/SearchKeyboard';
import { mockVODData, mockLiveChannels } from './services/mockData';
import { VODItem } from './types/vod';
import { LiveChannel } from './types/live';
import { SelectedContent } from './App.types';
import { styles } from './App.styles';

export default function App() {
  const [vodList, setVodList] = useState<VODItem[]>([]);
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // VOD whose details screen is open; it stays set while playing, so Back
  // from the player returns to the details screen.
  const [detailsItem, setDetailsItem] = useState<VODItem | null>(null);
  const [selected, setSelected] = useState<SelectedContent>(null);
  // Saved playback positions, most recently watched first.
  const [watchHistory, setWatchHistory] = useState<WatchProgress[]>([]);
  // Search overlay state.
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { containerRef: headerContainerRef, getItemProps: getHeaderItemProps } =
    useFocusGroup('header-bar', 1);

  useEffect(() => {
    loadWatchHistory().then(setWatchHistory);
  }, []);

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

  const playVOD = useCallback((vod: VODItem) => {
    const saved = getWatchHistory().find(entry => entry.id === vod.id);
    setWatchHistory(
      saveProgress(vod.id, saved?.position ?? 0, saved?.duration ?? vod.duration),
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
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = useCallback(() => setSelected(null), []);
  const handleDetailsBack = useCallback(() => setDetailsItem(null), []);

  const handleOpenSearch = useCallback(() => setSearchVisible(true), []);
  const handleCloseSearch = useCallback(() => {
    setSearchVisible(false);
    setSearchQuery('');
  }, []);
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter VOD and channels based on search query.
  const filteredVodList = useMemo(() => {
    if (!searchQuery.trim()) {
      return vodList;
    }
    const q = searchQuery.toLowerCase();
    return vodList.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [vodList, searchQuery]);

  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) {
      return channels;
    }
    const q = searchQuery.toLowerCase();
    return channels.filter(
      ch =>
        ch.name.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.category.toLowerCase().includes(q),
    );
  }, [channels, searchQuery]);

  if (selected) {
    return <VideoPlayer item={selected} onBack={handleBack} />;
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
        resumePosition={
          watchHistory.find(entry => entry.id === detailsItem.id)?.position
        }
        onBack={handleDetailsBack}
        onPlay={playVOD}
        onPlayTrailer={vod =>
          vod.trailer &&
          setSelected({ title: `${vod.title} – Trailer`, url: vod.trailer.url, isLive: false })
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <FocusGroup style={styles.header}>
        <View ref={headerContainerRef} style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>OTT TV App</Text>
            <Text style={styles.subtitle}>Videos & Live Channels</Text>
          </View>
          <Pressable
            {...getHeaderItemProps(0)}
            onPress={handleOpenSearch}
            style={({ focused }) => [
              styles.searchButton,
              focused && styles.searchButtonFocused,
            ]}
          >
            <Text style={styles.searchButtonIcon}>🔍</Text>
            <Text style={styles.searchButtonLabel}>Search</Text>
          </Pressable>
        </View>
      </FocusGroup>

      <SearchKeyboard
        visible={searchVisible}
        onClose={handleCloseSearch}
        onQueryChange={handleSearchQueryChange}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {continueWatchingItems.length > 0 && (
          <FocusGroup>
            <ContinueWatchingRail
              items={continueWatchingItems}
              onSelectVOD={setDetailsItem}
            />
          </FocusGroup>
        )}
        <FocusGroup>
          <VODList
            vodList={filteredVodList}
            isLoading={isLoading}
            onSelectVOD={setDetailsItem}
          />
        </FocusGroup>
        <FocusGroup>
          <LiveChannelList
            channels={filteredChannels}
            isLoading={isLoading}
            onSelectChannel={channel =>
              setSelected({ title: channel.name, url: channel.streamUrl, isLive: channel.isLive })
            }
          />
        </FocusGroup>
      </ScrollView>
    </View>
  );
}
