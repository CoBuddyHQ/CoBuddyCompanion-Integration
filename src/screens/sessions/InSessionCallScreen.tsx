/**
 * InSessionCallScreen (CPN-109) — Premium rewrite
 * Full-screen secured call UI with concentric pulse rings and toggleable controls.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";
import { useSessionStore } from '../../store/slices/sessionStore';

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

export function InSessionCallScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const customerName: string = route.params?.customerName ?? 'Customer';
  const initials = customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  // Three concentric pulse rings
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring3 = useRef(new Animated.Value(1)).current;
  const getCallToken = useSessionStore((s) => s.getCallToken);

  const makeLoop = (val: Animated.Value, delay: number) =>
  Animated.loop(Animated.sequence([
  Animated.delay(delay),
  Animated.timing(val, { toValue: 0.15, duration: 1000, useNativeDriver: true }),
  Animated.timing(val, { toValue: 1, duration: 1000, useNativeDriver: true })]
  ));

  useEffect(() => {
    makeLoop(ring1, 0).start();
    makeLoop(ring2, 300).start();
    makeLoop(ring3, 600).start();
    
    if (sessionId) {
      getCallToken(sessionId).catch(e => console.error('Failed to get call token', e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const handleEndCall = () => {
    Alert.alert(t("alerts.end_call"), t("alerts.this_will_disconnect_the_secured_call"),


    [
    { text: t("alerts.cancel"), style: 'cancel' },
    { text: t("alerts.end_call_1"), style: 'destructive',
      onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]

    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#07111F" />

      {/* Secured call pill */}
      <View style={s.topRow}>
        <View style={s.securedPill}>
          <Icon name="lock" size={11} color={colors.gold} />
          <Text style={s.securedText}> {t('sessions.cobuddy_secured_call')} </Text>
        </View>
      </View>

      {/* Center block */}
      <View style={s.center}>
        {/* Concentric rings */}
        <Animated.View style={[s.ringOuter, { opacity: ring1 }]} />
        <Animated.View style={[s.ringMid, { opacity: ring2 }]} />
        <Animated.View style={[s.ringInner, { opacity: ring3 }]} />

        {/* Avatar */}
        <View style={s.avatarRing}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>

        <Text style={s.customerName}>{customerName}</Text>
        <Text style={s.securedLabel}> {t('sessions.secured_session_call')} </Text>

        {/* Timer */}
        <View style={s.timerRow}>
          <View style={s.greenDot} />
          <Text style={s.timerText}>{fmt(elapsed)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={s.controls}>
        {/* Mute */}
        <View style={s.ctrlCol}>
          <TouchableOpacity accessibilityRole="button"
            style={[s.ctrlBtn, muted && s.ctrlBtnRed]}
            onPress={() => setMuted((v) => !v)}
            accessibilityLabel={t("accessibility.toggle_mute")}>
            <Icon name={muted ? 'mic-off' : 'mic'} size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={s.ctrlLabel}>{muted ? t("content.sessions.InSessionCallScreen.unmute") : t("content.sessions.InSessionCallScreen.mute")}</Text>
        </View>

        {/* End call */}
        <View style={s.ctrlCol}>
          <TouchableOpacity accessibilityRole="button" style={s.endBtn} onPress={handleEndCall}
          activeOpacity={0.85} accessibilityLabel={t("accessibility.end_call")}>
            <Icon name="call-end" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={s.ctrlLabel}> {t('sessions.end')} </Text>
        </View>

        {/* Speaker */}
        <View style={s.ctrlCol}>
          <TouchableOpacity accessibilityRole="button"
            style={[s.ctrlBtn, speaker && s.ctrlBtnGold]}
            onPress={() => setSpeaker((v) => !v)}
            accessibilityLabel={t("accessibility.toggle_speaker")}>
            <Icon name={speaker ? 'volume-up' : 'volume-off'} size={24}
            color={speaker ? colors.rootBg : '#fff'} />
          </TouchableOpacity>
          <Text style={s.ctrlLabel}>{speaker ? t("content.sessions.InSessionCallScreen.speaker") : t("content.sessions.InSessionCallScreen.earpiece")}</Text>
        </View>
      </View>

      {/* Chat link */}
      <TouchableOpacity accessibilityRole="button"
        style={s.chatLink}
        onPress={() => navigation.navigate(Routes.IN_SESSION_CHAT, { sessionId, customerName })}
        accessibilityLabel={t("accessibility.switch_to_chat")}>
        <Icon name="chat" size={14} color={colors.gold} />
        <Text style={s.chatLinkText}> {t('sessions.chat_instead')} </Text>
      </TouchableOpacity>
    </SafeAreaView>);

}
export default InSessionCallScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#07111F', alignItems: 'center' },

  topRow: { paddingTop: 48, paddingBottom: spacing.md },
  securedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(214,168,79,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    paddingHorizontal: 14, paddingVertical: 6
  },
  securedText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' },

  ringOuter: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    borderWidth: 1.5, borderColor: colors.gold,
    backgroundColor: 'rgba(214,168,79,0.04)'
  },
  ringMid: {
    position: 'absolute', width: 170, height: 170, borderRadius: 85,
    borderWidth: 1.5, borderColor: colors.gold,
    backgroundColor: 'rgba(214,168,79,0.08)'
  },
  ringInner: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    borderWidth: 2, borderColor: colors.gold,
    backgroundColor: 'rgba(214,168,79,0.14)'
  },
  avatarRing: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2.5, borderColor: colors.gold,
    backgroundColor: '#1A2D48',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg, zIndex: 1
  },
  avatarText: { fontFamily: fontFamily.playfairBold, fontSize: 32, color: '#fff' },

  customerName: {
    fontFamily: fontFamily.playfairBold, fontSize: 28, color: '#fff',
    marginBottom: 4, textAlign: 'center'
  },
  securedLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.safetyGreen },
  timerText: { fontFamily: fontFamily.interSemiBold, fontSize: 18, color: colors.safetyGreen },

  controls: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start',
    width: '100%', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg
  },
  ctrlCol: { alignItems: 'center', gap: 8 },
  ctrlBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#1A2A44', alignItems: 'center', justifyContent: 'center'
  },
  ctrlBtnRed: { backgroundColor: '#C0392B' },
  ctrlBtnGold: { backgroundColor: colors.gold },
  ctrlLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  endBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#C0392B', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#C0392B', shadowOpacity: 0.5,
    shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8
  },

  chatLink: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingBottom: spacing.xl
  },
  chatLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold }
});