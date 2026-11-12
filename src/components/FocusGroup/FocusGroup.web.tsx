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
  const from = current.element.getBoundingClientRect();
  const [next] = [...groups]
    .filter(group => group !== current && isShown(group.element))
    .map(group => ({ group, rect: group.element.getBoundingClientRect() }))
    .filter(({ rect }) =>
      up ? rect.bottom <= from.top : rect.top >= from.bottom,
    )
    .sort((a, b) => (up ? b.rect.top - a.rect.top : a.rect.top - b.rect.top));

  if (!next) {
    if (!up) {
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }
  const target =
    next.group.lastFocused?.isConnected
      ? next.group.lastFocused
      : cardsIn(next.group.element)[0];
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
