/**
 * SOSScreen (CPN-123)
 * Full-screen emergency SOS — no header, no back gesture.
 * Long press 3 seconds to confirm and send SOS.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Routes } from '../../navigation/routes';
import { useSafetyStore } from '../../store/slices/safetyStore';
import { useTranslation } from "react-i18next";

const HOLD_SECONDS = 3;

const INFO_ROWS = [
{ emoji: '📍', text: 'Your live location will be shared' },
{ emoji: '📞', text: 'Emergency contacts will be called' },
{ emoji: '🛡', text: 'CoBuddy support will be alerted' }];


export function SOSScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const triggerSOS = useSafetyStore((s) => s.triggerSOS);
  const [holding, setHolding] = useState(false);
  const [countdown, setCountdown] = useState(HOLD_SECONDS);

  // 3 concentric pulse rings
  const r1 = useRef(new Animated.Value(1)).current;
  const r2 = useRef(new Animated.Value(1)).current;
  const r3 = useRef(new Animated.Value(1)).current;

  const makeRing = (val: Animated.Value, delay: number) =>
  Animated.loop(Animated.sequence([
  Animated.delay(delay),
  Animated.timing(val, { toValue: 1.25, duration: 900, useNativeDriver: true }),
  Animated.timing(val, { toValue: 1, duration: 900, useNativeDriver: true })]
  ));

  useEffect(() => {
    makeRing(r1, 0).start();
    makeRing(r2, 300).start();
    makeRing(r3, 600).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    setHolding(true);
    setCountdown(HOLD_SECONDS);
    let c = HOLD_SECONDS;
    holdInterval.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(holdInterval.current!);
        setHolding(false);
        triggerSOS();
        navigation.navigate(Routes.SOS_CONFIRMATION);
      }
    }, 1000);
  };

  const cancelHold = () => {
    if (holdInterval.current) {clearInterval(holdInterval.current);}
    setHolding(false);
    setCountdown(HOLD_SECONDS);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0505" />

      <Text style={s.topLabel}> {t('safety.emergency_sos')} </Text>

      {/* SOS button */}
      <View style={s.center}>
        <Animated.View style={[s.ring, s.ring3, { transform: [{ scale: r3 }] }]} />
        <Animated.View style={[s.ring, s.ring2, { transform: [{ scale: r2 }] }]} />
        <Animated.View style={[s.ring, s.ring1, { transform: [{ scale: r1 }] }]} />

        <TouchableOpacity
          style={s.sosBtn}
          onLongPress={startHold}
          onPressOut={cancelHold}
          delayLongPress={0}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.hold_to_send_sos")}>
          {holding ?
          <Text style={s.sosBtnCount}>{countdown}</Text> :

          <Text style={s.sosBtnText}> {t('safety.sos')} </Text>
          }
        </TouchableOpacity>
      </View>

      <Text style={s.holdHint}>
        {holding ? `Sending in ${countdown}s… release to cancel` : t("content.safety.SOSScreen.hold_for_3_seconds_to_send_sos")}
      </Text>

      {/* Info rows */}
      <View style={s.infoSection}>
        {INFO_ROWS.map((r) =>
        <View key={t(r.text)} style={s.infoRow}>
            <Text style={s.infoEmoji}>{r.emoji}</Text>
            <Text style={s.infoText}>{t(r.text)}</Text>
          </View>
        )}
      </View>

      {/* Safe link */}
      <TouchableOpacity style={s.safeLink}
      onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
      activeOpacity={0.7} accessibilityLabel={t("accessibility.i_am_safe_go_back")}>
        <Icon name="check-circle-outline" size={16} color={colors.gold} />
        <Text style={s.safeLinkText}> {t('safety.i_m_safe_go_back')} </Text>
      </TouchableOpacity>
    </SafeAreaView>);

}
export default SOSScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0505', alignItems: 'center' },
  topLabel: { fontFamily: fontFamily.interBold, fontSize: 16, color: '#fff',
    letterSpacing: 3, marginTop: 48, textAlign: 'center' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },

  ring: { position: 'absolute', borderRadius: 999,
    borderWidth: 1.5, borderColor: 'rgba(192,57,43,0.50)' },
  ring1: { width: 230, height: 230, backgroundColor: 'rgba(192,57,43,0.06)' },
  ring2: { width: 185, height: 185, backgroundColor: 'rgba(192,57,43,0.10)' },
  ring3: { width: 145, height: 145, backgroundColor: 'rgba(192,57,43,0.15)' },

  sosBtn: { width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#C0392B', alignItems: 'center', justifyContent: 'center', zIndex: 1,
    shadowColor: '#C0392B', shadowOpacity: 0.7, shadowRadius: 30, shadowOffset: { width: 0, height: 0 }, elevation: 16 },
  sosBtnText: { fontFamily: fontFamily.playfairBold, fontSize: 36, color: '#fff' },
  sosBtnCount: { fontFamily: fontFamily.playfairBold, fontSize: 44, color: '#fff' },

  holdHint: { fontFamily: fontFamily.interRegular, fontSize: 13, color: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.xl, textAlign: 'center', paddingHorizontal: spacing.xl },

  infoSection: { width: '100%', paddingHorizontal: spacing.xl, marginBottom: spacing.xl, gap: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10,
    paddingHorizontal: spacing.md, paddingVertical: 11 },
  infoEmoji: { fontSize: 18 },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: 'rgba(255,255,255,0.75)' },

  safeLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: spacing.xl },
  safeLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold }
});