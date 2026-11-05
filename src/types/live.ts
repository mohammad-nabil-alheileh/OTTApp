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
