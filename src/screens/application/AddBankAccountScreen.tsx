import { useTranslation } from 'react-i18next';
/**
* CPN-042 � Add Bank Account Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-041 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88, cardSurface bg, gold glow, 44px account-balance icon
*   - Account details card: FormInput fields + type chips
*   - Pre-verification checks card: icon-row list (check-circle / schedule)
*   - Account-match indicator: check-circle text (no ✅ emoji)
*   - Confirmation checkbox: Icon check
*   - Security note card: lock icon row
*   - Footer: ctaWrap outside KAV with primary + ghost ActionButton
*   - No emoji anywhere
*
* PRIVACY (SENSITIVE � FINANCIAL � unchanged):
*   - Full bank account number NEVER stored in Zustand.
*   - Only last 4 digits stored after submission.
*   - Confirm account field: local state, discarded after validation.
*   - No console.log. No AsyncStorage.
*/

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import type { BankAccountType } from '../../store/slices/applicationStore';

import { validateBankAccount, validateIFSC } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.ADD_BANK_ACCOUNT>;

const IFSC_PREFIX_MAP: Record<string, string> = {
  HDFC: 'HDFC Bank', SBIN: 'State Bank of India', ICIC: 'ICICI Bank',
  UTIB: 'Axis Bank', KKBK: 'Kotak Mahindra Bank', PUNB: 'Punjab National Bank',
  BARB: 'Bank of Baroda', CNRB: 'Canara Bank', UBIN: 'Union Bank of India',
  INDB: 'IndusInd Bank', IDFB: 'IDFC FIRST Bank', YESB: 'Yes Bank'
};

function detectBankFromIFSC(ifsc: string): string {
  return IFSC_PREFIX_MAP[ifsc.slice(0, 4).toUpperCase()] ?? '';
}

export function AddBankAccountScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const {
    setBankAccount, setCurrentStage, setApplicationResumeTarget, setDraftSaved,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const [holderName, setHolderName] = useState('');
  const [accountNum, setAccountNum] = useState(''); // SENSITIVE � local only
  const [confirmNum, setConfirmNum] = useState(''); // SENSITIVE � local only
  const [ifsc, setIFSC] = useState('');
  const [detectedBank, setDetectedBank] = useState('');
  const [accountType, setAccountType] = useState<BankAccountType>('savings');
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleIFSCChange = useCallback((text: string) => {
    const upper = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    setIFSC(upper);
    if (upper.length >= 4) {setDetectedBank(detectBankFromIFSC(upper));} else
    {setDetectedBank('');}
    if (errors.ifsc) {setErrors((prev) => ({ ...prev, ifsc: '' }));}
  }, [errors.ifsc]);

  const canSubmit =
  holderName.trim().length > 2 &&
  accountNum.length >= 8 &&
  accountNum === confirmNum &&
  ifsc.length === 11 &&
  confirmed;

  const handleSubmit = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (holderName.trim().length < 3) {newErrors.holderName = 'Name must be at least 3 characters.';}
    const accErr = validateBankAccount(accountNum);
    if (accErr) {newErrors.accountNum = accErr;}
    if (accountNum !== confirmNum) {newErrors.confirmNum = 'Account numbers do not match.';}
    const ifscErr = validateIFSC(ifsc);
    if (ifscErr) {newErrors.ifsc = ifscErr;}
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {return;}

    // PRIVACY: extract last 4 only � full account NOT stored in Zustand
    const last4 = accountNum.slice(-4);
    setBankAccount(last4, detectedBank || 'Unknown Bank', ifsc, accountType);
    setCurrentStage('bank_account');

    // Clear sensitive local state
    setAccountNum('');
    setConfirmNum('');

    // If this was opened as a missing-requirement fix, navigate to verification
    // which will complete the fix after verifying the account.
    navigation.navigate(Routes.BANK_ACCOUNT_VERIFICATION);
  }, [
  holderName, accountNum, confirmNum, ifsc, detectedBank, accountType, confirmed,
  setBankAccount, setCurrentStage,
  missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix, navigation]
  );

  const accountsMatch = confirmNum.length > 0 && accountNum === confirmNum;

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
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.AddBankAccountContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="account-balance" size={44} color={colors.gold} />
            </View>
            <View style={styles.heroBadge}>
              <Icon name="lock" size={16} color={colors.gold} />
            </View>
          </View>

          {/* ── Headline ── */}
          <Text style={styles.headline}>{t("content.application_kyc.AddBankAccountContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.AddBankAccountContent.SUBHEADLINE")}</Text>

          {/* ── Account Details Card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.AddBankAccountContent.ACCOUNT_TITLE").toUpperCase()}</Text>

            <FormInput
              label={t("content.application_kyc.AddBankAccountContent.HOLDER_LABEL")}
              value={holderName}
              onChangeText={setHolderName}
              placeholder={t("content.application_kyc.AddBankAccountContent.HOLDER_PLACEHOLDER")}
              autoCapitalize="words"
              error={errors.holderName}
              accessibilityLabel={t("accessibility.account_holder_name")} />
            

            <FormInput
              label={t("content.application_kyc.AddBankAccountContent.ACCOUNT_LABEL")}
              value={accountNum}
              onChangeText={(t) => {
                setAccountNum(t.replace(/[^0-9]/g, '').slice(0, 18));
                if (errors.accountNum) {setErrors((prev) => ({ ...prev, accountNum: '' }));}
              }}
              placeholder={t("content.application_kyc.AddBankAccountContent.ACCOUNT_PLACEHOLDER")}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={18}
              error={errors.accountNum}
              accessibilityLabel={t("accessibility.bank_account_number")}
              accessibilityHint={t("accessibility.field_masked")} />
            

            <FormInput
              label={t("content.application_kyc.AddBankAccountContent.CONFIRM_LABEL")}
              value={confirmNum}
              onChangeText={(t) => {
                setConfirmNum(t.replace(/[^0-9]/g, '').slice(0, 18));
                if (errors.confirmNum) {setErrors((prev) => ({ ...prev, confirmNum: '' }));}
              }}
              placeholder={t("content.application_kyc.AddBankAccountContent.CONFIRM_PLACEHOLDER")}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={18}
              error={errors.confirmNum}
              accessibilityLabel={t("accessibility.confirm_bank_account_number")} />
            

            {/* Account-match indicator � no emoji */}
            {accountsMatch &&
            <View style={styles.matchRow}>
                <Icon name="check-circle" size={16} color={colors.safetyGreen} />
                <Text style={styles.matchText}>{t("application.account_numbers_match")}</Text>
              </View>
            }

            <FormInput
              label={t("content.application_kyc.AddBankAccountContent.IFSC_LABEL")}
              value={ifsc}
              onChangeText={handleIFSCChange}
              placeholder={t("content.application_kyc.AddBankAccountContent.IFSC_PLACEHOLDER")}
              autoCapitalize="characters"
              maxLength={11}
              error={errors.ifsc}
              accessibilityLabel={t("accessibility.ifsc_code")} />
            

            {/* Auto-detected bank name */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{t("content.application_kyc.AddBankAccountContent.BANK_NAME_LABEL")}</Text>
              <View style={styles.bankNameValue}>
                {detectedBank ?
                <>
                    <Icon name="check-circle" size={16} color={colors.safetyGreen} />
                    <Text style={styles.bankNameText}>{detectedBank}</Text>
                  </> :

                <>
                    <Icon name="info-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.bankNamePlaceholder}>{t("content.application_kyc.AddBankAccountContent.BANK_NAME_PLACEHOLDER")}</Text>
                  </>
                }
              </View>
            </View>

            {/* Account type chips */}
            <Text style={styles.fieldLabel}>{t("content.application_kyc.AddBankAccountContent.TYPE_LABEL")}</Text>
            <View style={styles.typeRow}>
              {((Array.isArray(t("content.application_kyc.AddBankAccountContent.TYPE_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.AddBankAccountContent.TYPE_OPTIONS", { returnObjects: true }) as any[]) : [])).map((opt, index) =>
              <TouchableOpacity accessibilityRole="button"
                key={`ui-opt-${index}-${opt.value}`}
                style={[styles.typeChip, accountType === opt.value && styles.typeChipSelected]}
                onPress={() => setAccountType(opt.value as BankAccountType)}
                accessibilityLabel={t(opt.label)}
                accessibilityState={{ selected: accountType === opt.value }}>
                  <Text style={[styles.typeChipText, accountType === opt.value && styles.typeChipTextSelected]}>
                    {t(opt.label)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>

          {/* ── Pre-verification checks card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.AddBankAccountContent.PRECHECK_TITLE").toUpperCase()}</Text>
            <View style={styles.precheckRow}>
              <View style={styles.precheckIconWrap}>
                <Icon
                  name={holderName.trim().length > 2 ? 'check-circle' : 'schedule'}
                  size={spacing.iconMd}
                  color={holderName.trim().length > 2 ? colors.safetyGreen : colors.textMuted} />
                
              </View>
              <View style={styles.precheckContent}>
                <Text style={styles.precheckLabel}>{t("content.application_kyc.AddBankAccountContent.PRECHECK_NAME")}</Text>
                <Text style={styles.precheckHint}>{t("content.application_kyc.AddBankAccountContent.PRECHECK_NAME_HINT")}</Text>
              </View>
            </View>
            <View style={styles.precheckDivider} />
            <View style={styles.precheckRow}>
              <View style={styles.precheckIconWrap}>
                <Icon
                  name={detectedBank ? 'check-circle' : 'schedule'}
                  size={spacing.iconMd}
                  color={detectedBank ? colors.safetyGreen : colors.textMuted} />
                
              </View>
              <View style={styles.precheckContent}>
                <Text style={styles.precheckLabel}>{t("content.application_kyc.AddBankAccountContent.PRECHECK_IFSC")}</Text>
                <Text style={styles.precheckHint}>
                  {detectedBank ? `${detectedBank} � branch confirmed` : t("content.application_kyc.AddBankAccountContent.PRECHECK_IFSC_HINT")}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* ── Confirmation row ── */}
          <TouchableOpacity accessibilityRole="button"
            style={styles.confirmRow}
            onPress={() => setConfirmed(!confirmed)}
            accessibilityLabel={t("content.application_kyc.AddBankAccountContent.CONFIRMATION_LABEL")}
            accessibilityState={{ checked: confirmed }}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
              {confirmed && <Icon name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.confirmLabel}>{t("content.application_kyc.AddBankAccountContent.CONFIRMATION_LABEL")}</Text>
          </TouchableOpacity>

          {/* ── Security note card ── */}
          <GlassCard style={styles.card}>
            <View style={styles.securityRow}>
              <View style={styles.securityIconWrap}>
                <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
              </View>
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>{t("application.bank_level_security")}</Text>
                <Text style={styles.securityBody}>{t("content.application_kyc.AddBankAccountContent.SECURITY_NOTE")}</Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.AddBankAccountContent.CTA_PRIMARY")}
          onPress={handleSubmit}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          disabled={!canSubmit}
          accessibilityLabel={t("accessibility.submit_bank_account_for_verification")} />
        
        <ActionButton
          label={t("application.save_draft")}
          onPress={() => {
            setApplicationResumeTarget({ route: Routes.ADD_BANK_ACCOUNT });
            setDraftSaved(new Date().toISOString());
            navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
          }}
          variant="ghost"
          style={styles.saveBtn}
          accessibilityLabel={t("accessibility.save_draft_and_continue_later")} />
        
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

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Account match row
  matchRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginBottom: spacing.xs
  },
  matchText: { ...textStyles.labelSm, color: colors.safetyGreen },

  // Bank name
  fieldBlock: { gap: spacing.xs },
  fieldLabel: { ...textStyles.labelSm, color: colors.textSecondary },
  bankNameValue: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    backgroundColor: colors.cardSurface
  },
  bankNameText: { ...textStyles.labelMd, color: colors.textPrimary },
  bankNamePlaceholder: { ...textStyles.bodyMd, color: colors.textMuted, fontStyle: 'italic' },

  // Type chips
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  typeChip: {
    flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.cardSurface
  },
  typeChipSelected: { borderColor: colors.gold, backgroundColor: colors.goldSubtle },
  typeChipText: { ...textStyles.labelSm, color: colors.textSecondary },
  typeChipTextSelected: { color: colors.gold, fontFamily: 'Inter-SemiBold' },

  // Pre-check rows
  precheckRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  precheckIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  precheckContent: { flex: 1 },
  precheckLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  precheckHint: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },
  precheckDivider: { height: 1, backgroundColor: colors.borderSurface },

  // Confirmation
  confirmRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2, backgroundColor: colors.cardSurface
  },
  checkboxChecked: { borderColor: colors.gold, backgroundColor: colors.gold },
  confirmLabel: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 20 },

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
  securityTitle: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  securityBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

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