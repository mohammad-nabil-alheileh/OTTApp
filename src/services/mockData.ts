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

// Public HLS test streams with several resolutions each. There are no public
// trailer streams for these titles, so trailers reuse a short test clip.
// vod-8 onward are fictional titles that reuse the same public streams.
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
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
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
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
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
  {
    id: 'vod-4',
    title: 'Sintel',
    description: 'A lonely girl searches the world for her lost baby dragon.',
    thumbnail: image('sintel', 640, 360),
    poster: image('sintel', 600, 900),
    duration: 888,
    releaseDate: '2010-09-27',
    rating: 7.5,
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    adBreaks: [
      { id: 'vod-4-mid-1', time: 240, ads: [ads.stock] },
      { id: 'vod-4-mid-2', time: 600, ads: [ads.android, ads.flower] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-5',
    title: 'Art of Motion',
    description: 'A freerunning showcase filmed across city rooftops.',
    thumbnail: image('motion', 640, 360),
    poster: image('motion', 600, 900),
    duration: 210,
    releaseDate: '2011-09-21',
    rating: 6.9,
    url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    adBreaks: [
      { id: 'vod-5-mid-1', time: 90, ads: [ads.flower] },
    ],
  },
  {
    id: 'vod-6',
    title: 'BipBop Lab',
    description: 'Apple\'s classic HLS reference stream in many renditions.',
    thumbnail: image('bipbop', 640, 360),
    poster: image('bipbop', 600, 900),
    duration: 1800,
    releaseDate: '2017-06-05',
    rating: 5.4,
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
  },
  {
    id: 'vod-7',
    title: 'Dark Truths',
    description: 'A moody re-grade of the bunny\'s forest adventure.',
    thumbnail: image('truths', 640, 360),
    poster: image('truths', 600, 900),
    duration: 635,
    releaseDate: '2019-03-12',
    rating: 7.2,
    url: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    adBreaks: [
      { id: 'vod-7-mid-1', time: 200, ads: [ads.android] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-8',
    title: 'Midnight Harbor',
    description: 'A dock worker uncovers a smuggling ring on the night shift.',
    thumbnail: image('harbor', 640, 360),
    poster: image('harbor', 600, 900),
    duration: 596,
    releaseDate: '2021-11-04',
    rating: 7.8,
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    adBreaks: [
      { id: 'vod-8-mid-1', time: 150, ads: [ads.stock] },
      { id: 'vod-8-mid-2', time: 400, ads: [ads.flower] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-9',
    title: 'The Last Orchard',
    description: 'Two siblings fight to save their family farm from drought.',
    thumbnail: image('orchard', 640, 360),
    poster: image('orchard', 600, 900),
    duration: 734,
    releaseDate: '2020-04-17',
    rating: 8.3,
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    adBreaks: [
      { id: 'vod-9-mid-1', time: 300, ads: [ads.android, ads.stock] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-10',
    title: 'Neon Drift',
    description: 'Street racers chase one last score through a rain-soaked city.',
    thumbnail: image('neon', 640, 360),
    poster: image('neon', 600, 900),
    duration: 888,
    releaseDate: '2022-08-19',
    rating: 6.5,
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    adBreaks: [
      { id: 'vod-10-mid-1', time: 220, ads: [ads.flower] },
      { id: 'vod-10-mid-2', time: 560, ads: [ads.android] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-11',
    title: 'Paper Lanterns',
    description: 'A quiet story about a festival that brings a village together.',
    thumbnail: image('lantern', 640, 360),
    poster: image('lantern', 600, 900),
    duration: 60,
    releaseDate: '2018-02-16',
    rating: 7.9,
    url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
  },
  {
    id: 'vod-12',
    title: 'Cold Signal',
    description: 'An arctic research team picks up a transmission from nowhere.',
    thumbnail: image('arctic', 640, 360),
    poster: image('arctic', 600, 900),
    duration: 734,
    releaseDate: '2023-01-27',
    rating: 7.1,
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    adBreaks: [
      { id: 'vod-12-mid-1', time: 180, ads: [ads.stock] },
      { id: 'vod-12-mid-2', time: 500, ads: [ads.flower] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-13',
    title: 'Wildwood',
    description: 'A documentary following a year in an old-growth forest.',
    thumbnail: image('forest', 640, 360),
    poster: image('forest', 600, 900),
    duration: 596,
    releaseDate: '2019-10-02',
    rating: 8.6,
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    adBreaks: [
      { id: 'vod-13-mid-1', time: 300, ads: [ads.android] },
    ],
  },
  {
    id: 'vod-14',
    title: 'Glass City',
    description: 'An architect is haunted by the tower she designed.',
    thumbnail: image('glass', 640, 360),
    poster: image('glass', 600, 900),
    duration: 210,
    releaseDate: '2024-05-09',
    rating: 6.7,
    url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    adBreaks: [
      { id: 'vod-14-mid-1', time: 100, ads: [ads.flower] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-15',
    title: 'Low Tide',
    description: 'A surfer returns home to make peace with her past.',
    thumbnail: image('tide', 640, 360),
    poster: image('tide', 600, 900),
    duration: 635,
    releaseDate: '2021-07-23',
    rating: 7.4,
    url: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    adBreaks: [
      { id: 'vod-15-mid-1', time: 250, ads: [ads.stock, ads.android] },
    ],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-16',
    title: 'Static Bloom',
    description: 'An experimental short built from broadcast test patterns.',
    thumbnail: image('bloom', 640, 360),
    poster: image('bloom', 600, 900),
    duration: 1800,
    releaseDate: '2025-03-14',
    rating: 5.9,
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
    adBreaks: [
      { id: 'vod-16-mid-1', time: 600, ads: [ads.flower] },
    ],
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
