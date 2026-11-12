import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { FocusGroupProps } from './FocusGroup.types';

interface Group {
  element: HTMLElement;
  lastFocused: HTMLElement | null;
}
const groups = new Set<Group>();

const isShown = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const cardsIn = (element: HTMLElement) =>
  Array.from(element.querySelectorAll<HTMLElement>('[tabindex]')).filter(
    card => card.tabIndex >= 0 && isShown(card),
  );

const groupOf = (element: HTMLElement | null) =>
  element ? [...groups].find(group => group.element.contains(element)) : undefined;

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
    return;
  }
  const active = document.activeElement as HTMLElement | null;
  const current = groupOf(active);
  if (!active || !current) {
    return;
  }
  const up = e.key === 'ArrowUp';
  // Document order, not on-screen position: rows scroll underneath the fixed
  // header, so a row partly scrolled above the viewport has a higher top than
  // the header and Up would skip straight past it to the header.
  const ordered = [...groups]
    .filter(
      group =>
        group === current ||
        (isShown(group.element) && cardsIn(group.element).length > 0),
    )
    .sort((a, b) =>
      // eslint-disable-next-line no-bitwise
      a.element.compareDocumentPosition(b.element) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    );
  const next = ordered[ordered.indexOf(current) + (up ? -1 : 1)];

  if (!next) {
    return;
  }
  const target = next.lastFocused?.isConnected
    ? next.lastFocused
    : cardsIn(next.element)[0];
  if (!target) {
    return;
  }
  current.lastFocused = active;
  e.preventDefault();
  e.stopPropagation();
  target.focus();
};

export const FocusGroup: React.FC<FocusGroupProps> = ({ children, style }) => {
  const containerRef = useRef<View>(null);

  useEffect(() => {
    const element = containerRef.current as unknown as HTMLElement | null;
    if (!element) {
      return;
    }
    const group: Group = { element, lastFocused: null };
    groups.add(group);
    if (groups.size === 1) {
      window.addEventListener('keydown', handleKeyDown, true);
    }
    return () => {
      groups.delete(group);
      if (groups.size === 0) {
        window.removeEventListener('keydown', handleKeyDown, true);
      }
    };
  }, []);

  return (
    <View ref={containerRef} style={style}>
      {children}
    </View>
  );
};
