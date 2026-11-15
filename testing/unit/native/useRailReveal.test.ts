import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { act, renderHook } from '@testing-library/react-native';
import { useRailReveal } from '../../../src/focus/useRailReveal';

const layout = { cardWidth: 320, cardGap: 24, gutter: 48 };

// Stand-in for the rail's FlatList: only the scroll call the hook makes.
const fakeList = () =>
  ({ scrollToOffset: jest.fn() } as unknown as FlatList & {
    scrollToOffset: jest.Mock;
  });

const layoutEvent = (width: number) =>
  ({ nativeEvent: { layout: { width } } } as LayoutChangeEvent);
const scrollEvent = (x: number) =>
  ({
    nativeEvent: { contentOffset: { x, y: 0 } },
  } as NativeSyntheticEvent<NativeScrollEvent>);

const renderRail = async (scrollX: number) => {
  const hook = await renderHook(() => useRailReveal(layout));
  const list = fakeList();
  await act(async () => {
    hook.result.current.listProps.ref.current = list;
    hook.result.current.listProps.onLayout?.(layoutEvent(1920));
    hook.result.current.listProps.onScroll?.(scrollEvent(scrollX));
  });
  return { hook, list };
};

describe('useRailReveal (native)', () => {
  it('scrolls the rail back to its start when the first card takes focus', async () => {
    const { hook, list } = await renderRail(48);
    hook.result.current.withReveal({}, 0).onFocus?.();
    expect(list.scrollToOffset).toHaveBeenCalledWith({ offset: 0, animated: false });
  });

  it('keeps a gutter after a card that Android left flush with the right edge', async () => {
    const { hook, list } = await renderRail(1200);
    hook.result.current.withReveal({}, 8).onFocus?.();
    expect(list.scrollToOffset).toHaveBeenCalledWith({
      offset: 3120 + 48 - 1920,
      animated: false,
    });
  });

  it('measures the next press from where it scrolled, not a stale offset', async () => {
    const { hook, list } = await renderRail(1200);
    hook.result.current.withReveal({}, 8).onFocus?.();
    hook.result.current.withReveal({}, 8).onFocus?.();
    expect(list.scrollToOffset).toHaveBeenCalledTimes(1);
  });

  it('leaves the rail alone for a card already in view', async () => {
    const { hook, list } = await renderRail(0);
    hook.result.current.withReveal({}, 2).onFocus?.();
    expect(list.scrollToOffset).not.toHaveBeenCalled();
  });

  it('keeps the onFocus and ref it was given', async () => {
    const { hook } = await renderRail(0);
    const onFocus = jest.fn();
    const ref = jest.fn();
    const props = hook.result.current.withReveal({ onFocus, ref }, 0);
    props.onFocus?.();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(props.ref).toBe(ref);
  });
});
