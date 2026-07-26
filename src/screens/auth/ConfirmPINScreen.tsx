/**
 * CPN-008 — ConfirmPINScreen
 * Visual parity: Stitch confirm_pin_screen/code.html
 *
 * Stitch layout:
 *  - ScreenTopBar (centered label + spacer)
 *  - Ambient gold glow blobs (decorative absolute elements)
 *  - H1 "Confirm Your PIN" (Playfair) + subtitle
 *  - "Secure access confirmation" badge pill (lock icon)
 *  - 4 VISUAL DOT-BOX indicators (NOT individual TextInputs):
 *    64×64 rounded-xl, border, filled dot (12px gold circle) when digit entered
 *    Single hidden full-width TextInput overlaid for keyboard capture
 *  - Two info cards (glass-style, interactive border):
 *    - "Almost secured" — verified_user icon
 *    - "Protected companion account" — shield icon
 *  - Sticky gradient footer: "Confirm PIN" gold rounded-full + "Change PIN" ghost outline + disclaimer
 *
 * Content: ConfirmPINContent from authOnboardingContent.ts
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import ActionButton from '../../components/actions/ActionButton';
import { AuthStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useTranslation } from "react-i18next";
import { useAuthStore } from '../../store/slices/authStore';

type Props = StackScreenProps<AuthStackParamList, typeof Routes.CONFIRM_PIN>;

const PIN_LENGTH = 4;

const ConfirmPINScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { pin: originalPin } = route.params;

  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {hiddenInputRef.current?.focus();}, 400);
    return () => clearTimeout(timer);
  }, []);

  const handlePinChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, PIN_LENGTH);
    setConfirmPin(digits);
    if (error) {setError(null);}
  };

  const handleConfirm = async () => {
    if (confirmPin.length < PIN_LENGTH) {return;}
    if (confirmPin !== originalPin) {
      setError(t("content.auth_onboarding.ConfirmPINContent.ERROR_MISMATCH"));
      setConfirmPin('');
      hiddenInputRef.current?.focus();
      return;
    }
    
    setLoading(true);
    try {
      await useAuthStore.getState().setPin(originalPin, confirmPin);
      // PIN confirmed & saved — navigate to biometrics
      navigation.navigate(Routes.BIOMETRIC_SETUP);
    } catch (e: any) {
      setError(e.message || 'Failed to set PIN');
      setConfirmPin('');
      hiddenInputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const INFO_CARDS = [
  {
    icon: 'verified-user',
    title: t('auth.almost_secured') as string,
    body: t('auth.after_confirmation_you_can_enable_biometric_access_for_faster_and_safer_login') as string
  },
  {
    icon: 'shield',
    title: t('auth.protected_companion_account') as string,
    body: t('auth.your_pin_helps_protect_bookings_earnings_session_details_safety_tools_and_profile_access') as string
  }];


  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      {/* Decorative glow blobs */}
      <View style={[styles.glow, styles.glowTopLeft]} />
      <View style={[styles.glow, styles.glowBottomRight]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* H1 */}
        <Text style={styles.headline}>{t("content.auth_onboarding.ConfirmPINContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.auth_onboarding.ConfirmPINContent.SUBHEADLINE")}</Text>

        {/* Badge pill */}
        <View style={styles.badgePill}>
          <Icon name="lock" size={14} color={colors.gold} />
          <Text style={styles.badgePillText}>{t("content.auth_onboarding.ConfirmPINContent.SECURE_ACCESS")}</Text>
        </View>

        {/* PIN dot display */}
        <Text style={styles.pinLabel}>{t("content.auth_onboarding.ConfirmPINContent.RE_ENTER")}</Text>
        <TouchableOpacity accessibilityRole="button"
          style={styles.dotContainer}
          activeOpacity={1}
          onPress={() => {
            hiddenInputRef.current?.blur();
            setTimeout(() => hiddenInputRef.current?.focus(), 10);
          }}>

          {/* Hidden real input */}
          <TextInput
            ref={hiddenInputRef}
            style={styles.hiddenInput}
            value={confirmPin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            pointerEvents="none"
            accessibilityLabel={t("accessibility.confirm_pin_input")} />
          

          {/* Visual dot boxes */}
          {Array.from({ length: PIN_LENGTH }).map((_, idx) => {
            const filled = idx < confirmPin.length;
            const isActive = idx === confirmPin.length;
            return (
              <View
                key={idx}
                style={[
                styles.dotBox,
                isActive && styles.dotBoxActive,
                error && styles.dotBoxError]
                }>
                {filled && <View style={styles.dot} />}
              </View>);

          })}
        </TouchableOpacity>

        {/* Error */}
        {error &&
        <View style={styles.errorRow}>
            <Icon name="error-outline" size={13} color={colors.softWarning} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        }

        {/* Info cards */}
        <View style={styles.infoList}>
          {INFO_CARDS.map((card, idx) =>
          <View key={idx} style={styles.infoCard}>
              <View style={styles.infoIconWrap}>
                <Icon name={card.icon} size={22} color={colors.gold} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{t(card.title)}</Text>
                <Text style={styles.infoBody}>{card.body}</Text>
              </View>
            </View>
          )}
        </View>

        {/* CTA Footer */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.ConfirmPINContent.CTA_PRIMARY")}
            onPress={handleConfirm}
            disabled={confirmPin.length < PIN_LENGTH}
            style={styles.primaryBtn}
            accessibilityLabel={t("accessibility.confirm_pin")} />
          
          <TouchableOpacity accessibilityRole="button"
            style={styles.changeBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.changeBtnText}>{t("content.auth_onboarding.ConfirmPINContent.CHANGE_PIN")}</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
             {t('auth.keep_your_pin_private_cobuddy_will_never_ask_you_to_share_it')} </Text>
        </View>
      </ScrollView>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  glow: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: 'rgba(214, 168, 79, 0.07)',
    zIndex: 0
  },
  glowTopLeft: {
    width: 300,
    height: 300,
    top: -100,
    left: -80
  },
  glowBottomRight: {
    width: 400,
    height: 400,
    bottom: -100,
    right: -120,
    opacity: 0.5
  },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    width: '100%'
  },
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 36,
    textAlign: 'center'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    maxWidth: 280
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(16, 27, 45, 0.60)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.15)',
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.xxxl
  },
  badgePillText: {
    ...textStyles.labelSm,
    color: colors.gold
  },
  pinLabel: {
    ...textStyles.capsSm,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
    alignSelf: 'flex-start'
  },
  dotContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
    width: '100%',
    maxWidth: 280
  },
  hiddenInput: {
    position: 'absolute', opacity: 0.01, width: '100%', height: '100%', zIndex: 10, color: 'transparent'
  },
  dotBox: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.30)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotBoxActive: {
    borderColor: colors.gold,
    borderWidth: 1.5,
    shadowColor: colors.gold,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4
  },
  dotBoxError: {
    borderColor: colors.softWarning
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    alignSelf: 'flex-start'
  },
  errorText: {
    ...textStyles.labelXs,
    color: colors.softWarning,
    flex: 1
  },
  infoList: {
    gap: spacing.md,
    width: '100%',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxl
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.50)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.12)',
    borderRadius: radius.xl,
    padding: spacing.lg
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  infoContent: {
    flex: 1,
    gap: spacing.xs
  },
  infoTitle: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  infoBody: {
    ...textStyles.bodyXs,
    color: colors.textSecondary,
    lineHeight: 18
  },
  ctaArea: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md
  },
  primaryBtn: {
    width: '100%',
    borderRadius: radius.full
  },
  changeBtn: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.25)',
    borderRadius: radius.full
  },
  changeBtnText: {
    ...textStyles.labelMd,
    color: colors.textSecondary
  },
  disclaimer: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.60)',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280
  }
});

export default ConfirmPINScreen;