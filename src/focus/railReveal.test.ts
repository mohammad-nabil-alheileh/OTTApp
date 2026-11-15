import { RailLayout, revealOffset } from './railReveal';

// Home rail geometry at 1080p: 320 cards, 24 gap, 48 gutter, 1920 wide.
const layout: RailLayout = { cardWidth: 320, cardGap: 24, gutter: 48 };
const VIEWPORT = 1920;
const cardStart = (index: number) => 48 + index * 344;

describe('revealOffset', () => {
  it('scrolls back to 0 when the first card takes focus from a scrolled rail', () => {
    expect(revealOffset(0, layout, 48, VIEWPORT)).toBe(0);
  });

  it('keeps the gutter to the left of a card that is off the left edge', () => {
    expect(revealOffset(3, layout, cardStart(3) + 10, VIEWPORT)).toBe(
      cardStart(3) - 48,
    );
  });

  it('keeps the gutter to the right of a card that is off the right edge', () => {
    // Card 8 ends at 3120; Android leaves it flush with the edge (offset 1200).
    expect(revealOffset(8, layout, 1200, VIEWPORT)).toBe(3120 + 48 - VIEWPORT);
  });

  it('does not scroll for a card that is fully visible with its gutters', () => {
    expect(revealOffset(0, layout, 0, VIEWPORT)).toBeNull();
    expect(revealOffset(4, layout, 0, VIEWPORT)).toBeNull();
  });

  it('does not scroll before the rail has been measured', () => {
    expect(revealOffset(8, layout, 0, 0)).toBeNull();
  });
});
