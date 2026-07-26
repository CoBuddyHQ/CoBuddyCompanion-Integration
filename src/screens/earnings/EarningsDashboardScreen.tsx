import i18next from 'i18next';
/**
 * CPN-137 — Earnings Dashboard Screen
 * Root tab screen for the Earnings stack.
 * Shows available balance, lifetime stats, and recent transactions.
 */
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useEarningsStore } from '../../store/slices/earningsStore';
import type { Transaction } from '../../store/types/store.types';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Transaction Row ──────────────────────────────────────────────────────────

const getIconType = (tx: Transaction) => {
  if (tx.status === 'pending_review') return 'pending';
  if (tx.amount < 0) return 'debit';
  return 'credit';
};

const TX_ICONS: Record<string, string> = {
  credit: 'arrow-downward',
  debit: 'arrow-upward',
  pending: 'access-time'
};
const TX_ICON_COLORS: Record<string, string> = {
  credit: colors.safetyGreen,
  debit: colors.softWarning,
  pending: colors.gold
};
const TX_BG: Record<string, string> = {
  credit: 'rgba(109,214,165,0.10)',
  debit: 'rgba(217,108,108,0.10)',
  pending: 'rgba(214,168,79,0.10)'
};

const TransactionRow: React.FC<{tx: Transaction;onPress: () => void;}> = ({ tx, onPress }) => {
  const iconType = getIconType(tx);
  const iconColor = TX_ICON_COLORS[iconType];
  const bgColor = TX_BG[iconType];
  const isDebit = tx.amount < 0;
  const isPending = tx.status === 'pending_review';
  const amountStr = `${isDebit ? '-' : '+'}₹${Math.abs(tx.amount).toLocaleString('en-IN')}`;

  return (
    <TouchableOpacity accessibilityRole="button" style={styles.txRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.txIconWrap, { backgroundColor: bgColor }]}>
        <Icon name={TX_ICONS[iconType] as any} size={18} color={iconColor} />
      </View>
      <View style={styles.txMid}>
        <Text style={styles.txTitle} numberOfLines={1}>{i18next.t(tx.description)}</Text>
        <Text style={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={[
      styles.txAmount,
      isDebit ? styles.txAmountDebit : null,
      isPending ? styles.txAmountPending : styles.txAmountCredit]
      }>
        {amountStr}
        {isPending ? ' *' : ''}
      </Text>
      <Icon name="chevron-right" size={16} color={colors.textMuted} style={{ marginLeft: 4 }} />
    </TouchableOpacity>);

};

// ─── Stat Cell ────────────────────────────────────────────────────────────────

const StatCell: React.FC<{label: string;value: string;icon: string;}> = ({ label, value, icon }) =>
<View style={styles.statCell}>
    <View style={styles.statIconWrap}>
      <Icon name={icon as any} size={16} color={colors.gold} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>;


// ─── Screen ───────────────────────────────────────────────────────────────────

export function EarningsDashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const availableBalance = useEarningsStore((s) => s.availableBalance);
  const pendingClearance = useEarningsStore((s) => s.pendingClearance);
  const lifetimeEarnings = useEarningsStore((s) => s.lifetimeEarnings);
  const totalSessions = useEarningsStore((s) => s.totalSessions);
  const recentTransactions = useEarningsStore((s) => s.recentTransactions);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        tabScreen
        title={t('earnings.earnings')}
        subtitle={t('earnings.balance_payouts')}
        rightIcon="account-balance"
        showBack={false}
        onRightPress={() => navigation.navigate(Routes.COMPLETED_PAYOUTS)} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
               TOP BALANCE CARD
            ══════════════════════════════════════════ */}
        <View style={styles.balanceCard}>
          {/* Decorative glow ring */}
          <View style={styles.balanceGlowRing} />

          <View style={styles.balanceIconRow}>
            <View style={styles.balanceIconWrap}>
              <Icon name="account-balance-wallet" size={22} color={colors.gold} />
            </View>
            <Text style={styles.balanceIconLabel}> {t('earnings.cobuddy_wallet')} </Text>
          </View>

          <Text style={styles.balanceMutedLabel}> {t('earnings.available_for_withdrawal')} </Text>
          <Text style={styles.balanceAmount}>{t("content.earnings.EarningsDashboardScreen.text")}
            {availableBalance.toLocaleString('en-IN')}
          </Text>

          <View style={styles.pendingRow}>
            <Icon name="access-time" size={13} color={colors.textMuted} />
            <Text style={styles.pendingText}>
               {t('earnings.pending_clearance')} {' '}
              <Text style={styles.pendingHighlight}>{t("content.earnings.EarningsDashboardScreen.text")}
                {pendingClearance.toLocaleString('en-IN')}
              </Text>
            </Text>
          </View>

          <TouchableOpacity accessibilityRole="button"
            style={styles.withdrawBtn}
            onPress={() => navigation.navigate(Routes.PAYOUT_REQUEST)}
            activeOpacity={0.85}
            accessibilityLabel={t("accessibility.withdraw_funds")}>
            <Icon name="send" size={16} color={colors.rootBg} style={{ marginRight: 8 }} />
            <Text style={styles.withdrawBtnText}> {t('earnings.withdraw_funds')} </Text>
          </TouchableOpacity>

          {/* Daily breakdown link */}
          <TouchableOpacity accessibilityRole="button" style={styles.breakdownLink}
          onPress={() => navigation.navigate(Routes.DAILY_EARNINGS_BREAKDOWN)}
          activeOpacity={0.7}>
            <Icon name="today" size={14} color={colors.gold} />
            <Text style={styles.breakdownLinkText}> {t('earnings.view_today_s_breakdown')} </Text>
            <Icon name="chevron-right" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════
               LIFETIME STATS ROW
            ══════════════════════════════════════════ */}
        <View style={styles.statsRow}>
          <StatCell
            icon="show-chart"
            label={t('earnings.lifetime_earnings')}
            value={`₹${lifetimeEarnings.toLocaleString('en-IN')}`} />
          
          <View style={styles.statsDivider} />
          <StatCell
            icon="event-available"
            label={t('earnings.total_sessions')}
            value={String(totalSessions)} />
          
        </View>

        {/* Completed payouts link */}
        <TouchableOpacity accessibilityRole="button" style={styles.payoutsLink}
        onPress={() => navigation.navigate(Routes.COMPLETED_PAYOUTS)}
        activeOpacity={0.75}>
          <Icon name="account-balance" size={16} color={colors.textMuted} />
          <Text style={styles.payoutsLinkText}> {t('earnings.view_payout_history')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ══════════════════════════════════════════
               QUICK LINKS
            ══════════════════════════════════════════ */}
        <View style={styles.quickLinks}>
          {[
          { icon: 'pending-actions', label: t("content.earnings.EarningsDashboardScreen.pending"), route: Routes.PENDING_EARNINGS },
          { icon: 'receipt-long', label: t("content.earnings.EarningsDashboardScreen.history"), route: Routes.TRANSACTION_HISTORY },
          { icon: 'description', label: t("content.earnings.EarningsDashboardScreen.tax_invoice"), route: Routes.TAX_INVOICE_DETAILS },
          { icon: 'bar-chart', label: t("content.earnings.EarningsDashboardScreen.weekly"), route: Routes.WEEKLY_MONTHLY_EARNINGS }].
          map((link) =>
          <TouchableOpacity accessibilityRole="button"
            key={t(link.label)}
            style={styles.quickLinkTile}
            onPress={() => navigation.navigate(link.route)}
            activeOpacity={0.75}>
              <View style={styles.quickLinkIconWrap}>
                <Icon name={link.icon as any} size={20} color={colors.gold} />
              </View>
              <Text style={styles.quickLinkLabel}>{t(link.label)}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ══════════════════════════════════════════
               RECENT TRANSACTIONS
            ══════════════════════════════════════════ */}
        <View style={styles.txSection}>
          <View style={styles.txSectionHeader}>
            <Text style={styles.txSectionTitle}> {t('earnings.recent_transactions')} </Text>
            <TouchableOpacity accessibilityRole="button"
              onPress={() => navigation.navigate(Routes.TRANSACTION_HISTORY)}
              accessibilityLabel={t("accessibility.view_all_transactions")}>
              <Text style={styles.viewAllText}> {t('earnings.view_all')} </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.txList}>
            {recentTransactions.slice(0, 5).map((tx) =>
            <TransactionRow key={tx.transactionId} tx={tx}
            onPress={() => navigation.navigate(Routes.TRANSACTION_DETAIL, { transactionId: tx.transactionId })} />
            )}
          </View>

          {recentTransactions.some((tx) => tx.status === 'pending_review') &&
          <View style={styles.pendingNote}>
              <Text style={styles.pendingNoteText}>
                 {t('earnings.pending_transactions_clear_within_24_hours_after_session_completion')} </Text>
            </View>
          }
        </View>

        {/* ══════════════════════════════════════════
               HELP STRIP
            ══════════════════════════════════════════ */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.helpStrip}
          onPress={() => navigation.navigate(Routes.REFUND_PENALTY_EXPLANATION)}
          activeOpacity={0.75}>
          <Icon name="help-outline" size={16} color={colors.textMuted} />
          <Text style={styles.helpStripText}>
             {t('earnings.understand_deductions_refunds_penalties')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>);

}

export default EarningsDashboardScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // ── Balance card ──────────────────────────────────────────────────────────
  balanceCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.20)',
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative'
  },
  balanceGlowRing: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  balanceIconRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.md
  },
  balanceIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center'
  },
  balanceIconLabel: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted
  },
  balanceMutedLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    marginBottom: spacing.xs
  },
  balanceAmount: {
    fontFamily: fontFamily.playfairBold, fontSize: 44, color: colors.gold,
    marginBottom: spacing.sm, letterSpacing: -1
  },
  pendingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: spacing.lg
  },
  pendingText: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted
  },
  pendingHighlight: {
    fontFamily: fontFamily.interSemiBold, color: colors.textSecondary
  },
  withdrawBtn: {
    height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  withdrawBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  breakdownLink: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: spacing.md, paddingVertical: 6
  },
  breakdownLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold, flex: 1 },

  // Payout history link
  payoutsLink: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.md
  },
  payoutsLinkText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md,
    overflow: 'hidden'
  },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: spacing.md },
  statIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm
  },
  statValue: {
    fontFamily: fontFamily.interBold, fontSize: 20, color: colors.textPrimary, marginBottom: 3
  },
  statLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted
  },

  // Quick links
  quickLinks: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md
  },
  quickLinkTile: {
    flex: 1, backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.sm,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },
  quickLinkIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 5
  },
  quickLinkLabel: {
    fontFamily: fontFamily.interMedium, fontSize: 10, color: colors.textSecondary, textAlign: 'center'
  },

  // Transactions
  txSection: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  txSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md
  },
  txSectionTitle: {
    fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary
  },
  viewAllText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold
  },
  txList: { gap: spacing.sm },
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.xs
  },
  txIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  txMid: { flex: 1 },
  txTitle: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary
  },
  txDate: {
    fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2
  },
  txAmount: {
    fontFamily: fontFamily.interBold, fontSize: 14, marginLeft: spacing.sm
  },
  txAmountCredit: { color: colors.safetyGreen },
  txAmountDebit: { color: colors.softWarning },
  txAmountPending: { color: colors.gold },
  pendingNote: { marginTop: spacing.sm },
  pendingNoteText: {
    fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, fontStyle: 'italic'
  },

  // Help strip
  helpStrip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },
  helpStripText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1
  }
});