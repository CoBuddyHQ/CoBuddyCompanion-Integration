/**
 * CPN-123 — Payout Request Screen
 * Companion initiates a withdrawal of their available earnings balance.
 */
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform,
  ActivityIndicator } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useEarningsStore } from '../../store/slices/earningsStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

// Minimum payout threshold (business rule)
const MIN_PAYOUT = 100;

// ─── Screen ───────────────────────────────────────────────────────────────────

export function PayoutRequestScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const availableBalance = useEarningsStore((s) => s.availableBalance);
  const pendingClearance = useEarningsStore((s) => s.pendingClearance);

  const [amountText, setAmountText] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Derived values ──────────────────────────────────────────────────────────
  const numericAmount = parseFloat(amountText) || 0;
  const exceedsBalance = numericAmount > availableBalance;
  const belowMinimum = numericAmount > 0 && numericAmount < MIN_PAYOUT;
  const isValid = numericAmount >= MIN_PAYOUT && !exceedsBalance;

  // ── Quick fill helpers ──────────────────────────────────────────────────────
  const fillPct = useCallback((pct: number) => {
    const val = Math.floor(availableBalance * pct);
    setAmountText(String(val));
  }, [availableBalance]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleRequest = () => {
    if (!isValid || loading) {return;}
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(Routes.PAYOUT_REVIEW, { amount: numericAmount });
    }, 800);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('earnings.withdraw_funds')}
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
                  BALANCE CARD
               ══════════════════════════════════════════ */}
          <View style={styles.balanceCard}>
            {/* Glow ring */}
            <View style={styles.balanceGlow} />

            <View style={styles.balanceTop}>
              <View style={styles.balanceIconWrap}>
                <Icon name="account-balance-wallet" size={20} color={colors.gold} />
              </View>
              <Text style={styles.balanceLabel}> {t('earnings.available_for_withdrawal')} </Text>
            </View>
            <Text style={styles.balanceAmount}>{fmtINR(availableBalance)}</Text>

            <View style={styles.balancePendingRow}>
              <Icon name="access-time" size={12} color={colors.textMuted} />
              <Text style={styles.balancePendingText}>
                 {t('earnings.pending_clearance')} {' '}
                <Text style={styles.balancePendingValue}>{fmtINR(pendingClearance)}</Text>
              </Text>
            </View>
          </View>

          {/* ══════════════════════════════════════════
                  AMOUNT INPUT
               ══════════════════════════════════════════ */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}> {t('earnings.enter_amount_to_withdraw')} </Text>

            {/* ₹ prefix + TextInput */}
            <View style={[styles.inputWrap, focused && styles.inputWrapFocused,
            exceedsBalance && styles.inputWrapError]}>
              <Text style={styles.rupeeSymbol}>{t("content.earnings.PayoutRequestScreen.text")}</Text>
              <TextInput
                style={styles.amountInput}
                value={amountText}
                onChangeText={(text) => setAmountText(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                selectionColor={colors.gold}
                maxLength={7}
                accessibilityLabel={t("accessibility.withdrawal_amount")} />
              
              {amountText.length > 0 &&
              <TouchableOpacity accessibilityRole="button" onPress={() => setAmountText('')} style={{ padding: 4 }}>
                  <Icon name="cancel" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              }
            </View>

            {/* Validation messages */}
            {exceedsBalance &&
            <View style={styles.errorBanner}>
                <Icon name="error-outline" size={14} color={colors.softWarning} />
                <Text style={styles.errorText}> {t('earnings.amount_exceeds_your_available_balance')} </Text>
              </View>
            }
            {belowMinimum && !exceedsBalance &&
            <View style={styles.warnBanner}>
                <Icon name="info-outline" size={14} color={colors.gold} />
                <Text style={styles.warnText}> {t('earnings.minimum_payout_is')} {fmtINR(MIN_PAYOUT)}.</Text>
              </View>
            }

            {/* Quick fill buttons */}
            <View style={styles.quickFillRow}>
              {[{ label: '25%', pct: 0.25 }, { label: '50%', pct: 0.5 }, { label: '75%', pct: 0.75 }, { label: t("content.earnings.PayoutRequestScreen.max"), pct: 1 }].map(({ label, pct }) =>
              <TouchableOpacity accessibilityRole="button"
                key={label}
                style={styles.quickFillBtn}
                onPress={() => fillPct(pct)}
                activeOpacity={0.75}>
                  <Text style={styles.quickFillText}>{label}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ══════════════════════════════════════════
                  DESTINATION BANK
               ══════════════════════════════════════════ */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}> {t('earnings.destination_account')} </Text>
            <View style={styles.bankRow}>
              <View style={styles.bankIconWrap}>
                <Icon name="account-balance" size={20} color={colors.gold} />
              </View>
              <View style={styles.bankMid}>
                <Text style={styles.bankName}> {t('earnings.hdfc_bank')} </Text>
                <Text style={styles.bankAcct}> {t('earnings.savings_1234')} </Text>
              </View>
              <View style={styles.bankRightCol}>
                <View style={styles.verifiedBadge}>
                  <Icon name="verified" size={11} color={colors.safetyGreen} />
                  <Text style={styles.verifiedText}> {t('earnings.verified')} </Text>
                </View>
                <TouchableOpacity accessibilityRole="button" style={{ marginTop: 4 }}
                onPress={() => navigation.navigate(Routes.BANK_DETAILS)}>
                  <Text style={styles.editLink}> {t('earnings.change')} </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ══════════════════════════════════════════
                  FEES & ETA
               ══════════════════════════════════════════ */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}> {t('earnings.transfer_details')} </Text>
            {[
            { icon: 'receipt', label: t("content.earnings.PayoutRequestScreen.transfer_fee"), value: '₹0 (Free)' },
            { icon: 'schedule', label: t("content.earnings.PayoutRequestScreen.estimated_arrival"), value: '24–48 hours' },
            { icon: 'currency-rupee', label: t("content.earnings.PayoutRequestScreen.amount_you_receive"),
              value: numericAmount > 0 ? fmtINR(numericAmount) : '—', highlight: true }].
            map((row, i, arr) =>
            <View key={t(row.label)} style={[
            styles.feeRow, i < arr.length - 1 && styles.feeRowDivider]
            }>
                <View style={styles.feeLeft}>
                  <Icon name={row.icon as any} size={14} color={colors.textMuted} />
                  <Text style={styles.feeLabel}>{t(row.label)}</Text>
                </View>
                <Text style={[styles.feeValue, row.highlight && styles.feeValueHighlight]}>
                  {row.value}
                </Text>
              </View>
            )}
          </View>

          {/* Info strip */}
          <View style={styles.infoStrip}>
            <Icon name="lock-outline" size={14} color={colors.textMuted} />
            <Text style={styles.infoStripText}>
               {t('earnings.payouts_are_secured_by_256_bit_bank_grade_encryption')} </Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ══════════════════════════════════════════
              STICKY BOTTOM BAR
           ══════════════════════════════════════════ */}
      <View style={styles.stickyBar}>
        {numericAmount > 0 && isValid &&
        <Text style={styles.stickyHint}>
             {t('earnings.you_will_receive')} {' '}
            <Text style={{ color: colors.gold, fontFamily: fontFamily.interBold }}>
              {fmtINR(numericAmount)}
            </Text>{' '}
             {t('earnings.in_your_bank_account')} </Text>
        }
        <TouchableOpacity accessibilityRole="button"
          style={[styles.requestBtn, (!isValid || loading) && styles.requestBtnDisabled]}
          onPress={handleRequest}
          disabled={!isValid || loading}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.request_payout")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} /> :

          <>
              <Icon name="send" size={18} color={colors.rootBg} style={{ marginRight: 9 }} />
              <Text style={styles.requestBtnText}>
                {numericAmount > 0 ? `Request ${fmtINR(numericAmount)}` : t("content.earnings.PayoutRequestScreen.request_payout")}
              </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default PayoutRequestScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Balance card
  balanceCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xxl, padding: spacing.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    marginBottom: spacing.md, overflow: 'hidden', position: 'relative'
  },
  balanceGlow: {
    position: 'absolute', top: -50, right: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  balanceTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  balanceIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    alignItems: 'center', justifyContent: 'center'
  },
  balanceLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  balanceAmount: {
    fontFamily: fontFamily.playfairBold, fontSize: 48, color: colors.gold,
    letterSpacing: -1, marginBottom: spacing.xs
  },
  balancePendingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  balancePendingText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  balancePendingValue: { fontFamily: fontFamily.interSemiBold, color: colors.textSecondary },

  // Amount input
  inputSection: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  inputLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0A1628',
    borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
    paddingHorizontal: spacing.md, marginBottom: spacing.sm
  },
  inputWrapFocused: { borderColor: colors.gold },
  inputWrapError: { borderColor: colors.softWarning },
  rupeeSymbol: {
    fontFamily: fontFamily.interBold, fontSize: 28, color: colors.textMuted, marginRight: 4
  },
  amountInput: {
    flex: 1, fontFamily: fontFamily.playfairBold, fontSize: 36,
    color: colors.textPrimary, paddingVertical: 14
  },

  // Validation banners
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(217,108,108,0.10)',
    borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(217,108,108,0.25)',
    padding: spacing.sm, marginBottom: spacing.sm
  },
  errorText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.softWarning },
  warnBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    padding: spacing.sm, marginBottom: spacing.sm
  },
  warnText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },

  // Quick fill
  quickFillRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  quickFillBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 8,
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)'
  },
  quickFillText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.gold },

  // Card
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  cardSectionTitle: {
    fontFamily: fontFamily.interSemiBold, fontSize: 12,
    color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: spacing.md
  },

  // Bank row
  bankRow: { flexDirection: 'row', alignItems: 'center' },
  bankIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  bankMid: { flex: 1 },
  bankName: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  bankAcct: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  bankRightCol: { alignItems: 'flex-end' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(109,214,165,0.12)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)',
    paddingHorizontal: 7, paddingVertical: 2
  },
  verifiedText: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.safetyGreen },
  editLink: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },

  // Fee rows
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  feeRowDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  feeLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feeLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary },
  feeValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary },
  feeValueHighlight: { fontFamily: fontFamily.interBold, color: colors.gold, fontSize: 14 },

  // Info strip
  infoStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: spacing.sm
  },
  infoStripText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },

  // Sticky bar
  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  stickyHint: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    textAlign: 'center', marginBottom: spacing.sm
  },
  requestBtn: {
    height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  requestBtnDisabled: { opacity: 0.45 },
  requestBtnText: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.rootBg }
});