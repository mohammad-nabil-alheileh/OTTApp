import { act, renderHook } from '@testing-library/react';
import { useAutoHide } from '../../../src/hooks/useAutoHide';
import { webKeyDown } from '../../helpers/dom';

const hideControls = () => act(() => jest.advanceTimersByTime(6000));

describe('useAutoHide (web)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('remembers that ArrowUp woke the hidden controls', () => {
    const { result, unmount } = renderHook(() => useAutoHide(false));
    hideControls();
    expect(result.current.visible).toBe(false);

    act(() => {
      webKeyDown({ key: 'ArrowUp' });
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.wokeWithUp).toBe(true);
    unmount();
  });

  it('does not report Up when another key wakes them', () => {
    const { result, unmount } = renderHook(() => useAutoHide(false));
    hideControls();

    act(() => {
      webKeyDown({ key: 'Enter' });
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.wokeWithUp).toBe(false);
    unmount();
  });
});
