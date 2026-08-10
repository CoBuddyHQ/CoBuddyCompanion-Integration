import { useTranslation } from 'react-i18next';
/**
 * CPN-051 — Verification Hub Screen
 * Phase 4C — Entry point showing all 6 verification steps with status.
 * "Start Verification" navigates to the government ID upload flow (CPN-036).
 */
import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { useAuthStore } from '../../store/slices/authStore';
import { KycService } from '../../services/api/services/kyc.service';


import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { VerificationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToRequirementFixScreen } from '../../navigation/missingRequirementNavigation';
import type { MandatoryRequirementKey } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.VERIFICATION_HUB>;

export function VerificationHubScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setAuthStatus } = useAuthStore();
  const {
    setVerificationStarted, setCurrentStage, setDraftSaved,
    idSubmittedForReview, panConfirmed, selfieCaptureComplete, livenessComplete,
    addressDetailsComplete, backgroundDeclaration,
    startMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  // ── Fetch fresh KYC status from backend whenever screen gains focus ──
  useFocusEffect(
    useCallback(() => {
      clearMissingRequirementFix();
      // This will hit the interceptor in client.ts which automatically 
      // calls hydrateOnboardingStatus, updating all local flags!
      KycService.getKycStatus().catch(() => null);
    }, [clearMissingRequirementFix])
  );


  // Background Declaration: ALL sub-declarations must be accepted
  const backgroundDeclarationComplete = Object.values(backgroundDeclaration).every(Boolean);

  // Map each of the 5 mandatory verification items to {label, key, done, route}
  // Emergency Contact is post-activation — NOT mandatory pre-approval.
  // Selfie & Liveness: both selfieCaptureComplete AND livenessComplete must be true.
  // Address: addressDetailsComplete is required; addressProofSubmitted is optional.
  const VERIFICATION_ITEMS: Array<{label: string;key: MandatoryRequirementKey;done: boolean;route: string;}> = [
  { label: t("content.application.VerificationHubScreen.government_id"), key: 'id_submitted', done: idSubmittedForReview, route: Routes.GOVERNMENT_ID_TYPE },
  { label: t("content.application.VerificationHubScreen.pan_tax_details"), key: 'pan', done: panConfirmed, route: Routes.PAN_TAX_DETAILS },
  { label: t("content.application.VerificationHubScreen.selfie_liveness"), key: 'selfie_liveness', done: selfieCaptureComplete && livenessComplete, route: Routes.SELFIE_CAPTURE },
  { label: t("content.application.VerificationHubScreen.address_details"), key: 'address_details', done: addressDetailsComplete, route: Routes.ADDRESS_VERIFICATION },
  { label: t("content.application.VerificationHubScreen.background_declaration"), key: 'background_declaration', done: backgroundDeclarationComplete, route: Routes.BACKGROUND_DECLARATION }];

  const stepStatuses = VERIFICATION_ITEMS.map((item) => item.done);
  const completedCount = stepStatuses.filter(Boolean).length;
  const progressPct = Math.round(completedCount / 5 * 100);
  const missingItems = VERIFICATION_ITEMS.filter((item) => !item.done);
  const allComplete = completedCount === 5;

  const handleStart = () => {
    if (!allComplete) {return;} // guard: all 5 must be done
    setVerificationStarted(true);
    setCurrentStage('verification_hub');
    navigation.navigate(Routes.VERIFICATION_PENDING);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.VerificationHubContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="verified-user" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="shield" size={16} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.VerificationHubContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.VerificationHubContent.SUBHEADLINE")}</Text>

        {/* ── Progress card ── */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{t("content.application_kyc.CommonKycContent.VERIFICATION_PROGRESS")}</Text>
            <Text style={styles.progressCount}>{completedCount}{t("application.of_5")}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` as any }]} />
          </View>
          <Text style={styles.startHint}>{t("content.application_kyc.VerificationHubContent.START_HINT")}</Text>
        </GlassCard>

        {/* ── Steps card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.CommonKycContent.REQUIRED_STEPS")}</Text>
          <View style={styles.stepList}>
            {VERIFICATION_ITEMS.map((item) => {
              const { done, label, key, route } = item;
              const handleItemPress = done ? undefined : () => {
                startMissingRequirementFix({
                  source: 'verification_hub',
                  requirementKey: key,
                  returnRoute: Routes.VERIFICATION_HUB
                });
                navigateToRequirementFixScreen(navigation, route);
              };
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={label}
                  style={styles.stepRow}
                  onPress={handleItemPress}
                  disabled={done}
                  activeOpacity={done ? 1 : 0.7}
                  accessibilityLabel={done ? `${label} complete` : `Fix: ${label}`}>
                  <View style={[styles.stepIconWrap, done && styles.stepIconDone]}>
                    <Icon
                      name={done ? 'check-circle' : 'radio-button-unchecked'}
                      size={22}
                      color={done ? colors.safetyGreen : colors.gold} />
                    
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepLabel}>{label}</Text>
                    {!done &&
                    <Text style={styles.stepIncomplete}>{t("content.application_kyc.CommonKycContent.TAP_TO_COMPLETE")}</Text>
                    }
                  </View>
                  <Icon
                    name={done ? 'check-circle' : 'chevron-right'}
                    size={20}
                    color={done ? colors.safetyGreen : colors.textMuted} />
                  
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* ── Privacy note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.VerificationHubContent.PRIVACY_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Bottom note ── */}
        <Text style={styles.bottomNote}>{t("content.application_kyc.VerificationHubContent.BOTTOM_NOTE")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={allComplete ? t("content.application_kyc.VerificationHubContent.CTA_START") : `Complete ${missingItems.length} remaining step${missingItems.length > 1 ? 's' : ''}`}
          onPress={handleStart}
          variant={allComplete ? 'primary' : 'secondary'}
          rightIcon={t("application.arrow_forward")}
          disabled={!allComplete}
          accessibilityLabel={t("accessibility.start_verification")} />
        
        <ActionButton
          label={t("content.application_kyc.VerificationHubContent.CTA_SAVE_LATER")}
          onPress={() => {
            setDraftSaved(new Date().toISOString());
            navigation.navigate(Routes.APPLICATION_SAVED_DRAFT as any);
          }}
          variant="ghost"
          style={styles.saveBtn}
          accessibilityLabel={t("accessibility.save_and_continue_later")} />

        
        {/* ─── DEV BYPASS — remove before production release ─── */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.devBypass}
          onPress={() => setAuthStatus('active')}
          accessibilityLabel={t("accessibility.dev_bypass_force_approve")}>
          <Text style={styles.devBypassText}>{t("application.dev_bypass_skip_to_main_app")}</Text>
        </TouchableOpacity>
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

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  progressCard: { gap: spacing.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { ...textStyles.labelMd, color: colors.textPrimary },
  progressCount: { fontSize: 18, fontFamily: 'Inter-Bold', color: colors.gold },
  progressBarBg: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: colors.gold, borderRadius: radius.full },
  startHint: { ...textStyles.labelSm, color: colors.textSecondary, fontStyle: 'italic' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  stepList: { gap: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  stepIconDone: { borderColor: `${colors.safetyGreen}40`, backgroundColor: `${colors.safetyGreen}12` },
  stepContent: { flex: 1 },
  stepLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  stepDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },
  stepIncomplete: { ...textStyles.labelSm, color: colors.softWarning, marginTop: 2 },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
  bottomPad: { height: spacing.xl },

  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  saveBtn: { marginTop: spacing.xs },
  devBypass: {
    marginTop: spacing.xs,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.25)',
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  devBypassText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 0.5
  },
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
  } });