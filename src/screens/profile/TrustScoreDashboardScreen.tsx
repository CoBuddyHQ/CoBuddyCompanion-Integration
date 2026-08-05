/**
 * TrustScoreDashboardScreen (CPN-158)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTrustStore } from '../../store/slices/trustStore';
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";

export function TrustScoreDashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { score, responseRate, fetchTrustScore } = useTrustStore((s) => s);
  const profile = useProfileStore((s) => s.profile);

  useFocusEffect(
    React.useCallback(() => {
      fetchTrustScore();
      useProfileStore.getState().fetchProfile();
    }, [fetchTrustScore])
  );

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('profile.trust_score')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          {/* Outer glow ring */}
          <View style={s.ringOuter}>
            <View style={s.ringInner}>
              <View style={s.scoreCircle}>
                <Text style={s.scoreNum}>{score}</Text>
                <Text style={s.scoreDenom}>/100</Text>
              </View>
            </View>
          </View>

          <View style={s.statusBadge}>
            <Icon name="verified-user" size={16} color={colors.safetyGreen} />
            <Text style={s.statusText}> {t('profile.excellent_trust_status')} </Text>
          </View>

          <Text style={s.heroSub}> {t('profile.your_score_is_in_the_top')} {score >= 95 ? '10' : score >= 85 ? '25' : '50'} {t('profile.of_all_companions')} </Text>
        </View>

        {/* Stat pills */}
        <View style={s.statsRow}>
          {[
          { label: t("content.profile.TrustScoreDashboardScreen.sessions"), value: String(profile?.totalSessions ?? 0) },
          { label: t("content.profile.TrustScoreDashboardScreen.reviews"), value: profile?.rating ? `${profile.rating.toFixed(1)}★` : '—' },
          { label: t("content.profile.TrustScoreDashboardScreen.response"), value: `${responseRate}%` }].
          map((st, i) =>
          <React.Fragment key={t(st.label)}>
              {i > 0 && <View style={s.statsDivider} />}
              <View style={s.statCell}>
                <Text style={s.statValue}>{st.value}</Text>
                <Text style={s.statLabel}>{t(st.label)}</Text>
              </View>
            </React.Fragment>
          )}
        </View>

        {/* Navigation cards */}
        <Text style={s.sectionLabel}> {t('profile.explore')} </Text>
        <TouchableOpacity accessibilityRole="button" style={s.navCard}
        onPress={() => navigation.navigate(Routes.TRUST_SCORE_SUMMARY)} activeOpacity={0.8}>
          <View style={s.navCardIcon}>
            <Icon name="bar-chart" size={24} color={colors.gold} />
          </View>
          <View style={s.navCardText}>
            <Text style={s.navCardTitle}> {t('profile.view_score_summary')} </Text>
            <Text style={s.navCardSub}> {t('profile.see_how_each_factor_contributes_to_your_score')} </Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity accessibilityRole="button" style={s.navCard}
        onPress={() => navigation.navigate(Routes.TRUST_SCORE_IMPROVEMENT_TASKS)} activeOpacity={0.8}>
          <View style={[s.navCardIcon, { backgroundColor: 'rgba(109,214,165,0.10)', borderColor: 'rgba(109,214,165,0.25)' }]}>
            <Icon name="trending-up" size={24} color={colors.safetyGreen} />
          </View>
          <View style={s.navCardText}>
            <Text style={s.navCardTitle}> {t('profile.how_to_improve_your_score')} </Text>
            <Text style={s.navCardSub}> {t('profile.actionable_tasks_to_reach_100_points')} </Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default TrustScoreDashboardScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  hero: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md },
  ringOuter: { width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(214,168,79,0.06)',
    borderWidth: 2, borderColor: 'rgba(214,168,79,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  ringInner: { width: 148, height: 148, borderRadius: 74,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 2, borderColor: 'rgba(214,168,79,0.28)',
    alignItems: 'center', justifyContent: 'center' },
  scoreCircle: { width: 116, height: 116, borderRadius: 58,
    backgroundColor: '#1A2D45',
    borderWidth: 3, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontFamily: fontFamily.playfairBold, fontSize: 42, color: colors.gold, lineHeight: 46 },
  scoreDenom: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.28)',
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: spacing.sm },
  statusText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.safetyGreen },
  heroSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.lg },
  statsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: spacing.sm },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  navCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm },
  navCardIcon: { width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  navCardText: { flex: 1 },
  navCardTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginBottom: 2 },
  navCardSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted }
});