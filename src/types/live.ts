export interface LiveChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  streamUrl: string;
  isLive: boolean;
  category: string;
}

export interface LiveState {
  isBehindLive: boolean;
  secondsBehindLive: number;
  // Position to seek to in order to return to live.
  livePosition: number;
  // The paused position has (nearly) dropped out of the DVR window, so
  // resuming from it would fail; the stream must be reloaded at live instead.
  hasLeftDvrWindow: boolean;
}

// A past broadcast from a live channel, offered on demand for a limited time.
export interface ArchiveProgramme {
  id: string;
  channelId: string;
  title: string;
  description: string;
  thumbnail: string;
  // ISO start of the original broadcast.
  airedAt: string;
  // Length in seconds.
  duration: number;
  url: string;
  // ISO time when catch-up stops being offered.
  availableUntil: string;
}
