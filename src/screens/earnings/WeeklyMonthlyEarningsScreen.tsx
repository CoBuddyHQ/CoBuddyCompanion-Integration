/**
 * WeeklyMonthlyEarningsScreen (CPN-102)
 */
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {useEarningsStore} from '../../store/slices/earningsStore';
import i18next from "i18next";
import { useTranslation } from "react-i18next";

// Mock bar heights as percentages (0–100)
const WEEKLY_BARS = [
  {day: 'M', pct: 60},
  {day: 'T', pct: 80},
  {day: 'W', pct: 40},
  {day: 'T', pct: 90},
  {day: 'F', pct: 70},
  {day: 'S', pct: 30},
  {day: 'S', pct: 20},
];
const MONTHLY_BARS = [
  {day: 'W1', pct: 55},
  {day: 'W2', pct: 75},
  {day: 'W3', pct: 85},
  {day: 'W4', pct: 65},
];

const BAR_MAX_HEIGHT = 120;

export function WeeklyMonthlyEarningsScreen(): React.JSX.Element {
    const { t } = useTranslation();
  const navigation = useNavigation<any>();  
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');

  const availableBalance = useEarningsStore(s => s.availableBalance);
  const lifetimeEarnings = useEarningsStore(s => s.lifetimeEarnings);
  const totalSessions    = useEarningsStore(s => s.totalSessions);
  const activeHours      = useEarningsStore(s => s.activeHours);
  const tipsEarned       = useEarningsStore(s => s.tipsEarned);

  // Weekly = available balance this cycle; Monthly = lifetime earnings for context
  const weeklyTotal  = `₹${availableBalance.toLocaleString('en-IN')}`;
  const monthlyTotal = `₹${lifetimeEarnings.toLocaleString('en-IN')}`;

  const displayTotal = tab === 'weekly' ? weeklyTotal : monthlyTotal;
  const bars = tab === 'weekly' ? WEEKLY_BARS : MONTHLY_BARS;
  
  // Weekly derived data
  const sessionsVal = tab === 'weekly' ? String(Math.ceil(totalSessions / 4)) : String(totalSessions);
  const hoursVal    = tab === 'weekly' ? `${Math.ceil(activeHours / 4)}h` : `${activeHours}h`;
  const tipsVal     = tab === 'weekly' ? `₹${Math.ceil(tipsEarned / 4)}` : `₹${tipsEarned}`;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.earnings_report')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Toggle tabs */}
        <View style={s.tabRow}>
          {(['weekly', 'monthly'] as const).map((tabItem) =>
          <TouchableOpacity accessibilityRole="button" key={tabItem} style={[s.tab, tab === tabItem && s.tabActive]}
          onPress={() => setTab(tabItem)} activeOpacity={0.75}>
              <Text style={[s.tabText, tab === tabItem && s.tabTextActive]}>
                {tabItem === 'weekly' ? i18next.t("content.earnings.WeeklyMonthlyEarningsScreen.weekly") : i18next.t("content.earnings.WeeklyMonthlyEarningsScreen.monthly")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bar chart */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>{tab === 'weekly' ? 'This Week' : 'This Month'}</Text>
          <View style={s.barsRow}>
            {bars.map((bar, i) => (
              <View key={i} style={s.barCol}>
                <View style={s.barTrack}>
                  <View style={[s.barFill, {height: (bar.pct / 100) * BAR_MAX_HEIGHT}]} />
                </View>
                <Text style={s.barLabel}>{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total card */}
        <View style={s.totalCard}>
          <Icon name="account-balance-wallet" size={20} color={colors.gold} />
          <Text style={s.totalLabel}>{tab === 'weekly' ? 'This Week' : 'This Month'}</Text>
          <Text style={s.totalAmount}>{displayTotal}</Text>
        </View>

        {/* Summary rows */}
        <Text style={s.sectionLabel}> {t('earnings.summary')} </Text>
        <View style={s.summaryCard}>
          {[
            {icon: 'event',              label: 'Total Sessions', value: sessionsVal},
            {icon: 'access-time',        label: 'Active Hours',   value: hoursVal},
            {icon: 'volunteer-activism', label: 'Tips Earned',    value: tipsVal},
          ].map((row, i, arr) => (
            <View key={row.label}>
              <View style={s.summaryRow}>
                <View style={s.summaryLeft}>
                  <Icon name={row.icon as any} size={18} color={colors.textMuted} />
                  <Text style={s.summaryLabel}>{row.label}</Text>
                </View>
                <Text style={s.summaryValue}>{row.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default WeeklyMonthlyEarningsScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  tabRow: {flexDirection: 'row', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: 4, marginBottom: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'},
  tab: {flex: 1, paddingVertical: 10, borderRadius: radius.lg, alignItems: 'center'},
  tabActive: {backgroundColor: colors.gold},
  tabText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted},
  tabTextActive: {color: colors.rootBg},
  chartCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md},
  chartTitle: {fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted,
    marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 0.6},
  barsRow: {flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: BAR_MAX_HEIGHT + 24},
  barCol: {flex: 1, alignItems: 'center', gap: 6},
  barTrack: {flex: 1, width: '100%', justifyContent: 'flex-end'},
  barFill: {backgroundColor: colors.gold, borderRadius: 4, width: '100%', minHeight: 4},
  barLabel: {fontFamily: fontFamily.interBold, fontSize: 10, color: colors.textMuted},
  totalCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)', padding: spacing.lg, marginBottom: spacing.md},
  totalLabel: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1},
  totalAmount: {fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.gold},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  summaryCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'},
  summaryRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md},
  summaryLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  summaryLabel: {fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary},
  summaryValue: {fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary},
  divider: {height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md},
});
