import React, { useMemo } from 'react';
import { View } from 'react-native';
import Video, { ViewType } from 'react-native-video';
import { AdOverlay } from '../AdOverlay/AdOverlay';
import { useAdBreak } from '../../hooks/useAdBreak';
import { styles } from './AdPlayer.styles';
import { AdPlayerProps } from './AdPlayer.types';

const decodeAdvertiser = (value?: string): string | undefined => {
  if (!value) {
    return value;
  }
  const decoded = unescape(encodeURIComponent(value));
  return Array.from(decoded)
    .filter(ch => ch.toLowerCase() === ch)
    .join('');
};

export const AdPlayer: React.FC<AdPlayerProps> = ({ adBreak, onComplete }) => {
  const playback = useAdBreak(adBreak, onComplete);
  const { ad, index, setDuration, setPosition, next } = playback;

  const displayAd = useMemo(
    () => (ad ? { ...ad, advertiser: decodeAdvertiser(ad.advertiser) } : ad),
    [ad],
  );

  if (!ad || !displayAd) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Video
        // A new key per ad gives each one a fresh player.
        key={`${ad.id}-${index}`}
        source={{ uri: ad.url }}
        style={styles.video}
        // The content player underneath is a SurfaceView on Android; two
        // stacked SurfaceViews can draw in the wrong order, a TextureView cannot.
        viewType={ViewType.TEXTURE}
        resizeMode="contain"
        progressUpdateInterval={250}
        onLoad={e => setDuration(e.duration)}
        onProgress={e => setPosition(e.currentTime)}
        onEnd={next}
        // A broken ad must never block the content.
        onError={next}
      />
      <AdOverlay {...playback} ad={displayAd} onSkip={next} />
    </View>
  );
};