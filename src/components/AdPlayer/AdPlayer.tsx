import React from 'react';
import { View } from 'react-native';
import Video, { ViewType } from 'react-native-video';
import { AdOverlay } from '../AdOverlay/AdOverlay';
import { useAdBreak } from '../../hooks/useAdBreak';
import { styles } from './AdPlayer.styles';
import { AdPlayerProps } from './AdPlayer.types';

export const AdPlayer: React.FC<AdPlayerProps> = ({ adBreak, onComplete }) => {
  const playback = useAdBreak(adBreak, onComplete);
  const { ad, index, setDuration, setPosition, next } = playback;

  if (!ad) {
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
      <AdOverlay {...playback} ad={ad} onSkip={next} />
    </View>
  );
};
