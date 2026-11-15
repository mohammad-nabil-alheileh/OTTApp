import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PlayerControls } from '../../../src/components/PlayerControls/PlayerControls';
import { PlayerControlsProps } from '../../../src/components/PlayerControls/PlayerControls.types';

const props: PlayerControlsProps = {
  isLive: false,
  paused: false,
  currentTime: 30,
  duration: 600,
  liveState: {} as PlayerControlsProps['liveState'],
  playbackRate: 1,
  onPlaybackRateChange: jest.fn(),
  qualities: [],
  quality: 0,
  onQualityChange: jest.fn(),
  onTogglePlay: jest.fn(),
  onSeek: jest.fn(),
  onGoLive: jest.fn(),
};

const seekBar = () => screen.getByRole('adjustable', { name: 'Playback position' });
const playButton = () => screen.getByRole('button', { name: 'Pause' });

describe('PlayerControls initial focus (native TV)', () => {
  it('focuses Play by default', async () => {
    await render(<PlayerControls {...props} />);

    expect(playButton().props.hasTVPreferredFocus).toBe(true);
    expect(seekBar().props.hasTVPreferredFocus).toBeFalsy();
  });

  it('focuses the seek bar when woken with Up', async () => {
    await render(<PlayerControls {...props} initialFocus="seekbar" />);

    expect(seekBar().props.hasTVPreferredFocus).toBe(true);
    expect(playButton().props.hasTVPreferredFocus).toBeFalsy();
  });
});
