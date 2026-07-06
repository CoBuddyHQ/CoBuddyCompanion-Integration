/**
 * CompletedPayoutsScreen (CPN-104)
 * Shows past withdrawals from earningsStore.recentTransactions (debit type).
 */
import React from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useEarningsStore, Transaction } from '../../store/slices/earningsStore';
import { useTranslation } from "react-i18next";

export function CompletedPayoutsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // ── Store data ──────────────────────────────────────────────────────────────
  const lifetimeEarnings = useEarningsStore((s) => s.lifetimeEarnings);
  const recentTransactions = useEarningsStore((s) => s.recentTransactions);
  const lifetimeStr = `₹${lifetimeEarnings.toLocaleString('en-IN')}`;

  // Show only debit (withdrawal) transactions as "completed payouts"
  const payouts = recentTransactions.filter((tx) => tx.type === 'debit');

  const renderItem = ({ item }: {item: Transaction;}) =>
  <View style={s.row}>
      <View style={s.rowIcon}>
        <Icon name="check-circle" size={20} color={colors.safetyGreen} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowLabel}>{t(item.title)}</Text>
        <Text style={s.rowDate}>{item.date}</Text>
      </View>
      <Text style={s.rowAmount}>{t("content.earnings.CompletedPayoutsScreen.text")}{Math.abs(item.amount).toLocaleString('en-IN')}</Text>
    </View>;


  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.payout_history')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <View style={s.lifetimeCard}>
        <Icon name="account-balance" size={18} color={colors.textMuted} />
        <Text style={s.lifetimeLabel}> {t('earnings.lifetime_paid_out')} </Text>
        <Text style={s.lifetimeAmount}>{lifetimeStr}</Text>
      </View>
      <FlatList
        data={payouts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <View style={s.emptyWrap}>
            <Icon name="account-balance-wallet" size={40} color={colors.textMuted} />
            <Text style={s.emptyText}> {t('earnings.no_completed_payouts_yet')} </Text>
          </View>
        } />
      
    </SafeAreaView>);

}
export default CompletedPayoutsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  lifetimeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, marginHorizontal: spacing.lg, marginVertical: spacing.md,
    borderRadius: radius.xl, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  lifetimeLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1 },
  lifetimeAmount: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary },
  list: { paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(109,214,165,0.10)',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md, flexShrink: 0 },
  rowLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  rowDate: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  rowAmount: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.safetyGreen, marginLeft: spacing.md },
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted }
});