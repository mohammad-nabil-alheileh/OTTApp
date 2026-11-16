import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';
import { KEYBOARD_WIDTH } from '../SearchKeyboard/SearchKeyboard.styles';

// One column shared by the header, field, results and keyboard, so every
// element sits on the same vertical edges.
const COLUMN_WIDTH = KEYBOARD_WIDTH;
// Three result cards plus their gaps fill the column exactly.
export const RESULT_CARD_WIDTH = Math.floor((COLUMN_WIDTH - spacing.md * 3) / 3);
export const FOCUSED_SCALE = 1.06;
const CARD_BORDER = scaleSize(4);
// The overlay is absolute, so a card is exactly its 16:9 thumbnail plus border.
const CARD_HEIGHT =
  Math.round(((RESULT_CARD_WIDTH - CARD_BORDER * 2) * 9) / 16) + CARD_BORDER * 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    width: COLUMN_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
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
    width: COLUMN_WIDTH,
    height: scaleSize(88),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(2),
    borderColor: 'rgba(255, 255, 255, 0.14)',
    backgroundColor: '#161616',
  },
  queryBarActive: {
    borderColor: 'rgba(255, 255, 255, 0.32)',
    backgroundColor: '#1e1e1e',
  },
  queryIconBadge: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(30),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: spacing.sm,
  },
  queryIcon: {
    fontSize: scaleSize(26),
  },
  queryField: {
    flex: 1,
  },
  queryText: {
    ...typography.subheading,
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
    color: colors.textSecondary,
  },
  micButton: {
    width: scaleSize(64),
    height: scaleSize(64),
    marginLeft: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(32),
    borderWidth: scaleSize(2),
    borderColor: '#4a4a52',
    backgroundColor: '#2a2a2f',
  },
  micButtonFocused: {
    borderColor: colors.focus,
    backgroundColor: colors.focus,
    transform: [{ scale: 1.08 }],
  },
  micButtonListening: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  micIcon: {
    fontSize: scaleSize(30),
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: scaleSize(1),
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultsSection: {
    width: COLUMN_WIDTH,
    flex: 1,
    justifyContent: 'center',
  },
  resultsBlock: {
    width: '100%',
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
  // The gutter gives a focused card room to scale; the negative margin keeps
  // the first card on the column edge at rest.
  resultsList: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  // Fixed to the card height (plus focus-scale room) so the rail never
  // collapses and the results block can center between field and keyboard.
  resultsListBox: {
    flexGrow: 0,
    height: CARD_HEIGHT + spacing.xs * 2,
    marginLeft: -spacing.sm,
  },
  resultCard: {
    width: RESULT_CARD_WIDTH,
    alignSelf: 'flex-start',
    marginRight: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: CARD_BORDER,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  resultCardFocused: {
    borderColor: colors.focus,
    transform: [{ scale: FOCUSED_SCALE }],
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
    color: colors.text,
  },
  resultMeta: {
    ...typography.caption,
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
