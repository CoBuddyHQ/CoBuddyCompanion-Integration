import { useTranslation } from 'react-i18next';
/**
 * CPN-049 � Submit Profile for Approval Screen
 * Phase 4C � Final submission screen before profile goes to CoBuddy review.
 * Requires confirmation checkbox before CTA is active.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../store/slices/authStore';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToRequirementFixScreen } from '../../navigation/missingRequirementNavigation';
import { KycService } from '../../services/api/services/kyc.service';
import { getApplicationReadiness } from '../../store/selectors/applicationReadinessSelector';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.SUBMIT_PROFILE_FOR_APPROVAL>;

export function SubmitProfileForApprovalScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  // ── Actions (narrowed subscription � useShallow prevents re-render on unrelated store changes) ──
  const {
    setProfileSubmittedForApproval,
    setProfileReviewStatus,
    setCurrentStage,
    setProfileEditRejectionSections,
    clearProfileCorrection,
    setProfileChecklistMode,
    startMissingRequirementFix,
    clearMissingRequirementFix
  } = useApplicationStore(
    useShallow((s) => ({
      setProfileSubmittedForApproval: s.setProfileSubmittedForApproval,
      setProfileReviewStatus: s.setProfileReviewStatus,
      setCurrentStage: s.setCurrentStage,
      setProfileEditRejectionSections: s.setProfileEditRejectionSections,
      clearProfileCorrection: s.clearProfileCorrection,
      setProfileChecklistMode: s.setProfileChecklistMode,
      startMissingRequirementFix: s.startMissingRequirementFix,
      clearMissingRequirementFix: s.clearMissingRequirementFix
    }))
  );
  const { setAuthStatus } = useAuthStore();
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Clear stale fix context when returning via Back from a fix screen ──
  useFocusEffect(
    useCallback(() => {
      clearMissingRequirementFix();
    }, [clearMissingRequirementFix])
  );

  // ── Stable slice � only the 22 primitives that getApplicationReadiness reads ──
  // useShallow performs a shallow equality check so Zustand only re-renders
  // when one of these primitive values actually changes.
  // NEVER call getApplicationReadiness() inside a Zustand selector � it returns
  // a new object on every call, causing an infinite getSnapshot loop.
  const readinessInput = useApplicationStore(
    useShallow((state) => ({
      basicDetails: state.basicDetails,
      professionalBio: state.professionalBio,
      interestTags: state.interestTags,
      experienceCategories: state.experienceCategories,
      spokenLanguages: state.spokenLanguages,
      profilePhotoComplete: state.profilePhotoComplete,
      backgroundDeclaration: state.backgroundDeclaration,
      workPreference: state.workPreference,
      city: state.city,
      broadAreas: state.broadAreas,
      commActivityPrefs: state.commActivityPrefs,
      venuePreferences: state.venuePreferences,
      boundariesAccepted: state.boundariesAccepted,
      selectedIdType: state.selectedIdType,
      idSubmittedForReview: state.idSubmittedForReview,
      selfieCaptureComplete: state.selfieCaptureComplete,
      livenessComplete: state.livenessComplete,
      addressDetailsComplete: state.addressDetailsComplete,
      addressProofSubmitted: state.addressProofSubmitted,
      sessionRateINR: state.sessionRateINR,
      panConfirmed: state.panConfirmed,
      bankVerified: state.bankVerified,
      upiVerified: state.upiVerified
    }))
  );

  // ── Derived readiness � computed once per stable input change ──
  // useMemo ensures getApplicationReadiness is not called on every render,
  // only when readinessInput (shallow-equal) actually changes.
  const readiness = useMemo(
    () => getApplicationReadiness(readinessInput),
    [readinessInput]
  );

  const canSubmit = confirmed && readiness.ready;

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await KycService.submit({});
      setProfileSubmittedForApproval(true);
      setProfileReviewStatus('pending');
      setCurrentStage('submit_profile_for_approval');
      // Clear all stale correction state on successful resubmission (Safeguard 1).
      // profileEditRejectionSections, correctedSections, profileCorrectionContext,
      // and profileChecklistMode are cleared here  NOT before the user leaves CPN-046.
      setProfileEditRejectionSections([]);
      clearProfileCorrection();
      setProfileChecklistMode('profile_setup');
      // RootNavigator is authStatus-gated: 'pending_verification' mounts VerificationNavigator.
      setAuthStatus('pending_verification');
    } catch (e: any) {
      // Could show an alert here
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }, [
  setProfileSubmittedForApproval, setProfileReviewStatus, setCurrentStage,
  setProfileEditRejectionSections, clearProfileCorrection, setProfileChecklistMode,
  setAuthStatus]
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.stepBadge}>
          <Icon name="send" size={14} color={colors.gold} />
          <Text style={styles.stepBadgeText}>{t("content.application_kyc.SubmitProfileForApprovalContent.STEP_LABEL")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="send" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="admin-panel-settings" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Phase badge ── */}

        {/* ── Review required banner ── */}
        <View style={styles.reviewBanner}>
          <Icon name="task-alt" size={14} color={colors.warningAmber} />
          <Text style={styles.reviewBannerText}>{t("content.application_kyc.CommonKycContent.FINAL_REVIEW_REQUIRED")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.SubmitProfileForApprovalContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.SubmitProfileForApprovalContent.SUBHEADLINE")}</Text>

        {/* ── Live Application Summary (from shared selector) ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.SubmitProfileForApprovalContent.SUMMARY_TITLE").toUpperCase()}</Text>
          <View style={styles.summaryList}>
            {Object.values(readiness.modules).map((mod, index) =>
            <View key={`ui-opt-${index}-${t(mod.title)}`} style={styles.summaryRow}>
                <Icon
                name={mod.allDone ? 'check-circle' : 'radio-button-unchecked'}
                size={18}
                color={mod.allDone ? colors.safetyGreen : colors.warningAmber} />
              
                <Text style={styles.summaryLabel}>{t(mod.title)}</Text>
                <View style={[styles.readyBadge, !mod.allDone && styles.incompleteBadge]}>
                  <Text style={[styles.readyBadgeText, !mod.allDone && styles.incompleteBadgeText]}>
                    {mod.allDone ? `${mod.completedCount}/${mod.totalCount}` : `${mod.completedCount}/${mod.totalCount}`}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t("content.application_kyc.CommonKycContent.OVERALL_READINESS")}</Text>
              <Text style={[styles.totalPct, !readiness.ready && styles.totalPctIncomplete]}>
                {readiness.percentage}{t("content.application.SubmitProfileForApprovalScreen.text")}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Confirmation Checklist card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.SubmitProfileForApprovalContent.CHECKLIST_TITLE").toUpperCase()}</Text>
          <View style={styles.checkList}>
            {((Array.isArray(t("content.application_kyc.SubmitProfileForApprovalContent.CHECKLIST_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.SubmitProfileForApprovalContent.CHECKLIST_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${item}`} style={styles.checkRow}>
                <Icon name="check" size={16} color={colors.safetyGreen} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Review notice card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="info" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.noteContent}>
              <Text style={styles.noteTitleText}>{t("application.review_process_notice")}</Text>
              <Text style={styles.noteText}>{t("content.application_kyc.SubmitProfileForApprovalContent.REVIEW_NOTICE")}</Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Incomplete sections warning (real store state) ── */}
        {!readiness.ready &&
        <GlassCard style={styles.missingCard}>
            <View style={styles.missingHeader}>
              <Icon name="warning" size={16} color={colors.warningAmber} />
              <Text style={styles.missingTitle}>
                {readiness.missing.length}{t("application.incomplete_section")}{readiness.missing.length > 1 ? 's' : ''}{t("application.tap_to_fix")}
            </Text>
            </View>
            {readiness.missing.map((item, index) =>
          <TouchableOpacity accessibilityRole="button"
            key={`ui-opt-${index}-${item.key}`}
            style={styles.missingRow}
            onPress={() => {
              startMissingRequirementFix({
                source: 'submit_application',
                requirementKey: item.key,
                returnRoute: Routes.SUBMIT_PROFILE_FOR_APPROVAL
              });
              navigateToRequirementFixScreen(navigation, item.route);
            }}
            accessibilityLabel={t("accessibility.fix_item", { item: t(item.label) })}>
                <Icon name="cancel" size={14} color={colors.softWarning} />
                <Text style={styles.missingText}>{t(item.label)}</Text>
                <Icon name="chevron-right" size={14} color={colors.textMuted} />
              </TouchableOpacity>
          )}
          </GlassCard>
        }

        {/* ── Confirmation checkbox ── */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.confirmRow}
          onPress={() => setConfirmed(!confirmed)}
          accessibilityLabel={t("accessibility.confirm_profile_accuracy")}
          accessibilityState={{ checked: confirmed }}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed && <Icon name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.confirmLabel}>{t("content.application_kyc.SubmitProfileForApprovalContent.CONFIRM_LABEL")}</Text>
        </TouchableOpacity>

        {/* ── Support note ── */}
        <View style={styles.supportRow}>
          <Icon name="support-agent" size={14} color={colors.textMuted} />
          <Text style={styles.supportText}>{t("content.application_kyc.SubmitProfileForApprovalContent.SUPPORT_NOTE")}</Text>
        </View>

        {/* ── Post-submit note ── */}
        <Text style={styles.postNote}>{t("content.application_kyc.SubmitProfileForApprovalContent.POST_SUBMIT_NOTE")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={isSubmitting ? t("alerts.processing") : t("content.application_kyc.SubmitProfileForApprovalContent.CTA_PRIMARY")}
          onPress={handleSubmit}
          variant="primary"
          disabled={!canSubmit || isSubmitting}
          rightIcon={!isSubmitting ? "arrow-forward" : undefined}
          accessibilityLabel={t("accessibility.submit_profile_for_review")} />
        
        <ActionButton
          label={t("content.application_kyc.SubmitProfileForApprovalContent.CTA_BACK_PREVIEW")}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.backBtn}
          accessibilityLabel={t("accessibility.back_to_preview")} />
        
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
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  stepBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  stepBadgeText: { ...textStyles.labelSm, color: colors.gold },

  reviewBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  reviewBannerText: { ...textStyles.labelSm, color: colors.warningAmber },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  summaryList: { gap: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryLabel: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  readyBadge: {
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.sm,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`,
    paddingHorizontal: spacing.sm, paddingVertical: 3
  },
  readyBadgeText: { ...textStyles.labelSm, color: colors.safetyGreen },
  incompleteBadge: {
    backgroundColor: `${colors.warningAmber}18`,
    borderColor: `${colors.warningAmber}30`
  },
  incompleteBadgeText: { color: colors.warningAmber },
  totalRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.sm, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.border
  },
  totalLabel: { ...textStyles.labelMd, color: colors.textMuted },
  totalPct: { ...textStyles.labelLg, color: colors.safetyGreen, fontFamily: 'PlayfairDisplay-SemiBold' },
  totalPctIncomplete: { color: colors.warningAmber },

  checkList: { gap: spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  checkText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteContent: { flex: 1 },
  noteTitleText: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 4 },
  noteText: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  confirmRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2, backgroundColor: colors.cardSurface
  },
  checkboxChecked: { borderColor: colors.gold, backgroundColor: colors.gold },
  confirmLabel: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 20 },

  supportRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center' },
  supportText: { ...textStyles.labelSm, color: colors.textMuted },
  postNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  backBtn: { marginTop: spacing.xs },
  missingCard: { borderWidth: 1, borderColor: colors.warningAmber },
  missingHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  missingTitle: { ...textStyles.labelMd, color: colors.warningAmber },
  missingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 3 },
  missingText: { ...textStyles.bodySm, color: colors.softWarning, flex: 1 }
});