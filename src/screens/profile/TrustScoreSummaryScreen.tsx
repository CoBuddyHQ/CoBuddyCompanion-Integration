/**
 * TrustScoreSummaryScreen (CPN-159)
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTrustStore } from '../../store/slices/trustStore';
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";

export function TrustScoreSummaryScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { score, cancellationRate } = useTrustStore((s) => s);
  const profile = useProfileStore((s) => s.profile);

  // Derive actual metrics
  const has50Sessions = (profile?.totalSessions ?? 0) >= 50;
  const isTopRated = (profile?.rating ?? 0) >= 4.8;
  const hasCancellations = cancellationRate > 0;

  const BREAKDOWN = [
    { label: "content.profile.TrustScoreSummaryScreen.breakdown.0.label", pts: "+50", positive: true, icon: "verified-user" },
    { label: "content.profile.TrustScoreSummaryScreen.breakdown.1.label", pts: "+20", positive: true, icon: "check-circle" },
    { label: "content.profile.TrustScoreSummaryScreen.breakdown.2.label", pts: "+15", positive: true, icon: "star" },
    { label: "content.profile.TrustScoreSummaryScreen.breakdown.3.label", pts: "-5", positive: false, icon: "cancel" }
  ] as any[];






  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('profile.score_summary')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Total hero */}
        <View style={s.heroCard}>
          <Text style={s.heroLabel}> {t('profile.total_trust_score')} </Text>
          <Text style={s.heroScore}>{score}</Text>
          <Text style={s.heroMax}> {t('profile.out_of_100_points')} </Text>
          {/* Progress bar */}
          <View style={s.barTrack}>
            <View style={[s.barFill, { width: `${score}%` as any }]} />
          </View>
        </View>

        {/* Breakdown */}
        <Text style={s.sectionLabel}> {t('profile.score_breakdown')} </Text>
        <View style={s.card}>
          {BREAKDOWN.map((item, i) =>
          <View key={t(item.label)}>
              {i > 0 && <View style={s.sep} />}
              <View style={s.row}>
                <View style={[s.iconWrap, item.positive ? s.iconWrapPos : s.iconWrapNeg]}>
                  <Icon name={item.icon as any} size={18}
                color={item.positive ? colors.safetyGreen : '#E74C3C'} />
                </View>
                <Text style={s.rowLabel}>{t(item.label)}</Text>
                <Text style={[s.pts, item.positive ? s.ptsPos : s.ptsNeg]}>
                  {item.pts}  {t('profile.pts')} </Text>
              </View>
            </View>
          )}
        </View>

        {/* Net */}
        <View style={s.netRow}>
          <Text style={s.netLabel}> {t('profile.net_score')} </Text>
          <Text style={s.netValue}>{score}  {t('profile.pts')} </Text>
        </View>

        {/* Footer note */}
        <View style={s.footerNote}>
          <Icon name="schedule" size={13} color={colors.textMuted} />
          <Text style={s.footerText}> {t('profile.trust_scores_are_updated_every_monday')} </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default TrustScoreSummaryScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  heroCard: { backgroundColor: '#1A2D45', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg, gap: 4 },
  heroLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  heroScore: { fontFamily: fontFamily.playfairBold, fontSize: 64, color: colors.gold, lineHeight: 72 },
  heroMax: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  barTrack: { width: '100%', height: 8, backgroundColor: colors.elevatedSurface,
    borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 4 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.sm },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconWrapPos: { backgroundColor: 'rgba(109,214,165,0.10)', borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)' },
  iconWrapNeg: { backgroundColor: 'rgba(231,76,60,0.10)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)' },
  rowLabel: { flex: 1, fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary },
  pts: { fontFamily: fontFamily.interBold, fontSize: 14 },
  ptsPos: { color: colors.safetyGreen },
  ptsNeg: { color: '#E74C3C' },
  netRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    padding: spacing.md, marginBottom: spacing.md },
  netLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  netValue: { fontFamily: fontFamily.playfairBold, fontSize: 20, color: colors.gold },
  footerNote: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  footerText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted }
});