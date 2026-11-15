import { StyleSheet } from 'react-native';
import { colors, contentWidth, screen } from '../../styles/theme';

// Ten equal columns fill the shared content width. Every row adds up to the
// same ten units, so the grid is a clean rectangle instead of staggered rows,
// and the search bar above shares the same left and right edges.
const COLUMN_UNITS = 10;
export const KEY_GAP = Math.max(4, Math.round(10 * screen.scale));
export const KEY_SIZE = Math.floor(
  (contentWidth - KEY_GAP * (COLUMN_UNITS - 1)) / COLUMN_UNITS,
);
export const KEYBOARD_WIDTH =
  KEY_SIZE * COLUMN_UNITS + KEY_GAP * (COLUMN_UNITS - 1);

export const keyWidth = (units: number) =>
  KEY_SIZE * units + KEY_GAP * (units - 1);

// Wider than tall: five rows still leave room for the results rail above.
const KEY_HEIGHT = Math.round(KEY_SIZE * 0.76);
// Labels scale with the keycaps instead of the screen height, so they never
// outgrow the keys on short/narrow windows.
const KEY_FONT_SIZE = Math.max(9, Math.round(KEY_SIZE * 0.4));
const ACTION_FONT_SIZE = Math.max(8, Math.round(KEY_SIZE * 0.26));
const KEY_RADIUS = Math.max(3, Math.round(KEY_SIZE * 0.12));
const KEY_BORDER = Math.max(1, Math.round(KEY_SIZE * 0.025));
const KEY_DEPTH = Math.max(1, Math.round(KEY_SIZE * 0.055));

export const styles = StyleSheet.create({
  keyboard: {
    width: KEYBOARD_WIDTH,
    gap: KEY_GAP,
  },
  row: {
    width: KEYBOARD_WIDTH,
    flexDirection: 'row',
    gap: KEY_GAP,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: KEY_RADIUS,
    borderWidth: KEY_BORDER,
    borderColor: '#3c3c42',
    borderBottomWidth: KEY_DEPTH,
    borderBottomColor: '#101012',
    backgroundColor: '#26262b',
  },
  // Action keys sit a shade darker so the alphabet grid reads as the surface.
  actionKey: {
    borderColor: '#333338',
    borderBottomColor: '#0c0c0e',
    backgroundColor: '#1c1c20',
  },
  keyFocused: {
    zIndex: 1,
    borderColor: colors.focus,
    borderBottomColor: '#c8c8c8',
    backgroundColor: colors.focus,
    transform: [{ scale: 1.06 }],
  },
  keyText: {
    fontSize: KEY_FONT_SIZE,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  // The number row reads as secondary to the letters.
  keyTextMuted: {
    fontWeight: '500',
    color: '#c2c2c8',
  },
  keyTextFocused: {
    color: '#000',
  },
  actionText: {
    fontSize: ACTION_FONT_SIZE,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.text,
    textAlign: 'center',
  },
});
