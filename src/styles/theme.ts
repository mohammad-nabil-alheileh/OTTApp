import { Dimensions, StyleSheet } from 'react-native';

// Designs are made for 1920x1080. Height drives the scale so the home rows
// always fill the screen: horizontal overflow is absorbed by each rail's own
// scroller instead of the page. A 16:9 screen scales the same as before
// (width/1920 === height/1080), including Android TV's 960x540 dp.
const DESIGN_HEIGHT = 1080;

const { width, height } = Dimensions.get('window');
const scale = height / DESIGN_HEIGHT;

export const scaleSize = (size: number): number => Math.round(size * scale);

export const screen = { width, height, scale };

export const colors = {
  primary: '#e50914',
  background: '#000',
  cardBackground: '#1a1a1a',
  text: '#fff',
  textSecondary: '#999',
  border: '#333',
  focus: '#fff',
  gold: '#ffd700',
};

export const spacing = {
  xs: scaleSize(8),
  sm: scaleSize(16),
  md: scaleSize(24),
  lg: scaleSize(32),
  xl: scaleSize(48),
  xxl: scaleSize(64),
};

export const borderRadius = {
  sm: scaleSize(4),
  md: scaleSize(8),
  lg: scaleSize(16),
};

export const typography = {
  title: { fontSize: scaleSize(48), fontWeight: 'bold' as const },
  heading: { fontSize: scaleSize(36), fontWeight: 'bold' as const },
  subheading: { fontSize: scaleSize(28), fontWeight: '600' as const },
  body: { fontSize: scaleSize(24), fontWeight: '400' as const },
  caption: { fontSize: scaleSize(20), fontWeight: '400' as const },
};

// Styles shared by more than one component.
export const sharedStyles = StyleSheet.create({
  controlButton: {
    minWidth: scaleSize(160),
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  controlButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.1 }],
  },
  controlButtonText: {
    ...typography.subheading,
    color: colors.text,
  },
});
