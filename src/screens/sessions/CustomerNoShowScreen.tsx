/**
 * CustomerNoShowScreen (CPN-117)
 * Shown when the customer hasn't arrived after the scheduled start time.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function CustomerNoShowScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const markNoShow = useSessionStore((s) => s.markNoShow);

  const handleReportNoShow = () => {
    Alert.alert(t("alerts.confirm_no_show"), t("alerts.you_will_receive_full_session_payment_as"),


    [
    { text: t("alerts.cancel"), style: 'cancel' },
    {
      text: t("alerts.report_no_show"), style: 'destructive',
      onPress: async () => {
        if (sessionId) {
          try {
            await markNoShow(sessionId);
            navigation.replace(Routes.SESSION_COMPLETE, { sessionId });
          } catch (e) {
            console.error(e);
          }
        }
      }
    }]

    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.customer_no_show')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Status card */}
        <View style={s.statusCard}>
          <View style={s.statusIconRow}>
            <View style={s.statusIconWrap}>
              <Icon name="person-off" size={24} color={colors.softWarning} />
            </View>
            <Text style={s.statusTitle}> {t('sessions.customer_hasn_t_arrived_1')} </Text>
          </View>
          <View style={s.statusInfoGrid}>
            <View style={s.statusInfoItem}>
              <Text style={s.statusInfoLabel}> {t('sessions.scheduled_start')} </Text>
              <Text style={s.statusInfoValue}> {t('sessions.2_30_pm')} </Text>
            </View>
            <View style={s.statusInfoDivider} />
            <View style={s.statusInfoItem}>
              <Text style={s.statusInfoLabel}> {t('sessions.current_time')} </Text>
              <Text style={s.statusInfoValue}> {t('sessions.3_00_pm')} </Text>
            </View>
            <View style={s.statusInfoDivider} />
            <View style={s.statusInfoItem}>
              <Text style={s.statusInfoLabel}> {t('sessions.waiting_time')} </Text>
              <Text style={[s.statusInfoValue, { color: colors.softWarning }]}> {t('sessions.30_minutes')} </Text>
            </View>
          </View>
        </View>

        {/* Policy info */}
        <View style={s.policyCard}>
          <Icon name="shield" size={16} color={colors.safetyGreen} style={{ flexShrink: 0 }} />
          <Text style={s.policyText}>
             {t('sessions.per_cobuddy_policy_you_are_entitled_to')} {' '}
            <Text style={s.policyBold}> {t('sessions.full_session_payment')} </Text>
            {' '} {t('sessions.after_15_minutes_of_waiting')} </Text>
        </View>

        {/* Options */}
        <Text style={s.sectionTitle}> {t('sessions.your_options')} </Text>

        <TouchableOpacity accessibilityRole="button" style={s.btnWait}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        activeOpacity={0.75}>
          <Icon name="schedule" size={18} color={colors.gold} />
          <Text style={s.btnWaitText}> {t('sessions.wait_a_little_longer')} </Text>
        </TouchableOpacity>

        <TouchableOpacity accessibilityRole="button" style={s.btnChat}
        onPress={() => navigation.navigate(Routes.IN_SESSION_CHAT, { sessionId })}
        activeOpacity={0.85}>
          <Icon name="chat" size={18} color={colors.rootBg} />
          <Text style={s.btnChatText}> {t('sessions.contact_customer')} </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky red CTA */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnNoShow} onPress={handleReportNoShow}
        activeOpacity={0.85} accessibilityLabel={t("accessibility.report_no_show")}>
          <Icon name="person-off" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={s.btnNoShowText}> {t('sessions.report_no_show')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CustomerNoShowScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  statusCard: {
    backgroundColor: 'rgba(200,40,40,0.08)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(200,40,40,0.28)', padding: spacing.lg, marginBottom: spacing.md
  },
  statusIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  statusIconWrap: { width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(200,40,40,0.12)', alignItems: 'center', justifyContent: 'center' },
  statusTitle: { fontFamily: fontFamily.playfairBold, fontSize: 17, color: colors.softWarning },
  statusInfoGrid: { flexDirection: 'row', alignItems: 'stretch' },
  statusInfoItem: { flex: 1, alignItems: 'center' },
  statusInfoDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: spacing.sm },
  statusInfoLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  statusInfoValue: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginTop: 3 },

  policyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.07)', borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.20)', marginBottom: spacing.lg },
  policyText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  policyBold: { fontFamily: fontFamily.interBold, color: colors.safetyGreen },

  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },

  btnWait: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    height: 50, borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)',
    marginBottom: spacing.sm },
  btnWaitText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },
  btnChat: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    height: 50, borderRadius: radius.md, backgroundColor: colors.gold },
  btnChatText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnNoShow: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning },
  btnNoShowText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff' }
});