import { VODItem } from '../types/vod';
import { LiveChannel } from '../types/live';
import { Ad } from '../types/ads';

const image = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Public sample ad creatives (Google IMA samples + an MDN CC0 clip).
const ads: Record<'stock' | 'android' | 'flower', Ad> = {
  stock: {
    id: 'ad-stock',
    title: 'Stock footage',
    advertiser: 'Google Ads samples',
    url: 'https://storage.googleapis.com/gvabox/media/samples/stock.mp4',
    skipOffset: 5,
  },
  android: {
    id: 'ad-android',
    title: 'Android',
    advertiser: 'Google',
    url: 'https://storage.googleapis.com/gvabox/media/samples/android.mp4',
    skipOffset: 5,
  },
  // Short and not skippable.
  flower: {
    id: 'ad-flower',
    title: 'Flower',
    advertiser: 'MDN Web Docs',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
};

// Public HLS test streams with several resolutions each.
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
    adBreaks: [
      { id: 'vod-1-mid-1', time: 120, ads: [ads.flower, ads.stock] },
      { id: 'vod-1-mid-2', time: 360, ads: [ads.android] },
    ],
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
    adBreaks: [
      { id: 'vod-2-mid-1', time: 180, ads: [ads.android] },
      { id: 'vod-2-mid-2', time: 450, ads: [ads.stock, ads.flower] },
    ],
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
    // Short clip, so the break comes early enough to try out quickly.
    adBreaks: [{ id: 'vod-3-mid-1', time: 20, ads: [ads.flower] }],
  },
];

// Real live streams with a 10 minute DVR window, so pause/timeshift works.
export const mockLiveChannels: LiveChannel[] = [
  {
    id: 'live-1',
    name: 'Live Demo',
    description: 'Unified Streaming live HLS demo',
    icon: image('news', 160, 160),
    banner: image('news', 640, 360),
    streamUrl:
      'https://demo.unified-streaming.com/k8s/live/stable/live.isml/.m3u8',
    isLive: true,
    category: 'News',
  },
  {
    id: 'live-2',
    name: 'Live Ads',
    description: 'Unified Streaming live HLS with SCTE-35 ad markers',
    icon: image('music', 160, 160),
    banner: image('music', 640, 360),
    streamUrl:
      'https://demo.unified-streaming.com/k8s/live/stable/scte35.isml/.m3u8',
    isLive: true,
    category: 'Music',
  },
  {
    id: 'live-3',
    name: 'Live Trunk',
    description: 'Unified Streaming live HLS (development build)',
    icon: image('sports', 160, 160),
    banner: image('sports', 640, 360),
    streamUrl:
      'https://demo.unified-streaming.com/k8s/live/trunk/live.isml/.m3u8',
    isLive: true,
    category: 'Sports',
  },
];
