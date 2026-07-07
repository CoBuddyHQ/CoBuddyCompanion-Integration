/**
 * PendingEarningsScreen (CPN-103)
 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useEarningsStore, Transaction } from '../../store/slices/earningsStore';
import { useTranslation } from "react-i18next";

// Nested component extraction: ItemSeparator was defined inside PendingEarningsScreen render.
// It uses no parent state/props (only global spacing theme). Extracted to module level.
const ItemSeparator = () => <View style={{ height: spacing.sm }} />;

export function PendingEarningsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // ── Store data ──────────────────────────────────────────────────────────────
  const pendingClearance = useEarningsStore((s) => s.pendingClearance);
  const recentTransactions = useEarningsStore((s) => s.recentTransactions);

  // Only show transactions still in pending state
  const pendingItems = recentTransactions.filter((tx) => tx.type === 'pending');
  const totalPendingStr = `₹${pendingClearance.toLocaleString('en-IN')}`;

  // ── Row renderer ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }: {item: Transaction;}) =>
  <View style={s.row}>
      <Icon name="schedule" size={20} color={colors.softWarning} style={{ flexShrink: 0 }} />
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={s.rowSession}>{t(item.title)}</Text>
        <Text style={s.rowDate}>{item.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={s.rowAmount}>{t("content.earnings.PendingEarningsScreen.text")}{Math.abs(item.amount).toLocaleString('en-IN')}</Text>
        <View style={s.pill}><Text style={s.pillText}> {t('earnings.clearing_soon')} </Text></View>
      </View>
    </View>;


  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.pending_earnings')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <View style={s.banner}>
        <Icon name="info-outline" size={16} color={colors.softWarning} style={{ flexShrink: 0 }} />
        <Text style={s.bannerText}> {t('earnings.earnings_from_completed_sessions_take_24_48_hours_to_clear_security_checks')} </Text>
      </View>
      <View style={s.hero}>
        <Text style={s.heroLabel}> {t('earnings.total_pending')} </Text>
        <Text style={s.heroAmount}>{totalPendingStr}</Text>
        <Text style={s.heroSub}>{pendingItems.length}  {t('earnings.session')} {pendingItems.length !== 1 ? 's' : ''}  {t('earnings.clearing')} </Text>
      </View>
      <FlatList
        data={pendingItems}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <View style={s.emptyWrap}>
            <Icon name="check-circle" size={40} color={colors.safetyGreen} />
            <Text style={s.emptyText}> {t('earnings.no_pending_earnings_right_now')} </Text>
          </View>
        }
        ListFooterComponent={
        <TouchableOpacity accessibilityRole="button" style={s.support}
        onPress={() => navigation.navigate(Routes.SUPPORT_CENTER)} activeOpacity={0.7}>
            <Icon name="headset-mic" size={16} color={colors.textMuted} />
            <Text style={s.supportText}> {t('earnings.issue_with_pending_amount_contact_support')} </Text>
          </TouchableOpacity>
        } />
      
    </SafeAreaView>);

}
export default PendingEarningsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  banner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(255,171,64,0.07)', borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,171,64,0.18)', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  bannerText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.softWarning, flex: 1, lineHeight: 19 },
  hero: { alignItems: 'center', paddingVertical: spacing.xl,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  heroLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  heroAmount: { fontFamily: fontFamily.playfairBold, fontSize: 44, color: colors.gold, lineHeight: 52 },
  heroSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  rowSession: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  rowDate: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  rowAmount: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.softWarning },
  pill: { backgroundColor: 'rgba(255,171,64,0.12)', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.softWarning },
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted },
  support: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'center', paddingVertical: spacing.lg },
  supportText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted }
});