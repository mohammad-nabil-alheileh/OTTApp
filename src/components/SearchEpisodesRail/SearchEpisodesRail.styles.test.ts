import { EPISODE_CARD_WIDTH, FOCUSED_SCALE, styles } from './SearchEpisodesRail.styles';

describe('SearchEpisodesRail', () => {
  const growth = (EPISODE_CARD_WIDTH * (FOCUSED_SCALE - 1)) / 2;

  it('leaves room on both sides for a focused card to scale up', () => {
    expect(styles.listContent.paddingHorizontal).toBeGreaterThanOrEqual(growth);
  });

  it('keeps the first card lined up with the search column', () => {
    expect(
      (styles.listContent.paddingHorizontal as number) +
        (styles.list.marginLeft as number),
    ).toBe(0);
  });
});
