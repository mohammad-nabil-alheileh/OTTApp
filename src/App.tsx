import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
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

  if (selected) {
    return <VideoPlayer item={selected} onBack={handleBack} />;
  }

  if (detailsItem) {
    return (
      <ShowDetails
        item={detailsItem}
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
      <View style={styles.header}>
        <Text style={styles.title}>OTT TV App</Text>
        <Text style={styles.subtitle}>Videos & Live Channels</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ContinueWatchingRail items={continueWatchingItems} onSelectVOD={setDetailsItem} />
        <VODList
          vodList={vodList}
          isLoading={isLoading}
          onSelectVOD={setDetailsItem}
        />
        <LiveChannelList
          channels={channels}
          isLoading={isLoading}
          onSelectChannel={channel =>
            setSelected({ title: channel.name, url: channel.streamUrl, isLive: channel.isLive })
          }
        />
      </ScrollView>
    </View>
  );
}
