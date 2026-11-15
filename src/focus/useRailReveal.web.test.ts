import { renderHook } from '@testing-library/react';
import { useRailReveal } from './useRailReveal';

const layout = { cardWidth: 320, cardGap: 24, gutter: 48 };

describe('useRailReveal (web)', () => {
  it('leaves card and list props alone, since revealWithGutter already keeps the gutter', () => {
    const { result } = renderHook(() => useRailReveal(layout));
    const props = { onFocus: jest.fn(), tabIndex: 0 as const };
    expect(result.current.withReveal(props, 0)).toBe(props);
    expect(Object.keys(result.current.listProps)).toEqual(['ref']);
  });
});
