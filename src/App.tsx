import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { VODList } from './components/VODList/VODList';
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
        onPlay={vod =>
          setSelected({
            title: vod.title,
            url: vod.url,
            isLive: false,
            adBreaks: vod.adBreaks,
          })
        }
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
