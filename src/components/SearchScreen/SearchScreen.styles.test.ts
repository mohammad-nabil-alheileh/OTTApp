import { styles } from './SearchScreen.styles';

describe('SearchScreen query bar', () => {
  it('uses opaque backgrounds so its color is independent of the screen backdrop', () => {
    expect(styles.queryBar.backgroundColor).toBe('#161616');
    expect(styles.queryBarActive.backgroundColor).toBe('#1e1e1e');
  });
});
