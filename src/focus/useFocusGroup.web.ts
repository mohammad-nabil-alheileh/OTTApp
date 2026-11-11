/// <reference lib="dom" />
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { FocusGroup, FocusGroupItemProps } from './useFocusGroup.types';

type Direction = 'left' | 'right' | 'up' | 'down';
type FocusableElement = HTMLElement;

interface GroupState {
  container: FocusableElement | null;
  items: (FocusableElement | null)[];
  // Index of the item that had focus last, so coming back to this rail lands
  // on it again instead of the nearest item geometrically.
  lastFocusedIndex: number;
}

// Each rail registers here. Arrow keys are only taken over while focus is
// inside a registered group, so the player and other screens keep using the
// spatial-navigation polyfill.
const groups = new Map<string, GroupState>();
let listenerAttached = false;

const toElement = (node: View | null): FocusableElement | null =>
  node as unknown as FocusableElement | null;

const findGroup = (element: Element | null): GroupState | null => {
  if (!element) {
    return null;
  }
  for (const group of groups.values()) {
    if (group.items.includes(element as FocusableElement)) {
      return group;
    }
  }
  return null;
};

const orderedGroups = (): GroupState[] => {
  const withContainer = Array.from(groups.values()).filter(
    (group): group is GroupState & { container: FocusableElement } =>
      group.container !== null && group.items.some(Boolean),
  );
  return withContainer.sort(
    (a, b) =>
      a.container.getBoundingClientRect().top -
      b.container.getBoundingClientRect().top,
  );
};

// Clamp to the group and skip items that are not mounted (virtualized lists).
const availableIndex = (group: GroupState, index: number): number | null => {
  const last = group.items.length - 1;
  if (last < 0) {
    return null;
  }
  const clamped = Math.min(Math.max(index, 0), last);
  for (let distance = 0; distance <= last; distance += 1) {
    if (group.items[clamped - distance]) {
      return clamped - distance;
    }
    if (group.items[clamped + distance]) {
      return clamped + distance;
    }
  }
  return null;
};

// First visit to a rail: land on the item in line with the current one.
const indexUnder = (group: GroupState, element: FocusableElement) => {
  const rect = element.getBoundingClientRect();
  const center = rect.left + rect.width / 2;
  let closest: number | null = null;
  let closestDistance = Infinity;
  group.items.forEach((item, index) => {
    if (!item) {
      return;
    }
    const itemRect = item.getBoundingClientRect();
    const distance = Math.abs(itemRect.left + itemRect.width / 2 - center);
    if (distance < closestDistance) {
      closest = index;
      closestDistance = distance;
    }
  });
  return closest;
};

const focusItem = (group: GroupState, index: number) => {
  const item = group.items[index];
  if (!item) {
    return;
  }
  group.lastFocusedIndex = index;
  // Focus without the browser's own scrolling, then reveal the item with
  // 'nearest': the rail scrolls sideways, and the page scrolls vertically
  // only when the row itself is out of view.
  item.focus({ preventScroll: true });
  item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  revealWithGutter(item);
};

const scrollerOf = (element: FocusableElement): FocusableElement | null => {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowX } = getComputedStyle(node);
    if (
      (overflowX === 'auto' || overflowX === 'scroll') &&
      node.scrollWidth > node.clientWidth
    ) {
      return node;
    }
  }
  return null;
};

// 'nearest' only scrolls until the card touches the rail's edge, which hides
// the rail's padding: coming back to the first card would leave it stuck to
// the screen edge. Keep the content container's padding visible as a gutter,
// so the first and last cards sit where they do at rest.
const revealWithGutter = (item: FocusableElement) => {
  const scroller = scrollerOf(item);
  if (!scroller) {
    return;
  }
  const content = scroller.firstElementChild;
  const padding = content ? getComputedStyle(content) : null;
  const gutterStart = padding ? parseFloat(padding.paddingLeft) || 0 : 0;
  const gutterEnd = padding ? parseFloat(padding.paddingRight) || 0 : 0;

  const scrollerRect = scroller.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const start = itemRect.left - scrollerRect.left - gutterStart;
  const end = itemRect.right - scrollerRect.right + gutterEnd;
  if (start < 0) {
    scroller.scrollLeft += start;
  } else if (end > 0) {
    scroller.scrollLeft += end;
  }
};

const ARROW_KEYS: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return;
  }
  const direction = ARROW_KEYS[event.key];
  if (!direction) {
    return;
  }

  const active = document.activeElement as FocusableElement | null;
  if (
    !active ||
    active.isContentEditable ||
    active.tagName === 'INPUT' ||
    active.tagName === 'TEXTAREA'
  ) {
    return;
  }
  const group = findGroup(active);
  if (!group) {
    return;
  }

  // The group owns the arrows: preventDefault stops the browser and the
  // polyfill from also moving focus or scrolling. stopImmediatePropagation is
  // needed because the TV FocusGroup wrapper listens on this same target and
  // would otherwise see the already-moved focus and move a second rail.
  event.preventDefault();
  event.stopImmediatePropagation();

  if (direction === 'left' || direction === 'right') {
    const index = group.items.indexOf(active);
    const next = availableIndex(
      group,
      index + (direction === 'right' ? 1 : -1),
    );
    if (next !== null && next !== index) {
      focusItem(group, next);
    }
    return;
  }

  const ordered = orderedGroups();
  const currentIndex = ordered.indexOf(group);
  const nextGroup = ordered[currentIndex + (direction === 'down' ? 1 : -1)];
  if (!nextGroup) {
    return;
  }

  const remembered =
    nextGroup.lastFocusedIndex >= 0
      ? availableIndex(nextGroup, nextGroup.lastFocusedIndex)
      : null;
  const next = remembered ?? indexUnder(nextGroup, active);
  if (next !== null) {
    focusItem(nextGroup, next);
  }
};

export const useFocusGroup = (
  groupId: string,
  itemCount: number,
): FocusGroup => {
  const group = useMemo<GroupState>(
    () => ({ container: null, items: [], lastFocusedIndex: -1 }),
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef(new Map<number, (node: View | null) => void>());

  useEffect(() => {
    groups.set(groupId, group);
    if (!listenerAttached) {
      window.addEventListener('keydown', handleKeyDown, true);
      listenerAttached = true;
    }
    return () => {
      if (groups.get(groupId) === group) {
        groups.delete(groupId);
      }
    };
  }, [groupId, group]);

  useEffect(() => {
    group.items.length = itemCount;
  }, [group, itemCount]);

  const containerRef = useCallback(
    (node: View | null) => {
      group.container = toElement(node);
    },
    [group],
  );

  const getItemRef = useCallback(
    (index: number) => {
      let callback = itemRefs.current.get(index);
      if (!callback) {
        callback = (node: View | null) => {
          group.items[index] = toElement(node);
        };
        itemRefs.current.set(index, callback);
      }
      return callback;
    },
    [group],
  );

  const getItemProps = useCallback(
    (index: number): FocusGroupItemProps => ({
      ref: getItemRef(index),
      onFocus: () => {
        group.lastFocusedIndex = index;
        setActiveIndex(index);
      },
      // Roving tabindex: one tab stop per rail.
      tabIndex: index === activeIndex ? 0 : -1,
    }),
    [activeIndex, getItemRef, group],
  );

  const focusFirst = useCallback(() => {
    const index =
      group.lastFocusedIndex >= 0 ? group.lastFocusedIndex : 0;
    const target = availableIndex(group, index);
    if (target !== null) {
      focusItem(group, target);
    }
  }, [group]);

  return { containerRef, getItemProps, activeIndex, focusFirst };
};
