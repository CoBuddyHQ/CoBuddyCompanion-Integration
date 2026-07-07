import { useTranslation } from 'react-i18next';
/**
 * CPN-048 � Application Review Info Screen
 * Phase 4C � Shows real readiness state before the user proceeds to CPN-049.
 * Uses the shared applicationReadinessSelector so the summary is NEVER static.
 * Incomplete mandatory items are tappable: tap ? startMissingRequirementFix ? fix screen ? back here.
 */
import React, { useMemo, useCallback } from 'react';
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
import { getApplicationReadiness } from '../../store/selectors/applicationReadinessSelector';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToRequirementFixScreen } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.APPLICATION_REVIEW_INFO>;

export function ApplicationReviewInfoScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  // ── Actions (narrowed subscription) ──
  const { setCurrentStage, startMissingRequirementFix, clearMissingRequirementFix } = useApplicationStore(
    useShallow((s) => ({
      setCurrentStage: s.setCurrentStage,
      startMissingRequirementFix: s.startMissingRequirementFix,
      clearMissingRequirementFix: s.clearMissingRequirementFix
    }))
  );

  // ── Clear stale fix context when returning via Back from a fix screen ──
  useFocusEffect(
    useCallback(() => {
      clearMissingRequirementFix();
    }, [clearMissingRequirementFix])
  );

  // ── Stable slice of readiness primitives (shallow equality) ──
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

  // ── Memoised readiness ──
  const readiness = useMemo(
    () => getApplicationReadiness(readinessInput),
    [readinessInput]
  );
  const { percentage, missing, modules } = readiness;
  const isReady = missing.length === 0;

  // Derived arrays � memoised so they don't cause fresh allocations on every render
  const { mandatoryItems, completedMandatory, incompleteMandatory } = useMemo(() => {
    const allItems = [
    ...modules.profile.items,
    ...modules.safetyService.items,
    ...modules.identity.items,
    ...modules.financial.items];

    const mandatory = allItems.filter((item) => !item.optional);
    return {
      mandatoryItems: mandatory,
      completedMandatory: mandatory.filter((item) => item.done),
      incompleteMandatory: mandatory.filter((item) => !item.done)
    };
  }, [modules]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.stepBadge}>
          <Icon name="rate-review" size={14} color={colors.gold} />
          <Text style={styles.stepBadgeText}>{t("content.application_kyc.ApplicationReviewInfoContent.STEP_LABEL")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="rate-review" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name={isReady ? 'verified-user' : 'warning'} size={16} color={isReady ? colors.gold : colors.warningAmber} />
          </View>
        </View>

        {/* ── Phase badge ── */}

        <Text style={styles.headline}>{t("content.application_kyc.ApplicationReviewInfoContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ApplicationReviewInfoContent.SUBHEADLINE")}</Text>

        {/* ── Live readiness summary ── */}
        <GlassCard style={styles.card}>
          <View style={styles.readinessHeader}>
            <Text style={styles.cardTitle}>{t("application.application_readiness")}</Text>
            <Text style={[styles.pctBadge, isReady ? styles.pctBadgeReady : styles.pctBadgeWarn]}>
              {percentage}{t("content.application.ApplicationReviewInfoScreen.text")}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[
            styles.progressBarFill,
            { width: `${percentage}%` as any },
            !isReady && styles.progressBarFillWarn]
            } />
          </View>
          <Text style={styles.progressDetail}>
            {completedMandatory.length}{t("application.of")}{mandatoryItems.length}{t("application.required_items_complete")}
          </Text>
        </GlassCard>

        {/* ── Incomplete mandatory items ── */}
        {incompleteMandatory.length > 0 &&
        <GlassCard style={styles.card}>
            <View style={styles.warnHeader}>
              <Icon name="warning" size={16} color={colors.warningAmber} />
              <Text style={styles.warnTitle}>{t("application.incomplete_required_items")}</Text>
            </View>
            <Text style={styles.warnNote}>{t("application.tap_any_item_below_to_complete_it_you_mu")}

          </Text>
            <View style={styles.itemList}>
              {incompleteMandatory.map((item, index) =>
            <TouchableOpacity
              key={`ui-opt-${index}-${item.key}`}
              style={styles.incompleteRow}
              onPress={() => {
                startMissingRequirementFix({
                  source: 'application_review',
                  requirementKey: item.key,
                  returnRoute: Routes.APPLICATION_REVIEW_INFO
                });
                navigateToRequirementFixScreen(navigation, item.route);
              }}
              accessibilityRole="button"
              accessibilityLabel={t("accessibility.complete_missing", { item: t(item.label) })}>
                  <View style={styles.incompleteIconWrap}>
                    <Icon name="radio-button-unchecked" size={18} color={colors.warningAmber} />
                  </View>
                  <View style={styles.incompleteContent}>
                    <Text style={styles.incompleteLabel}>{t(item.label)}</Text>
                    <Text style={styles.incompleteSub}>{t("content.application_kyc.CommonKycContent.TAP_TO_COMPLETE")}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.textMuted} />
                </TouchableOpacity>
            )}
            </View>
          </GlassCard>
        }

        {/* ── Ready confirmation (only when all mandatory items complete) ── */}
        {isReady &&
        <View style={styles.readyRow}>
            <Icon name="task-alt" size={18} color={colors.safetyGreen} />
            <Text style={styles.readyText}>{t("application.all_required_items_complete_ready_to_sub")}</Text>
          </View>
        }

        {/* ── What CoBuddy reviews card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ApplicationReviewInfoContent.REVIEW_TITLE").toUpperCase()}</Text>
          <View style={styles.itemList}>
            {((Array.isArray(t("content.application_kyc.ApplicationReviewInfoContent.REVIEW_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.ApplicationReviewInfoContent.REVIEW_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.itemRow}>
                <View style={styles.itemIconWrap}>
                  <Icon name={item.icon as any} size={22} color={colors.gold} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel}>{t(item.label)}</Text>
                  <Text style={styles.itemDesc}>{t(item.description)}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Privacy note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ApplicationReviewInfoContent.PRIVACY_NOTE")}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={isReady ? t("content.application_kyc.ApplicationReviewInfoContent.CTA_BEGIN") : t("content.application.ApplicationReviewInfoScreen.complete_required_items_first")}
          disabled={!isReady}
          onPress={() => {
            setCurrentStage('application_review_info');
            navigation.navigate(Routes.SUBMIT_PROFILE_FOR_APPROVAL);
          }}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.proceed_to_submit_application")} />
        
        <ActionButton
          label={t("content.application_kyc.ApplicationReviewInfoContent.CTA_REVIEW")}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.reviewBtn}
          accessibilityLabel={t("accessibility.review_application_details")} />
        
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

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  readinessHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pctBadge: { ...textStyles.labelLg, fontFamily: 'Inter-Bold' },
  pctBadgeReady: { color: colors.safetyGreen },
  pctBadgeWarn: { color: colors.warningAmber },
  progressBarBg: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: colors.safetyGreen, borderRadius: radius.full },
  progressBarFillWarn: { backgroundColor: colors.warningAmber },
  progressDetail: { ...textStyles.bodySm, color: colors.textSecondary },

  warnHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  warnTitle: { ...textStyles.labelMd, color: colors.warningAmber, textTransform: 'uppercase', letterSpacing: 1 },
  warnNote: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  itemList: { gap: spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  itemIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  itemContent: { flex: 1 },
  itemLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  itemDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

  incompleteRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.sm,
    backgroundColor: `${colors.warningAmber}10`,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: `${colors.warningAmber}25`
  },
  incompleteIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.cardSurface,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  incompleteContent: { flex: 1 },
  incompleteLabel: { ...textStyles.labelMd, color: colors.textPrimary },
  incompleteSub: { ...textStyles.bodySm, color: colors.warningAmber },

  readyRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'center',
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`,
    paddingHorizontal: spacing.md, paddingVertical: 8
  },
  readyText: { ...textStyles.labelMd, color: colors.safetyGreen },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  reviewBtn: { marginTop: spacing.xs }
});