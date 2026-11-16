import { EPISODE_CARD_WIDTH, FOCUSED_SCALE, styles } from './SeasonEpisodes.styles';

describe('SeasonEpisodes episode rail', () => {
  it('leaves room on the left for the focused card to scale up', () => {
    const growth = (EPISODE_CARD_WIDTH * (FOCUSED_SCALE - 1)) / 2;
    expect(styles.listContent.paddingLeft).toBeGreaterThanOrEqual(growth);
  });

  it('keeps the first card lined up with the text above it', () => {
    expect(
      styles.listContent.paddingLeft + (styles.list.marginLeft as number),
    ).toBeGreaterThanOrEqual(0);
  });
});
