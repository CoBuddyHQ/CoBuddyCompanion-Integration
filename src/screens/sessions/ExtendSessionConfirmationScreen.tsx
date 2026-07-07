/**
 * ExtendSessionConfirmationScreen (CPN-112)
 * Shown after an extension request is sent — awaiting customer approval.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function ExtendSessionConfirmationScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const minutes: number = route.params?.extendedMinutes ?? 60;
  const label = minutes === 30 ? t("content.sessions.ExtendSessionConfirmationScreen.30_minutes") : minutes === 60 ? t("content.sessions.ExtendSessionConfirmationScreen.1_hour") : t("content.sessions.ExtendSessionConfirmationScreen.2_hours");

  // Amber pulsing dot
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
    Animated.timing(pulse, { toValue: 0.2, duration: 700, useNativeDriver: true }),
    Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true })]
    )).start();
  }, [pulse]);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.body}>
        {/* Icon */}
        <View style={s.iconCircle}>
          <Icon name="hourglass-top" size={46} color={colors.gold} />
        </View>

        {/* Title */}
        <Text style={s.title}> {t('sessions.extension_request_sent')} </Text>
        <Text style={s.subtitle}>
           {t('sessions.waiting_for_your_customer_to_confirm_the')} {' '}
          <Text style={s.subtitleBold}>+{label}  {t('sessions.extension')} </Text>.
        </Text>

        {/* Status card */}
        <View style={s.statusCard}>
          <Animated.View style={[s.pendingDot, { opacity: pulse }]} />
          <View style={s.statusMid}>
            <Text style={s.statusTitle}> {t('sessions.pending_customer_approval')} </Text>
            <Text style={s.statusSub}> {t('sessions.you_ll_be_notified_when_they_respond')} </Text>
          </View>
        </View>

        {/* Info */}
        <View style={s.infoCard}>
          <Icon name="info-outline" size={15} color={colors.textMuted} style={{ flexShrink: 0, marginTop: 1 }} />
          <Text style={s.infoText}>
             {t('sessions.continue_your_session_normally_the_extension_will_be_applied_automatically_once_confirmed')} </Text>
        </View>
      </View>

      {/* Sticky button */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btn}
        onPress={() => {
          // Pop back to ActiveSession
          navigation.navigate(Routes.ACTIVE_SESSION, { sessionId });
        }}
        activeOpacity={0.85}
        accessibilityLabel={t("accessibility.back_to_session")}>
          <Icon name="arrow-back" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('sessions.back_to_session')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default ExtendSessionConfirmationScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },

  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 2, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl
  },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 24, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  subtitleBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(255,171,64,0.08)',
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.25)',
    width: '100%', marginBottom: spacing.md
  },
  pendingDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.softWarning, flexShrink: 0
  },
  statusMid: { flex: 1 },
  statusTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.softWarning },
  statusSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    width: '100%'
  },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1, lineHeight: 19 },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});