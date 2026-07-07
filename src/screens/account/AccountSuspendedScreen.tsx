/**
 * AccountSuspendedScreen (CPN-196)
 * Full-screen takeover — shown when account is suspended due to violations.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function AccountSuspendedScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="block" size={64} color="#D96C6C" />
        </View>
        <Text style={s.title}> {t('account.account_suspended')} </Text>
        <Text style={s.message}>
           {t('account.your_account_has_been_temporarily_suspended_due_to_multiple_policy_violations_you_cannot_accept_new_bookings_during_this_period')} </Text>

        {/* Reason card */}
        <View style={s.reasonCard}>
          <View style={s.reasonHeader}>
            <Icon name="report-problem" size={16} color={colors.softWarning} />
            <Text style={s.reasonHeaderText}> {t('account.violation_reason')} </Text>
          </View>
          <Text style={s.reasonBody}>
             {t('account.sharing_personal_contact_information_phone_number_social_handle_with_a_customer_during_a_session_violates_cobuddy_community_guidelines_4_2')} </Text>
        </View>

        {/* Timeline */}
        <View style={s.timelineCard}>
          {[
          { icon: 'gavel', label: t('account.suspension_issued') as string, value: '28 Jun 2026' },
          { icon: 'event', label: t('account.review_deadline') as string, value: '12 Jul 2026' },
          { icon: 'hourglass-empty', label: t('account.auto_lift_if_no_action') as string, value: '28 Jul 2026' }].
          map((row, i, arr) =>
          <View key={t(row.label)}>
              <View style={s.timelineRow}>
                <Icon name={row.icon as any} size={15} color={colors.textMuted} />
                <Text style={s.timelineLabel}>{t(row.label)}</Text>
                <Text style={s.timelineValue}>{row.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.sep} />}
            </View>
          )}
        </View>

        {/* CTAs */}
        <TouchableOpacity accessibilityRole="button" style={s.appealBtn} activeOpacity={0.85}
        onPress={() => navigation.navigate(Routes.ACCOUNT_REACTIVATION_REQUEST)}>
          <Icon name="send" size={17} color="#D96C6C" style={{ marginRight: 8 }} />
          <Text style={s.appealBtnText}> {t('account.submit_appeal')} </Text>
        </TouchableOpacity>

        <TouchableOpacity accessibilityRole="button" style={s.logoutBtn} activeOpacity={0.7}
        onPress={() => Alert.alert(t('account.logging_out'), t('account.you_will_be_returned_to_the_login_screen'))}>
          <Text style={s.logoutBtnText}> {t('account.log_out')} </Text>
        </TouchableOpacity>

        <Text style={s.footerNote}>
           {t('account.questions_email')} {' '}
          <Text style={s.footerEmail}> {t('account.trust_cobuddy_in')} </Text>
        </Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default AccountSuspendedScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xxxxl },
  heroCircle: { width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(217,108,108,0.10)', borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.30)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  reasonCard: { width: '100%', backgroundColor: 'rgba(217,108,108,0.06)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(217,108,108,0.22)', padding: spacing.lg, marginBottom: spacing.md },
  reasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm },
  reasonHeaderText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.softWarning },
  reasonBody: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  timelineCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.xl },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  timelineLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1 },
  timelineValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 2 },
  appealBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.50)',
    backgroundColor: 'rgba(217,108,108,0.08)', marginBottom: spacing.sm },
  appealBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#D96C6C' },
  logoutBtn: { width: '100%', height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  logoutBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted },
  footerNote: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  footerEmail: { fontFamily: fontFamily.interBold, color: colors.gold }
});