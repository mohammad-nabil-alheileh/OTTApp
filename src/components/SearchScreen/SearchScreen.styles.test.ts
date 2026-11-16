import { FOCUSED_SCALE, RESULT_CARD_WIDTH, styles } from './SearchScreen.styles';

describe('SearchScreen results rail', () => {
  const growth = (RESULT_CARD_WIDTH * (FOCUSED_SCALE - 1)) / 2;

  it('leaves room on both sides for a focused card to scale up', () => {
    expect(styles.resultsList.paddingHorizontal).toBeGreaterThanOrEqual(growth);
  });

  it('keeps the first card lined up with the search column', () => {
    expect(
      (styles.resultsList.paddingHorizontal as number) +
        (styles.resultsListBox.marginLeft as number),
    ).toBe(0);
  });
});
