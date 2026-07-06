import { useTranslation } from 'react-i18next';
/**
 * CPN-059 — Profile Edit Rejected Screen
 * Phase 4C — Specific edit sections were rejected; existing approved profile stays live.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { useAuthStore } from '../../store/slices/authStore';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { VerificationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.PROFILE_EDIT_REJECTED>;

export function ProfileEditRejectedScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setProfileReviewStatus, setProfileEditRejectionSections, setApplicationEntryRoute, setProfileChecklistMode } = useApplicationStore();
  const { setAuthStatus } = useAuthStore();

  useEffect(() => {
    setProfileReviewStatus('rejected');
    setProfileEditRejectionSections(['Gallery photos', 'Bio wording', 'Experience categories']);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.stepBadge}>
          <Icon name="adjust" size={14} color={colors.gold} />
          <Text style={styles.stepBadgeText}>{t("content.application_kyc.ProfileEditRejectedContent.STEP_LABEL")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="edit-off" size={44} color={colors.errorRed} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="error-outline" size={16} color={colors.errorRed} />
          </View>
        </View>

        {/* ── Step badge ── */}

        {/* ── Error badge ── */}
        <View style={styles.errorBadge}>
          <Icon name="error-outline" size={14} color={colors.errorRed} />
          <Text style={styles.errorBadgeText}>{t("content.application_kyc.CommonKycContent.EDIT_REVIEW_NOT_APPROVED")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.ProfileEditRejectedContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ProfileEditRejectedContent.SUBHEADLINE")}</Text>

        {/* ── Review summary card ── */}
        <GlassCard style={StyleSheet.flatten([styles.card, styles.reviewCard])}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileEditRejectedContent.REVIEW_TITLE").toUpperCase()}</Text>
          <View style={styles.summaryList}>
            {((Array.isArray(t("content.application_kyc.ProfileEditRejectedContent.REVIEW_SUMMARY", { returnObjects: true })) ? (t("content.application_kyc.ProfileEditRejectedContent.REVIEW_SUMMARY", { returnObjects: true }) as any[]) : [])).map((item, index) => {
              const statusColors: Record<string, string> = {
                Completed: colors.safetyGreen,
                'Not published': colors.errorRed,
                'Update required': colors.warningAmber
              };
              const statusIcons: Record<string, string> = {
                Completed: 'check-circle',
                'Not published': 'visibility-off',
                'Update required': 'admin-panel-settings'
              };
              const c = statusColors[item.status] ?? colors.textMuted;
              const ic = statusIcons[item.status] ?? 'radio-button-unchecked';
              return (
                <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.summaryRow}>
                  <View style={styles.summaryIconWrap}>
                    <Icon name={item.icon as any} size={18} color={c} />
                  </View>
                  <Text style={styles.summaryLabel}>{t(item.label)}</Text>
                  <View style={[styles.summaryStatusBadge, { borderColor: `${c}30`, backgroundColor: `${c}12` }]}>
                    <Text style={[styles.summaryStatusText, { color: c }]}>{item.status}</Text>
                  </View>
                </View>);

            })}
          </View>
        </GlassCard>

        {/* ── Required updates card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileEditRejectedContent.REQUIRED_TITLE").toUpperCase()}</Text>
          <Text style={styles.requiredSubtitle}>{t("content.application_kyc.ProfileEditRejectedContent.REQUIRED_SUBTITLE")}</Text>
          <View style={styles.updateList}>
            {((Array.isArray(t("content.application_kyc.ProfileEditRejectedContent.REQUIRED_UPDATES", { returnObjects: true })) ? (t("content.application_kyc.ProfileEditRejectedContent.REQUIRED_UPDATES", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.updateRow}>
                <View style={styles.updateIconWrap}>
                  <Icon name={item.icon as any} size={22} color={colors.errorRed} />
                </View>
                <View style={styles.updateContent}>
                  <View style={styles.updateLabelRow}>
                    <Text style={styles.updateLabel}>{t(item.label)}</Text>
                    <View style={styles.requiredTag}>
                      <Text style={styles.requiredTagText}>{t("content.application_kyc.CommonKycContent.REQUIRED")}</Text>
                    </View>
                  </View>
                  <Text style={styles.updateDesc}>{t(item.description)}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Current status card (approved profile still live) ── */}
        <GlassCard style={StyleSheet.flatten([styles.card, styles.approvedCard])}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileEditRejectedContent.CURRENT_STATUS_TITLE").toUpperCase()}</Text>
          <Text style={styles.currentStatusNote}>{t("content.application_kyc.ProfileEditRejectedContent.CURRENT_STATUS_NOTE")}</Text>
          <View style={styles.currentStatusList}>
            {((Array.isArray(t("content.application_kyc.ProfileEditRejectedContent.STATUS_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.ProfileEditRejectedContent.STATUS_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.currentStatusRow}>
                <Icon name={item.icon as any} size={18} color={colors.safetyGreen} />
                <Text style={styles.currentStatusLabel}>{t(item.label)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Support note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="support-agent" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ProfileEditRejectedContent.SUPPORT_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Warning ── */}
        <Text style={styles.warningNote}>{t("content.application_kyc.ProfileEditRejectedContent.WARNING")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ProfileEditRejectedContent.CTA_UPDATE")}
          onPress={() => {
            // Explicitly set checklist mode in store BEFORE switching the navigator.
            // CPN-046 is mounted as the initial route (no nav params) so it reads
            // profileChecklistMode from store as the authoritative mode source.
            setProfileChecklistMode('correction');
            setApplicationEntryRoute(Routes.PROFILE_COMPLETION_CHECKLIST);
            setAuthStatus('applying');
          }}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.update_required_sections")} />
        
        <ActionButton
          label={t("content.application_kyc.ProfileEditRejectedContent.CTA_SUPPORT")}
          onPress={() => {}}
          variant="ghost"
          style={styles.supportBtn}
          accessibilityLabel={t("accessibility.contact_support")} />
        
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg },

  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: `${colors.errorRed}40`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.errorRed, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: `${colors.errorRed}30`,
    alignItems: 'center', justifyContent: 'center'
  },

  stepBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  stepBadgeText: { ...textStyles.labelSm, color: colors.gold },

  errorBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: `${colors.errorRed}18`, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.errorRed}30`, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  errorBadgeText: { ...textStyles.labelMd, color: colors.errorRed },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  reviewCard: { borderColor: `${colors.errorRed}20` },
  approvedCard: { borderColor: `${colors.safetyGreen}25` },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  summaryList: { gap: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  summaryLabel: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  summaryStatusBadge: { borderRadius: radius.xs, paddingHorizontal: 6, paddingVertical: 3, borderWidth: 1 },
  summaryStatusText: { ...textStyles.labelSm },

  requiredSubtitle: { ...textStyles.bodySm, color: colors.textSecondary, marginBottom: spacing.xs },
  updateList: { gap: spacing.md },
  updateRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  updateIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: `${colors.errorRed}10`,
    borderWidth: 1, borderColor: `${colors.errorRed}25`, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  updateContent: { flex: 1 },
  updateLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  updateLabel: { ...textStyles.labelMd, color: colors.textPrimary },
  requiredTag: {
    backgroundColor: `${colors.errorRed}18`, borderRadius: radius.xs,
    paddingHorizontal: 6, paddingVertical: 2
  },
  requiredTagText: { ...textStyles.labelSm, color: colors.errorRed },
  updateDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

  currentStatusNote: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },
  currentStatusList: { gap: spacing.sm },
  currentStatusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  currentStatusLabel: { ...textStyles.labelMd, color: colors.safetyGreen },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  warningNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
  bottomPad: { height: spacing.xl },

  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  supportBtn: { marginTop: spacing.xs }
});