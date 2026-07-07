/**
 * CPN-002 — PhoneLoginScreen
 * Visual parity: Stitch phone_login_screen/code.html
 *
 * Stitch layout:
 *  - ScreenTopBar (back + "CoBuddy Companion")
 *  - Gold glow behind header area
 *  - Badge pill: verified_user icon + "Secure companion login"
 *  - H1: "Sign in to Your Companion Workspace" (Playfair 28px)
 *  - Body text below
 *  - GlassCard for phone input (call icon + "+91" + divider + TextInput)
 *  - Info card: shield icon + "Your account stays protected"
 *  - "Send OTP" gold button (full width, rounded-lg)
 *  - Bottom: terms note
 *
 * P0 FIXES APPLIED: +91 default, "companion workspace" copy, maskPhone().
 * Content: PhoneLoginContent from authOnboardingContent.ts
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  ScrollView,
  Modal,
  FlatList } from
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
import { validatePhone } from '../../utils/validators';
import { useAuthStore } from '../../store/slices/authStore';

import { QA_PHONE } from '../../config/devQaPrefill';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<AuthStackParamList, typeof Routes.PHONE_LOGIN>;

// ─── Country data ───────────────────────────────────────────────────────────────
// Ordered by companion program priority. India is the default.
const COUNTRIES = [
{ code: '+91', name: 'India', flag: '🇮🇳' },
{ code: '+1', name: 'United States', flag: '🇺🇸' },
{ code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
{ code: '+61', name: 'Australia', flag: '🇦🇺' },
{ code: '+971', name: 'UAE', flag: '🇦🇪' },
{ code: '+65', name: 'Singapore', flag: '🇸🇬' },
{ code: '+60', name: 'Malaysia', flag: '🇲🇾' },
{ code: '+66', name: 'Thailand', flag: '🇹🇭' },
{ code: '+1', name: 'Canada', flag: '🇨🇦' },
{ code: '+64', name: 'New Zealand', flag: '🇳🇿' },
{ code: '+27', name: 'South Africa', flag: '🇿🇦' },
{ code: '+55', name: 'Brazil', flag: '🇧🇷' },
{ code: '+49', name: 'Germany', flag: '🇩🇪' },
{ code: '+33', name: 'France', flag: '🇫🇷' },
{ code: '+81', name: 'Japan', flag: '🇯🇵' }] as
const;
type Country = typeof COUNTRIES[number];

function maskPhone(digits: string, code: string): string {
  return `${code} \u2022\u2022\u2022\u2022\u2022\u2022${digits.slice(-4)}`;
}

const PhoneLoginScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { setMaskedPhone } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]); // India default
  const [pickerOpen, setPickerOpen] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const shake = useCallback(() => {
    Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true })]
    ).start();
  }, [shakeAnim]);

  // QA convenience: pre-fill phone number for emulator navigation testing.
  // Controlled by DEV_QA_PREFILL in src/config/devQaPrefill.ts.
  // Validation is NOT bypassed — phone must still pass validatePhone().
  // This block is dead code in production release builds.
  useEffect(() => {
    if (QA_PHONE) {setPhone(QA_PHONE);}
  }, []);

  const handlePhoneChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (error) {setError(null);}
  };

  const handleContinue = useCallback(async () => {
    Keyboard.dismiss();
    const validationError = validatePhone(phone);
    if (validationError) {
      setError(validationError);
      shake();
      return;
    }
    setLoading(true);
    try {
      setMaskedPhone(maskPhone(phone, country.code));
      // Pass full E.164 number to OTP screen
      navigation.navigate(Routes.OTP_VERIFICATION, { phoneNumber: `${country.code}${phone}` });
    } finally {
      setLoading(false);
    }
  }, [phone, country, navigation, setMaskedPhone, shake]);

  const displayPhone = phone.length > 0 ?
  `${phone.slice(0, 5)}${phone.length > 5 ? ' ' + phone.slice(5) : ''}` :
  '';

  const inputBorderColor = error ?
  colors.softWarning :
  focused ?
  colors.gold :
  'rgba(214, 168, 79, 0.30)';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top nav */}
      <ScreenTopBar onBack={() => navigation.goBack()} />

      {/* Gold ambient glow */}
      <View style={styles.topGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Badge pill */}
        <View style={styles.badgePill}>
          <Icon name="verified-user" size={14} color={colors.gold} />
          <Text style={styles.badgePillText}>{t("content.auth_onboarding.PhoneLoginContent.SECURE_LOGIN")}</Text>
        </View>

        {/* H1 */}
        <Text style={styles.headline}>{t("content.auth_onboarding.PhoneLoginContent.SUBHEADLINE")}</Text>
        <Text style={styles.subBody}>
           {t('auth.enter_your_registered_mobile_number_to_securely_access_your_availability_bookings_sessions_and_earnings')} </Text>

        {/* Phone input glass card */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <GlassCard
            borderStrength={focused ? 'strong' : error ? 'strong' : 'normal'}
            style={styles.phoneCard}>
            {/* Label */}
            <Text style={styles.inputLabel}>{t("content.auth_onboarding.PhoneLoginContent.PHONE_LABEL")}</Text>

            {/* Input row */}
            <View style={[styles.inputRow, { borderBottomColor: inputBorderColor }]}>
              <Icon name="call" size={20} color={focused ? colors.gold : colors.textMuted} />
              {/* Country selector — tappable */}
              <TouchableOpacity
                style={styles.countryPart}
                onPress={() => {Keyboard.dismiss();setPickerOpen(true);}}
                accessibilityLabel={t("accessibility.country_code", { name: country.name, code: country.code })}
                accessibilityRole="button">
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={styles.countryCode}>{country.code}</Text>
                <Icon name="arrow-drop-down" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TextInput
                ref={inputRef}
                style={styles.phoneInput}
                value={displayPhone}
                onChangeText={handlePhoneChange}
                placeholder={t("content.auth_onboarding.PhoneLoginContent.PHONE_PLACEHOLDER")}
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={11}
                returnKeyType="done"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={handleContinue}
                selectionColor={colors.gold}
                accessibilityLabel={t("accessibility.mobile_number_input")} />
              
            </View>

            {/* Footer note */}
            <Text style={styles.inputFooter}>{t("content.auth_onboarding.PhoneLoginContent.FOOTER_NOTE")}</Text>
          </GlassCard>
        </Animated.View>

        {/* Error */}
        {error &&
        <View style={styles.errorRow}>
            <Icon name="error-outline" size={13} color={colors.softWarning} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        }

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Icon name="shield" size={22} color={colors.bronze} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>{t("content.auth_onboarding.PhoneLoginContent.ACCOUNT_PROTECTED")}</Text>
            <Text style={styles.infoBody}>
               {t('auth.cobuddy_uses_phone_verification_to_keep_companion_accounts_secure_and_prevent_unauthorized_access')} </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.PhoneLoginContent.CTA_PRIMARY")}
            onPress={handleContinue}
            loading={loading}
            disabled={phone.length < 10}
            accessibilityLabel={t("accessibility.send_otp_to_verify_mobile_number")} />
          
          <TouchableOpacity style={styles.helpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.helpText}>{t("content.auth_onboarding.PhoneLoginContent.HELP_LINK")}</Text>
          </TouchableOpacity>
        </View>

        {/* Terms footer */}
        <Text style={styles.termsText}>
           {t('auth.by_continuing_you_agree_to_cobuddy_companion')} {' '}
          <Text style={styles.termsLink}>{t("content.auth_onboarding.PhoneLoginContent.TERMS")}</Text>,{' '}
          <Text style={styles.termsLink}>{t("content.auth_onboarding.PhoneLoginContent.SAFETY_STANDARDS")}</Text> {t('auth.and')} {' '}
          <Text style={styles.termsLink}>{t("content.auth_onboarding.PhoneLoginContent.PRIVACY_POLICY")}</Text>.
        </Text>
      </ScrollView>

      {/* Country code picker modal */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerOpen(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t("content.auth_onboarding.PhoneLoginContent.SELECT_COUNTRY")}</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => `${item.code}-${item.name}`}
              renderItem={({ item }) =>
              <TouchableOpacity
                style={[styles.countryRow, country.name === item.name && styles.countryRowSelected]}
                onPress={() => {setCountry(item);setPickerOpen(false);}}
                accessibilityLabel={t("accessibility.country_code", { name: item.name, code: item.code })}>
                  <Text style={styles.countryRowFlag}>{item.flag}</Text>
                  <Text style={styles.countryRowName}>{item.name}</Text>
                  <Text style={styles.countryRowCode}>{item.code}</Text>
                  {country.name === item.name &&
                <Icon name="check" size={16} color={colors.gold} />
                }
                </TouchableOpacity>
              } />
            
          </View>
        </TouchableOpacity>
      </Modal>
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
    height: 240,
    backgroundColor: 'rgba(214, 168, 79, 0.06)',
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 160,
    zIndex: 0
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: spacing.md
  },
  badgePillText: {
    ...textStyles.labelSm,
    color: colors.gold
  },
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 38
  },
  subBody: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
    lineHeight: 22
  },
  phoneCard: {
    marginBottom: spacing.sm
  },
  inputLabel: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    marginBottom: spacing.sm
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1.5,
    paddingBottom: spacing.sm
  },
  countryPart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 2
  },
  countryCode: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    fontWeight: '600'
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(184, 192, 204, 0.25)',
    marginHorizontal: spacing.xs
  },
  phoneInput: {
    flex: 1,
    ...textStyles.bodyLg,
    color: colors.textPrimary,
    paddingVertical: 0,
    letterSpacing: 1
  },
  inputFooter: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.70)',
    marginTop: spacing.md
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs
  },
  errorText: {
    ...textStyles.labelXs,
    color: colors.softWarning,
    flex: 1
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.50)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.12)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxxl
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardSurface,
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
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18
  },
  ctaArea: {
    gap: spacing.md,
    marginBottom: spacing.xxl
  },
  helpBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  helpText: {
    ...textStyles.labelMd,
    color: colors.textMuted
  },
  termsText: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.60)',
    textAlign: 'center',
    lineHeight: 18
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: colors.textMuted
  },
  // Country picker modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: colors.secondaryBg,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm, paddingBottom: spacing.xxxl,
    borderTopWidth: 1, borderColor: colors.border,
    maxHeight: '75%'
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md
  },
  modalTitle: {
    ...textStyles.labelLg, color: colors.textPrimary,
    paddingHorizontal: spacing.lg, marginBottom: spacing.md
  },
  countryRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderSubtle
  },
  countryRowSelected: {
    backgroundColor: `${colors.gold}10`
  },
  countryRowFlag: { fontSize: 22 },
  countryRowName: { flex: 1, ...textStyles.bodyMd, color: colors.textPrimary },
  countryRowCode: { ...textStyles.labelMd, color: colors.textMuted, minWidth: 44, textAlign: 'right' }
});

export default PhoneLoginScreen;