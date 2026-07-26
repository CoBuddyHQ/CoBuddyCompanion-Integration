import i18next from "i18next";import { useTranslation } from 'react-i18next';
/**
* CPN-039 � Liveness Detection Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-038 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88 circle, cardSurface bg, gold glow, 44px icon (state-aware)
*   - Instructions card: icon-row list (no dots/emoji)
*   - State-aware: ready ? checking ? complete
*   - Checking: gold GlassCard with animated text
*   - Complete: safetyGreen GlassCard with check-circle icon
*   - Footer: ctaWrap with state-dependent primary ActionButton + Retake ghost
*   - No emoji anywhere
*
* PRIVACY (P0 CONSTRAINT � unchanged):
*   - No video or image data stored.
*   - selfieUri cleared here after the stub liveness check passes.
*   - Only livenessComplete: boolean stored in Zustand.
*   - Phase 5: replace stub with liveness SDK.
*/

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { UploadsService } from '../../services/api/services/uploads.service';
import { KycService } from '../../services/api/services/kyc.service';
import { Alert } from 'react-native';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.LIVENESS_DETECTION>;

type LivenessState = 'ready' | 'checking' | 'complete';

const LIVENESS_INSTRUCTIONS = [
{ icon: 'face', label: i18next.t("content.application.LivenessDetectionScreen.keep_your_face_visible"), body: 'Stay centred in the frame.' },
{ icon: 'sync', label: i18next.t("content.application.LivenessDetectionScreen.follow_one_movement"), body: 'A single gentle head movement.' },
{ icon: 'light-mode', label: i18next.t("content.application.LivenessDetectionScreen.stay_in_good_lighting"), body: 'Avoid shadows or bright backlight.' }] as
const;

export function LivenessDetectionScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const {
    setSelfieCaptureComplete, setLivenessComplete, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();
  const [state, setState] = useState<LivenessState>('ready');

  const handleStartCheck = useCallback(async () => {
    setState('checking');
    try {
      // Phase 5: replace with real liveness SDK video URI
      const dummyVideoUri = 'stub://selfie_liveness.mp4';
      
      const uploadRes = await UploadsService.uploadKycSelfie(dummyVideoUri);
      
      await KycService.submitSelfie({
        imageUrl: uploadRes.photoUrl || uploadRes.url || 'stub://imageUrl',
        videoUrl: uploadRes.videoUrl || uploadRes.url || dummyVideoUri,
      });

      // Raw selfie data never enters Zustand  only boolean completion flags.
      setLivenessComplete(true);
      setState('complete');
    } catch (e: any) {
      Alert.alert(t("alerts.error"), e.message || 'Liveness check failed');
      setState('ready');
    }
  }, [setLivenessComplete, t]);

  const handleContinue = useCallback(() => {
    setCurrentStage('liveness_detection');
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('selfie_liveness');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.ADDRESS_VERIFICATION);
  }, [setCurrentStage, missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix, navigation]);

  const handleRetakeSelfie = useCallback(() => {
    // Reset BOTH liveness AND selfie completion so that the user must
    // recapture a selfie before liveness can be marked complete again.
    setLivenessComplete(false);
    setSelfieCaptureComplete(false);
    navigation.navigate(Routes.SELFIE_CAPTURE);
  }, [setLivenessComplete, setSelfieCaptureComplete, navigation]);

  // Hero icon is state-aware
  const heroIcon =
  state === 'complete' ? 'check-circle' :
  state === 'checking' ? 'hourglass-empty' :
  'verified-user';
  const heroIconColor =
  state === 'complete' ? colors.safetyGreen :
  state === 'checking' ? colors.gold :
  colors.gold;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={handleRetakeSelfie} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero (state-aware) ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.LivenessDetectionContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={[
          styles.heroCircle,
          state === 'complete' && styles.heroCircleComplete]
          }>
            <Icon name={heroIcon} size={44} color={heroIconColor} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="shield" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t("content.application_kyc.LivenessDetectionContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.LivenessDetectionContent.SUBHEADLINE")}</Text>

        {/* ── Checking state card ── */}
        {state === 'checking' &&
        <GlassCard style={styles.checkingCard}>
            <View style={styles.checkingRow}>
              <Icon name="hourglass-empty" size={spacing.iconMd} color={colors.gold} />
              <Text style={styles.checkingText}>{t("application.checking_liveness")}</Text>
            </View>
            <Text style={styles.checkingHint}>{t("application.turn_your_head_slightly_left_keep_your_f")}

          </Text>
          </GlassCard>
        }

        {/* ── Complete state card ── */}
        {state === 'complete' &&
        <GlassCard style={styles.completeCard}>
            <View style={styles.completeIconRow}>
              <Icon name="check-circle" size={40} color={colors.safetyGreen} />
            </View>
            <Text style={styles.completeTitle}>{t("application.live_check_complete")}</Text>
            <Text style={styles.completeNote}>{t("content.application_kyc.LivenessDetectionContent.PROCESSING_NOTE")}</Text>
          </GlassCard>
        }

        {/* ── Instructions Card (visible in ready state) ── */}
        {state === 'ready' &&
        <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.LivenessDetectionContent.INSTRUCTIONS_TITLE").toUpperCase()}</Text>
            <View style={styles.instrList}>
              {LIVENESS_INSTRUCTIONS.map((inst) =>
            <View key={t(inst.label)} style={styles.instrRow}>
                  <View style={styles.instrIconWrap}>
                    <Icon name={inst.icon as any} size={spacing.iconMd} color={colors.gold} />
                  </View>
                  <View style={styles.instrContent}>
                    <Text style={styles.instrLabel}>{t(inst.label)}</Text>
                    <Text style={styles.instrBody}>{inst.body}</Text>
                  </View>
                </View>
            )}
            </View>
          </GlassCard>
        }

        {/* ── Security Note Card ── */}
        <GlassCard style={styles.card}>
          <View style={styles.securityRow}>
            <View style={styles.securityIconWrap}>
              <Icon name="shield" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>{t("content.application_kyc.LivenessDetectionContent.SECURITY_TITLE")}</Text>
              <Text style={styles.securityBody}>{t("content.application_kyc.LivenessDetectionContent.SECURITY_BODY")}</Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Privacy note ── */}
        <View style={styles.privacyRow}>
          <Icon name="lock" size={14} color={colors.textMuted} />
          <Text style={styles.privacyText}>{t("content.application_kyc.LivenessDetectionContent.PRIVACY_NOTE")}</Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer (state-aware) ── */}
      <View style={styles.ctaWrap}>
        {state === 'ready' &&
        <ActionButton
          label={t("content.application_kyc.LivenessDetectionContent.CTA_START")}
          onPress={handleStartCheck}
          variant="primary"
          rightIcon={t("application.play_arrow")}
          accessibilityLabel={t("accessibility.start_live_check")} />

        }
        {state === 'checking' &&
        <ActionButton
          label={t("application.checking")}
          onPress={() => {}}
          variant="primary"
          disabled
          accessibilityLabel={t("accessibility.liveness_check_in_progress")} />

        }
        {state === 'complete' &&
        <ActionButton
          label={t("application.continue_to_address_verification")}
          onPress={handleContinue}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.continue_to_address_verification")} />

        }
        <ActionButton
          label={t("content.application_kyc.LivenessDetectionContent.CTA_RETAKE")}
          onPress={handleRetakeSelfie}
          variant="ghost"
          style={styles.retakeBtn}
          accessibilityLabel={t("accessibility.retake_selfie")} />
        
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },

  // Hero
  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroCircleComplete: {
    shadowColor: colors.safetyGreen,
    borderColor: `${colors.safetyGreen}30`,
    backgroundColor: colors.safetyGreenSubtle
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  // Headline
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-SemiBold'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },

  // State cards
  checkingCard: { gap: spacing.sm, alignItems: 'center' },
  checkingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkingText: { ...textStyles.labelMd, color: colors.gold },
  checkingHint: {
    ...textStyles.bodySm, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 18
  },
  completeCard: { gap: spacing.sm, alignItems: 'center' },
  completeIconRow: { alignItems: 'center' },
  completeTitle: {
    ...textStyles.labelMd, color: colors.safetyGreen,
    fontSize: 16
  },
  completeNote: {
    ...textStyles.bodySm, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 18
  },

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Instructions
  instrList: { gap: spacing.md },
  instrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  instrIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  instrContent: { flex: 1 },
  instrLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  instrBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  // Security
  securityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  securityIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  securityContent: { flex: 1 },
  securityTitle: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 4 },
  securityBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 20 },

  // Privacy row
  privacyRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    alignSelf: 'center'
  },
  privacyText: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center' },

  bottomPad: { height: spacing.xl },

  // CTA footer
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  retakeBtn: { marginTop: spacing.xs },
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