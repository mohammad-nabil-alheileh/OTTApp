import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { BoldTextContext } from '../../../src/accessibility/BoldTextContext';
import { ContinueListeningRail } from '../../../src/components/ContinueListeningRail/ContinueListeningRail';
import { ListenScreen } from '../../../src/components/ListenScreen/ListenScreen';
import { NowPlaying } from '../../../src/components/NowPlaying/NowPlaying';
import { PodcastDetails } from '../../../src/components/PodcastDetails/PodcastDetails';
import { PodcastRail } from '../../../src/components/PodcastRail/PodcastRail';
import { mockPodcasts } from '../../../src/services/mockData';

// Runs under both android-tv and apple-tv.
const podcast = mockPodcasts[0];
const episode = podcast.episodes[0];

const renderBold = (ui: React.ReactElement) =>
  render(
    <BoldTextContext.Provider
      value={{ isBoldText: true, toggleBoldText: jest.fn() }}
    >
      {ui}
    </BoldTextContext.Provider>,
  );

const expectBold = (text: string | RegExp) => {
  for (const node of screen.getAllByText(text)) {
    expect(StyleSheet.flatten(node.props.style).fontWeight).toBe('bold');
  }
};

describe('Bold Text in the podcast screens (native TV)', () => {
  it('bolds the ListenScreen header and empty message', async () => {
    await renderBold(
      <ListenScreen
        podcasts={[]}
        isLoading={false}
        failure={null}
        onRetry={jest.fn()}
        continueListening={[]}
        onSelectPodcast={jest.fn()}
        onPlayEpisode={jest.fn()}
        onBack={jest.fn()}
      />,
    );
    expectBold('Listen');
    expectBold('Podcasts & Audio');
    expectBold('No podcasts available yet.');
  });

  it('bolds the PodcastRail title and card labels', async () => {
    await renderBold(
      <PodcastRail
        groupId="test-rail"
        title="Featured"
        podcasts={[podcast]}
        onSelectPodcast={jest.fn()}
      />,
    );
    expectBold('Featured');
    expectBold(podcast.title);
    expectBold(podcast.author);
  });

  it('bolds the ContinueListeningRail title and card labels', async () => {
    await renderBold(
      <ContinueListeningRail
        items={[{ podcast, episode, position: 30, duration: episode.duration }]}
        onPlayEpisode={jest.fn()}
      />,
    );
    expectBold('Continue Listening');
    expectBold(episode.title);
    expectBold(/left ·/);
  });

  it('bolds the PodcastDetails header and episode list', async () => {
    await renderBold(
      <PodcastDetails
        podcast={podcast}
        listenHistory={[]}
        onPlayEpisode={jest.fn()}
        onBack={jest.fn()}
      />,
    );
    expectBold(podcast.title);
    expectBold(podcast.author);
    expectBold('Episodes');
    expectBold(episode.title);
  });

  it('bolds the NowPlaying labels and error status', async () => {
    await renderBold(
      <NowPlaying
        item={{
          id: episode.id,
          title: episode.title,
          podcastTitle: podcast.title,
          artwork: podcast.artwork,
          url: episode.audioUrl,
        }}
        paused={false}
        buffering={false}
        error="Playback failed"
        currentTime={0}
        duration={episode.duration}
        playbackRate={1}
        onPlaybackRateChange={jest.fn()}
        onTogglePlay={jest.fn()}
        onSeek={jest.fn()}
      />,
    );
    expectBold('NOW PLAYING');
    expectBold(podcast.title);
    expectBold(episode.title);
    expectBold('Playback failed');
  });
});
