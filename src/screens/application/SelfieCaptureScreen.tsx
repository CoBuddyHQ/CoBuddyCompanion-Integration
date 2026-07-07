import i18next from "i18next";import { useTranslation } from 'react-i18next';
/**
* CPN-038 — Selfie Capture Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-037 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88Ã—88 circle, cardSurface bg, gold glow, 44px photo_camera icon
*   - Oval camera frame: 200Ã—260, gold dashed border, face icon guide
*   - Capture button: outer gold ring (72Ã—72), inner fill (56Ã—56)
*   - Guidelines card: icon-row list (no bullets/dots/emoji)
*   - Footer: ctaWrap with primary ActionButton + ghost ActionButton
*   - No emoji anywhere
*
* PRIVACY (P0 CONSTRAINT — unchanged):
*   - Selfie = biometric data — HIGHLY SENSITIVE.
*   - setSelfieCaptureComplete(true/false) is stored in Zustand (non-sensitive boolean).
*   - Raw selfie URI stays in local component state only — never in Zustand.
*   - No base64. No console.log.
*   - Phase 5: replace stub with launchCamera.
*/

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.SELFIE_CAPTURE>;

const SELFIE_GUIDELINES = [
{ icon: 'wb-sunny', label: i18next.t("content.application.SelfieCaptureScreen.use_clear_lighting"), body: 'Avoid shadows or backlight.' },
{ icon: 'face', label: i18next.t("content.application.SelfieCaptureScreen.face_the_camera"), body: 'Keep your full face visible.' },
{ icon: 'visibility', label: i18next.t("content.application.SelfieCaptureScreen.no_sunglasses_or_mask"), body: 'Your face must be clearly visible.' },
{ icon: 'crop-free', label: i18next.t("content.application.SelfieCaptureScreen.stay_within_frame"), body: 'Align your face inside the guide.' }] as
const;

export function SelfieCaptureScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const {
    setSelfieCaptureComplete, setCurrentStage,
    missingRequirementFixContext, clearMissingRequirementFix
  } = useApplicationStore();
  const [captured, setCaptured] = useState(false);

  const handleCapture = useCallback(() => {
    Alert.alert(t("alerts.capture_selfie"), t("alerts.position_your_face_in_the_oval_frame_and"),


    [
    {
      text: t("content.application_kyc.SelfieCaptureContent.CTA_CAPTURE"),
      onPress: () => {
        // Phase 5: launchCamera({ mediaType: 'photo', cameraType: 'front', quality: 0.9 }, ...)
        // Raw URI stays in local state — only the boolean completion flag goes to Zustand.
        setSelfieCaptureComplete(true);
        setCaptured(true);
      }
    },
    { text: t("alerts.cancel"), style: 'cancel' }]

    );
  }, [setSelfieCaptureComplete]);

  const handleRetake = useCallback(() => {
    // Reset both local UI state and the store completion boolean on retake.
    setSelfieCaptureComplete(false);
    setCaptured(false);
  }, [setSelfieCaptureComplete]);

  const handleContinue = useCallback(() => {
    if (!captured) {return;}
    setCurrentStage('selfie_capture');
    // Always navigate to LivenessDetection — liveness is a mandatory part of this step.
    // LivenessDetectionScreen calls completeMissingRequirementFix('selfie_liveness') and
    // returns to the hub after liveness passes, whether in fix-flow or normal flow.
    navigation.navigate(Routes.LIVENESS_DETECTION);
  }, [captured, setCurrentStage, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* â”€â”€ Hero â”€â”€ */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.SelfieCaptureContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon
              name={captured ? 'check-circle' : 'photo-camera'}
              size={44}
              color={captured ? colors.safetyGreen : colors.gold} />
            
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* â”€â”€ Headline â”€â”€ */}
        <Text style={styles.headline}>{t("content.application_kyc.SelfieCaptureContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.SelfieCaptureContent.SUBHEADLINE")}</Text>

        {/* â”€â”€ Camera oval frame â”€â”€ */}
        <View style={styles.cameraFrameWrap}>
          <View style={[styles.ovalGuide, captured && styles.ovalGuideCaptured]}>
            {captured ?
            <View style={styles.capturedState}>
                <Icon name="check-circle" size={52} color={colors.safetyGreen} />
                <Text style={styles.capturedLabel}>{t("application.selfie_captured")}</Text>
              </View> :

            <View style={styles.ovalContent}>
                <Icon name="face" size={56} color={`${colors.gold}70`} />
                <Text style={styles.alignHint}>{t("content.application_kyc.SelfieCaptureContent.ALIGN_HINT")}</Text>
                <Text style={styles.alignSubhint}>{t("content.application_kyc.SelfieCaptureContent.ALIGN_SUBHINT")}</Text>
              </View>
            }
          </View>

          {/* Camera controls */}
          <View style={styles.cameraControls}>
            {captured ?
            <TouchableOpacity accessibilityRole="button"
              style={styles.retakeBtn}
              onPress={handleRetake}
              accessibilityLabel={t("content.application_kyc.SelfieCaptureContent.CTA_RETAKE")}>
                <Icon name="refresh" size={16} color={colors.textSecondary} />
                <Text style={styles.retakeBtnText}>{t("content.application_kyc.SelfieCaptureContent.CTA_RETAKE")}</Text>
              </TouchableOpacity> :

            <TouchableOpacity accessibilityRole="button"
              style={styles.captureBtn}
              onPress={handleCapture}
              accessibilityLabel={t("content.application_kyc.SelfieCaptureContent.CTA_CAPTURE")}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
            }
          </View>
        </View>

        {/* â”€â”€ Selfie Guidelines Card â”€â”€ */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.SelfieCaptureContent.SELFIE_GUIDELINES_TITLE").toUpperCase()}</Text>
          <View style={styles.guideList}>
            {SELFIE_GUIDELINES.map((g) =>
            <View key={t(g.label)} style={styles.guideRow}>
                <View style={styles.guideIconWrap}>
                  <Icon name={g.icon as any} size={spacing.iconMd} color={colors.gold} />
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideLabel}>{t(g.label)}</Text>
                  <Text style={styles.guideBody}>{g.body}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* â”€â”€ Privacy Note Card â”€â”€ */}
        <GlassCard style={styles.card}>
          <View style={styles.privacyRow}>
            <View style={styles.privacyIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>{t("application.private_and_protected")}</Text>
              <Text style={styles.privacyBody}>{t("content.application_kyc.SelfieCaptureContent.PRIVACY_NOTE")}</Text>
              <Text style={[styles.privacyBody, styles.privacyBodySecond]}>{t("content.application_kyc.SelfieCaptureContent.PROFILE_NOTE")}</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* â”€â”€ CTA Footer â”€â”€ */}
      <View style={styles.ctaWrap}>
        {captured ?
        <ActionButton
          label={t("application.continue_to_live_check")}
          onPress={handleContinue}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.continue_to_liveness_check")} /> :


        <ActionButton
          label={t("content.application_kyc.SelfieCaptureContent.CTA_CAPTURE")}
          onPress={handleCapture}
          variant="primary"
          rightIcon={t("application.photo_camera")}
          accessibilityLabel={t("accessibility.capture_selfie")} />

        }
        <ActionButton
          label={t("content.application_kyc.SelfieCaptureContent.CTA_SAVE_LATER")}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.saveBtn}
          accessibilityLabel={t("accessibility.save_and_continue_later")} />
        
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

  // Camera frame
  cameraFrameWrap: { alignItems: 'center', gap: spacing.lg },
  ovalGuide: {
    width: 200, height: 260, borderRadius: 100,
    borderWidth: 2.5, borderColor: colors.gold, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardSurface
  },
  ovalGuideCaptured: {
    borderStyle: 'solid', borderColor: colors.safetyGreen,
    backgroundColor: colors.safetyGreenSubtle
  },
  ovalContent: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  capturedState: { alignItems: 'center', gap: spacing.sm },
  capturedLabel: { ...textStyles.labelMd, color: colors.safetyGreen },
  alignHint: { ...textStyles.labelMd, color: colors.textPrimary, textAlign: 'center' },
  alignSubhint: { ...textStyles.bodySm, color: colors.textSecondary, textAlign: 'center' },

  // Camera controls
  cameraControls: { alignItems: 'center' },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center'
  },
  captureBtnInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.gold
  },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm
  },
  retakeBtnText: { ...textStyles.labelMd, color: colors.textSecondary },

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Guideline rows
  guideList: { gap: spacing.md },
  guideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  guideIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  guideContent: { flex: 1 },
  guideLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  guideBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  // Privacy
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  privacyIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  privacyContent: { flex: 1, gap: spacing.xs },
  privacyTitle: { ...textStyles.labelMd, color: colors.textPrimary },
  privacyBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },
  privacyBodySecond: { marginTop: 4 },

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
  saveBtn: { marginTop: spacing.xs },
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