/**
 * SOSConfirmationScreen (CPN-124)
 * Full-screen SOS sent confirmation — no header, no back gesture.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useSafetyStore } from '../../store/slices/safetyStore';
import { useTranslation } from "react-i18next";

const STATUS_ITEMS_BASE = [
{ icon: 'check-circle', text: 'CoBuddy Support Notified' },
{ icon: 'my-location', text: 'Live Location Shared' }];


export function SOSConfirmationScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const resolveSOS = useSafetyStore((s) => s.resolveSOS);

  // Read the primary contact (or first contact) from the store
  const primary = useSafetyStore((s) =>
  s.trustedContacts.find((c) => c.isEmergencyContact) ?? s.trustedContacts[0] ?? null
  );
  const contactText = primary ?
  `${primary.name} (${primary.maskedPhone}) — Calling…` : t("content.safety.SOSConfirmationScreen.emergency_services_112_calling");


  const STATUS_ITEMS = [
  ...STATUS_ITEMS_BASE,
  { icon: 'phone', text: `Emergency Contact: ${contactText}` }];


  const handleCancelSOS = () => {
    Alert.alert(t("alerts.are_you_sure_you_are_safe"), t("alerts.cancelling_will_stop_all_sos_alerts_only"),


    [
    { text: t("alerts.stay_on_alert"), style: 'cancel' },
    { text: t("alerts.yes_i_m_safe"), style: 'default',
      onPress: () => {
        resolveSOS();
        (navigation as any).navigate(Routes.HOME_DASHBOARD  );
      } }]

    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0505" />

      <View style={s.body}>
        {/* Shield icon */}
        <View style={s.iconCircle}>
          <Icon name="shield" size={52} color="#fff" />
          <View style={s.checkBadge}>
            <Icon name="check" size={16} color={colors.safetyGreen} />
          </View>
        </View>

        <Text style={s.title}> {t('safety.sos_sent')} </Text>
        <Text style={s.subtitle}> {t('safety.help_is_on_the_way')} </Text>

        {/* Status cards */}
        <View style={s.statusCard}>
          {STATUS_ITEMS.map((item, i) =>
          <View key={t(item.text)} style={[s.statusRow, i === STATUS_ITEMS.length - 1 && s.statusRowLast]}>
              <Icon name={item.icon as any} size={18} color={colors.safetyGreen} />
              <Text style={s.statusText}>{t(item.text)}</Text>
            </View>
          )}
        </View>

        {/* ETA */}
        <View style={s.etaCard}>
          <Icon name="support-agent" size={16} color={colors.gold} />
          <Text style={s.etaText}> {t('safety.support_team_will_contact_you_in')} <Text style={s.etaBold}> {t('safety.2_minutes')} </Text></Text>
        </View>
      </View>

      {/* Cancel SOS */}
      <View style={s.bar}>
        <TouchableOpacity style={s.cancelBtn} onPress={handleCancelSOS} activeOpacity={0.8}>
          <Text style={s.cancelBtnText}> {t('safety.cancel_sos_i_m_safe')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default SOSConfirmationScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0505' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },

  iconCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(192,57,43,0.35)',
    borderWidth: 2, borderColor: 'rgba(192,57,43,0.60)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl, position: 'relative'
  },
  checkBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1A0505', borderWidth: 1.5, borderColor: colors.safetyGreen,
    alignItems: 'center', justifyContent: 'center'
  },

  title: { fontFamily: fontFamily.playfairBold, fontSize: 32, color: '#fff',
    textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 16, color: 'rgba(255,255,255,0.55)',
    textAlign: 'center', marginBottom: spacing.xl },

  statusCard: { width: '100%', backgroundColor: 'rgba(192,57,43,0.12)',
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.30)', marginBottom: spacing.md },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  statusRowLast: { borderBottomWidth: 0 },
  statusText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: '#fff', flex: 1, lineHeight: 19 },

  etaCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.10)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    paddingHorizontal: spacing.md, paddingVertical: 10, width: '100%' },
  etaText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: 'rgba(255,255,255,0.70)', flex: 1 },
  etaBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl },
  cancelBtn: { height: 50, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.30)' },
  cancelBtnText: { fontFamily: fontFamily.interBold, fontSize: 14, color: '#fff' }
});