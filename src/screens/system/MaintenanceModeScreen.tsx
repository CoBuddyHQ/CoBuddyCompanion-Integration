/**
 * MaintenanceModeScreen (CPN-205)
 * Full-screen takeover — shown during scheduled downtime.
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

export function MaintenanceModeScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <View style={s.body}>

        {/* Hero */}
        <View style={s.heroCircle}>
          <Icon name="engineering" size={64} color={colors.gold} />
        </View>
        <Text style={s.title}> {t('system.we_ll_be_right_back')} </Text>
        <Text style={s.message}>
           {t('system.cobuddy_is_currently_undergoing_scheduled_maintenance_to_improve_your_experience_we_apologise_for_the_inconvenience')} </Text>

        {/* ETA card */}
        <View style={s.etaCard}>
          <View style={s.etaRow}>
            <Icon name="schedule" size={16} color={colors.gold} />
            <View style={s.etaTextWrap}>
              <Text style={s.etaLabel}> {t('system.estimated_completion')} </Text>
              <Text style={s.etaValue}> {t('system.approximately_2_hours')} </Text>
            </View>
          </View>
          <View style={s.etaSep} />
          <View style={s.etaRow}>
            <Icon name="calendar-today" size={16} color={colors.textMuted} />
            <View style={s.etaTextWrap}>
              <Text style={s.etaLabel}> {t('system.maintenance_window')} </Text>
              <Text style={s.etaValue}> {t('system.01_jul_2026_02_00_04_00_am_ist')} </Text>
            </View>
          </View>
        </View>

        {/* What's being fixed */}
        <View style={s.workCard}>
          <Text style={s.workTitle}> {t('system.what_we_re_working_on')} </Text>
          {[
          { icon: 'speed', text: 'Performance improvements to booking flow' },
          { icon: 'security', text: 'Trust & Safety infrastructure upgrades' },
          { icon: 'payments', text: 'Payout engine reliability enhancements' }].
          map((row) =>
          <View key={t(row.text)} style={s.workRow}>
              <Icon name={row.icon as any} size={14} color={colors.safetyGreen} />
              <Text style={s.workText}>{t(row.text)}</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity accessibilityRole="button" style={s.statusBtn} activeOpacity={0.8}
        onPress={() => Alert.alert(t("alerts.opening_browser"), t("alerts.redirecting_to_status_cobuddy_in"))}>
          <Icon name="open-in-browser" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
          <Text style={s.statusBtnText}> {t('system.check_status_page')} </Text>
        </TouchableOpacity>

        <Text style={s.footerNote}> {t('system.follow_cobuddyapp_for_live_updates')} </Text>
      </View>
    </SafeAreaView>);

}
export default MaintenanceModeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  heroCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.28)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  message: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  etaCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.md },
  etaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  etaTextWrap: { flex: 1 },
  etaLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginBottom: 2 },
  etaValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  etaSep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: spacing.md },
  workCard: { width: '100%', backgroundColor: 'rgba(109,214,165,0.05)', borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(109,214,165,0.16)', padding: spacing.lg, marginBottom: spacing.xl },
  workTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.safetyGreen, marginBottom: spacing.md },
  workRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: 4 },
  workText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  statusBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: spacing.md },
  statusBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted },
  footerNote: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, textAlign: 'center' }
});