import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SearchScreen } from '../../../src/components/SearchScreen/SearchScreen';
import { mockVODData } from '../../../src/services/mockData';
import {
  isVoiceSearchAvailable,
  startVoiceListening,
  stopVoiceListening,
} from '../../../src/services/voiceSearch';
import { pressBack } from '../../helpers/native';

// Runs under both android-tv and apple-tv. The voice service is the only
// fake: the session never resolves on its own, so the listening state can be
// inspected the way a screen reader sees it.
jest.mock('../../../src/services/voiceSearch', () => ({
  isVoiceSearchAvailable: jest.fn(),
  startVoiceListening: jest.fn(),
  stopVoiceListening: jest.fn(),
}));

const available = isVoiceSearchAvailable as jest.Mock;
const startVoice = startVoiceListening as jest.Mock;
const stopVoice = stopVoiceListening as jest.Mock;

const videos = mockVODData.slice(0, 3);

const Harness: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  return (
    <SearchScreen
      videos={videos}
      isLoading={false}
      failure={null}
      onRetry={jest.fn()}
      query={query}
      onQueryChange={setQuery}
      onSelectVOD={jest.fn()}
      onBack={onBack}
    />
  );
};

let resolveSession: (text: string | null) => void = () => {};

beforeEach(() => {
  available.mockResolvedValue(true);
  startVoice.mockReset();
  stopVoice.mockReset();
  startVoice.mockImplementation(
    () =>
      new Promise<string | null>(resolve => {
        resolveSession = resolve;
      }),
  );
});

const renderSearch = async (onBack = jest.fn()) => {
  await render(<Harness onBack={onBack} />);
  const mic = await screen.findByRole('button', { name: 'Search by voice' });
  return { mic, onBack };
};

const startSession = async (mic: ReturnType<typeof screen.getByRole>) => {
  await act(async () => {
    fireEvent.press(mic);
  });
  return screen.getByRole('button', { name: 'Listening' });
};

const endSession = async (text: string | null) => {
  await act(async () => {
    resolveSession(text);
  });
  return screen.getByRole('button', { name: 'Search by voice' });
};

describe('SearchScreen voice session (native TV)', () => {
  it('keeps the mic in the reading order on its own while listening', async () => {
    const { mic } = await renderSearch();
    expect(screen.getByRole('button', { name: 'Q' })).toBeTruthy();

    await startSession(mic);

    // TalkBack (and the remote) can no longer reach the keyboard, results or
    // history, but the way out is still there.
    expect(screen.queryByRole('button', { name: 'Q' })).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Q', includeHiddenElements: true }),
    ).toBeTruthy();
    expect(screen.queryByRole('header', { name: 'All Videos' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Back' }).props.accessibilityHint,
    ).toBe('Stops voice search');
  });

  it('claims preferred focus for the mic until the session ends', async () => {
    const { mic } = await renderSearch();
    const listening = await startSession(mic);
    expect(listening.props.hasTVPreferredFocus).toBe(true);
    expect(listening.props.accessibilityHint).toBe('Back stops listening');

    const idle = await endSession(null);
    expect(idle.props.hasTVPreferredFocus).toBe(false);
  });

  it('uses Back to stop the session instead of closing search', async () => {
    const { mic, onBack } = await renderSearch();
    await startSession(mic);

    await pressBack();

    expect(stopVoice).toHaveBeenCalledTimes(1);
    expect(onBack).not.toHaveBeenCalled();

    await endSession(null);
    await pressBack();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('cancels the session from the visible Back button too', async () => {
    const { mic, onBack } = await renderSearch();
    await startSession(mic);

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    });

    expect(stopVoice).toHaveBeenCalledTimes(1);
    expect(onBack).not.toHaveBeenCalled();
  });

  it('applies the transcript and restores the screen', async () => {
    const { mic } = await renderSearch();
    await startSession(mic);

    await endSession('zzz');

    expect(screen.getByText('No videos match “zzz”')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Q' })).toBeTruthy();
  });
});

describe('SearchScreen results cache (native TV)', () => {
  const cached = videos;
  const cards = () =>
    screen.getAllByRole('button', { name: /, rated .* out of 5/ });

  const search = (
    items: typeof cached,
    failure: { kind: 'offline' } | null,
    { isLoading = false, onRetry = jest.fn() } = {},
  ) => (
    <SearchScreen
      videos={items}
      isLoading={isLoading}
      failure={failure}
      onRetry={onRetry}
      query=""
      onQueryChange={jest.fn()}
      onSelectVOD={jest.fn()}
      onBack={jest.fn()}
    />
  );

  it('keeps loaded results on screen when the catalogue fails later', async () => {
    await render(search(cached, { kind: 'offline' }));

    expect(cards()).toHaveLength(cached.length);
    expect(screen.queryByText("You're offline")).toBeNull();
  });

  it('falls back to the cached results when the rail comes back empty', async () => {
    const view = await render(search(cached, null));

    await view.rerender(search([], { kind: 'offline' }));

    expect(cards()).toHaveLength(cached.length);
    expect(screen.queryByText("You're offline")).toBeNull();
  });

  it('still shows the page error when nothing was ever cached', async () => {
    await render(search([], { kind: 'offline' }));

    expect(screen.getByText("You're offline")).toBeTruthy();
  });

  it('keeps the cards and requests nothing when focus moves after the catalogue fails', async () => {
    const onRetry = jest.fn();
    await render(search(cached, { kind: 'offline' }, { onRetry }));
    const [first, second] = cards();

    await act(async () => {
      fireEvent(first, 'focus');
      fireEvent(second, 'focus');
    });

    expect(cards()).toHaveLength(cached.length);
    expect(screen.queryByText("You're offline")).toBeNull();
    expect(onRetry).not.toHaveBeenCalled();
  });

  it('keeps the cached cards on screen while a retry runs', async () => {
    await render(search(cached, null, { isLoading: true }));

    expect(
      await screen.findAllByRole('button', { name: /, rated .* out of 5/ }),
    ).toHaveLength(cached.length);
    expect(screen.queryByText('Loading videos…')).toBeNull();
  });
});
