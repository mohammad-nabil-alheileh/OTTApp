import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ArchiveRail } from '../../../src/components/ArchiveRail/ArchiveRail';
import { mockLiveChannels } from '../../../src/services/mockData';
import { ArchiveProgramme } from '../../../src/types/live';

// Runs under both android-tv and apple-tv.
const now = new Date(2026, 10, 15, 12, 0);
const at = (day: number, hour: number) => new Date(2026, 10, day, hour).toISOString();

const programme: ArchiveProgramme = {
  id: 'arc-x',
  channelId: 'live-1',
  title: 'Morning Briefing',
  description: '',
  thumbnail: 'https://example.com/a.jpg',
  airedAt: at(15, 8),
  duration: 1800,
  url: 'https://example.com/a.m3u8',
  availableUntil: at(22, 8),
};

const railProps = {
  channels: mockLiveChannels,
  isLoading: false,
  failure: null,
  onRetry: jest.fn(),
  now,
};

describe('ArchiveRail (native TV)', () => {
  it('renders nothing when there is no catch-up on offer', async () => {
    await render(<ArchiveRail {...railProps} programmes={[]} onSelectProgramme={jest.fn()} />);
    expect(screen.queryByRole('header', { name: 'Catch-up' })).toBeNull();
  });

  it('reads each recording with channel, air time, length and availability', async () => {
    const onSelect = jest.fn();
    await render(
      <ArchiveRail {...railProps} programmes={[programme]} onSelectProgramme={onSelect} />,
    );
    expect(screen.getByRole('header', { name: 'Catch-up' })).toBeTruthy();

    const card = screen.getByRole('button', {
      name: 'Morning Briefing, Live Demo, aired today at 08:00, 30 min, available for 7 more days',
    });
    expect(card.props.accessibilityHint).toBe('Plays recording');
    expect(
      screen.getByText('Live Demo · Today 08:00', { includeHiddenElements: true }),
    ).toBeTruthy();

    await fireEvent.press(card);
    expect(onSelect).toHaveBeenCalledWith(programme, 'Live Demo');
  });

  it('keeps its heading and offers a retry when loading fails', async () => {
    await render(
      <ArchiveRail
        {...railProps}
        programmes={[]}
        failure={{ kind: 'error' }}
        onSelectProgramme={jest.fn()}
      />,
    );
    expect(screen.getByRole('header', { name: 'Catch-up' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Couldn't load catch-up/ })).toBeTruthy();
  });

  it('announces loading politely', async () => {
    await render(
      <ArchiveRail {...railProps} programmes={[]} isLoading onSelectProgramme={jest.fn()} />,
    );
    expect(screen.getByText('Loading catch-up...').props.accessibilityLiveRegion).toBe('polite');
  });
});
