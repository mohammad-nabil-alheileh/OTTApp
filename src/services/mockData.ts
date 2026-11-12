import { VODItem } from '../types/vod';
import { LiveChannel } from '../types/live';
import { Ad } from '../types/ads';
import { Podcast } from '../types/podcast';

// Public Unsplash photos served straight from their CDN (no key needed). The
// seed picks one, so a title keeps the same art for every size it is drawn at.
const PHOTOS = [
  'photo-1489599849927-2ee91cede3ba',
  'photo-1478720568477-152d9b164e26',
  'photo-1485846234645-a62644f84728',
  'photo-1517604931442-7e0c8ed2963c',
  'photo-1440404653325-ab127d49abc1',
  'photo-1536440136628-849c177e76a1',
  'photo-1524985069026-dd778a71c7b4',
  'photo-1470229722913-7c0e2dbbafd3',
  'photo-1493804714600-6edb1cd93080',
  'photo-1522869635100-9f4c5e86aa37',
  'photo-1509347528160-9a9e33742cdb',
  'photo-1512070679279-8988d32161be',
  'photo-1574375927938-d5a98e8ffe85',
  'photo-1594909122845-11baa439b7bf',
  'photo-1586899028174-e7098604235b',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1441974231531-c6227db76b6e',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1506744038136-46273834b3fb',
  'photo-1518791841217-8f162f1e1131',
  'photo-1521302080334-4bebac2763a6',
  'photo-1542204165-65bf26472b9b',
  'photo-1511671782779-c97d3d27a1d4',
  'photo-1481627834876-b7833e8f5570',
  'photo-1495020689067-958852a7765e',
  'photo-1516280440614-37939bbacd81',
  'photo-1460881680858-30d872d5b530',
  'photo-1502136969935-8d8eef54d77b',
  'photo-1518709268805-4e9042af9f23',
  'photo-1524253482453-3fed8d2fe12b',
];

const seedIndex = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 37 + seed.charCodeAt(i)) % 1000003;
  }
  return hash % PHOTOS.length;
};

const image = (seed: string, w: number, h: number) =>
  `https://images.unsplash.com/${
    PHOTOS[seedIndex(seed)]
  }?w=${w}&h=${h}&fit=crop&auto=format&q=70`;

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
    adBreaks: [{ id: 'vod-5-mid-1', time: 90, ads: [ads.flower] }],
  },
  {
    id: 'vod-6',
    title: 'BipBop Lab',
    description: "Apple's classic HLS reference stream in many renditions.",
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
    description: "A moody re-grade of the bunny's forest adventure.",
    thumbnail: image('truths', 640, 360),
    poster: image('truths', 600, 900),
    duration: 635,
    releaseDate: '2019-03-12',
    rating: 7.2,
    url: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    adBreaks: [{ id: 'vod-7-mid-1', time: 200, ads: [ads.android] }],
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
    adBreaks: [{ id: 'vod-9-mid-1', time: 300, ads: [ads.android, ads.stock] }],
    trailer: {
      url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
      duration: 60,
    },
  },
  {
    id: 'vod-10',
    title: 'Neon Drift',
    description:
      'Street racers chase one last score through a rain-soaked city.',
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
    description:
      'A quiet story about a festival that brings a village together.',
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
    description:
      'An arctic research team picks up a transmission from nowhere.',
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
    adBreaks: [{ id: 'vod-13-mid-1', time: 300, ads: [ads.android] }],
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
    adBreaks: [{ id: 'vod-14-mid-1', time: 100, ads: [ads.flower] }],
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
    adBreaks: [{ id: 'vod-16-mid-1', time: 600, ads: [ads.flower] }],
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

// Public sample MP3s (SoundHelix). The podcasts and episodes are fictional and
// reuse these tracks; durations match the real files.
const tracks = [
  { n: 1, duration: 372 },
  { n: 2, duration: 425 },
  { n: 3, duration: 344 },
  { n: 4, duration: 302 },
  { n: 5, duration: 353 },
  { n: 6, duration: 279 },
  { n: 7, duration: 420 },
  { n: 8, duration: 325 },
  { n: 9, duration: 389 },
  { n: 10, duration: 527 },
];

const episode = (
  id: string,
  track: number,
  title: string,
  description: string,
  releaseDate: string,
) => {
  const { n, duration } = tracks[(track - 1) % tracks.length];
  return {
    id,
    title,
    description,
    releaseDate,
    duration,
    audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`,
  };
};

export const mockPodcasts: Podcast[] = [
  {
    id: 'pod-1',
    title: 'Signal & Noise',
    author: 'Lena Ortiz',
    description:
      'Weekly conversations with engineers about the tools and trade-offs behind the apps we use every day.',
    artwork: image('signal', 600, 600),
    category: 'Technology',
    episodes: [
      episode(
        'pod-1-ep-4',
        1,
        'Shipping to Ten Screens',
        'Building one app for phones, TVs and browsers.',
        '2026-10-28',
      ),
      episode(
        'pod-1-ep-3',
        2,
        'The Cost of a Millisecond',
        'Why latency budgets shape product decisions.',
        '2026-10-21',
      ),
      episode(
        'pod-1-ep-2',
        3,
        'Streaming at Scale',
        'How video reaches millions of living rooms.',
        '2026-10-14',
      ),
      episode(
        'pod-1-ep-1',
        4,
        'Hello, World',
        'Meet the host and what the show is about.',
        '2026-10-07',
      ),
    ],
  },
  {
    id: 'pod-2',
    title: 'Byte Sized',
    author: 'Omar Haddad',
    description: 'Quick, friendly explainers on one tech idea per episode.',
    artwork: image('bytesized', 600, 600),
    category: 'Technology',
    episodes: [
      episode(
        'pod-2-ep-3',
        5,
        'What Is a CDN?',
        'Why your movie loads from a server down the street.',
        '2026-11-02',
      ),
      episode(
        'pod-2-ep-2',
        6,
        'Codecs, Explained',
        'Squeezing video without losing the picture.',
        '2026-10-26',
      ),
      episode(
        'pod-2-ep-1',
        7,
        'Bits and Bytes',
        'The smallest units of everything digital.',
        '2026-10-19',
      ),
    ],
  },
  {
    id: 'pod-3',
    title: 'Morning Briefing',
    author: 'Daily Desk',
    description: 'The stories that matter, in about five minutes.',
    artwork: image('briefing', 600, 600),
    category: 'News',
    episodes: [
      episode(
        'pod-3-ep-3',
        8,
        'Wednesday Briefing',
        'Markets, weather and the day ahead.',
        '2026-11-11',
      ),
      episode(
        'pod-3-ep-2',
        9,
        'Tuesday Briefing',
        'Elections, energy and a space launch.',
        '2026-11-10',
      ),
      episode(
        'pod-3-ep-1',
        10,
        'Monday Briefing',
        'The week ahead in five minutes.',
        '2026-11-09',
      ),
    ],
  },
  {
    id: 'pod-4',
    title: 'Laugh Track',
    author: 'Sam & Rita',
    description: 'Two comedians, one microphone and absolutely no plan.',
    artwork: image('laughtrack', 600, 600),
    category: 'Comedy',
    episodes: [
      episode(
        'pod-4-ep-3',
        2,
        'The Great Toaster Debate',
        'Settling the most important question of our time.',
        '2026-11-05',
      ),
      episode(
        'pod-4-ep-2',
        4,
        'Holiday Disasters',
        'Listeners share their worst trips.',
        '2026-10-29',
      ),
      episode(
        'pod-4-ep-1',
        6,
        'Pilot',
        'Where it all went wrong.',
        '2026-10-22',
      ),
    ],
  },
  {
    id: 'pod-5',
    title: 'Deep Field',
    author: 'Dr. Mara Quinn',
    description:
      'An astronomer takes you on a tour of the universe, one discovery at a time.',
    artwork: image('deepfield', 600, 600),
    category: 'Science',
    episodes: [
      episode(
        'pod-5-ep-4',
        3,
        'Rogue Planets',
        'Worlds that drift without a star.',
        '2026-11-03',
      ),
      episode(
        'pod-5-ep-3',
        5,
        'Listening to Black Holes',
        'What gravitational waves tell us.',
        '2026-10-20',
      ),
      episode(
        'pod-5-ep-2',
        7,
        'The Moon Is Leaving',
        'Why the Moon drifts a few centimetres a year.',
        '2026-10-06',
      ),
      episode(
        'pod-5-ep-1',
        9,
        'First Light',
        'How telescopes changed what we know.',
        '2026-09-22',
      ),
    ],
  },
  {
    id: 'pod-6',
    title: 'Cold Case Files',
    author: 'Nadia Brooks',
    description:
      'Revisiting unsolved mysteries with fresh eyes and new evidence.',
    artwork: image('coldcase', 600, 600),
    category: 'True Crime',
    episodes: [
      episode(
        'pod-6-ep-2',
        10,
        'The Lighthouse Keeper',
        'A keeper vanishes from a locked tower.',
        '2026-11-01',
      ),
      episode(
        'pod-6-ep-1',
        8,
        'The Missing Painting',
        'A masterpiece disappears during a gala.',
        '2026-10-18',
      ),
    ],
  },
  {
    id: 'pod-7',
    title: 'Small Wonders',
    author: 'Theo Grant',
    description: 'The surprising science hiding in everyday things.',
    artwork: image('wonders', 600, 600),
    category: 'Science',
    episodes: [
      episode(
        'pod-7-ep-2',
        1,
        'Why Bread Rises',
        'Yeast, gas and a little patience.',
        '2026-10-30',
      ),
      episode(
        'pod-7-ep-1',
        2,
        'The Physics of Coffee',
        'What happens in your morning cup.',
        '2026-10-16',
      ),
    ],
  },
];
