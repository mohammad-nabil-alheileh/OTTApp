/// <reference lib="dom" />
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Hls from 'hls.js';
import { AppText as Text } from '../AppText/AppText';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { PlayerStatus } from '../PlayerStatus/PlayerStatus';
import { PlayerUpNext } from '../PlayerUpNext/PlayerUpNext';
import { IdleCatcher } from '../IdleCatcher/IdleCatcher';
import { AdPlayer } from '../AdPlayer/AdPlayer';
import { useLiveState } from '../../hooks/useLiveState';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useAutoHide } from '../../hooks/useAutoHide';
import { useScreenReaderEnabled } from '../../accessibility/useScreenReaderEnabled';
import { useMidRollAds } from '../../hooks/useMidRollAds';
import { useStallWatchdog } from '../../hooks/useStallWatchdog';
import { useWatchProgress } from '../../hooks/useWatchProgress';
import { AUTO_QUALITY } from '../../types/quality';
import { toQualities } from '../../utils/quality';
import { styles, webVideoStyle } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

const STALL_MESSAGE = 'Playback stalled. Check your connection.';
// How far the clock must move past the point buffering started before the
// spinner is trusted to be stale.
const BUFFERING_EPSILON_SECONDS = 0.25;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  item,
  onBack,
  recommendedItems,
  onSelectRecommended,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  // Where the next source load should resume; set when retrying a stall so a
  // dropped VOD does not start over from the original resume point.
  const resumeAtRef = useRef<number | null>(null);
  // Position at the moment buffering started, to tell a real stall (clock
  // frozen) from a stale 'waiting' whose 'playing' never arrived.
  const bufferingFromRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liveEdge, setLiveEdge] = useState(0);
  const [dvrWindowLength, setDvrWindowLength] = useState(0);
  // Bumping this re-runs the setup effect below, which starts the stream at live.
  const [reloadKey, setReloadKey] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualities, setQualities] = useState<number[]>([]);
  const [quality, setQuality] = useState(AUTO_QUALITY);
  // A finished VOD parks on its last frame and offers other titles instead of
  // the transport controls.
  const [ended, setEnded] = useState(false);
  const hasRecommendations =
    !item.isLive && !!recommendedItems?.length && !!onSelectRecommended;
  const showsUpNext = ended && hasRecommendations;

  // A different title starts at its own resume point, not the last retry's.
  useEffect(() => {
    resumeAtRef.current = null;
  }, [item.url]);

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
          setPlaybackError(`Stream failed: ${data.details}`);
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

  const ads = useMidRollAds(
    item.adBreaks,
    currentTime,
    !item.isLive,
    item.startPosition ?? 0,
  );
  const inAdBreak = !!ads.activeBreak;
  const { finishBreak } = ads;

  // With TalkBack, the progress bar is adjusted in TalkBack's adjust mode
  // (select, then left/right). Entering it reaches the app as nothing, so
  // a viewer pausing there would see no activity and lose the controls, and
  // adjust mode with them. Keep the controls up while the bar has focus.
  const screenReaderEnabled = useScreenReaderEnabled();
  const [seekbarFocused, setSeekbarFocused] = useState(false);
  const stalled = useStallWatchdog(
    !paused && !ended && !inAdBreak,
    currentTime,
    reloadKey,
  );
  const error = playbackError ?? (stalled ? STALL_MESSAGE : null);
  const overlay = useAutoHide(
    paused || !!error || ended || (screenReaderEnabled && seekbarFocused),
  );
  // While paused, the same titles sit in a shelf above the controls.
  const showsPausedRail =
    overlay.visible && paused && !ended && !error && hasRecommendations;

  const markFinished = useWatchProgress(item, currentTime, duration);

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

  const showBuffering = useCallback(() => {
    bufferingFromRef.current = videoRef.current?.currentTime ?? null;
    setBuffering(true);
  }, []);

  const hideBuffering = useCallback(() => {
    bufferingFromRef.current = null;
    setBuffering(false);
  }, []);

  const retryPlayback = useCallback(() => {
    resumeAtRef.current = item.isLive
      ? null
      : videoRef.current?.currentTime ?? null;
    setPlaybackError(null);
    showBuffering();
    setPaused(false);
    setReloadKey(k => k + 1);
  }, [item.isLive, showBuffering]);

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
      showBuffering();
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
        aria-label={`Now playing: ${item.title}`}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        // 'waiting'/'seeking' = stalled; 'playing' (or 'canplay' when paused) = recovered.
        onWaiting={showBuffering}
        onSeeking={showBuffering}
        onPlaying={hideBuffering}
        onCanPlay={hideBuffering}
        // Ignore positions reported mid-seek so the seeker doesn't jump back;
        // 'seeked' then reports where the seek actually landed.
        onTimeUpdate={e => {
          if (!e.currentTarget.seeking) {
            const bufferingFrom = bufferingFromRef.current;
            // Frames are moving again, so nothing is loading even when the
            // matching 'playing' event never arrived.
            if (
              bufferingFrom !== null &&
              e.currentTarget.currentTime >
                bufferingFrom + BUFFERING_EPSILON_SECONDS
            ) {
              hideBuffering();
            }
            setCurrentTime(e.currentTarget.currentTime);
          }
        }}
        onSeeked={e => {
          hideBuffering();
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={e => {
          const resumeAt = resumeAtRef.current ?? item.startPosition;
          if (resumeAt !== undefined) {
            e.currentTarget.currentTime = resumeAt;
          }
          resumeAtRef.current = null;
        }}
        onEnded={() => {
          markFinished();
          if (!item.isLive) {
            setEnded(true);
          }
        }}
        // Live streams report Infinity; the controls hide the bar for live anyway.
        onDurationChange={e => {
          const d = e.currentTarget.duration;
          setDuration(Number.isFinite(d) ? d : 0);
        }}
        onError={() => setPlaybackError('Playback failed')}
      />
      {ads.activeBreak ? (
        <AdPlayer adBreak={ads.activeBreak} onComplete={handleAdsComplete} />
      ) : (
        <>
          <View style={styles.overlay}>
            {overlay.visible && (
              <View style={styles.topBar}>
                <Text
                  style={styles.title}
                  numberOfLines={1}
                  accessibilityRole="header"
                >
                  {item.title}
                </Text>
              </View>
            )}
            {!showsUpNext && (
              <PlayerStatus
                error={error}
                buffering={buffering}
                paused={paused}
                onRetry={retryPlayback}
              />
            )}
            {showsUpNext || error ? null : overlay.visible ? (
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
                onSeekbarFocusChange={setSeekbarFocused}
                initialFocus={overlay.wokeWithUp ? 'seekbar' : 'play'}
              />
            ) : (
              <IdleCatcher onWake={overlay.show} />
            )}
            {showsPausedRail && recommendedItems && onSelectRecommended && (
              <PlayerUpNext
                items={recommendedItems}
                onSelectVOD={onSelectRecommended}
                variant="bottom"
              />
            )}
          </View>
          {showsUpNext && recommendedItems && onSelectRecommended && (
            <PlayerUpNext
              items={recommendedItems}
              onSelectVOD={onSelectRecommended}
              variant="fullScreen"
              autoFocus
            />
          )}
        </>
      )}
    </View>
  );
};
