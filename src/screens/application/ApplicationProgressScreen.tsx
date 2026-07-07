import { useTranslation } from 'react-i18next';
/**
 * CPN-047 � Application Progress Screen
 * Phase 4C � Shows overall application progress with completed steps.
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

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.APPLICATION_PROGRESS>;

export function ApplicationProgressScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  // -- Actions (stable refs, narrowed subscription � useShallow prevents re-render on unrelated store changes) --
  const { setCurrentStage, setApplicationResumeTarget, setDraftSaved, startMissingRequirementFix, clearMissingRequirementFix } =
  useApplicationStore(
    useShallow((s) => ({
      setCurrentStage: s.setCurrentStage,
      setApplicationResumeTarget: s.setApplicationResumeTarget,
      setDraftSaved: s.setDraftSaved,
      startMissingRequirementFix: s.startMissingRequirementFix,
      clearMissingRequirementFix: s.clearMissingRequirementFix
    }))
  );

  // -- Clear stale fix context when returning via Back from a fix screen --
  // If the user pressed Back instead of completing the fix, isActive stays true.
  // Clearing on focus prevents the next "Continue" on any screen from routing back here.
  useFocusEffect(
    useCallback(() => {
      clearMissingRequirementFix();
    }, [clearMissingRequirementFix])
  );

  // -- Stable slice of readiness primitives (shallow equality) --
  // NEVER call getApplicationReadiness() inside a Zustand selector � it returns a
  // new object on every call, causing an infinite useSyncExternalStore getSnapshot loop.
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

  // -- Memoised readiness � recomputed only when a tracked primitive changes --
  const readiness = useMemo(
    () => getApplicationReadiness(readinessInput),
    [readinessInput]
  );

  const { completedMandatory, totalMandatory, percentage, modules } = readiness;
  const displayPct = percentage;
  const completedModules = Object.values(modules).filter((m) => m.allDone).length;
  const totalModules = Object.values(modules).length;

  // Flatten modules array for rendering
  const moduleList = [
  modules.profile,
  modules.safetyService,
  modules.identity,
  modules.financial];


  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* -- Hero -- */}
        <View style={styles.stepBadge}>
          <Icon name="adjust" size={14} color={colors.gold} />
          <Text style={styles.stepBadgeText}>{t("content.application_kyc.ApplicationProgressContent.STEP_LABEL")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="task-alt" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="trending-up" size={16} color={colors.gold} />
          </View>
        </View>

        {/* -- Step badge -- */}

        <Text style={styles.headline}>{t("content.application_kyc.ApplicationProgressContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ApplicationProgressContent.SUBHEADLINE")}</Text>

        {/* -- Overall progress card -- */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ApplicationProgressContent.PROGRESS_TITLE").toUpperCase()}</Text>
          <View style={styles.progressHeader}>
            <Text style={styles.progressPct}>{displayPct}{t("content.application.ApplicationProgressScreen.text")}</Text>
            <Text style={styles.progressSub}>
              {completedModules}{t("application.of")}{totalModules}{t("application.modules_complete")}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${displayPct}%` as any }]} />
          </View>
          <Text style={styles.progressDetail}>
            {completedMandatory}{t("application.of")}{totalMandatory}{t("application.required_items_complete")}
          </Text>
        </GlassCard>

        {/* -- Next step note -- */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="info" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ApplicationProgressContent.NEXT_STEP_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* -- Module cards -- */}
        {moduleList.map((mod, index) => {
          const modComplete = mod.allDone;
          return (
            <GlassCard key={`ui-opt-${index}-${t(mod.title)}`} style={styles.card}>
              <View style={styles.modHeader}>
                <Icon name={mod.icon as any} size={18} color={modComplete ? colors.safetyGreen : colors.gold} />
                <Text style={styles.cardTitle}>{t(mod.title)}</Text>
                <Text style={[styles.modCount, modComplete && styles.modCountDone]}>
                  {mod.completedCount}/{mod.totalCount}
                </Text>
              </View>
              <View style={styles.stepList}>
                {mod.items.map((item, index) => {
                  if (item.done) {
                    // Completed � non-tappable
                    return (
                      <View key={`ui-opt-${index}-${item.key}`} style={styles.stepRow}>
                        <Icon name="check-circle" size={16} color={colors.safetyGreen} />
                        <Text style={[styles.stepLabel, styles.stepLabelDone]}>
                          {t(item.label)}{item.optional ? t("content.application.ApplicationProgressScreen.optional") : ''}
                        </Text>
                      </View>);

                  }
                  // Incomplete � tappable: start fix context and navigate to fix screen
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.stepRowTappable}
                      onPress={() => {
                        startMissingRequirementFix({
                          source: 'application_progress',
                          requirementKey: item.key,
                          returnRoute: Routes.APPLICATION_PROGRESS
                        });
                        navigateToRequirementFixScreen(navigation, item.route);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={t("accessibility.fix_missing", { item: t(item.label) })}>
                      <Icon name="radio-button-unchecked" size={16} color={colors.warningAmber} />
                      <Text style={[styles.stepLabel, styles.stepLabelMissing]}>
                        {t(item.label)}{item.optional ? t("content.application.ApplicationProgressScreen.optional") : ''}
                      </Text>
                      <Icon name="chevron-right" size={16} color={colors.textMuted} />
                    </TouchableOpacity>);

                })}
              </View>
            </GlassCard>);

        })}

        {/* -- Completed steps card -- */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ApplicationProgressContent.COMPLETED_TITLE").toUpperCase()}</Text>
          <View style={styles.stepList}>
            {((Array.isArray(t("content.application_kyc.ApplicationProgressContent.COMPLETED_STEPS", { returnObjects: true })) ? (t("content.application_kyc.ApplicationProgressContent.COMPLETED_STEPS", { returnObjects: true }) as any[]) : [])).map((step, index) =>
            <View key={`ui-opt-${index}-${t(step.label)}`} style={styles.stepRow}>
                <View style={styles.stepIconWrap}>
                  <Icon name={step.icon as any} size={22} color={colors.safetyGreen} />
                </View>
                <Text style={styles.stepLabel}>{t(step.label)}</Text>
                <Icon name="check-circle" size={18} color={colors.safetyGreen} />
              </View>
            )}
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* -- CTA Footer -- */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ApplicationProgressContent.CTA_CONTINUE")}
          onPress={() => {
            setCurrentStage('application_progress');
            navigation.navigate(Routes.APPLICATION_REVIEW_INFO);
          }}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.continue_to_review_info")} />
        
        <ActionButton
          label={t("content.application_kyc.ApplicationProgressContent.CTA_SAVE_EXIT")}
          onPress={() => {
            setApplicationResumeTarget({ route: Routes.APPLICATION_PROGRESS });
            setDraftSaved(new Date().toISOString());
            navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
          }}
          variant="ghost"
          style={styles.exitBtn}
          accessibilityLabel={t("accessibility.save_and_exit")} />
        
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

  progressHeader: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
  progressPct: { fontSize: 28, fontFamily: 'Inter-Bold', color: colors.gold },
  progressSub: { ...textStyles.bodySm, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  progressBarBg: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: colors.gold, borderRadius: radius.full },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  stepList: { gap: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepRowTappable: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
    borderRadius: radius.md,
    backgroundColor: `${colors.warningAmber}08`
  },
  stepIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  stepLabel: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  stepLabelDone: { color: colors.safetyGreen },
  stepLabelMissing: { color: colors.warningAmber },
  progressDetail: { ...textStyles.bodySm, color: colors.textSecondary, marginTop: spacing.xs },
  modHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  modCount: { ...textStyles.labelSm, color: colors.textMuted, marginLeft: 'auto' },
  modCountDone: { color: colors.safetyGreen },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  exitBtn: { marginTop: spacing.xs }
});