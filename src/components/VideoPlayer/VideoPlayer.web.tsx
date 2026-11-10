/// <reference lib="dom" />
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Hls from 'hls.js';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { PlayerStatus } from '../PlayerStatus/PlayerStatus';
import { IdleCatcher } from '../IdleCatcher/IdleCatcher';
import { AdPlayer } from '../AdPlayer/AdPlayer';
import { useLiveState } from '../../hooks/useLiveState';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useAutoHide } from '../../hooks/useAutoHide';
import { useMidRollAds } from '../../hooks/useMidRollAds';
import { AUTO_QUALITY } from '../../types/quality';
import { toQualities } from '../../utils/quality';
import { styles, webVideoStyle } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liveEdge, setLiveEdge] = useState(0);
  const [dvrWindowLength, setDvrWindowLength] = useState(0);
  // Bumping this re-runs the setup effect below, which starts the stream at live.
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualities, setQualities] = useState<number[]>([]);
  const [quality, setQuality] = useState(AUTO_QUALITY);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const isHls = item.url.includes('.m3u8');
    let hls: Hls | undefined;

    // Prefer hls.js (same behaviour on every TV); native HLS is the fallback
    // for browsers without Media Source Extensions.
    if (isHls && Hls.isSupported()) {
      hls = new Hls();
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(`Stream failed: ${data.details}`);
        }
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setQualities(toQualities(data.levels.map(level => level.height)));
      });
      hls.loadSource(item.url);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      video.src = item.url;
    }
    video.play().catch(() => setPaused(true));

    return () => {
      hls?.destroy();
      hlsRef.current = null;
      video.removeAttribute('src');
      video.load();
    };
  }, [item.url, reloadKey]);

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  const overlay = useAutoHide(paused || !!error);

  const ads = useMidRollAds(item.adBreaks, currentTime, !item.isLive);
  const inAdBreak = !!ads.activeBreak;
  const { finishBreak } = ads;

  // Hold the content while a break plays; the ad has its own <video>.
  useEffect(() => {
    if (inAdBreak) {
      videoRef.current?.pause();
    }
  }, [inAdBreak]);

  const handleAdsComplete = useCallback(() => {
    finishBreak();
    videoRef.current?.play().catch(() => setPaused(true));
  }, [finishBreak]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // defaultPlaybackRate too, because loading a new source resets playbackRate to it.
      video.defaultPlaybackRate = playbackRate;
      video.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const hls = hlsRef.current;
    if (!hls) {
      return;
    }
    if (quality === AUTO_QUALITY) {
      hls.currentLevel = -1;
      return;
    }
    // Several levels can share a height; take the highest bitrate one.
    let best = -1;
    hls.levels.forEach((level, index) => {
      if (
        level.height === quality &&
        (best < 0 || level.bitrate > hls.levels[best].bitrate)
      ) {
        best = index;
      }
    });
    hls.currentLevel = best;
  }, [quality]);

  // Polled rather than read in onTimeUpdate, which stops firing while paused,
  // and the live edge keeps moving during a pause.
  useEffect(() => {
    if (!item.isLive) {
      return;
    }
    const timer = setInterval(() => {
      const seekable = videoRef.current?.seekable;
      if (seekable && seekable.length > 0) {
        const end = seekable.end(seekable.length - 1);
        setLiveEdge(end);
        setDvrWindowLength(end - seekable.start(0));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [item.isLive]);

  const liveState = useLiveState(currentTime, liveEdge, dvrWindowLength);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused && item.isLive && liveState.hasLeftDvrWindow) {
      setReloadKey(k => k + 1);
      setBuffering(true);
    } else if (video.paused) {
      video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const goLive = () => {
    seek(liveState.livePosition);
    videoRef.current?.play().catch(() => setPaused(true));
  };

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={webVideoStyle}
        playsInline
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        // 'waiting'/'seeking' = stalled; 'playing' (or 'canplay' when paused) = recovered.
        onWaiting={() => setBuffering(true)}
        onSeeking={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        // Ignore positions reported mid-seek so the seeker doesn't jump back;
        // 'seeked' then reports where the seek actually landed.
        onTimeUpdate={e => {
          if (!e.currentTarget.seeking) {
            setCurrentTime(e.currentTarget.currentTime);
          }
        }}
        onSeeked={e => setCurrentTime(e.currentTarget.currentTime)}
        // Live streams report Infinity; the controls hide the bar for live anyway.
        onDurationChange={e => {
          const d = e.currentTarget.duration;
          setDuration(Number.isFinite(d) ? d : 0);
        }}
        onError={() => setError('Playback failed')}
      />
      {ads.activeBreak ? (
        <AdPlayer adBreak={ads.activeBreak} onComplete={handleAdsComplete} />
      ) : (
        <View style={styles.overlay}>
          {overlay.visible && (
            <View style={styles.topBar}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          )}
          <PlayerStatus error={error} buffering={buffering} paused={paused} />
          {overlay.visible ? (
            <PlayerControls
              isLive={item.isLive}
              paused={paused}
              currentTime={currentTime}
              duration={duration}
              liveState={liveState}
              playbackRate={playbackRate}
              onPlaybackRateChange={setPlaybackRate}
              qualities={qualities}
              quality={quality}
              onQualityChange={setQuality}
              onTogglePlay={togglePlay}
              onSeek={seek}
              onGoLive={goLive}
              adMarkers={ads.markers}
            />
          ) : (
            <IdleCatcher onWake={overlay.show} />
          )}
        </View>
      )}
    </View>
  );
};
