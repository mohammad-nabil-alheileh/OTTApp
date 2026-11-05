import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { PlayerStatus } from '../PlayerStatus/PlayerStatus';
import { useLiveState } from '../../hooks/useLiveState';
import { useBackHandler } from '../../hooks/useBackHandler';
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

  const handleBack = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);
  useBackHandler(handleBack);

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
        <View style={styles.topBar}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <PlayerStatus error={error} buffering={buffering} paused={paused} />
        <PlayerControls
          isLive={item.isLive}
          paused={paused}
          currentTime={currentTime}
          duration={duration}
          liveState={liveState}
          playbackRate={playbackRate}
          onPlaybackRateChange={setPlaybackRate}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onGoLive={goLive}
        />
      </View>
    </View>
  );
};
