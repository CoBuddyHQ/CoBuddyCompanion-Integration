/**
 * AccountDeactivatedScreen (CPN-197)
 * Full-screen state — account is deactivated (no back button).
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function AccountDeactivatedScreen(): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <View style={s.body}>

        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="person-off" size={60} color={colors.textMuted} />
        </View>
        <Text style={s.title}> {t('account.account_deactivated')} </Text>
        <Text style={s.message}>
           {t('account.your_cobuddy_profile_is_no_longer_visible_to_customers_pending_payouts_will_be_processed_on_the_next_payout_cycle')} </Text>

        {/* Status checklist */}
        <View style={s.statusCard}>
          {[
          { icon: 'visibility-off', text: t('account.profile_hidden_from_all_customers') as string, done: true },
          { icon: 'event-busy', text: t('account.no_new_bookings_will_be_accepted') as string, done: true },
          { icon: 'payments', text: t('account.pending_payouts_queued_for_next_cycle') as string, done: false },
          { icon: 'chat-bubble-outline', text: t('account.chat_history_preserved_for_90_days') as string, done: true }].
          map((row) =>
          <View key={t(row.text)} style={s.statusRow}>
              <Icon name={row.icon as any} size={16} color={row.done ? colors.safetyGreen : colors.softWarning} />
              <Text style={s.statusText}>{t(row.text)}</Text>
              <Icon name={row.done ? 'check-circle' : 'hourglass-empty'} size={15}
            color={row.done ? colors.safetyGreen : colors.softWarning} />
            </View>
          )}
        </View>

        {/* Reactivation note */}
        <View style={s.noteCard}>
          <Icon name="info-outline" size={15} color={colors.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          <Text style={s.noteText}>
             {t('account.you_can_reactivate_your_account_anytime_by_logging_in')} {' '}
            <Text style={s.noteBold}> {t('account.within_30_days')} </Text> {t('account.after_that_your_account_will_be_permanently_deleted')} </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity accessibilityRole="button" style={s.exitBtn} activeOpacity={0.85}
        onPress={() => Alert.alert(t('account.redirecting_to_login'), t('account.you_will_be_taken_to_the_login_screen'))}>
          <Icon name="login" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.exitBtnText}> {t('account.exit_to_login')} </Text>
        </TouchableOpacity>

        <Text style={s.helpText}>
           {t('account.need_help_email')} {' '}
          <Text style={s.helpEmail}> {t('account.support_cobuddy_in')} </Text>
        </Text>
      </View>
    </SafeAreaView>);

}
export default AccountDeactivatedScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xxxxl, justifyContent: 'center' },
  heroCircle: { width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  statusCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.md },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 7 },
  statusText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1 },
  noteCard: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md, marginBottom: spacing.xl },
  noteText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  noteBold: { fontFamily: fontFamily.interBold, color: colors.gold },
  exitBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md, marginBottom: spacing.md },
  exitBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  helpText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  helpEmail: { fontFamily: fontFamily.interBold, color: colors.gold }
});