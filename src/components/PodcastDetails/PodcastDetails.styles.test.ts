import { spacing } from '../../styles/theme';
import { styles } from './PodcastDetails.styles';

// How far a focused card's edge grows past its resting box on each side.
const focusOverflow = (size: number) => {
  const [{ scale }] = styles.episodeCardFocused.transform as [{ scale: number }];
  return (size * (scale - 1)) / 2;
};

describe('PodcastDetails episode rail', () => {
  it('leaves room for the focused card to grow past its left edge', () => {
    const width = styles.episodeCard.width as number;
    expect(styles.episodesListContent.paddingLeft).toBeGreaterThanOrEqual(
      focusOverflow(width),
    );
  });

  it('leaves room for the focused card to grow past its top and bottom', () => {
    const height = styles.episodeCard.height as number;
    expect(styles.episodesListContent.paddingVertical).toBeGreaterThanOrEqual(
      focusOverflow(height),
    );
  });

  it('keeps the first card at its resting position', () => {
    expect(
      styles.episodesListContent.paddingLeft + (styles.episodesList.marginLeft as number),
    ).toBe(spacing.xs);
  });
});
