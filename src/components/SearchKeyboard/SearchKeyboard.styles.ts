import { StyleSheet } from 'react-native';
import { colors, screen, spacing } from '../../styles/theme';

// Base sizes are designed at 1080p; shrink further when the window is too
// narrow for the 10-key layout so nothing clips on small web viewports.
const BASE_KEY_SIZE = 72;
const BASE_KEY_GAP = 12;
const BASE_KEYBOARD_WIDTH =
  BASE_KEY_SIZE * 10 + BASE_KEY_GAP * 10 + BASE_KEY_SIZE * 0.75;
const AVAILABLE_WIDTH =
  Math.min(1000 * screen.scale, screen.width - spacing.xl * 2) - spacing.sm * 2;
const SCALE = Math.min(screen.scale, AVAILABLE_WIDTH / BASE_KEYBOARD_WIDTH);

const scale = (size: number) => Math.floor(size * SCALE);

export const KEY_SIZE = scale(BASE_KEY_SIZE);
export const KEY_GAP = scale(BASE_KEY_GAP);
// Each row is offset a quarter key further right, like a physical keyboard.
export const ROW_INDENTS = [0, 1, 2, 3].map(row =>
  Math.round((KEY_SIZE * row) / 4),
);
const KEYBOARD_WIDTH = KEY_SIZE * 10 + KEY_GAP * 10 + ROW_INDENTS[3];

// Labels scale with the keycaps instead of the screen height, so they never
// outgrow the keys on short/narrow windows.
const KEY_FONT_SIZE = Math.max(9, Math.round(KEY_SIZE * 0.42));
const ACTION_FONT_SIZE = Math.max(8, Math.round(KEY_SIZE * 0.32));
const KEY_RADIUS = Math.max(3, Math.round(KEY_SIZE * 0.1));
const KEY_BORDER = Math.max(1, Math.round(KEY_SIZE * 0.025));
const KEY_DEPTH = Math.max(1, Math.round(KEY_SIZE * 0.06));

export const keyWidth = (keyUnits: number) =>
  KEY_SIZE * keyUnits + KEY_GAP * (keyUnits - 1);

export const styles = StyleSheet.create({
  plate: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: Math.max(6, Math.round(KEY_SIZE * 0.2)),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  keyboard: {
    width: KEYBOARD_WIDTH,
  },
  row: {
    flexDirection: 'row',
    marginBottom: KEY_GAP,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    marginRight: KEY_GAP,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: KEY_RADIUS,
    borderWidth: KEY_BORDER,
    borderColor: '#4d4d4d',
    borderBottomWidth: KEY_DEPTH,
    borderBottomColor: '#0a0a0a',
    backgroundColor: '#2e2e2e',
  },
  keyFocused: {
    zIndex: 1,
    borderColor: colors.focus,
    borderBottomColor: '#bdbdbd',
    backgroundColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  keyText: {
    fontSize: KEY_FONT_SIZE,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  keyTextFocused: {
    color: '#000',
  },
  // Same width as the letter rows so SPACE sits centered under the keyboard.
  actionRow: {
    width: KEYBOARD_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: KEY_GAP,
  },
  actionKey: {
    height: KEY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: KEY_RADIUS,
    borderWidth: KEY_BORDER,
    borderColor: '#4d4d4d',
    borderBottomWidth: KEY_DEPTH,
    borderBottomColor: '#0a0a0a',
    backgroundColor: '#232323',
  },
  actionText: {
    fontSize: ACTION_FONT_SIZE,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
