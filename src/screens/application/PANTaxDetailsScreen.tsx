import { useTranslation } from 'react-i18next';
/**
* CPN-041 � PAN & Tax Details Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-040 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88, cardSurface bg, gold glow, 44px receipt-long icon
*   - Required-for badge ? GlassCard row with account-balance icon
*   - Residency read-only row: earth icon (no emoji 🌏)
*   - GST toggle: checkbox icon row
*   - Confirmation checkbox: Icon check
*   - Privacy note: GlassCard + lock icon (no emoji 🔒)
*   - Footer: ctaWrap outside KAV with primary + ghost ActionButton
*   - No emoji anywhere
*
* PRIVACY (SENSITIVE � FINANCIAL IDENTITY � unchanged):
*   - PAN number NEVER stored raw in Zustand.
*   - Only masked PAN (AB������XY) stored after confirmation.
*   - Raw PAN cleared from local state after store update.
*   - No console.log. No AsyncStorage.
*/

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import FormInput from '../../components/form/FormInput';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';

import { validatePAN } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.PAN_TAX_DETAILS>;

function maskPAN(pan: string): string {
  if (pan.length !== 10) {return pan;}
  return `${pan[0]}${pan[1]}������${pan[8]}${pan[9]}`;
}

export function PANTaxDetailsScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const {
    setPANDetails, setPANConfirmed, setCurrentStage, basicDetails,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const [panRaw, setPANRaw] = useState('');
  const [panName, setPANName] = useState('');
  const [taxResidency] = useState('India');
  const [hasGST, setHasGST] = useState(false);
  const [gstNumber, setGSTNumber] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [panError, setPANError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const canSave = panRaw.length === 10 && panName.trim().length > 2 && confirmed && !panError;

  const handlePANChange = useCallback((text: string) => {
    const upper = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPANRaw(upper);
    if (upper.length === 10) {
      setPANError(validatePAN(upper));
    } else {
      setPANError(null);
    }
  }, []);

  const handleSave = useCallback(() => {
    const panErr = validatePAN(panRaw);
    if (panErr) {setPANError(panErr);return;}
    if (panName.trim().length < 3) {setNameError('Name must be at least 3 characters.');return;}
    if (!confirmed) {
      Alert.alert(t("alerts.confirmation_required"), t("alerts.please_confirm_the_pan_details_are_accur"));
      return;
    }
    // PRIVACY: mask PAN before storing � raw PAN NOT stored in Zustand
    const masked = maskPAN(panRaw);
    setPANDetails(panName.trim(), masked, taxResidency, hasGST, gstNumber.trim());
    setPANConfirmed(true);
    setCurrentStage('pan_tax_details');
    setPANRaw(''); // clear raw PAN from component state
    // If opened from a hub screen for missing-requirement fix, return there instead.
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('pan');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.ADD_BANK_ACCOUNT);
  }, [panRaw, panName, taxResidency, hasGST, gstNumber, confirmed, setPANDetails, setPANConfirmed, setCurrentStage,
  missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />
      

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Hero ── */}
          {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.PANTaxDetailsContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="receipt-long" size={44} color={colors.gold} />
            </View>
            <View style={styles.heroBadge}>
              <Icon name="account-balance" size={16} color={colors.gold} />
            </View>
          </View>

          {/* ── Headline ── */}
          <Text style={styles.headline}>{t("content.application_kyc.PANTaxDetailsContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.PANTaxDetailsContent.SUBHEADLINE")}</Text>

          {/* ── Required for payouts badge ── */}
          <GlassCard style={styles.requiredCard}>
            <View style={styles.requiredRow}>
              <View style={styles.requiredIconWrap}>
                <Icon name="account-balance-wallet" size={spacing.iconMd} color={colors.gold} />
              </View>
              <Text style={styles.requiredText}>{t("content.application_kyc.PANTaxDetailsContent.REQUIRED_FOR")}</Text>
            </View>
          </GlassCard>

          {/* ── PAN form card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("application.pan_details")}</Text>

            <FormInput
              label={t("content.application_kyc.PANTaxDetailsContent.PAN_LABEL")}
              value={panRaw}
              onChangeText={handlePANChange}
              placeholder={t("content.application_kyc.PANTaxDetailsContent.PAN_PLACEHOLDER")}
              autoCapitalize="characters"
              maxLength={10}
              error={panError ?? undefined}
              accessibilityLabel={t("accessibility.pan_number")}
              accessibilityHint="Enter your 10-character PAN number" />
            

            <FormInput
              label={t("content.application_kyc.PANTaxDetailsContent.PAN_NAME_LABEL")}
              value={panName}
              onChangeText={(t) => {setPANName(t);if (nameError) {setNameError(null);}}}
              placeholder={t("content.application_kyc.PANTaxDetailsContent.PAN_NAME_PLACEHOLDER")}
              autoCapitalize="words"
              error={nameError ?? undefined}
              accessibilityLabel={t("accessibility.name_as_per_pan")} />
            

            {/* DOB pre-filled from CPN-023 */}
            {basicDetails.dateOfBirth ?
            <View style={styles.prefillRow}>
                <Text style={styles.prefillLabel}>{t("content.application_kyc.PANTaxDetailsContent.DOB_LABEL")}</Text>
                <Text style={styles.prefillValue}>{basicDetails.dateOfBirth}</Text>
                <Text style={styles.prefillHint}>{t("content.application_kyc.PANTaxDetailsContent.DOB_HINT")}</Text>
              </View> :
            null}

            {/* Tax residency (read-only) */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{t("content.application_kyc.PANTaxDetailsContent.RESIDENCY_LABEL")}</Text>
              <View style={styles.residencyValue}>
                <Icon name="public" size={18} color={colors.gold} />
                <Text style={styles.residencyValueText}>{taxResidency}</Text>
              </View>
            </View>
          </GlassCard>

          {/* ── GST card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("application.gst_optional")}</Text>
            <TouchableOpacity
              style={styles.gstToggleRow}
              onPress={() => setHasGST(!hasGST)}
              accessibilityLabel={t("content.application_kyc.PANTaxDetailsContent.GST_TOGGLE_LABEL")}
              accessibilityState={{ checked: hasGST }}>
              <View style={[styles.checkbox, hasGST && styles.checkboxChecked]}>
                {hasGST && <Icon name="check" size={14} color="#fff" />}
              </View>
              <View style={styles.gstToggleContent}>
                <Text style={styles.gstToggleLabel}>{t("content.application_kyc.PANTaxDetailsContent.GST_TOGGLE_LABEL")}</Text>
                <Text style={styles.gstToggleHint}>{t("content.application_kyc.PANTaxDetailsContent.GST_HINT")}</Text>
              </View>
            </TouchableOpacity>

            {hasGST &&
            <View style={styles.gstField}>
                <FormInput
                label={t("content.application_kyc.PANTaxDetailsContent.GST_LABEL")}
                value={gstNumber}
                onChangeText={setGSTNumber}
                placeholder={t("content.application_kyc.PANTaxDetailsContent.GST_PLACEHOLDER")}
                autoCapitalize="characters"
                maxLength={15}
                accessibilityLabel={t("accessibility.gst_number")} />
              
              </View>
            }
          </GlassCard>

          {/* ── Confirmation row ── */}
          <TouchableOpacity
            style={styles.confirmRow}
            onPress={() => setConfirmed(!confirmed)}
            accessibilityLabel={t("content.application_kyc.PANTaxDetailsContent.CONFIRMATION_LABEL")}
            accessibilityState={{ checked: confirmed }}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
              {confirmed && <Icon name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.confirmLabel}>{t("content.application_kyc.PANTaxDetailsContent.CONFIRMATION_LABEL")}</Text>
          </TouchableOpacity>

          {/* ── Privacy note card ── */}
          <GlassCard style={styles.card}>
            <View style={styles.privacyRow}>
              <View style={styles.privacyIconWrap}>
                <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
              </View>
              <View style={styles.privacyContent}>
                <Text style={styles.privacyTitle}>{t("application.secure_handling")}</Text>
                <Text style={styles.privacyBody}>{t("content.application_kyc.PANTaxDetailsContent.PRIVACY_NOTE")}</Text>
              </View>
            </View>
          </GlassCard>

          {/* ── Review note ── */}
          <View style={styles.reviewRow}>
            <Icon name="info-outline" size={14} color={colors.textMuted} />
            <Text style={styles.reviewNote}>{t("content.application_kyc.PANTaxDetailsContent.PAN_REVIEW_NOTE")}</Text>
          </View>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.PANTaxDetailsContent.CTA_PRIMARY")}
          onPress={handleSave}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          disabled={!canSave}
          accessibilityLabel={t("accessibility.save_tax_details")} />
        
        <ActionButton
          label={t("content.application_kyc.PANTaxDetailsContent.CTA_SAVE_LATER")}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.saveBtn}
          accessibilityLabel={t("accessibility.save_and_continue_later")} />
        
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  flex: { flex: 1 },
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

  // Required card
  requiredCard: { gap: 0 },
  requiredRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  requiredIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  requiredText: { ...textStyles.labelMd, color: colors.gold, flex: 1 },

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Pre-fill row (DOB)
  prefillRow: { gap: 2 },
  prefillLabel: { ...textStyles.labelSm, color: colors.textSecondary },
  prefillValue: { ...textStyles.labelMd, color: colors.textPrimary },
  prefillHint: {
    ...textStyles.labelSm, color: colors.textMuted,
    fontStyle: 'italic'
  },

  // Residency row
  fieldBlock: { gap: spacing.xs },
  fieldLabel: { ...textStyles.labelSm, color: colors.textSecondary },
  residencyValue: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    backgroundColor: colors.cardSurface
  },
  residencyValueText: { ...textStyles.bodyMd, color: colors.textPrimary },

  // GST
  gstToggleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  gstToggleContent: { flex: 1 },
  gstToggleLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  gstToggleHint: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },
  gstField: { marginTop: spacing.sm },

  // Checkbox
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2, backgroundColor: colors.cardSurface
  },
  checkboxChecked: { borderColor: colors.gold, backgroundColor: colors.gold },

  // Confirmation row
  confirmRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md
  },
  confirmLabel: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 20 },

  // Privacy
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

  // Review note
  reviewRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    alignSelf: 'center'
  },
  reviewNote: {
    ...textStyles.labelSm, color: colors.textMuted,
    textAlign: 'center', fontStyle: 'italic'
  },

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