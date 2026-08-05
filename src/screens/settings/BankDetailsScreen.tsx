/**
 * BankDetailsScreen
 * View current linked bank account and submit a new one for verification.
 * Accessed from: AccountSettingsScreen → "Bank & Payout Details".
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useProfileStore } from '../../store/slices/profileStore';
import { useEarningsStore } from '../../store/slices/earningsStore';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { KycService } from '../../services/api/services/kyc.service';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Labelled input ───────────────────────────────────────────────────────────

interface InputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  maxLength?: number;
  secureTextEntry?: boolean;
}

const LabelledInput: React.FC<InputProps> = ({
  label, value, onChangeText, placeholder,
  keyboardType = 'default', autoCapitalize = 'words',
  maxLength, secureTextEntry
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.inputWrap, focused && inputStyles.focused]}>
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.gold} />
      </View>
    </View>);
};

const inputStyles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  inputWrap: {
    backgroundColor: '#0D1B2E',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  focused: { borderColor: colors.gold },
  input: {
    fontFamily: fontFamily.interRegular, fontSize: 14,
    color: colors.textPrimary, paddingVertical: 13
  }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function BankDetailsScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const lifetimeEarnings = useEarningsStore((s) => s.lifetimeEarnings);
  const currentBankName = useApplicationStore((s) => s.bankName);
  const currentLast4 = useApplicationStore((s) => s.bankAccountLast4);
  const accountHolder = profile?.displayName ?? 'Account Holder';
  const formattedLifetime = `₹${lifetimeEarnings.toLocaleString('en-IN')}`;

  const [bankData, setBankData] = useState<{
    bankName: string;
    maskedAccount: string;
    holderName: string;
    ifsc: string;
  } | null>(null);

  React.useEffect(() => {
    KycService.getKycStatus().then((res: any) => {
      const b = res?.steps?.bank;
      if (b && b.maskedAccount) {
        setBankData({
          bankName: b.bankName || 'HDFC Bank',
          maskedAccount: b.maskedAccount,
          holderName: b.holderName || profile?.displayName || 'Account Holder',
          ifsc: b.ifsc || 'HDFC0001234',
        });
      }
    }).catch(() => {});
  }, [profile]);

  const displayBankName = bankData?.bankName || currentBankName || 'HDFC Bank';
  const displayLast4 = bankData?.maskedAccount ? `Savings ${bankData.maskedAccount}` : (currentLast4 ? `Savings **** ${currentLast4}` : 'Savings **** 2365');
  const displayHolder = bankData?.holderName || accountHolder;
  const displayIfsc = bankData?.ifsc || 'HDFC0001234';

  // New account form state
  const [holderName, setHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormFilled = holderName.trim() && bankName.trim() &&
    accountNo.trim().length >= 9 && ifscCode.trim().length === 11;

  const handleSave = async () => {
    if (!isFormFilled || loading) return;
    setLoading(true);
    try {
      await KycService.saveBank({
        holderName: holderName.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNo.trim(),
        ifsc: ifscCode.trim(),
      });
      
      Alert.alert(
        t("alerts.otp_sent") || 'OTP Verification Sent',
        'For your security, adding a new bank account requires OTP verification. Withdrawals will be paused for 24 hours after a change.',
        [{ text: t("alerts.ok") || 'OK', onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save bank details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('settings.bank_payout_details')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* ══════════════════════════════════════════
                   CURRENT LINKED ACCOUNT
                ══════════════════════════════════════════ */}
          <Text style={styles.sectionLabel}> {t('settings.current_account')} </Text>
          <View style={styles.currentCard}>
            {/* Glow */}
            <View style={styles.currentGlow} />

            <View style={styles.currentTop}>
              <View style={styles.bankIconWrap}>
                <Icon name="account-balance" size={22} color={colors.safetyGreen} />
              </View>
              <View style={styles.bankMid}>
                <Text style={styles.bankName}>{displayBankName}</Text>
                <Text style={styles.bankAcct}>{displayLast4}</Text>
                <Text style={styles.bankHolder}>{displayHolder}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={12} color={colors.safetyGreen} />
                <Text style={styles.verifiedText}> {t('settings.verified')} </Text>
              </View>
            </View>

            {/* Detail rows */}
            {[
            { label: t("content.settings.BankDetailsScreen.account_type"), value: 'Savings Account' },
            { label: t("content.settings.BankDetailsScreen.ifsc_code"), value: displayIfsc },
            { label: t("content.settings.BankDetailsScreen.added_on"), value: '12 May 2026' }].
            map((row) =>
            <View key={t(row.label)} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t(row.label)}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            )}

            <Text style={styles.defaultNote}>
               {t('settings.this_is_your_default_account_for_all_earnings_withdrawals')} </Text>
          </View>

          {/* ══════════════════════════════════════════
                   PAYOUT STATS
                ══════════════════════════════════════════ */}
          <View style={styles.statsRow}>
            {[
            { icon: 'send', label: t("content.settings.BankDetailsScreen.total_withdrawn"), value: formattedLifetime },
            { icon: 'schedule', label: t("content.settings.BankDetailsScreen.last_payout"), value: '3 days ago' }].
            map((stat, i) =>
            <View key={t(stat.label)} style={[styles.statCell, i === 0 && styles.statCellRight]}>
                <Icon name={stat.icon as any} size={16} color={colors.gold} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{t(stat.label)}</Text>
              </View>
            )}
          </View>

          {/* ══════════════════════════════════════════
                   NEW ACCOUNT FORM
                ══════════════════════════════════════════ */}
          <View style={styles.formCard}>
            <View style={styles.formTitleRow}>
              <Icon name="add-card" size={18} color={colors.gold} />
              <Text style={styles.formTitle}> {t('settings.link_a_new_bank_account')} </Text>
            </View>
            <Text style={styles.formSubtitle}>
               {t('settings.linking_a_new_account_will_replace_the_current_one_after_otp_verification')} </Text>

            <LabelledInput
              label={t('settings.account_holder_name')}
              value={holderName}
              onChangeText={setHolderName}
              placeholder={t('settings.full_name_as_on_bank_records')}
              autoCapitalize="words" />
            
            <LabelledInput
              label={t('settings.bank_name')}
              value={bankName}
              onChangeText={setBankName}
              placeholder={t('settings.e_g_hdfc_bank_sbi_icici')}
              autoCapitalize="words" />
            
            <LabelledInput
              label={t('settings.account_number')}
              value={accountNo}
              onChangeText={(t) => setAccountNo(t.replace(/\D/g, ''))}
              placeholder={t('settings.enter_your_account_number')}
              keyboardType="numeric"
              maxLength={18}
              autoCapitalize="none" />
            
            <LabelledInput
              label={t('settings.ifsc_code')}
              value={ifscCode}
              onChangeText={(t) => setIfscCode(t.toUpperCase().replace(/\s/g, ''))}
              placeholder={t('settings.e_g_hdfc0001234')}
              autoCapitalize="characters"
              maxLength={11} />
            
          </View>

          {/* ══════════════════════════════════════════
                   SECURITY INFO STRIP
                ══════════════════════════════════════════ */}
          <View style={styles.infoStrip}>
            <Icon name="lock-outline" size={15} color={colors.gold} style={{ flexShrink: 0, marginTop: 1 }} />
            <Text style={styles.infoStripText}>
               {t('settings.for_your_security_adding_a_new_bank_account_requires')} {' '}
              <Text style={styles.infoStripBold}> {t('settings.otp_verification')} </Text> {t('settings.withdrawals_will_be_paused_for')} {' '}
              <Text style={styles.infoStripBold}> {t('settings.24_hours')} </Text>
              {' '} {t('settings.after_a_change')} </Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ══════════════════════════════════════════
               STICKY SAVE BAR
            ══════════════════════════════════════════ */}
      <View style={styles.stickyBar}>
        <TouchableOpacity accessibilityRole="button"
          style={[styles.saveBtn, (!isFormFilled || loading) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!isFormFilled || loading}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.verify_and_save_bank_account")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} /> :

          <>
              <Icon name="verified-user" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}> {t('settings.verify_save_account')} </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default BankDetailsScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  sectionLabel: {
    fontFamily: fontFamily.interSemiBold, fontSize: 11,
    color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: spacing.sm
  },

  // Current account card
  currentCard: {
    backgroundColor: 'rgba(109,214,165,0.07)',
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)',
    marginBottom: spacing.md, overflow: 'hidden', position: 'relative'
  },
  currentGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(109,214,165,0.08)'
  },
  currentTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md, gap: spacing.md },
  bankIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(109,214,165,0.14)',
    borderWidth: 1.5, borderColor: 'rgba(109,214,165,0.28)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  bankMid: { flex: 1 },
  bankName: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary },
  bankAcct: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary, marginTop: 3, letterSpacing: 1 },
  bankHolder: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,214,165,0.14)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(109,214,165,0.28)',
    paddingHorizontal: 8, paddingVertical: 3
  },
  verifiedText: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.safetyGreen },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  detailLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  detailValue: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textSecondary },
  defaultNote: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    marginTop: spacing.sm, fontStyle: 'italic' },

  // Stats row
  statsRow: { flexDirection: 'row', marginBottom: spacing.md },
  statCell: { flex: 1, backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.md, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statCellRight: { marginRight: spacing.sm },
  statValue: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },

  // Form card
  formCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  formTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  formTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  formSubtitle: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    marginBottom: spacing.lg, lineHeight: 18 },

  // Info strip
  infoStrip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md
  },
  infoStripText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    flex: 1, lineHeight: 18 },
  infoStripBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  // Sticky bar
  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  saveBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});