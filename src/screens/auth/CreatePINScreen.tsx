import { useTranslation } from "react-i18next"; /**
* CPN-007 — CreatePINScreen
* Visual parity: Stitch create_pin_screen/code.html
*
* Stitch layout:
*  - Header: back + "CoBuddy Companion" in gold label-md
*  - H1 "Create Your Secure PIN" (Playfair 28px)
*  - Body + lock pill badge ("Protects bookings, earnings, and safety tools")
*  - Section label: "ENTER 4-DIGIT PIN"
*  - 4 PIN input boxes: TAB-STYLE (border-b-2 only, no full border)
*    56×64px, rounded-t-lg, gold bottom-border when filled/focused
*  - Two guidance cards: bg-[#112240] with border-[#233554]
*    - Card 1: security icon + "Choose a PIN only you know"
*    - Card 2: verified_user icon + "Companion workspace protection"
*  - Footer: "Set PIN" gold rounded-full button + disclaimer
*
* Content: CreatePINContent from authOnboardingContent.ts
*/

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView } from 'react-native';
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
type Props = StackScreenProps<AuthStackParamList, typeof Routes.CREATE_PIN>;
const PIN_LENGTH = 4;
const CreatePINScreen: React.FC<Props> = ({
  navigation
}) => {
  const {
    t
  } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const hiddenInputRef = useRef<TextInput>(null);

  // Reliable auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  const handlePinChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, PIN_LENGTH);
    setPin(digits);
    if (error) {
      setError(null);
    }
  };
  const handleSetPin = () => {
    if (pin.length < PIN_LENGTH) {
      return;
    }
    const isWeak = /^(\d)\1+$/.test(pin) || pin === '1234' || pin === '0000' || pin === '1111' || pin === '2222' || pin === '3333' || pin === '4444';
    if (isWeak) {
      setError(t("content.auth_onboarding.CreatePINContent.HELPER"));
      setPin('');
      hiddenInputRef.current?.focus();
      return;
    }
    navigation.navigate(Routes.CONFIRM_PIN, {
      pin
    });
  };
  const GUIDANCE = [{
    icon: 'security',
    title: t("content.auth.CreatePINScreen.choose_a_pin_only_you_know"),
    body: 'Avoid simple combinations like 0000, 1111, or your birth year.'
  }, {
    icon: 'verified-user',
    title: t("content.auth.CreatePINScreen.companion_workspace_protection"),
    body: t("content.auth_onboarding.CreatePINContent.SECURITY_NOTE")
  }];
  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      {/* Decorative glow blobs — matches ConfirmPINScreen */}
      <View style={[styles.glow, styles.glowTopLeft]} />
      <View style={[styles.glow, styles.glowBottomRight]} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* H1 */}
        <Text style={styles.headline}>{t("content.auth_onboarding.CreatePINContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.auth_onboarding.CreatePINContent.SUBHEADLINE")}</Text>

        {/* Lock pill badge */}
        <View style={styles.lockPill}>
          <Icon name="lock" size={14} color={colors.gold} />
          <Text style={styles.lockPillText}>{t("content.auth_onboarding.CreatePINContent.PROTECTS")}</Text>
        </View>

        {/* PIN inputs */}
        <Text style={styles.pinLabel}>{t("content.auth_onboarding.CreatePINContent.PIN_LABEL").toUpperCase()}</Text>
        
        <TouchableOpacity style={styles.pinRow} activeOpacity={1} onPress={() => {
        hiddenInputRef.current?.blur();
        setTimeout(() => hiddenInputRef.current?.focus(), 10);
      }}>
          
          <TextInput ref={hiddenInputRef} style={styles.hiddenInput} value={pin} onChangeText={handlePinChange} keyboardType="number-pad" maxLength={PIN_LENGTH} caretHidden pointerEvents="none" accessibilityLabel={t("accessibility.pin_input")} />
          

          {Array.from({
          length: PIN_LENGTH
        }).map((_, idx) => {
          const isFilled = idx < pin.length;
          const isFocused = idx === pin.length;
          return <View key={idx} style={[styles.pinBox, isFilled && styles.pinBoxFilled, isFocused && styles.pinBoxFocused, error && styles.pinBoxError]}>
                {isFilled && <View style={styles.dot} />}
              </View>;
        })}
        </TouchableOpacity>

        {/* Error */}
        {error && <View style={styles.errorRow}>
            <Icon name="error-outline" size={13} color={colors.softWarning} />
            <Text style={styles.errorText}>{error}</Text>
          </View>}

        {/* Guidance cards */}
        <View style={styles.guidanceList}>
          {GUIDANCE.map((g, idx) => <View key={idx} style={styles.guidanceCard}>
              <View style={styles.guidanceIconWrap}>
                <Icon name={g.icon} size={22} color={colors.gold} />
              </View>
              <View style={styles.guidanceContent}>
                <Text style={styles.guidanceTitle}>{t(g.title)}</Text>
                <Text style={styles.guidanceBody}>{g.body}</Text>
              </View>
            </View>)}
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton label={t("content.auth_onboarding.CreatePINContent.CTA_PRIMARY")} onPress={handleSetPin} disabled={pin.length < PIN_LENGTH} style={styles.primaryBtn} accessibilityLabel={t("accessibility.set_pin")} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>{t("content.auth_onboarding.CreatePINContent.BACK_TO_OTP")}</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            {t("content.auth_onboarding.CreatePINContent.SECURITY_NOTE")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>;
};
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  // Glow blobs — matches ConfirmPINScreen exactly
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
  scroll: {
    flex: 1,
    zIndex: 1
  },
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
  lockPill: {
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
  lockPillText: {
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
  pinRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: '100%',
    maxWidth: 280
  },
  pinBox: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.30)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    width: '100%',
    height: '100%',
    zIndex: 10,
    color: 'transparent'
  },
  pinBoxFilled: {
    borderColor: colors.gold,
    borderWidth: 1.5,
    shadowColor: colors.gold,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0
    },
    elevation: 4
  },
  pinBoxFocused: {
    borderColor: colors.gold,
    borderWidth: 1.5,
    shadowColor: colors.gold,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0
    },
    elevation: 4
  },
  pinBoxError: {
    borderColor: colors.softWarning
  },
  // Gold dot — exact match to ConfirmPINScreen: width:12 height:12 borderRadius:6
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
  guidanceList: {
    gap: spacing.md,
    width: '100%',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xxl
  },
  guidanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.50)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.12)',
    borderRadius: radius.xl,
    padding: spacing.lg
  },
  guidanceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  guidanceContent: {
    flex: 1,
    gap: spacing.xs
  },
  guidanceTitle: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  guidanceBody: {
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
  backBtn: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.25)',
    borderRadius: radius.full
  },
  backBtnText: {
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
export default CreatePINScreen;