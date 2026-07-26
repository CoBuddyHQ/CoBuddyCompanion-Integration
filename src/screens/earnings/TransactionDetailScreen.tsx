/**
 * TransactionDetailScreen (CPN-105)
 */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useEarningsStore } from '../../store/slices/earningsStore';
import { useTranslation } from "react-i18next";

export function TransactionDetailScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transactionId = 'TXN-001' } = route.params ?? {};
  const fetchTransactions = useEarningsStore((s) => s.fetchTransactions);

  // Look up the real transaction from the store
  const tx = useEarningsStore((s) =>
    s.recentTransactions.find((t) => t.transactionId === transactionId) ?? null
  );

  useEffect(() => {
    if (!tx && transactionId) {
      fetchTransactions();
    }
  }, [tx, transactionId, fetchTransactions]);

  const isDebit = tx ? tx.amount < 0 : false;
  const isPositive = !isDebit;
  const isPenalty = tx?.type === 'cancellation_penalty' || (tx?.description?.toLowerCase().includes('penalty') ?? false);
  const amountColor = isPositive ? colors.safetyGreen : '#E74C3C';
  const amountText = tx ?
  `${isDebit ? '−' : '+'}₹${Math.abs(tx.amount).toLocaleString('en-IN')}` :
  '—';

  const rows = [{ label: "content.earnings.TransactionDetailScreen.rows.0.label" }, { label: "content.earnings.TransactionDetailScreen.rows.1.label" }, { label: "content.earnings.TransactionDetailScreen.rows.2.label" }, { label: "content.earnings.TransactionDetailScreen.rows.3.label" }] as any[];






  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.transaction_info')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero amount */}
        <View style={s.amountWrap}>
          <Text style={[s.amount, { color: amountColor }]}>{amountText}</Text>
          <View style={s.statusBadge}>
            <Icon name="check-circle" size={13} color={colors.safetyGreen} />
            <Text style={s.statusText}> {t('earnings.completed')} </Text>
          </View>
        </View>

        {/* Info table */}
        <View style={s.tableCard}>
          {rows.map((row, i) =>
          <View key={t(row.label)}>
              <View style={s.tableRow}>
                <Text style={s.tableKey}>{t(row.label)}</Text>
                <Text style={s.tableVal} numberOfLines={1}>{row.value}</Text>
              </View>
              {i < rows.length - 1 && <View style={s.divider} />}
            </View>
          )}
        </View>

        {/* Penalty link — only shown when this transaction has an associated penalty */}
        {isPenalty &&
        <TouchableOpacity accessibilityRole="button" style={s.penaltyLink}
        onPress={() => navigation.navigate(Routes.REFUND_PENALTY_EXPLANATION)}
        activeOpacity={0.75}>
            <Icon name="gavel" size={16} color={'#E74C3C'} />
            <Text style={s.penaltyLinkText}> {t('earnings.view_penalty_details')} </Text>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        }

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnGold}
        onPress={() => navigation.navigate(Routes.TAX_INVOICE_DETAILS, { invoiceId: transactionId })}
        activeOpacity={0.85}>
          <Icon name="download" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnGoldText}> {t('earnings.download_tax_invoice')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default TransactionDetailScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  amountWrap: { alignItems: 'center', paddingVertical: spacing.xl,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.lg },
  amount: { fontFamily: fontFamily.playfairBold, fontSize: 48, lineHeight: 56 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)',
    paddingHorizontal: 12, paddingVertical: 5, marginTop: spacing.md },
  statusText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.safetyGreen },
  tableCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  tableKey: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  tableVal: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary, maxWidth: '55%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnGold: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnGoldText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  penaltyLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(231,76,60,0.06)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.22)', padding: spacing.md, marginBottom: spacing.sm },
  penaltyLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: '#E74C3C', flex: 1 }
});