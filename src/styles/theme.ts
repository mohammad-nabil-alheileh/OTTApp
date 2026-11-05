import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);

// Scale factor based on screen size (1080p = 1.0)
const scale = diagonal / 1920;

const scaleSize = (size: number): number => Math.round(size * scale);

export const colors = {
  primary: '#e74c3c',
  background: '#000',
  cardBackground: '#1a1a1a',
  text: '#fff',
  textSecondary: '#999',
  border: '#333',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  gold: '#ffd700',
};

export const spacing = {
  xs: scaleSize(4),
  sm: scaleSize(8),
  md: scaleSize(12),
  lg: scaleSize(16),
  xl: scaleSize(20),
  xxl: scaleSize(24),
};

export const borderRadius = {
  sm: scaleSize(4),
  md: scaleSize(8),
  lg: scaleSize(12),
  full: 9999,
};

export const typography = {
  title: {
    fontSize: scaleSize(24),
    fontWeight: 'bold' as const,
  },
  heading: {
    fontSize: scaleSize(18),
    fontWeight: 'bold' as const,
  },
  subheading: {
    fontSize: scaleSize(16),
    fontWeight: '600' as const,
  },
  body: {
    fontSize: scaleSize(14),
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: scaleSize(12),
    fontWeight: '400' as const,
  },
};

// Screen dimensions for responsive layout
export const screen = {
  width: screenWidth,
  height: screenHeight,
  scale,
};
