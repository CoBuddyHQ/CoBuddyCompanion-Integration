import i18next from "i18next"; /**
* PerformanceInsightsScreen (CPN-064)
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

type Period = 'week' | 'month';

const DATA: Record<Period, {views: number;delta: number;rows: {label: string;value: string;icon: string;}[];}> = {
  week: {
    views: 145,
    delta: 12,
    rows: [
    { label: i18next.t("content.dashboard.PerformanceInsightsScreen.booking_conversion_rate"), value: '15%', icon: 'trending-up' },
    { label: i18next.t("content.dashboard.PerformanceInsightsScreen.avg_response_time"), value: '5 min', icon: 'timer' },
    { label: i18next.t("content.dashboard.PerformanceInsightsScreen.profile_click_through"), value: '8%', icon: 'ads-click' }]

  },
  month: {
    views: 540,
    delta: 24,
    rows: [
    { label: i18next.t("content.dashboard.PerformanceInsightsScreen.booking_conversion_rate"), value: '18%', icon: 'trending-up' },
    { label: i18next.t("content.dashboard.PerformanceInsightsScreen.avg_response_time"), value: '4 min', icon: 'timer' },
    { label: i18next.t("content.dashboard.PerformanceInsightsScreen.profile_click_through"), value: '11%', icon: 'ads-click' }]

  }
};

export function PerformanceInsightsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState<Period>('week');
  const d = DATA[period];

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('dashboard.performance_insights')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Toggle */}
        <View style={s.toggleRow}>
          {(['week', 'month'] as Period[]).map((p) =>
          <TouchableOpacity accessibilityRole="button" key={p} style={[s.togglePill, period === p && s.togglePillActive]}
          onPress={() => setPeriod(p)} activeOpacity={0.75}>
              <Text style={[s.toggleText, period === p && s.toggleTextActive]}>
                {p === 'week' ? t("content.dashboard.PerformanceInsightsScreen.this_week") : t("content.dashboard.PerformanceInsightsScreen.this_month")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Big metric */}
        <View style={s.metricCard}>
          <View style={s.metricIconWrap}>
            <Icon name="visibility" size={22} color={colors.gold} />
          </View>
          <View style={s.metricCenter}>
            <Text style={s.metricLabel}> {t('dashboard.profile_views')} </Text>
            <Text style={s.metricValue}>{d.views.toLocaleString()}</Text>
          </View>
          <View style={s.deltaBadge}>
            <Icon name="arrow-upward" size={12} color={colors.safetyGreen} />
            <Text style={s.deltaText}>+{d.delta}{t("content.dashboard.PerformanceInsightsScreen.text")}</Text>
          </View>
        </View>

        {/* Info rows */}
        <Text style={s.sectionLabel}> {t('dashboard.key_metrics')} </Text>
        <View style={s.card}>
          {d.rows.map((row, i) =>
          <View key={t(row.label)}>
              {i > 0 && <View style={s.sep} />}
              <View style={s.infoRow}>
                <View style={s.infoIconWrap}>
                  <Icon name={row.icon as any} size={16} color={colors.gold} />
                </View>
                <Text style={s.infoLabel}>{t(row.label)}</Text>
                <Text style={s.infoValue}>{row.value}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer note */}
        <View style={s.footerNote}>
          <Icon name="info-outline" size={13} color={colors.textMuted} style={{ flexShrink: 0 }} />
          <Text style={s.footerText}>
             {t('dashboard.high_conversion_rates_lead_to_more_featured_placements')} </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default PerformanceInsightsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  toggleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  togglePill: { flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: radius.xl, backgroundColor: colors.cardSurface,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },
  togglePillActive: { backgroundColor: 'rgba(214,168,79,0.10)', borderColor: colors.gold },
  toggleText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  toggleTextActive: { color: colors.gold },
  metricCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: '#1A2D45', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    padding: spacing.lg, marginBottom: spacing.lg },
  metricIconWrap: { width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(214,168,79,0.12)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  metricCenter: { flex: 1 },
  metricLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 3 },
  metricValue: { fontFamily: fontFamily.playfairBold, fontSize: 36, color: colors.gold, lineHeight: 40 },
  deltaBadge: { flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.28)',
    paddingHorizontal: 8, paddingVertical: 4 },
  deltaText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.safetyGreen },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  infoIconWrap: { width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoLabel: { flex: 1, fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary },
  infoValue: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  footerNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: 'rgba(214,168,79,0.06)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.15)', padding: spacing.md },
  footerText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    flex: 1, lineHeight: 18 }
});