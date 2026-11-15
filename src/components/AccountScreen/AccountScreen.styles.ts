import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  contentWidth,
  scaleSize,
  spacing,
  typography,
} from '../../styles/theme';

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
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  body: {
    width: contentWidth,
    alignSelf: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  // Blocks below Back are read-only, but the remote still has to be able to
  // land on them; a brighter frame shows where it is without the card jumping
  // the way a scaled-up button would.
  cardFocused: {
    borderColor: colors.focus,
    backgroundColor: '#2a2a2a',
  },
  avatar: {
    width: scaleSize(160),
    height: scaleSize(160),
    borderRadius: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: scaleSize(56),
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    ...typography.heading,
    color: colors.text,
  },
  profileEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: scaleSize(4),
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailsCard: {
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: scaleSize(1),
    borderBottomColor: colors.border,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.md,
  },
  emptyPanel: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: scaleSize(2),
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
