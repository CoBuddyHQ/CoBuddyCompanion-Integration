import i18next from "i18next"; /**
* CPN-122 — Transaction History Screen  (mapped to TRANSACTION_HISTORY route)
* Full filterable list of the companion's earnings and withdrawals.
*/
import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useEarningsStore, Transaction } from '../../store/slices/earningsStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Filter config ────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'credit' | 'debit' | 'pending';

const FILTERS: {key: FilterKey;label: string;}[] = [{ key: "all", label: "content.earnings.PayoutHistoryScreen.filters.0.label" }, { key: "credit", label: "content.earnings.PayoutHistoryScreen.filters.1.label" }, { key: "debit", label: "content.earnings.PayoutHistoryScreen.filters.2.label" }, { key: "pending", label: "content.earnings.PayoutHistoryScreen.filters.3.label" }] as any[];






// ─── Transaction icon/color maps (matches EarningsDashboardScreen) ────────────

const TX_ICONS: Record<Transaction['type'], string> = {
  credit: 'arrow-downward',
  debit: 'arrow-upward',
  pending: 'access-time'
};
const TX_ICON_COLORS: Record<Transaction['type'], string> = {
  credit: colors.safetyGreen,
  debit: colors.softWarning,
  pending: colors.gold
};
const TX_BG: Record<Transaction['type'], string> = {
  credit: 'rgba(109,214,165,0.10)',
  debit: 'rgba(217,108,108,0.10)',
  pending: 'rgba(214,168,79,0.10)'
};

function fmtAmount(tx: Transaction): string {
  const sign = tx.type === 'debit' ? '-' : '+';
  return `${sign}₹${Math.abs(tx.amount).toLocaleString('en-IN')}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TransactionRow: React.FC<{tx: Transaction;last: boolean;}> = ({ tx, last }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.txRow, last && styles.txRowLast]}>
    <View style={[styles.txIconWrap, { backgroundColor: TX_BG[tx.type] }]}>
      <Icon name={TX_ICONS[tx.type] as any} size={18} color={TX_ICON_COLORS[tx.type]} />
    </View>
    <View style={styles.txMid}>
      <Text style={styles.txTitle} numberOfLines={1}>{t(tx.title)}</Text>
      <Text style={styles.txDate}>{tx.date}</Text>
    </View>
    <View style={styles.txRight}>
      <Text style={[
        styles.txAmount,
        tx.type === 'credit' && styles.txAmountCredit,
        tx.type === 'debit' && styles.txAmountDebit,
        tx.type === 'pending' && styles.txAmountPending]
        }>
        {fmtAmount(tx)}
      </Text>
      {tx.type === 'pending' &&
        <Text style={styles.txPendingTag}> {t('earnings.pending')} </Text>
        }
    </View>
  </View>);

};

const EmptyState: React.FC<{filter: FilterKey;}> = ({ filter }) => {
  const { t } = useTranslation();
  const labels: Record<FilterKey, string> = {
    all: 'No transactions yet.',
    credit: 'No earnings recorded yet.',
    debit: 'No withdrawals made yet.',
    pending: 'No pending transactions.'
  };
  return (
    <View style={styles.emptyWrap}>
      <Icon name="receipt-long" size={44} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>{labels[filter]}</Text>
      <Text style={styles.emptySubtitle}>
         {t('earnings.transactions_will_appear_here_after_your_sessions_are_completed')} </Text>
    </View>);

};

// ─── Header (ListHeaderComponent) ────────────────────────────────────────────

const ListHeader: React.FC<{
  activeFilter: FilterKey;
  onFilter: (k: FilterKey) => void;
  totalCount: number;
}> = ({ activeFilter, onFilter, totalCount }) => {
  const { t } = useTranslation();
  return (
    <View>
    {/* Filter pill row */}
    <View style={styles.filterRow}>
      {FILTERS.map((f) => {
          const active = f.key === activeFilter;
          return (
            <TouchableOpacity accessibilityRole="button"
              key={f.key}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => onFilter(f.key)}
              activeOpacity={0.75}>
            <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
              {t(f.label)}
            </Text>
          </TouchableOpacity>);

        })}
    </View>

    {/* Count strip */}
    {totalCount > 0 &&
      <Text style={styles.countStrip}>{totalCount}  {t('earnings.transaction')} {totalCount !== 1 ? 's' : ''}</Text>
      }
  </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function PayoutHistoryScreen(): React.JSX.Element {
  const { t } = useTranslation();


  const navigation = useNavigation<any>();
  const recentTransactions = useEarningsStore((s) => s.recentTransactions);

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') {return recentTransactions;}
    return recentTransactions.filter((tx) => tx.type === activeFilter);
  }, [recentTransactions, activeFilter]);

  // Earnings/debit summaries for the header badge
  const totalEarned = useMemo(
    () => recentTransactions.filter((t) => t.type === 'credit').reduce((a, t) => a + t.amount, 0),
    [recentTransactions]
  );
  const totalWithdrawn = useMemo(
    () => Math.abs(recentTransactions.filter((t) => t.type === 'debit').reduce((a, t) => a + t.amount, 0)),
    [recentTransactions]
  );

  const handleDownload = () => {

    Alert.alert(t("alerts.download_statement"), t("alerts.your_earnings_statement_will_be_sent_to"),


    [{ text: t("alerts.ok") }]
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('earnings.transaction_history')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      {/* Summary pills row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryPill}>
          <Icon name="arrow-downward" size={13} color={colors.safetyGreen} />
          <Text style={styles.summaryPillLabel}> {t('earnings.earned')} </Text>
          <Text style={[styles.summaryPillValue, { color: colors.safetyGreen }]}>{t("content.earnings.PayoutHistoryScreen.text")}
            {totalEarned.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.summaryPill, { borderColor: 'rgba(217,108,108,0.22)' }]}>
          <Icon name="arrow-upward" size={13} color={colors.softWarning} />
          <Text style={styles.summaryPillLabel}> {t('earnings.withdrawn')} </Text>
          <Text style={[styles.summaryPillValue, { color: colors.softWarning }]}>{t("content.earnings.PayoutHistoryScreen.text")}
            {totalWithdrawn.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) =>
        <TransactionRow tx={item} last={index === filtered.length - 1} />
        }
        ListHeaderComponent={
        <ListHeader
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          totalCount={filtered.length} />

        }
        ListEmptyComponent={<EmptyState filter={activeFilter} />}
        ListFooterComponent={
        filtered.length > 0 ?
        <View>
              {recentTransactions.some((t) => t.type === 'pending') &&
          activeFilter !== 'debit' && activeFilter !== 'credit' &&
          <View style={styles.pendingNote}>
                  <Icon name="info-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.pendingNoteText}>
                     {t('earnings.pending_earnings_clear_within_24h_of_session_completion')} </Text>
                </View>
          }
              <View style={{ height: 120 }} />
            </View> :

        <View style={{ height: 80 }} />

        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]} />
      

      {/* Floating download button */}
      <View style={styles.fab}>
        <TouchableOpacity accessibilityRole="button"
          style={styles.fabBtn}
          onPress={handleDownload}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.download_statement")}>
          <Icon name="file-download" size={18} color={colors.gold} style={{ marginRight: 8 }} />
          <Text style={styles.fabBtnText}> {t('earnings.download_statement')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default PayoutHistoryScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  listContent: { paddingHorizontal: spacing.lg },

  // Summary row
  summaryRow: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  summaryPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(109,214,165,0.18)',
    paddingHorizontal: spacing.md, paddingVertical: 8
  },
  summaryPillLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, flex: 1
  },
  summaryPillValue: { fontFamily: fontFamily.interBold, fontSize: 13 },

  // Filter row — sticky
  filterRow: {
    flexDirection: 'row', gap: spacing.sm,
    backgroundColor: colors.rootBg,
    paddingVertical: spacing.sm
  },
  filterPill: {
    flex: 1, alignItems: 'center', paddingVertical: 8,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.cardSurface
  },
  filterPillActive: {
    backgroundColor: colors.goldSubtle,
    borderColor: 'rgba(214,168,79,0.45)'
  },
  filterPillText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  filterPillTextActive: { color: colors.gold },

  // Count strip
  countStrip: {
    fontFamily: fontFamily.interRegular, fontSize: 11,
    color: colors.textMuted, marginBottom: spacing.xs
  },

  // Transaction rows — inside a card wrapper look
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface,
    paddingHorizontal: spacing.md, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },
  txRowLast: {
    borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl,
    borderBottomWidth: 1
  },
  txIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  txMid: { flex: 1 },
  txTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  txDate: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  txRight: { alignItems: 'flex-end', marginLeft: spacing.sm },
  txAmount: { fontFamily: fontFamily.interBold, fontSize: 14 },
  txAmountCredit: { color: colors.safetyGreen },
  txAmountDebit: { color: colors.softWarning },
  txAmountPending: { color: colors.gold },
  txPendingTag: {
    fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.gold, marginTop: 2
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center', paddingVertical: spacing.xl * 2
  },
  emptyTitle: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textSecondary, marginTop: 14, marginBottom: 8 },
  emptySubtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, textAlign: 'center', maxWidth: 260, lineHeight: 20 },

  // Pending note
  pendingNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: spacing.md
  },
  pendingNoteText: {
    fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, fontStyle: 'italic', flex: 1
  },

  // FAB
  fab: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  fabBtn: {
    height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)',
    backgroundColor: 'rgba(214,168,79,0.07)'
  },
  fabBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold }
});