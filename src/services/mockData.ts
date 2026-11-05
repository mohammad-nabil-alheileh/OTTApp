import { VODItem } from '../types/vod';
import { LiveChannel } from '../types/live';

const image = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Public test streams. VODs mix HLS (.m3u8) and a plain MP4 on purpose.
// Only 'Live Demo' is a true live stream; the other channels loop VOD streams.
export const mockVODData: VODItem[] = [
  {
    id: 'vod-1',
    title: 'Big Buck Bunny',
    description: 'A giant rabbit takes on three bullying rodents.',
    thumbnail: image('bunny', 640, 360),
    poster: image('bunny', 600, 900),
    duration: 596,
    releaseDate: '2008-05-30',
    rating: 8.1,
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  },
  {
    id: 'vod-2',
    title: 'Tears of Steel',
    description: 'Warriors and scientists try to save the world from robots.',
    thumbnail: image('steel', 640, 360),
    poster: image('steel', 600, 900),
    duration: 734,
    releaseDate: '2012-09-26',
    rating: 6.8,
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  },
  {
    id: 'vod-3',
    title: 'Angel One',
    description: 'A short sci-fi clip from the Shaka Player demo assets.',
    thumbnail: image('angel', 640, 360),
    poster: image('angel', 600, 900),
    duration: 60,
    releaseDate: '2016-01-01',
    rating: 7.0,
    url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
  },
  {
    id: 'vod-4',
    title: 'Bunny Clip (MP4)',
    description: 'A 10 second progressive MP4 clip.',
    thumbnail: image('clip', 640, 360),
    poster: image('clip', 600, 900),
    duration: 10,
    releaseDate: '2008-05-30',
    rating: 7.5,
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
  },
];

export const mockLiveChannels: LiveChannel[] = [
  {
    id: 'live-1',
    name: 'Live Demo',
    description: 'Unified Streaming live HLS demo',
    icon: image('news', 160, 160),
    banner: image('news', 640, 360),
    streamUrl: 'https://demo.unified-streaming.com/k8s/live/stable/live.isml/.m3u8',
    isLive: true,
    category: 'News',
  },
  {
    id: 'live-2',
    name: 'Bip Bop',
    description: 'Apple HLS example stream (looped as a channel)',
    icon: image('music', 160, 160),
    banner: image('music', 640, 360),
    streamUrl:
      'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
    isLive: true,
    category: 'Music',
  },
  {
    id: 'live-3',
    name: 'Bunny TV',
    description: 'Mux HLS test stream (looped as a channel)',
    icon: image('sports', 160, 160),
    banner: image('sports', 640, 360),
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    isLive: true,
    category: 'Kids',
  },
];
