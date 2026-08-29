/**
 * CustomerArrivalVerificationScreen (CPN-106)
 * OTP/QR code verification before starting a session.
 */
import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSessionStore } from '../../store/slices/sessionStore';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const CODE_LEN = 4;

export function CustomerArrivalVerificationScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const startSession = useSessionStore((s) => s.startSession);

  const [code, setCode] = useState<string[]>(Array(CODE_LEN).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleDigit = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    if (digit && idx < CODE_LEN - 1) {inputs.current[idx + 1]?.focus();}
  };

  const handleBackspace = (idx: number) => {
    const next = [...code];
    if (next[idx]) {next[idx] = '';setCode(next);} else
    if (idx > 0) {
      next[idx - 1] = '';setCode(next);
      inputs.current[idx - 1]?.focus();
    }
  };

  const fullCode = code.join('');
  const isValid = fullCode.length === CODE_LEN;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!isValid || loading) {return;}
    setLoading(true);
    try {
      await startSession(sessionId, fullCode);
      navigation.replace(Routes.ACTIVE_SESSION, { sessionId });
    } catch (e: any) {
      Alert.alert(t("alerts.error"), e?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };



  const handleQR = () => {
    // TODO: Integrate a real QR scanner library (e.g. react-native-camera, vision-camera)
    // For now, show an informational message instead of sending a fake code to the backend.
    Alert.alert(
      t('alerts.coming_soon') || 'QR Scanner Coming Soon',
      t('sessions.qr_scanner_not_yet_available') || 'QR scanning is not yet available. Please ask the customer for their 4-digit code.',
      [{ text: t('common.ok') || 'OK' }],
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.verify_customer')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Instruction */}
        <View style={s.instrCard}>
          <Icon name="qr-code-scanner" size={26} color={colors.gold} />
          <Text style={s.instrTitle}> {t('sessions.verify_the_customer')} </Text>
          <Text style={s.instrText}>
             {t('sessions.ask_the_customer_to_show_their_booking_qr_code_or_tell_you_their')} {' '}<Text style={s.instrBold}> {t('sessions.4_digit_verification_code')} </Text>.
          </Text>
        </View>

        {/* OTP boxes */}
        <Text style={s.otpLabel}> {t('sessions.enter_4_digit_code')} </Text>
        <View style={s.otpRow}>
          {code.map((digit, idx) =>
          <TextInput
            key={idx}
            ref={(r) => {inputs.current[idx] = r;}}
            style={[s.otpBox, digit ? s.otpBoxFilled : null]}
            value={digit}
            onChangeText={(v) => handleDigit(v, idx)}
            onKeyPress={({ nativeEvent }) =>
            nativeEvent.key === 'Backspace' && handleBackspace(idx)}
            keyboardType="numeric"
            maxLength={1}
            selectionColor={colors.gold}
            textAlign="center" />

          )}
        </View>

        {/* QR alternative */}
        <View style={s.dividerRow}>
          <View style={s.divLine} />
          <Text style={s.divText}> {t('sessions.or')} </Text>
          <View style={s.divLine} />
        </View>

        <TouchableOpacity accessibilityRole="button" style={s.qrBtn} onPress={handleQR} activeOpacity={0.75}>
          <Icon name="qr-code" size={20} color={colors.gold} />
          <Text style={s.qrBtnText}>{t('sessions.scan_customer_qr_code') || 'Scan Customer\'s QR Code'}</Text>
        </TouchableOpacity>

        {/* No-show link */}
        <TouchableOpacity accessibilityRole="button" style={s.noShowLink}
        onPress={() => navigation.navigate(Routes.CUSTOMER_NO_SHOW)} activeOpacity={0.7}>
          <Icon name="person-off" size={14} color={colors.softWarning} />
          <Text style={s.noShowText}> {t('sessions.customer_hasn_t_arrived')} </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky confirm */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button"
          style={[s.btn, !isValid && s.btnDisabled]}
          onPress={handleConfirm}
          disabled={!isValid}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.confirm_and_start_session")}>
          <Icon name="play-circle-filled" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('sessions.confirm_start_session')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CustomerArrivalVerificationScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  instrCard: {
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.xl, padding: spacing.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    alignItems: 'center', marginBottom: spacing.lg
  },
  instrTitle: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary,
    marginTop: spacing.sm, marginBottom: spacing.sm },
  instrText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 21 },
  instrBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  otpLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.md },
  otpRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  otpBox: {
    flex: 1, height: 64, borderRadius: radius.lg,
    borderWidth: 2, borderColor: colors.border,
    backgroundColor: colors.cardSurface,
    fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.textPrimary,
    textAlign: 'center'
  },
  otpBoxFilled: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.08)' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  divText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },

  qrBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)',
    borderRadius: radius.md, paddingVertical: 14,
    backgroundColor: 'rgba(214,168,79,0.07)', marginBottom: spacing.lg },
  qrBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },

  noShowLink: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  noShowText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.softWarning },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});