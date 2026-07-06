import i18next from "i18next"; /**
* SafetyTimerScreen (CPN-122)
* Countdown timer that alerts emergency contacts if companion doesn't check in.
*/
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useSafetyStore } from '../../store/slices/safetyStore';
import { useTranslation } from "react-i18next";

const PRESETS = [
  { label: "content.safety.SafetyTimerScreen.presets.0.label", seconds: 15 * 60 },
  { label: "content.safety.SafetyTimerScreen.presets.1.label", seconds: 30 * 60 },
  { label: "content.safety.SafetyTimerScreen.presets.2.label", seconds: 45 * 60 },
  { label: "content.safety.SafetyTimerScreen.presets.3.label", seconds: 60 * 60 }
] as any[];






const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

export function SafetyTimerScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const startTimer = useSafetyStore((s) => s.startTimer);
  const cancelTimer = useSafetyStore((s) => s.cancelTimer);
  const expireTimer = useSafetyStore((s) => s.expireTimer);
  const timer = useSafetyStore((s) => s.timer);

  const running = timer.status === 'active';
  const [selected, setSelected] = useState(1); // default 30 min
  const [remaining, setRemaining] = useState(PRESETS[1].seconds);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Green pulsing dot when active
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!running) {pulse.stopAnimation();pulse.setValue(1);return;}
    Animated.loop(Animated.sequence([
    Animated.timing(pulse, { toValue: 0.2, duration: 700, useNativeDriver: true }),
    Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true })]
    )).start();
  }, [running, pulse]);

  useEffect(() => {
    if (!running) {
      setRemaining(PRESETS[selected].seconds);
    }
  }, [running, selected]);

  useEffect(() => {
    if (running && timer.expiresAt) {
      intervalRef.current = setInterval(() => {
        const diff = Math.floor((timer.expiresAt! - Date.now()) / 1000);
        if (diff <= 0) {
          clearInterval(intervalRef.current!);
          expireTimer();
          navigation.navigate(Routes.SOS_CONFIRMATION);
        } else {
          setRemaining(diff);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {clearInterval(intervalRef.current);}
    }
    return () => {if (intervalRef.current) {clearInterval(intervalRef.current);}};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timer.expiresAt]);

  const handleStart = () => {
    startTimer(PRESETS[selected].seconds / 60, null);
  };

  const handleCancel = () => {
    cancelTimer();
  };

  const handlePreset = (idx: number) => {
    if (running) {return;}
    setSelected(idx);
    setRemaining(PRESETS[idx].seconds);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.safety_timer')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Explanation */}
        <View style={s.infoCard}>
          <Icon name="info" size={16} color={colors.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          <Text style={s.infoText}>
             {t('safety.set_a_timer_if_you_don_t_check_in_before_it_ends_cobuddy_will_automatically_alert_your_emergency_contacts')} </Text>
        </View>

        {/* Presets */}
        <Text style={s.sectionTitle}> {t('safety.select_duration')} </Text>
        <View style={s.presetsRow}>
          {PRESETS.map((p, i) =>
          <TouchableOpacity key={t(p.label)}
          style={[s.presetPill, i === selected && s.presetPillActive, running && s.presetPillDisabled]}
          onPress={() => handlePreset(i)} activeOpacity={running ? 1 : 0.75}>
              <Text style={[s.presetLabel, i === selected && s.presetLabelActive]}>{t(p.label)}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Countdown display */}
        <View style={s.timerWrap}>
          <Text style={s.timerText}>{fmt(remaining)}</Text>
          {running &&
          <View style={s.activePill}>
              <Animated.View style={[s.activeDot, { opacity: pulse }]} />
              <Text style={s.activePillText}> {t('safety.timer_active')} </Text>
            </View>
          }
        </View>

        {/* Cancel link when running */}
        {running &&
        <TouchableOpacity style={s.cancelLink} onPress={handleCancel} activeOpacity={0.7}>
            <Icon name="timer-off" size={14} color={colors.softWarning} />
            <Text style={s.cancelLinkText}> {t('safety.cancel_timer')} </Text>
          </TouchableOpacity>
        }

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={s.bar}>
        <TouchableOpacity
          style={[s.btn, running && s.btnDisabled]}
          onPress={handleStart} disabled={running}
          activeOpacity={0.85} accessibilityLabel={t("accessibility.start_safety_timer")}>
          <Icon name="timer" size={18} color={running ? colors.textMuted : colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={[s.btnText, running && s.btnTextDisabled]}>
            {running ? t('safety.timer_running', { defaultValue: 'Timer Running…' }) : t('safety.start_timer', { defaultValue: 'Start Timer' })}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default SafetyTimerScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)', padding: spacing.md, marginBottom: spacing.lg },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },

  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },

  presetsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  presetPill: { flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  presetPillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  presetPillDisabled: { opacity: 0.45 },
  presetLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  presetLabelActive: { color: colors.gold },

  timerWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  timerText: { fontFamily: fontFamily.playfairBold, fontSize: 72, color: colors.gold, letterSpacing: 4 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md,
    backgroundColor: 'rgba(109,214,165,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', paddingHorizontal: 12, paddingVertical: 5 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.safetyGreen },
  activePillText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.safetyGreen },

  cancelLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingBottom: spacing.md },
  cancelLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.softWarning },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { backgroundColor: colors.cardSurface },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  btnTextDisabled: { color: colors.textMuted }
});