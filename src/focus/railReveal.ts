// Fixed geometry of a horizontal rail: every card has the same width and gap,
// and the content container has `gutter` padding at each end.
export interface RailLayout {
  cardWidth: number;
  cardGap: number;
  gutter: number;
}

// Scroll offset that shows card `index` with a gutter on both sides, or null
// when it already is. Same rule as the web's revealWithGutter.
export const revealOffset = (
  index: number,
  { cardWidth, cardGap, gutter }: RailLayout,
  scrollOffset: number,
  viewport: number,
): number | null => {
  if (viewport <= 0) {
    return null;
  }
  const start = gutter + index * (cardWidth + cardGap);
  const end = start + cardWidth;
  if (start - gutter < scrollOffset) {
    return Math.max(0, start - gutter);
  }
  if (end + gutter > scrollOffset + viewport) {
    return end + gutter - viewport;
  }
  return null;
};
