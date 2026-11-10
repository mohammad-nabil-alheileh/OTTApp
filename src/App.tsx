import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { VODList } from './components/VODList/VODList';
import { ContinueWatchingRail } from './components/ContinueWatchingRail/ContinueWatchingRail';
import { getWatchHistory, recordWatch } from './services/watchHistory';
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
  // Recently watched VOD ids, most recent first.
  const [watchHistory, setWatchHistory] = useState<string[]>(() => getWatchHistory());

  const continueWatchingItems = useMemo(
    () =>
      watchHistory
        .map(id => vodList.find(vod => vod.id === id))
        .filter((vod): vod is VODItem => Boolean(vod)),
    [watchHistory, vodList],
  );

  const playVOD = useCallback((vod: VODItem) => {
    setWatchHistory(recordWatch(vod.id));
    setSelected({
      title: vod.title,
      url: vod.url,
      isLive: false,
      adBreaks: vod.adBreaks,
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
