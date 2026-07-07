import i18next from 'i18next';
/**
 * CPN-003 — OTPVerificationScreen
 * Visual parity: Stitch otp_verification_screen/code.html
 *
 * Stitch layout:
 *  - ScreenTopBar
 *  - Subtle top gold glow
 *  - GlassCard: phone icon + masked number + "Edit number" link
 *  - Section label "Enter OTP" + 6 OTP boxes (48×56, gold border/30, rounded-xl, focus glow)
 *  - Resend row: "Resend code in 00:28" gold timer + "Resend" button (disabled state)
 *  - Security info box: shield + "Secure verification" text
 *  - Sticky-style footer: "Verify & Continue" gold button + "Use another number" ghost + disclaimer
 *
 * P0 FIXES: encoding artifacts removed, +91 masked format, 6-digit boxes, 30s countdown.
 * Content: OTPContent from authOnboardingContent.ts
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ScrollView } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { AuthStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { validateOTP } from '../../utils/validators';

import { QA_OTP_DIGITS } from '../../config/devQaPrefill';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<AuthStackParamList, typeof Routes.OTP_VERIFICATION>;

const OTP_LENGTH = 6;

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { phoneNumber } = route.params;
  const maskedDisplay = `+91 ••••••${phoneNumber.slice(-4)}`;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendSecs, setResendSecs] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    if (resendSecs === 0) {setCanResend(true);return;}
    const timer = setTimeout(() => setResendSecs((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendSecs]);

  // QA convenience: pre-fill OTP digits for emulator navigation testing.
  // Controlled by DEV_QA_PREFILL in src/config/devQaPrefill.ts.
  // Validation is NOT bypassed — OTP must still pass validateOTP().
  // This block is dead code in production release builds.
  useEffect(() => {
    if (QA_OTP_DIGITS.length === OTP_LENGTH) {setDigits(QA_OTP_DIGITS);}
  }, []);

  const focusNext = (index: number) => {
    if (index < OTP_LENGTH - 1) {inputRefs.current[index + 1]?.focus();}
  };
  const focusPrev = (index: number) => {
    if (index > 0) {inputRefs.current[index - 1]?.focus();}
  };

  const handleDigitChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (error) {setError(null);}
    if (digit) {focusNext(index);}
  };

  const handleKeyPress = (
  event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  index: number) =>
  {
    if (event.nativeEvent.key === 'Backspace' && !digits[index]) {
      focusPrev(index);
    }
  };

  const otpValue = digits.join('');

  const handleVerify = useCallback(async () => {
    const validationError = validateOTP(otpValue);
    if (validationError) {
      setError(t("content.auth_onboarding.OTPContent.ERROR_INVALID"));
      return;
    }
    setLoading(true);
    try {
      // TODO (BACKEND INTEGRATION): 
      // When API is integrated, the verify-otp endpoint should return a flag like `isNewUser`.
      // If the user already exists (Existing User) -> bypass onboarding and navigate to Home or PIN screen.
      // If the user is new (New User) -> navigate to the Language Selection screen to continue onboarding.

      const isNewUser = true; // Hardcoded to true for UI flow testing

      if (isNewUser) {
        navigation.navigate(Routes.LANGUAGE_SELECTION);
      } else {




        // Example for existing user:
        // navigation.navigate(Routes.CONFIRM_PIN); // or bypass to MainApp
      }} finally {setLoading(false);}}, [otpValue, navigation]);

  const handleResend = () => {
    if (!canResend) {return;}
    setDigits(Array(OTP_LENGTH).fill(''));
    setError(null);
    setResendSecs(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const resendTimerLabel = canResend ? t("content.auth_onboarding.OTPContent.RESEND_LABEL") :

  t("content.auth_onboarding.OTPContent.RESEND_TIMER").replace('{seconds}', String(resendSecs).padStart(2, '0'));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      {/* Subtle top glow */}
      <View style={styles.topGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Phone display card */}
        <GlassCard style={styles.phoneCard}>
          <View style={styles.phoneRow}>
            <View style={styles.phoneIconWrap}>
              <Icon name="phone" size={20} color={colors.gold} />
            </View>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneSubLabel}>{t("content.auth_onboarding.OTPContent.SUBHEADLINE")}</Text>
              <Text style={styles.phoneNumber}>{maskedDisplay}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.editLink}>{t("content.auth_onboarding.OTPContent.CHANGE_NUMBER")}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* OTP Section */}
        <Text style={styles.headline}>{t("content.auth_onboarding.OTPContent.HEADLINE")}</Text>

        <Text style={styles.otpLabel}>{t("content.auth_onboarding.OTPContent.ENTER_OTP")}</Text>

        {/* 6 OTP Digit Boxes */}
        <View style={styles.digitRow}>
          {Array.from({ length: OTP_LENGTH }).map((_, idx) =>
          <TextInput
            key={idx}
            ref={(el) => {inputRefs.current[idx] = el;}}
            style={[
            styles.digitBox,
            digits[idx] ? styles.digitBoxFilled : null,
            error ? styles.digitBoxError : null]
            }
            value={digits[idx]}
            onChangeText={(v) => handleDigitChange(v, idx)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor={colors.gold}
            accessibilityLabel={t("accessibility.otp_digit", { digit: idx + 1 })}
            autoFocus={idx === 0} />

          )}
        </View>

        {/* Error */}
        {error &&
        <View style={styles.errorRow}>
            <Icon name="error-outline" size={13} color={colors.softWarning} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        }

        {/* Resend row */}
        <View style={styles.resendRow}>
          <Icon
            name="timer"
            size={16}
            color={canResend ? colors.gold : colors.textMuted} />
          
          <Text style={[styles.resendTimer, canResend && styles.resendTimerActive]}>
            {resendTimerLabel}
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.resendBtn, !canResend && styles.resendBtnDisabled]}>
              {t("content.auth_onboarding.OTPContent.RESEND_LABEL")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security info card */}
        <View style={styles.securityCard}>
          <Icon name="shield" size={20} color={colors.textMuted} />
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>{t("content.auth_onboarding.OTPContent.SECURE_VERIFICATION")}</Text>
            <Text style={styles.securityBody}>
               {t('auth.your_otp_is_valid_for_10_minutes_cobuddy_will_never_ask_you_to_share_your_otp_with_anyone')} </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.OTPContent.CTA_PRIMARY")}
            onPress={handleVerify}
            loading={loading}
            disabled={otpValue.length < OTP_LENGTH}
            accessibilityLabel={t("accessibility.verify_otp_and_continue")} />
          
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.ghostBtnText}>{t("content.auth_onboarding.OTPContent.USE_ANOTHER_NUMBER")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
           {t('auth.having_trouble_contact_cobuddy_support_for_help_with_otp_verification')} </Text>
      </ScrollView>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  topGlow: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(214, 168, 79, 0.05)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    zIndex: 0
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl
  },
  phoneCard: {
    marginBottom: spacing.xxl
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  phoneIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardSurface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  phoneInfo: {
    flex: 1,
    gap: 2
  },
  phoneSubLabel: {
    ...textStyles.labelXs,
    color: colors.textMuted
  },
  phoneNumber: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  editLink: {
    ...textStyles.labelSm,
    color: colors.gold
  },
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 36
  },
  otpLabel: {
    ...textStyles.capsSm,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  digitBox: {
    width: 48,
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(214, 168, 79, 0.25)',
    backgroundColor: colors.cardSurface,
    ...textStyles.metricSm,
    color: colors.textPrimary,
    textAlign: 'center'
  },
  digitBoxFilled: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSubtle
  },
  digitBoxError: {
    borderColor: colors.softWarning
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md
  },
  errorText: {
    ...textStyles.labelXs,
    color: colors.softWarning,
    flex: 1
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl
  },
  resendTimer: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    flex: 1
  },
  resendTimerActive: {
    color: colors.gold,
    fontWeight: '600'
  },
  resendBtn: {
    ...textStyles.labelMd,
    color: colors.gold
  },
  resendBtnDisabled: {
    color: colors.textMuted,
    opacity: 0.5
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.40)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.10)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxxl
  },
  securityContent: {
    flex: 1,
    gap: spacing.xs
  },
  securityTitle: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  securityBody: {
    ...textStyles.bodyXs,
    color: colors.textSecondary,
    lineHeight: 18
  },
  ctaArea: {
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.20)',
    borderRadius: radius.sm
  },
  ghostBtnText: {
    ...textStyles.labelMd,
    color: colors.textSecondary
  },
  disclaimer: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.60)',
    textAlign: 'center',
    lineHeight: 18
  }
});

export default OTPVerificationScreen;