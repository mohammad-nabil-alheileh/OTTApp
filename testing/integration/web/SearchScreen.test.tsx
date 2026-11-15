import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchScreen } from '../../../src/components/SearchScreen/SearchScreen';
import { mockVODData } from '../../../src/services/mockData';
import {
  isVoiceSearchAvailable,
  startVoiceListening,
  stopVoiceListening,
} from '../../../src/services/voiceSearch';

// Runs under lg-webos and samsung-tizen. The recognizer is the only fake.
jest.mock('../../../src/services/voiceSearch', () => ({
  isVoiceSearchAvailable: jest.fn(),
  startVoiceListening: jest.fn(),
  stopVoiceListening: jest.fn(),
}));

const available = isVoiceSearchAvailable as jest.Mock;
const startVoice = startVoiceListening as jest.Mock;
const stopVoice = stopVoiceListening as jest.Mock;

const Harness: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  return (
    <SearchScreen
      videos={mockVODData.slice(0, 3)}
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
  const view = render(<Harness onBack={onBack} />);
  const mic = await screen.findByRole('button', { name: 'Search by voice' });
  return { mic, onBack, view };
};

const startSession = async () => {
  fireEvent.click(await screen.findByRole('button', { name: 'Search by voice' }));
  return screen.findByRole('button', { name: 'Listening' });
};

describe('SearchScreen voice session (web TV)', () => {
  it('keeps the remote on the mic while listening', async () => {
    const { mic } = await renderSearch();
    const listening = await startSession();

    expect(document.activeElement).toBe(mic);

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(mic);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(mic);
    expect(listening).toBeTruthy();
  });

  it('stops the session with Escape instead of closing search', async () => {
    const { onBack } = await renderSearch();
    await startSession();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(stopVoice).toHaveBeenCalledTimes(1);
    expect(onBack).not.toHaveBeenCalled();
  });

  it('stops the session from the visible Back button', async () => {
    const { onBack } = await renderSearch();
    await startSession();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(stopVoice).toHaveBeenCalledTimes(1);
    expect(onBack).not.toHaveBeenCalled();
  });

  it('applies the transcript and puts the screen back in reach', async () => {
    const { view } = await renderSearch();
    await startSession();

    resolveSession('zzz');

    expect(await screen.findByText('No videos match “zzz”')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Q' })).toBeTruthy();
    view.unmount();
  });
});
