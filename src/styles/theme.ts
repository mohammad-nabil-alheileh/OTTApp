import { Dimensions } from 'react-native';

// Designs are made for 1920x1080. Android TV reports width in dp (960 on a
// 1080p TV), so scaling by width works for both dp and CSS pixels.
const DESIGN_WIDTH = 1920;

const { width, height } = Dimensions.get('window');
const scale = width / DESIGN_WIDTH;

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
