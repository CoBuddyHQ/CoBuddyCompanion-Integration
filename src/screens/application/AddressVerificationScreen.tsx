import { useTranslation } from 'react-i18next';
/**
* CPN-040 � Address Verification Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-039 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88 circle, cardSurface bg, gold glow, 44px home icon
*   - P0 mandatory privacy badge: GlassCard with lock icon (not emoji)
*   - Address form: GlassCard with FormInput fields + State selector + type chips
*   - Address proof: GlassCard with dashed upload zone + icon
*   - Footer: ctaWrap outside scroll, primary ActionButton + ghost ActionButton
*   - No emoji anywhere
*
* PRIVACY (P0 CONSTRAINT � unchanged):
*   - Address = HIGHLY SENSITIVE PII.
*   - Stored ONLY in Zustand in-memory (never AsyncStorage, never logged).
*   - NEVER shown to customers � only used for city/area service matching.
*   - No GPS auto-population � manual entry only.
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
import type { AddressType } from '../../store/slices/applicationStore';




import { validateAddressLine, validatePINCode } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.ADDRESS_VERIFICATION>;

export function AddressVerificationScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const {
    setAddress, setAddressDetailsComplete, setAddressProofSubmitted, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateVal] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [addressType, setAddressType] = useState<AddressType>('current_residence');
  const [idMatch, setIdMatch] = useState(false);
  const [proofAdded, setProofAdded] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const l1Err = validateAddressLine(line1, 'Address Line 1');
    if (l1Err) {newErrors.line1 = l1Err;}
    const cityErr = validateAddressLine(city, 'City');
    if (cityErr) {newErrors.city = cityErr;}
    if (!state) {newErrors.state = 'State is required.';}
    const pinErr = validatePINCode(pinCode);
    if (pinErr) {newErrors.pinCode = pinErr;}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [line1, city, state, pinCode]);

  // Address proof is OPTIONAL � does NOT block Continue.
  // Only address form fields (line1, city, state, pinCode) are required.
  const canContinue =
  line1.trim().length >= 3 &&
  city.trim().length >= 2 &&
  state.length > 0 &&
  pinCode.length === 6;

  const handleContinue = useCallback(() => {
    if (!validateAll()) {return;}
    // PRIVACY: store in-memory Zustand only � never AsyncStorage, never log
    setAddress({ line1, line2, city, state, pinCode, addressType });
    // addressDetailsComplete = form fields validated (required)
    // addressProofSubmitted = proof was also added (optional, set separately by handleProofUpload)
    setAddressDetailsComplete(true);
    if (proofAdded) {setAddressProofSubmitted(true);}
    setCurrentStage('address_verification');
    // If opened from a hub screen for missing-requirement fix, return there instead.
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('address_details');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.COMPANION_PRICING);
  }, [
  validateAll, setAddress, setAddressDetailsComplete, setAddressProofSubmitted,
  setCurrentStage, missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix,
  navigation, line1, line2, city, state, pinCode, addressType, proofAdded]
  );

  const handleProofUpload = useCallback(() => {
    Alert.alert(t("alerts.upload_address_proof"), t("alerts.choose_a_document_to_upload"),


    [
    { text: t("alerts.camera"), onPress: () => setProofAdded(true) },
    { text: t("alerts.gallery"), onPress: () => setProofAdded(true) },
    { text: t("alerts.cancel"), style: 'cancel' }]

    );
  }, []);

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
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.AddressVerificationContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="home" size={44} color={colors.gold} />
            </View>
            <View style={styles.heroBadge}>
              <Icon name="shield" size={16} color={colors.gold} />
            </View>
          </View>

          {/* ── Headline ── */}
          <Text style={styles.headline}>{t("content.application_kyc.AddressVerificationContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.AddressVerificationContent.SUBHEADLINE")}</Text>

          {/* ── P0 MANDATORY: Privacy Badge ── */}
          <GlassCard style={styles.privacyCard}>
            <View style={styles.privacyBadgeRow}>
              <View style={styles.privacyIconWrap}>
                <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
              </View>
              <View style={styles.privacyBadgeContent}>
                <Text style={styles.privacyBadgeTitle}>{t("content.application_kyc.AddressVerificationContent.PRIVACY_BADGE")}</Text>
                <Text style={styles.privacyBadgeNote}>{t("content.application_kyc.AddressVerificationContent.PRIVACY_NOTE")}</Text>
              </View>
            </View>
          </GlassCard>

          <Text style={styles.purposeNote}>{t("content.application_kyc.AddressVerificationContent.PURPOSE_NOTE")}</Text>

          {/* ── Address Form Card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.AddressVerificationContent.ADDRESS_TITLE").toUpperCase()}</Text>

            <FormInput
              label={t("content.application_kyc.AddressVerificationContent.LINE1_LABEL")}
              value={line1}
              onChangeText={setLine1}
              placeholder={t("content.application_kyc.AddressVerificationContent.LINE1_PLACEHOLDER")}
              error={errors.line1}
              accessibilityLabel={t("accessibility.address_line_1")} />
            
            <FormInput
              label={t("content.application_kyc.AddressVerificationContent.LINE2_LABEL")}
              value={line2}
              onChangeText={setLine2}
              placeholder={t("content.application_kyc.AddressVerificationContent.LINE2_PLACEHOLDER")}
              accessibilityLabel={t("accessibility.address_line_2_optional")} />
            
            <FormInput
              label={t("content.application_kyc.AddressVerificationContent.CITY_LABEL")}
              value={city}
              onChangeText={setCity}
              placeholder={t("content.application_kyc.AddressVerificationContent.CITY_PLACEHOLDER")}
              error={errors.city}
              accessibilityLabel={t("accessibility.city")} />
            

            {/* State selector */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{t("content.application_kyc.AddressVerificationContent.STATE_LABEL")}</Text>
              <TouchableOpacity
                style={[styles.stateSelector, errors.state ? styles.stateSelectorError : null]}
                onPress={() => setShowStateList(!showStateList)}
                accessibilityLabel={t("accessibility.select_state")}>
                <Text style={state ? styles.stateSelectorValue : styles.stateSelectorPlaceholder}>
                  {state || t("content.application_kyc.AddressVerificationContent.STATE_PLACEHOLDER")}
                </Text>
                <Icon
                  name={showStateList ? 'expand-less' : 'expand-more'}
                  size={20}
                  color={colors.textMuted} />
                
              </TouchableOpacity>
              {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
              {showStateList &&
              <View style={styles.stateList}>
                  <ScrollView style={styles.stateScroll} nestedScrollEnabled>
                    {[
                      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
                      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
                      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
                      'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
                      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
                      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
                      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
                    ].map((s) =>
                  <TouchableOpacity
                    key={s}
                    style={[styles.stateItem, state === s && styles.stateItemSelected]}
                    onPress={() => {setStateVal(s);setShowStateList(false);}}>
                        <Text style={[styles.stateItemText, state === s && styles.stateItemTextSelected]}>
                          {s}
                        </Text>
                      </TouchableOpacity>
                  )}
                  </ScrollView>
                </View>
              }
            </View>

            <FormInput
              label={t("content.application_kyc.AddressVerificationContent.PIN_LABEL")}
              value={pinCode}
              onChangeText={(t) => setPinCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder={t("content.application_kyc.AddressVerificationContent.PIN_PLACEHOLDER")}
              keyboardType="number-pad"
              maxLength={6}
              error={errors.pinCode}
              accessibilityLabel={t("accessibility.pin_code")} />
            

            {/* Address type chips */}
            <Text style={styles.fieldLabel}>{t("content.application_kyc.AddressVerificationContent.TYPE_LABEL")}</Text>
            <View style={styles.typeRow}>
              {(Array.isArray(t("content.application_kyc.AddressVerificationContent.TYPE_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.AddressVerificationContent.TYPE_OPTIONS", { returnObjects: true }) as any[]) : []).map((opt, index) =>
              <TouchableOpacity
                key={`ui-opt-${index}-${opt.value}`}
                style={[
                styles.typeChip,
                addressType === opt.value && styles.typeChipSelected]
                }
                onPress={() => setAddressType(opt.value as AddressType)}
                accessibilityLabel={t(opt.label)}
                accessibilityState={{ selected: addressType === opt.value }}>
                  <Text style={[
                styles.typeChipText,
                addressType === opt.value && styles.typeChipTextSelected]
                }>
                    {t(opt.label)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ID match toggle */}
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setIdMatch(!idMatch)}
              accessibilityLabel={t("content.application_kyc.AddressVerificationContent.ID_MATCH_LABEL")}
              accessibilityState={{ checked: idMatch }}>
              <View style={[styles.checkbox, idMatch && styles.checkboxChecked]}>
                {idMatch && <Icon name="check" size={14} color="#fff" />}
              </View>
              <Text style={styles.checkLabel}>{t("content.application_kyc.AddressVerificationContent.ID_MATCH_LABEL")}</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* ── Address Proof Card (OPTIONAL) ── */}
          <GlassCard style={styles.card}>
            <View style={styles.proofHeaderRow}>
              <Text style={styles.cardTitle}>{t("content.application_kyc.AddressVerificationContent.PROOF_TITLE").toUpperCase()}</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalBadgeText}>{t("application.optional")}</Text>
              </View>
            </View>
            <Text style={styles.proofSubtitle}>{t("content.application_kyc.AddressVerificationContent.PROOF_SUBTITLE")}</Text>
            <Text style={styles.proofHint}>{t("content.application_kyc.AddressVerificationContent.PROOF_HINT")}</Text>
            <Text style={styles.proofOptionalNote}>{t("application.adding_address_proof_may_help_speed_up_v")}

            </Text>
            <TouchableOpacity
              style={[styles.proofUpload, proofAdded && styles.proofUploadDone]}
              onPress={handleProofUpload}
              accessibilityLabel={t("content.application_kyc.AddressVerificationContent.PROOF_CTA")}>
              <View style={[styles.proofIconWrap, proofAdded && styles.proofIconWrapDone]}>
                <Icon
                  name={proofAdded ? 'check-circle' : 'upload-file'}
                  size={spacing.iconMd}
                  color={proofAdded ? colors.safetyGreen : colors.gold} />
                
              </View>
              <Text style={[styles.proofUploadText, proofAdded && styles.proofUploadTextDone]}>
                {proofAdded ? t("content.application.AddressVerificationScreen.proof_added_tap_to_change") : t("content.application_kyc.AddressVerificationContent.PROOF_CTA")}
              </Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── CTA Footer (outside KeyboardAvoidingView) ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.AddressVerificationContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          disabled={!canContinue}
          accessibilityLabel={t("accessibility.save_address_details")} />
        
        <ActionButton
          label={t("content.application_kyc.AddressVerificationContent.CTA_SAVE_LATER")}
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

  // P0 Privacy card
  privacyCard: { gap: spacing.sm },
  privacyBadgeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  privacyIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  privacyBadgeContent: { flex: 1 },
  privacyBadgeTitle: {
    ...textStyles.labelMd, color: colors.gold,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 4
  },
  privacyBadgeNote: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  purposeNote: {
    ...textStyles.labelSm, color: colors.textMuted,
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

  // Form fields
  fieldBlock: { gap: spacing.xs },
  fieldLabel: {
    ...textStyles.labelSm, color: colors.textSecondary
  },
  stateSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    backgroundColor: colors.cardSurface
  },
  stateSelectorError: { borderColor: colors.softWarning },
  stateSelectorValue: { ...textStyles.bodyMd, color: colors.textPrimary },
  stateSelectorPlaceholder: { ...textStyles.bodyMd, color: colors.textMuted },
  stateList: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    backgroundColor: colors.cardSurface, maxHeight: 200, marginTop: spacing.xs
  },
  stateScroll: { padding: spacing.xs },
  stateItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.sm },
  stateItemSelected: { backgroundColor: colors.goldSubtle },
  stateItemText: { ...textStyles.bodyMd, color: colors.textPrimary },
  stateItemTextSelected: { color: colors.gold, fontFamily: 'Inter-SemiBold' },
  errorText: {
    ...textStyles.labelSm, color: colors.softWarning, marginTop: spacing.xs
  },

  // Address type chips
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  typeChip: {
    flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.cardSurface
  },
  typeChipSelected: { borderColor: colors.gold, backgroundColor: colors.goldSubtle },
  typeChipText: { ...textStyles.labelSm, color: colors.textSecondary },
  typeChipTextSelected: { color: colors.gold, fontFamily: 'Inter-SemiBold' },

  // ID match checkbox
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },
  checkboxChecked: { borderColor: colors.gold, backgroundColor: colors.gold },
  checkLabel: {
    flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18
  },

  // Address proof
  proofHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  optionalBadge: {
    backgroundColor: 'rgba(126, 136, 150, 0.15)',
    borderRadius: 20, paddingHorizontal: spacing.sm, paddingVertical: 2
  },
  optionalBadgeText: { ...textStyles.labelXs, color: colors.textMuted },
  proofSubtitle: { ...textStyles.bodySm, color: colors.textSecondary },
  proofHint: {
    ...textStyles.labelSm, color: colors.textMuted,
    fontStyle: 'italic'
  },
  proofOptionalNote: {
    ...textStyles.labelSm, color: 'rgba(126,136,150,0.80)',
    marginTop: spacing.xs, marginBottom: spacing.sm
  },
  proofUpload: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    backgroundColor: colors.elevatedSurface
  },
  proofUploadDone: {
    borderStyle: 'solid', borderColor: colors.gold,
    backgroundColor: colors.goldSubtle
  },
  proofIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  proofIconWrapDone: {
    backgroundColor: colors.safetyGreenSubtle,
    borderColor: `${colors.safetyGreen}30`
  },
  proofUploadText: { ...textStyles.labelMd, color: colors.textSecondary },
  proofUploadTextDone: { color: colors.safetyGreen },

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
  fieldError: { ...textStyles.bodySm, color: colors.softWarning, marginTop: spacing.xs, paddingHorizontal: spacing.xs },
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