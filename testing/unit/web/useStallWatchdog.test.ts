import { act, renderHook } from '@testing-library/react';
import {
  STALL_TIMEOUT_MS,
  useStallWatchdog,
} from '../../../src/hooks/useStallWatchdog';

const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe('useStallWatchdog (web)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('reports a stall when the position stops moving', () => {
    const { result, unmount } = renderHook(
      ({ active, position }) => useStallWatchdog(active, position),
      { initialProps: { active: true, position: 12 } },
    );

    advance(STALL_TIMEOUT_MS - 1000);
    expect(result.current).toBe(false);

    advance(1000);
    expect(result.current).toBe(true);
    unmount();
  });

  it('stays quiet while playback is inactive', () => {
    const { result, unmount } = renderHook(
      ({ active, position }) => useStallWatchdog(active, position),
      { initialProps: { active: false, position: 0 } },
    );

    advance(STALL_TIMEOUT_MS * 2);
    expect(result.current).toBe(false);
    unmount();
  });

  it('re-arms whenever the position advances', () => {
    const { result, rerender, unmount } = renderHook(
      ({ active, position }) => useStallWatchdog(active, position),
      { initialProps: { active: true, position: 0 } },
    );

    advance(STALL_TIMEOUT_MS - 1000);
    rerender({ active: true, position: 1 });
    advance(STALL_TIMEOUT_MS - 1000);
    expect(result.current).toBe(false);

    advance(1000);
    expect(result.current).toBe(true);
    unmount();
  });

  it('clears on recovery and re-arms on a retry', () => {
    const { result, rerender, unmount } = renderHook(
      ({ active, position, attempt }) =>
        useStallWatchdog(active, position, attempt),
      { initialProps: { active: true, position: 5, attempt: 0 } },
    );

    advance(STALL_TIMEOUT_MS);
    expect(result.current).toBe(true);

    rerender({ active: true, position: 6, attempt: 0 });
    expect(result.current).toBe(false);

    // A retry re-arms the timer even though the position has not moved.
    rerender({ active: true, position: 6, attempt: 1 });
    expect(result.current).toBe(false);
    advance(STALL_TIMEOUT_MS);
    expect(result.current).toBe(true);
    unmount();
  });
});
