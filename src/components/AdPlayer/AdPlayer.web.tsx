/// <reference lib="dom" />
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { AdOverlay } from '../AdOverlay/AdOverlay';
import { useAdBreak } from '../../hooks/useAdBreak';
import { styles, webVideoStyle } from './AdPlayer.styles';
import { AdPlayerProps } from './AdPlayer.types';

export const AdPlayer: React.FC<AdPlayerProps> = ({ adBreak, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playback = useAdBreak(adBreak, onComplete);
  const { ad, index, setDuration, setPosition, next } = playback;
  const nextRef = useRef(next);
  nextRef.current = next;

  const url = ad?.url;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) {
      return;
    }
    video.src = url;
    // If autoplay with sound is refused, retry muted; if that fails too, skip.
    video
      .play()
      .catch(() => {
        video.muted = true;
        return video.play();
      })
      .catch(() => nextRef.current());
    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [url, index]);

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={webVideoStyle}
        playsInline
        onLoadedMetadata={e => {
          const d = e.currentTarget.duration;
          setDuration(Number.isFinite(d) ? d : 0);
        }}
        onTimeUpdate={e => setPosition(e.currentTarget.currentTime)}
        onEnded={() => next()}
        // A broken ad must never block the content.
        onError={() => next()}
      />
      {ad && <AdOverlay {...playback} ad={ad} onSkip={next} />}
    </View>
  );
};
