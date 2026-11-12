import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

const ICON_SIZE = scaleSize(64);

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(1),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPing: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: ICON_SIZE / 2,
    borderWidth: scaleSize(2),
    borderColor: colors.focus,
  },
  iconBadge: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLens: {
    width: scaleSize(26),
    height: scaleSize(26),
    borderRadius: scaleSize(13),
    borderWidth: scaleSize(4),
    borderColor: colors.text,
    marginTop: -scaleSize(3),
    marginLeft: -scaleSize(3),
  },
  iconHandle: {
    position: 'absolute',
    width: scaleSize(4),
    height: scaleSize(15),
    borderRadius: scaleSize(2),
    backgroundColor: colors.text,
    transform: [{ rotate: '45deg' }],
    top: scaleSize(38),
    left: scaleSize(41),
  },
  textBlock: {
    flexShrink: 1,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
