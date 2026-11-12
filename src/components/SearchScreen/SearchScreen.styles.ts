import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  screen,
  spacing,
  typography,
} from '../../styles/theme';

const CONTENT_WIDTH = Math.min(scaleSize(1000), screen.width - spacing.xl * 2);
const CARD_WIDTH = scaleSize(300);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(3),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  backChevron: {
    ...typography.subheading,
    lineHeight: scaleSize(30),
    color: colors.text,
    marginRight: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.text,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text,
    marginLeft: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 'auto',
    paddingLeft: spacing.md,
    textAlign: 'right',
    flexShrink: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  queryBar: {
    width: CONTENT_WIDTH,
    height: scaleSize(84),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  queryIcon: {
    ...typography.subheading,
    marginRight: spacing.sm,
  },
  queryField: {
    flex: 1,
  },
  queryText: {
    ...typography.subheading,
    lineHeight: scaleSize(36),
    color: colors.text,
  },
  // Still being recognized; not yet committed to the query.
  queryPartial: {
    color: colors.textSecondary,
  },
  caret: {
    color: colors.primary,
  },
  placeholder: {
    ...typography.subheading,
    lineHeight: scaleSize(36),
    color: colors.textSecondary,
  },
  micButton: {
    width: scaleSize(64),
    height: scaleSize(64),
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(2),
    borderColor: '#4d4d4d',
    borderBottomWidth: scaleSize(4),
    borderBottomColor: '#0a0a0a',
    backgroundColor: '#2e2e2e',
  },
  micButtonFocused: {
    borderColor: colors.focus,
    borderBottomColor: '#bdbdbd',
    backgroundColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  micButtonListening: {
    borderColor: colors.primary,
    borderBottomColor: '#8a050c',
    backgroundColor: colors.primary,
  },
  micIcon: {
    fontSize: scaleSize(32),
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    width: CONTENT_WIDTH,
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: scaleSize(1),
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultsSection: {
    width: CONTENT_WIDTH,
    flex: 1,
    justifyContent: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resultsTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  resultsCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  resultsList: {
    paddingVertical: spacing.xs,
  },
  resultCard: {
    width: CARD_WIDTH,
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(4),
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  resultCardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: 1.06 }],
  },
  resultThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  resultOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  resultTitle: {
    ...typography.subheading,
    lineHeight: scaleSize(32),
    color: colors.text,
  },
  resultMeta: {
    ...typography.caption,
    lineHeight: scaleSize(24),
    color: colors.textSecondary,
  },
  emptyState: {
    height: scaleSize(190),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: scaleSize(1),
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  emptyTitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
