/**
 * CPN-105 — Arrival Check-In Screen
 * Companion verifies their arrival with customer PIN to start the session.
 */
import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, NativeSyntheticEvent, TextInputKeyPressEventData } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.ARRIVAL_CHECK_IN>;

const PIN_LENGTH = 4;

export function ArrivalCheckInScreen({ route, navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const sessionId = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  s.upcomingSessions.find((ses) => ses.sessionId === sessionId) ?? null
  );

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [pinError, setPinError] = useState('');
  const refs = Array.from({ length: PIN_LENGTH }, () => useRef<TextInput>(null));

  const pinValue = pin.join('');
  const canStart = pinValue.length === PIN_LENGTH;

  const handleDigit = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...pin];
    next[index] = digit;
    setPin(next);
    setPinError('');
    if (digit && index < PIN_LENGTH - 1) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleStart = () => {
    if (!canStart) {return;}
    navigation.navigate(Routes.CUSTOMER_ARRIVAL_VERIFICATION, { sessionId });
  };

  const venueName = session?.venue.name ?? 'the venue';
  const area = session?.venue.area ?? '';
  const city = session?.venue.city ?? '';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.check_in')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <View style={styles.content}>

        {/* ── Venue arrived banner ── */}
        <View style={styles.arrivedBanner}>
          <Icon name="location-on" size={18} color={colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.arrivedLabel}> {t('sessions.you_have_arrived_at')} </Text>
            <Text style={styles.arrivedVenue}>{venueName}</Text>
            {(area || city) &&
            <Text style={styles.arrivedArea}>{[area, city].filter(Boolean).join(', ')}</Text>
            }
          </View>
        </View>

        {/* ── PIN verification ── */}
        <View style={styles.pinSection}>
          <Icon name="pin" size={28} color={colors.gold} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.pinTitle}> {t('sessions.verify_meeting')} </Text>
          <Text style={styles.pinSubtitle}>
             {t('sessions.ask_the_customer_for_their')} <Text style={styles.pinSubHighlight}> {t('sessions.4_digit_start_pin')} </Text>  {t('sessions.to_officially_begin_the_session')} </Text>

          {/* PIN boxes */}
          <View style={styles.pinRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) =>
            <TextInput
              key={i}
              ref={refs[i]}
              style={[styles.pinBox, pin[i] ? styles.pinBoxFilled : null,
              pinError ? styles.pinBoxError : null]}
              value={pin[i]}
              onChangeText={(val) => handleDigit(i, val)}
              onKeyPress={(e) => handleKeyPress(i, e)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={t("accessibility.pin_digit", { digit: i + 1 })} />

            )}
          </View>

          {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
        </View>

        {/* ── Divider ── */}
        <View style={styles.orRow}>
          <View style={styles.orLine} /><Text style={styles.orText}> {t('sessions.or')} </Text><View style={styles.orLine} />
        </View>

        {/* ── Selfie alternative ── */}
        <TouchableOpacity accessibilityRole="button" style={styles.selfieBtn} activeOpacity={0.75}
        accessibilityLabel={t("accessibility.take_venue_selfie")}>
          <Icon name="camera-alt" size={18} color={colors.gold} style={{ marginRight: spacing.sm }} />
          <Text style={styles.selfieBtnText}> {t('sessions.take_a_venue_selfie_instead')} </Text>
        </TouchableOpacity>

        {/* ── SOS reminder ── */}
        <View style={styles.sosCard}>
          <Icon name="shield" size={16} color={colors.safetyGreen} />
          <Text style={styles.sosText}>
             {t('sessions.the')} <Text style={{ fontFamily: fontFamily.interBold }}> {t('sessions.sos_button')} </Text>  {t('sessions.is_now_active_for_this_session')} </Text>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button"
          style={[styles.btnStart, !canStart && styles.btnDisabled]}
          onPress={handleStart}
          disabled={!canStart}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.start_session")}>
          <Icon name="play-arrow" size={20} color={canStart ? colors.rootBg : colors.textMuted}
          style={{ marginRight: 8 }} />
          <Text style={[styles.btnStartText, !canStart && styles.btnStartTextDisabled]}>
             {t('sessions.verify_start_session')} </Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>
           {t('sessions.by_starting_you_confirm_the_customer_is_present_and_you_are_ready_to_begin')} </Text>
      </View>
    </SafeAreaView>);

}

export default ArrivalCheckInScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  arrivedBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.xl
  },
  arrivedLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  arrivedVenue: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold, marginTop: 2 },
  arrivedArea: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  pinSection: { alignItems: 'center', marginBottom: spacing.xl },
  pinTitle: { fontFamily: fontFamily.playfairSemiBold, fontSize: 20, color: colors.textPrimary, marginBottom: spacing.sm },
  pinSubtitle: {
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted,
    textAlign: 'center', lineHeight: 20, paddingHorizontal: spacing.md, marginBottom: spacing.xl
  },
  pinSubHighlight: { fontFamily: fontFamily.interBold, color: colors.gold },

  pinRow: { flexDirection: 'row', gap: spacing.md },
  pinBox: {
    width: 56, height: 64, borderRadius: radius.lg,
    borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.cardSurface,
    textAlign: 'center',
    fontFamily: fontFamily.interBold, fontSize: 26, color: colors.textPrimary
  },
  pinBoxFilled: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.08)' },
  pinBoxError: { borderColor: colors.softWarning },
  pinError: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.softWarning, marginTop: spacing.sm },

  orRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  orText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginHorizontal: spacing.md },

  selfieBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)',
    backgroundColor: 'rgba(214,168,79,0.06)',
    marginBottom: spacing.lg
  },
  selfieBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },

  sosCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.08)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(109,214,165,0.20)',
    padding: spacing.md
  },
  sosText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.safetyGreen, lineHeight: 19, flex: 1 },

  footer: {
    paddingHorizontal: spacing.lg, paddingTop: spacing.md,
    paddingBottom: spacing.xl, backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnStart: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.safetyGreen, marginBottom: spacing.sm
  },
  btnStartText: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.rootBg },
  btnDisabled: { backgroundColor: colors.elevatedSurface },
  btnStartTextDisabled: { color: colors.textMuted },
  footerNote: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textAlign: 'center' }
});