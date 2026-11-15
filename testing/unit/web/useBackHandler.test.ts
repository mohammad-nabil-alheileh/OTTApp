import { renderHook } from '@testing-library/react';
import { useBackHandler } from '../../../src/hooks/useBackHandler';
import { webKeyDown } from '../../helpers/dom';

// Keyboard Back keys shared by every web TV runtime (and desktop browsers).
// The remote's own Back keyCode is tested per platform in unit/<platform>/.
describe('useBackHandler (web, shared keys)', () => {
  it.each(['Escape', 'Backspace'])('%s runs the handler', key => {
    const handler = jest.fn(() => true);
    const { unmount } = renderHook(() => useBackHandler(handler));

    const event = webKeyDown({ key });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    unmount();
  });

  it('runs the newest handler first and stops when it returns true', () => {
    const older = jest.fn(() => true);
    const newer = jest.fn(() => true);
    const a = renderHook(() => useBackHandler(older));
    const b = renderHook(() => useBackHandler(newer));

    webKeyDown({ key: 'Escape' });

    expect(newer).toHaveBeenCalledTimes(1);
    expect(older).not.toHaveBeenCalled();
    a.unmount();
    b.unmount();
  });

  it('leaves the event alone when no handler claims it', () => {
    const { unmount } = renderHook(() => useBackHandler(() => false));
    const event = webKeyDown({ key: 'Escape' });
    expect(event.defaultPrevented).toBe(false);
    unmount();
  });

  it('ignores other keys', () => {
    const handler = jest.fn(() => true);
    const { unmount } = renderHook(() => useBackHandler(handler));
    webKeyDown({ key: 'ArrowLeft' });
    webKeyDown({ key: 'Enter' });
    expect(handler).not.toHaveBeenCalled();
    unmount();
  });
});
