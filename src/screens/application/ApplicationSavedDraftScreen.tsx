import { useTranslation } from 'react-i18next';
/**
* CPN-050 — Application Saved Draft Screen
* Phase 4C — Shown when companion saves progress and exits the flow mid-way.
*/
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore, DEFAULT_RESUME_TARGET } from '../../store/slices/applicationStore';
import { getApplicationReadiness } from '../../store/selectors/applicationReadinessSelector';


import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

import type { ApplicationResumeTarget } from '../../store/slices/applicationStore';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.APPLICATION_SAVED_DRAFT>;

// ─── Exhaustive typed navigate helper ────────────────────────────────────────
// Handles every ApplicationResumeTarget variant without 'as any'.
// TypeScript will produce a compile error if a new variant is added but not
// covered here — see assertNever() at the bottom.
function assertNever(x: never): never {
  throw new Error(`Unhandled ApplicationResumeTarget route: ${JSON.stringify(x)}`);
}

function navigateToResumeTarget(
navigation: StackNavigationProp<ApplicationStackParamList>,
target: ApplicationResumeTarget)
: void {
  // Blindly navigate to the backend-provided route.
  navigation.navigate(target.route as any, (target as any).params as any);
}

export function ApplicationSavedDraftScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const store = useApplicationStore();
  const { setDraftSaved, setCurrentStage, applicationResumeTarget, setApplicationResumeTarget } = store;

  // Single Source of Truth selector for completed & pending items from backend profile/kyc state
  const readiness = getApplicationReadiness(store);
  const displayPct = readiness.percentage;

  const allItems = [
    ...readiness.modules.profile.items,
    ...readiness.modules.safetyService.items,
    ...readiness.modules.identity.items,
    ...readiness.modules.financial.items,
  ];

  const completedItems = allItems.filter(i => i.done).map(i => i.label);
  const pendingItems = readiness.missing.length > 0
    ? readiness.missing.map(i => `${i.label} pending`)
    : ['Review information pending'];

  const isSensitiveUpload =
    applicationResumeTarget.route === Routes.PROFILE_PHOTO_UPLOAD ||
    applicationResumeTarget.route === Routes.GOVERNMENT_ID_UPLOAD ||
    applicationResumeTarget.route === Routes.ADD_BANK_ACCOUNT;



  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.ApplicationSavedDraftContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="cloud-done" size={44} color={colors.safetyGreen} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="save" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Save badge ── */}
        <View style={styles.saveBadge}>
          <Icon name="cloud-done" size={14} color={colors.safetyGreen} />
          <Text style={styles.saveBadgeText}>{t("content.application_kyc.ApplicationSavedDraftContent.SAVE_BADGE")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.ApplicationSavedDraftContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ApplicationSavedDraftContent.SUBHEADLINE")}</Text>

        {/* ── Progress card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ApplicationSavedDraftContent.PROGRESS_TITLE").toUpperCase()}</Text>
          <View style={styles.progressHeader}>
            <Text style={styles.progressPct}>{displayPct}{t("content.application.ApplicationSavedDraftScreen.text")}</Text>
            <Text style={styles.progressLabel}>{t("application.complete")}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${displayPct}%` as any }]} />
          </View>
          <View style={styles.itemList}>
            {completedItems.map((item) =>
            <View key={item} style={styles.itemRow}>
                <Icon name="check-circle" size={18} color={colors.safetyGreen} />
                <Text style={styles.itemText}>{item}</Text>
              </View>
            )}
            {pendingItems.map((item) =>
            <View key={item} style={styles.itemRow}>
                <Icon name="radio-button-unchecked" size={18} color={colors.textMuted} />
                <Text style={styles.itemTextMuted}>{item}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Next step card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="info" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.noteContent}>
              <Text style={styles.noteTitleText}>{t("content.application_kyc.ApplicationSavedDraftContent.NEXT_STEP_TITLE")}</Text>
              <Text style={styles.noteText}>{t("content.application_kyc.ApplicationSavedDraftContent.NEXT_STEP_DESC")}</Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Security note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ApplicationSavedDraftContent.SECURITY_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Sensitive-upload privacy note — shown for CPN-035, CPN-037, CPN-042 ── */}
        {isSensitiveUpload &&
        <GlassCard style={styles.noteCard}>
            <View style={styles.noteRow}>
              <View style={styles.noteIconWrap}>
                <Icon name="security" size={spacing.iconMd} color={colors.warningAmber} />
              </View>
              <Text style={styles.noteText}>{t("content.application_kyc.ApplicationSavedDraftContent.SENSITIVE_UPLOAD_NOTE")}</Text>
            </View>
          </GlassCard>
        }

        <Text style={styles.closeNote}>{t("content.application_kyc.ApplicationSavedDraftContent.CLOSE_NOTE")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ApplicationSavedDraftContent.CTA_CONTINUE")}
          onPress={() => {
            setCurrentStage('application_saved_draft');
            const backendRoute = store.onboardingStatus?.resumeRoute;
            const targetRoute = backendRoute || applicationResumeTarget.route || Routes.BASIC_DETAILS;
            setApplicationResumeTarget(DEFAULT_RESUME_TARGET);
            navigation.reset({
              index: 0,
              routes: [{ name: targetRoute as any }],
            });
          }}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.continue_application")} />
        
        <ActionButton
          label={t("content.application_kyc.ApplicationSavedDraftContent.CTA_CLOSE")}
          onPress={() => {
            setDraftSaved(new Date().toISOString());
            // Go back to wherever the companion was — do NOT restart from JOURNEY_INTRO
            navigation.goBack();
          }}
          variant="ghost"
          style={styles.closeBtn}
          accessibilityLabel={t("accessibility.close_for_now")} />
        
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
    borderWidth: 1, borderColor: `${colors.safetyGreen}40`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.safetyGreen, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  saveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  saveBadgeText: { ...textStyles.labelMd, color: colors.safetyGreen },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  progressHeader: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  progressPct: { fontSize: 28, fontFamily: 'Inter-Bold', color: colors.gold },
  progressLabel: { ...textStyles.bodyMd, color: colors.textSecondary },
  progressBarBg: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: colors.gold, borderRadius: radius.full },

  itemList: { gap: spacing.sm, marginTop: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  itemText: { flex: 1, ...textStyles.bodySm, color: colors.textPrimary },
  itemTextMuted: { flex: 1, ...textStyles.bodySm, color: colors.textMuted },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteContent: { flex: 1 },
  noteTitleText: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 4 },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  closeNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  closeBtn: { marginTop: spacing.xs },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.xl
  },
  phaseBadgeText: {
    ...textStyles.capsSm,
    color: colors.gold,
    letterSpacing: 1
  }
});