import i18next from "i18next"; /**
* DailyEarningsBreakdownScreen (CPN-101)
* Shows per-day session credits & deductions, driven from earningsStore.recentTransactions.
*/
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useEarningsStore } from '../../store/slices/earningsStore';
import { useTranslation } from "react-i18next";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtINR(n: number): string {
  return `₹${Math.abs(n).toLocaleString('en-IN')}`;
}

// 7-day rolling window labels (most-recent = index 6 = "Today")
const DATE_LABELS = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"] as any[];

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DailyEarningsBreakdownScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [dateIdx, setDateIdx] = useState(6); // default: "Today"

  // ── Store ────────────────────────────────────────────────────────────────────
  const recentTransactions = useEarningsStore((s) => s.recentTransactions);

  // For "today" show all credits/debits from the store (future: filter by date via API)
  // For other days we show an empty state since we only have "recent" mock data
  const isToday = dateIdx === 6;
  const dayTxns = isToday ? recentTransactions.filter((tx) => tx.type !== 'pending') : [];

  // Compute net for the displayed day: sum of amounts (negatives are deductions)
  const netAmount = dayTxns.reduce((sum, tx) => sum + tx.amount, 0);
  const netStr = netAmount >= 0 ? `+${fmtINR(netAmount)}` : `-${fmtINR(netAmount)}`;
  const netColor = netAmount >= 0 ? colors.safetyGreen : colors.softWarning;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.daily_breakdown')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Date selector */}
        <View style={s.dateRow}>
          <TouchableOpacity accessibilityRole="button" onPress={() => setDateIdx(Math.max(0, dateIdx - 1))} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Icon name="chevron-left" size={26} color={dateIdx > 0 ? colors.gold : colors.textMuted} />
          </TouchableOpacity>
          <Text style={s.dateText}>{DATE_LABELS[dateIdx]}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => setDateIdx(Math.min(DATE_LABELS.length - 1, dateIdx + 1))} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Icon name="chevron-right" size={26} color={dateIdx < DATE_LABELS.length - 1 ? colors.gold : colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Net total card */}
        <View style={s.totalCard}>
          <Text style={s.totalLabel}> {t('earnings.net_earnings')} </Text>
          <Text style={[s.totalAmount, { color: dayTxns.length > 0 ? netColor : colors.textMuted }]}>
            {dayTxns.length > 0 ? fmtINR(netAmount) : '—'}
          </Text>
          <Text style={s.totalSub}> {t('earnings.after_platform_fees')} </Text>
        </View>

        {/* Breakdown list */}
        <Text style={s.sectionLabel}> {t('earnings.breakdown')} </Text>
        {dayTxns.length === 0 ?
        <View style={s.emptyCard}>
            <Icon name="event-busy" size={32} color={colors.textMuted} />
            <Text style={s.emptyText}> {t('earnings.no_transactions_for_this_day')} </Text>
          </View> :

        <View style={s.breakdownCard}>
            {dayTxns.map((tx, i) => {
            const isDebit = tx.type === 'debit';
            const rowColor = isDebit ? colors.softWarning : colors.safetyGreen;
            const sign = isDebit ? '−' : '+';
            return (
              <View key={tx.id}>
                  <TouchableOpacity accessibilityRole="button" style={s.breakdownRow}
                onPress={() => navigation.navigate(Routes.TRANSACTION_DETAIL, { transactionId: tx.id })}
                activeOpacity={0.75}>
                    <View style={s.breakdownLeft}>
                      <Icon name={isDebit ? 'arrow-downward' : 'arrow-upward'}
                    size={16} color={rowColor} style={{ marginRight: 6 }} />
                      <Text style={s.breakdownLabel} numberOfLines={1}>{t(tx.title)}</Text>
                    </View>
                    <Text style={[s.breakdownAmount, { color: rowColor }]}>
                      {sign}{fmtINR(tx.amount)}
                    </Text>
                    <Icon name="chevron-right" size={14} color={colors.textMuted} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                  {i < dayTxns.length - 1 && <View style={s.divider} />}
                </View>);

          })}
          </View>
        }

        {/* View full transaction history link */}
        <TouchableOpacity accessibilityRole="button" style={s.linkRow}
        onPress={() => navigation.navigate(Routes.TRANSACTION_HISTORY)}
        activeOpacity={0.7}>
          <Icon name="receipt-long" size={16} color={colors.gold} />
          <Text style={s.linkText}> {t('earnings.view_full_transaction_history')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default DailyEarningsBreakdownScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: spacing.md },
  dateText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  totalCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)', alignItems: 'center', marginBottom: spacing.lg },
  totalLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  totalAmount: { fontFamily: fontFamily.playfairBold, fontSize: 40, lineHeight: 48 },
  totalSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  breakdownCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  breakdownLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  breakdownLabel: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, flex: 1 },
  breakdownAmount: { fontFamily: fontFamily.interBold, fontSize: 15 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  emptyCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.xl,
    alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md },
  linkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold, flex: 1 }
});