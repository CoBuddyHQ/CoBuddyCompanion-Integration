import { useTranslation } from 'react-i18next';
/**
* CPN-037 � Government ID Upload Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-036 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88, cardSurface, gold glow, 44px Icon, 28×28 badge
*   - Headline: Playfair SemiBold textStyles.displayMd
*   - Cards: GlassCard
*   - Upload slots: icon-based (no emoji)
*   - Footer: ctaWrap with primary ActionButton + ghost ActionButton
*
* PRIVACY (P0 CONSTRAINT � unchanged):
*   - Government ID images NEVER stored in applicationStore / Zustand.
*   - Only idSubmittedForReview: boolean is written to store after stub submit.
*   - No URI, no base64, no content stored client-side after navigation.
*   - Phase 5: Upload images directly to secure backend endpoint.
*
* Receives idType from navigation params (from CPN-036).
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
import { UploadsService } from '../../services/api/services/uploads.service';
import { KycService } from '../../services/api/services/kyc.service';
import { pickMedia, PickedMedia } from '../../utils/mediaPicker';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.GOVERNMENT_ID_UPLOAD>;

const UPLOAD_GUIDELINES = [
'Use clear lighting',
'Avoid blur or glare',
'Show full document edges',
'Details must match your basic profile'] as
const;

export function GovernmentIDUploadScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const idType = (route.params as {idType?: string;})?.idType ?? 'Government ID';

  const {
    setIdSubmitted, setCurrentStage, setApplicationResumeTarget, setDraftSaved,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const [frontFile, setFrontFile] = useState<PickedMedia | null>(null);
  const [backFile, setBackFile] = useState<PickedMedia | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frontUri = frontFile?.uri ?? null;
  const backUri = backFile?.uri ?? null;
  const canSubmit = !!frontUri && !!backUri;

  const pickImage = useCallback((side: 'front' | 'back') => {
    Alert.alert(
      `Upload ${side === 'front' ? t("content.application.GovernmentIDUploadScreen.front") : t("content.application.GovernmentIDUploadScreen.back")} of ${idType}`,
      t("alerts.choose_how_you_want_to_upload"),
      [
        {
          text: t("alerts.camera"),
          onPress: async () => {
            const result = await pickMedia('camera', { mediaType: 'photo' });
            if (result) {
              if (side === 'front') setFrontFile(result);
              else setBackFile(result);
            }
          },
        },
        {
          text: t("alerts.gallery"),
          onPress: async () => {
            const result = await pickMedia('gallery', { mediaType: 'photo' });
            if (result) {
              if (side === 'front') setFrontFile(result);
              else setBackFile(result);
            }
          },
        },
        { text: t("alerts.cancel"), style: 'cancel' },
      ],
    );
  }, [idType, t]);

  const handleSubmit = useCallback(async () => {
    if (!frontFile || !backFile) {
      Alert.alert(t('alerts.error'), 'Please capture or select both front and back sides of your Government ID.');
      return;
    }
    setIsSubmitting(true);
    try {
      const frontUpload = {
        uri: frontFile.uri,
        type: frontFile.type || 'image/jpeg',
        name: frontFile.name || `id_front_${Date.now()}.jpg`,
      };
      const backUpload = {
        uri: backFile.uri,
        type: backFile.type || 'image/jpeg',
        name: backFile.name || `id_back_${Date.now()}.jpg`,
      };

      const frontRes: any = await UploadsService.uploadKycIdentity(frontUpload);
      const backRes: any = await UploadsService.uploadKycIdentity(backUpload);
      
      const frontUrl = frontRes?.url || frontRes?.photoUrl || frontFile.uri;
      const backUrl = backRes?.url || backRes?.photoUrl || backFile.uri;

      await KycService.submitGovernmentId({
        documentType: idType || 'Aadhaar Card',
        frontUrl,
        backUrl,
      });

      setFrontFile(null);
      setBackFile(null);
      setIdSubmitted(true);
      setCurrentStage('government_id_upload');
      if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
        completeMissingRequirementFix('id_submitted');
        navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
        return;
      }
      navigation.navigate(Routes.SELFIE_CAPTURE);
    } catch (e: any) {
      Alert.alert(t("alerts.error"), e?.message || 'Failed to upload Government ID');
    } finally {
      setIsSubmitting(false);
    }
  }, [frontFile, backFile, idType, missingRequirementFixContext, navigation, setCurrentStage, setIdSubmitted, completeMissingRequirementFix, t]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.GovernmentIDUploadContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="upload-file" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t("content.application_kyc.GovernmentIDUploadContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.GovernmentIDUploadContent.SUBHEADLINE")}</Text>

        {/* ── Selected Document Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.selected_document")}</Text>
          <View style={styles.selectedDocRow}>
            <View style={styles.selectedDocLeft}>
              <View style={styles.docIconWrap}>
                <Icon name="badge" size={spacing.iconMd} color={colors.gold} />
              </View>
              <View style={styles.selectedDocInfo}>
                <Text style={styles.selectedDocType}>{idType}</Text>
                <Text style={styles.selectedDocRequired}>{t("content.application_kyc.CommonKycContent.REQUIRED")}</Text>
              </View>
            </View>
            <TouchableOpacity accessibilityRole="button"
              onPress={() => navigation.goBack()}
              accessibilityLabel={t("accessibility.change_id_type")}>
              <Text style={styles.changeLink}>{t("application.change")}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* ── Upload Slots Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.upload_id_images")}</Text>

          {/* Front side */}
          <TouchableOpacity accessibilityRole="button"
            style={[styles.uploadSlot, frontUri && styles.uploadSlotFilled]}
            onPress={() => pickImage('front')}
            accessibilityLabel={t("accessibility.upload_front_side_of_id")}>
            <View style={[styles.uploadIconWrap, frontUri && styles.uploadIconWrapFilled]}>
              <Icon
                name={frontUri ? 'check-circle' : 'add-photo-alternate'}
                size={spacing.iconMd}
                color={frontUri ? colors.safetyGreen : colors.gold} />
              
            </View>
            <View style={styles.uploadSlotInfo}>
              <Text style={styles.uploadSlotLabel}>{t("content.application_kyc.GovernmentIDUploadContent.FRONT_LABEL")}</Text>
              <Text style={styles.uploadSlotHint}>
                {frontUri ? t("content.application.GovernmentIDUploadScreen.image_added_tap_to_replace") : t("content.application_kyc.GovernmentIDUploadContent.FRONT_HINT")}
              </Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.textMuted} />
            
          </TouchableOpacity>

          <View style={styles.slotDivider} />

          {/* Back side */}
          <TouchableOpacity accessibilityRole="button"
            style={[styles.uploadSlot, backUri && styles.uploadSlotFilled]}
            onPress={() => pickImage('back')}
            accessibilityLabel={t("accessibility.upload_back_side_of_id")}>
            <View style={[styles.uploadIconWrap, backUri && styles.uploadIconWrapFilled]}>
              <Icon
                name={backUri ? 'check-circle' : 'add-photo-alternate'}
                size={spacing.iconMd}
                color={backUri ? colors.safetyGreen : colors.gold} />
              
            </View>
            <View style={styles.uploadSlotInfo}>
              <Text style={styles.uploadSlotLabel}>{t("content.application_kyc.GovernmentIDUploadContent.BACK_LABEL")}</Text>
              <Text style={styles.uploadSlotHint}>
                {backUri ? t("content.application.GovernmentIDUploadScreen.image_added_tap_to_replace") : t("content.application_kyc.GovernmentIDUploadContent.BACK_HINT")}
              </Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.textMuted} />
            
          </TouchableOpacity>
        </GlassCard>

        {/* ── Upload Guidelines Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.GovernmentIDUploadContent.UPLOAD_GUIDELINES_TITLE").toUpperCase()}</Text>
          <View style={styles.guideList}>
            {UPLOAD_GUIDELINES.map((g) =>
            <View key={g} style={styles.guideRow}>
                <View style={styles.guideDotWrap}>
                  <Icon name="check-circle" size={16} color={colors.gold} />
                </View>
                <Text style={styles.guideText}>{g}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Privacy Note Card ── */}
        <GlassCard style={styles.card}>
          <View style={styles.privacyRow}>
            <View style={styles.privacyIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>{t("application.secure_document_handling")}</Text>
              <Text style={styles.privacyBody}>{t("content.application_kyc.GovernmentIDUploadContent.PRIVACY_NOTE")}</Text>
            </View>
          </View>
        </GlassCard>

        {/* ── Warning note ── */}
        <View style={styles.warningRow}>
          <Icon name="info-outline" size={14} color={colors.textMuted} />
          <Text style={styles.warningText}>{t("content.application_kyc.GovernmentIDUploadContent.WARNING_NOTE")}</Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── Sticky Bottom CTA ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={isSubmitting ? t("alerts.processing") : t("application.submit")}
          onPress={handleSubmit}
          variant="primary"
          disabled={!canSubmit || isSubmitting}
          rightIcon={!isSubmitting ? "check-circle" : undefined}
          accessibilityLabel={t("accessibility.submit_uploaded_documents")} />
        
        <ActionButton
          label={t("content.application_kyc.GovernmentIDUploadContent.CTA_SAVE_LATER")}
          onPress={() => {
            // Preserve idType so CPN-050 resumes here with the correct document labels
            setApplicationResumeTarget({ route: Routes.GOVERNMENT_ID_UPLOAD, params: { idType } });
            setDraftSaved(new Date().toISOString());
            navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
          }}
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

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Selected doc row
  selectedDocRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  selectedDocLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },
  selectedDocInfo: { gap: 2 },
  selectedDocType: { ...textStyles.labelMd, color: colors.textPrimary },
  selectedDocRequired: { ...textStyles.labelSm, color: colors.gold },
  changeLink: {
    ...textStyles.labelMd, color: colors.gold,
    textDecorationLine: 'underline'
  },

  // Upload slots
  uploadSlot: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    backgroundColor: colors.elevatedSurface
  },
  uploadSlotFilled: {
    borderStyle: 'solid', borderColor: colors.gold,
    backgroundColor: colors.goldSubtle
  },
  uploadIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  uploadIconWrapFilled: {
    backgroundColor: colors.safetyGreenSubtle,
    borderColor: `${colors.safetyGreen}30`
  },
  uploadSlotInfo: { flex: 1 },
  uploadSlotLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  uploadSlotHint: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },
  slotDivider: { height: 1, backgroundColor: colors.borderSurface },

  // Guidelines
  guideList: { gap: spacing.sm },
  guideRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  guideDotWrap: { flexShrink: 0 },
  guideText: { ...textStyles.bodySm, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  // Privacy row
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  privacyIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  privacyContent: { flex: 1 },
  privacyTitle: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  privacyBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  // Warning
  warningRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    alignSelf: 'center'
  },
  warningText: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center' },

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