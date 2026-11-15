import React from 'react';
import { act, render } from '@testing-library/react';
import { Pressable, View } from 'react-native';
import { useFocusGroup } from '../../../src/focus/useFocusGroup';
import { webKeyDown } from '../../helpers/dom';

// Same shape as the player's transport bar: fixed slots with the middle ones
// left empty while live, so only slots 1 and 5 are rendered.
const SLOTS = [1, 5];

const SparseRow: React.FC = () => {
  const group = useFocusGroup('sparse-row', 6);
  return (
    <View ref={group.containerRef}>
      {SLOTS.map(index => (
        <Pressable
          key={index}
          {...group.getItemProps(index)}
          accessibilityLabel={`slot ${index}`}
        />
      ))}
    </View>
  );
};

const byLabel = (label: string) =>
  document.querySelector(`[aria-label="${label}"]`) as HTMLElement;

describe('useFocusGroup (web)', () => {
  it('skips empty slots in the direction of travel', () => {
    const { unmount } = render(<SparseRow />);
    const first = byLabel('slot 1');
    const last = byLabel('slot 5');
    act(() => first.focus());

    webKeyDown({ key: 'ArrowRight' });
    expect(document.activeElement).toBe(last);

    // Nothing further right, so the move is dropped rather than snapping back.
    webKeyDown({ key: 'ArrowRight' });
    expect(document.activeElement).toBe(last);

    webKeyDown({ key: 'ArrowLeft' });
    expect(document.activeElement).toBe(first);
    unmount();
  });
});
