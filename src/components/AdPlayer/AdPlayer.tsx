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
  return decoded;
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
        // ExoPlayer's view is focusable by default. When the ad replaces the
        // focused player control, Android hands focus to the first focusable
        // view it finds, which is this invisible player, so the remote's
        // highlight disappears. Only the overlay's buttons should take focus.
        focusable={false}
        resizeMode="contain"
        progressUpdateInterval={250}
        // The overlay's badge and buttons describe the ad; a full-screen
        // TalkBack stop here would only pull focus away from them.
        importantForAccessibility="no-hide-descendants"
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