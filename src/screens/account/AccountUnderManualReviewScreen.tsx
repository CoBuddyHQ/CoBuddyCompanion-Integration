/**
 * AccountUnderManualReviewScreen (CPN-198)
 * Shown when the Trust & Safety team is reviewing profile updates.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function AccountUnderManualReviewScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('account.profile_review')} showBack={false} />

      <View style={s.body}>
        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="hourglass-empty" size={60} color={colors.softWarning} />
        </View>
        <Text style={s.title}> {t('account.profile_under_review')} </Text>
        <Text style={s.message}>
           {t('account.our_trust_safety_team_is_verifying_your_recent_profile_updates_this_usually_takes')} {' '}
          <Text style={s.bold}> {t('account.24_48_hours')} </Text>.
        </Text>

        {/* Progress steps */}
        <View style={s.stepsCard}>
          {[
          { icon: 'check-circle', label: t('account.profile_update_submitted') as string, done: true },
          { icon: 'pending', label: t('account.team_review_in_progress') as string, done: false, active: true },
          { icon: 'radio-button-unchecked', label: t('account.verification_complete') as string, done: false }].
          map((step, i, arr) =>
          <View key={t(step.label)} style={s.stepWrap}>
              <View style={s.stepLeft}>
                <Icon
                name={step.icon as any}
                size={20}
                color={step.done ? colors.safetyGreen : step.active ? colors.softWarning : colors.textMuted} />
              
                {i < arr.length - 1 &&
              <View style={[s.stepLine, { backgroundColor: step.done ? colors.safetyGreen : 'rgba(255,255,255,0.08)' }]} />
              }
              </View>
              <Text style={[s.stepLabel, step.done && s.stepDone, step.active && s.stepActive]}>
                {t(step.label)}
              </Text>
            </View>
          )}
        </View>

        {/* Info strip */}
        <View style={s.infoStrip}>
          <Icon name="info-outline" size={14} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.infoText}>
             {t('account.your_profile_remains_active_and_visible_to_customers_until_the_review_is_complete')} </Text>
        </View>

        {/* CTAs */}
        <TouchableOpacity style={s.dashBtn} activeOpacity={0.85}
        onPress={() => (navigation as any).navigate(Routes.HOME_DASHBOARD  )}>
          <Icon name="dashboard" size={17} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.dashBtnText}> {t('account.go_to_dashboard')} </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.supportBtn} activeOpacity={0.75}
        onPress={() => navigation.navigate(Routes.CREATE_SUPPORT_TICKET)}>
          <Icon name="headset-mic" size={16} color={colors.gold} style={{ marginRight: 8 }} />
          <Text style={s.supportBtnText}> {t('account.contact_support')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default AccountUnderManualReviewScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  heroCircle: { width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(245,166,35,0.10)', borderWidth: 1.5, borderColor: 'rgba(245,166,35,0.30)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  bold: { fontFamily: fontFamily.interBold, color: colors.softWarning },
  stepsCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.md },
  stepWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
  stepLeft: { alignItems: 'center', width: 20 },
  stepLine: { width: 2, flex: 1, minHeight: 18, marginTop: 4, borderRadius: 1 },
  stepLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1, paddingTop: 2 },
  stepDone: { color: colors.safetyGreen, fontFamily: fontFamily.interSemiBold },
  stepActive: { color: colors.softWarning, fontFamily: fontFamily.interSemiBold },
  infoStrip: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginBottom: spacing.xl },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  dashBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md, marginBottom: spacing.sm },
  dashBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  supportBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.06)' },
  supportBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold }
});