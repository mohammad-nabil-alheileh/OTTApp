import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import Video, {
  SelectedVideoTrack,
  SelectedVideoTrackType,
  VideoRef,
} from 'react-native-video';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { PlayerStatus } from '../PlayerStatus/PlayerStatus';
import { IdleCatcher } from '../IdleCatcher/IdleCatcher';
import { useLiveState } from '../../hooks/useLiveState';
import { useBackHandler } from '../../hooks/useBackHandler';
import { useAutoHide } from '../../hooks/useAutoHide';
import { AUTO_QUALITY } from '../../types/quality';
import { toQualities } from '../../utils/quality';
import { styles } from './VideoPlayer.styles';
import { VideoPlayerProps } from './VideoPlayer.types';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onBack }) => {
  const videoRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liveEdge, setLiveEdge] = useState(0);
  // Changing the Video key remounts it, which reloads the stream at live.
  const [sourceKey, setSourceKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualities, setQualities] = useState<number[]>([]);
  const [quality, setQuality] = useState(AUTO_QUALITY);

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

  const overlay = useAutoHide(paused || !!error);

  // ExoPlayer reports live positions inside a sliding window, so while paused
  // the window moves on and our position in it drops by one second per second.
  // onProgress stops while paused, so simulate that until it reports again.
  useEffect(() => {
    if (!item.isLive || !paused) {
      return;
    }
    const timer = setInterval(() => setCurrentTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [item.isLive, paused]);

  // In ExoPlayer's live coordinates the window starts at 0, so its length is the edge.
  const liveState = useLiveState(currentTime, liveEdge, liveEdge);

  const togglePlay = () => {
    if (paused && item.isLive && liveState.hasLeftDvrWindow) {
      setSourceKey(k => k + 1);
      setBuffering(true);
      setPaused(false);
    } else {
      setPaused(p => !p);
    }
  };

  // Memoised: a new object every render would make the native player
  // re-apply the track selection on every progress update.
  const selectedVideoTrack = useMemo<SelectedVideoTrack>(
    () =>
      quality === AUTO_QUALITY
        ? { type: SelectedVideoTrackType.AUTO }
        : { type: SelectedVideoTrackType.RESOLUTION, value: quality },
    [quality],
  );

  const seek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  const goLive = () => {
    seek(liveState.livePosition);
    setPaused(false);
  };

  return (
    <View style={styles.container}>
      <Video
        key={sourceKey}
        ref={videoRef}
        source={{ uri: item.url }}
        style={styles.video}
        paused={paused}
        rate={playbackRate}
        selectedVideoTrack={selectedVideoTrack}
        onVideoTracks={e =>
          setQualities(toQualities(e.videoTracks.map(t => t.height)))
        }
        resizeMode="contain"
        progressUpdateInterval={250}
        onLoad={e => setDuration(e.duration)}
        onBuffer={e => setBuffering(e.isBuffering)}
        onProgress={e => {
          setCurrentTime(e.currentTime);
          // For live streams this is the length of the DVR window, i.e. the live edge.
          setLiveEdge(e.seekableDuration);
        }}
        onError={e => setError(e.error.errorString ?? 'Playback failed')}
      />
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
          />
        ) : (
          <IdleCatcher onWake={overlay.show} />
        )}
      </View>
    </View>
  );
};
