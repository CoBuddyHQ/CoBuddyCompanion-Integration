/**
 * CPN-009 — Native biometric enrollment is unavailable in this build.
 * Keep PIN onboarding available without registering synthetic credentials.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated
} from
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

import { useAuthStore } from '../../store/slices/authStore';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<AuthStackParamList, typeof Routes.BIOMETRIC_SETUP>;

const BiometricSetupScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(0.85)).current;
  const { setAuthStatus } = useAuthStore();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.12, duration: 1500, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0.85, duration: 1500, useNativeDriver: true })]
      )
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const handleSkip = () => {
    // Skip biometrics — still go to onboarding, not application
    setAuthStatus('onboarding');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => _navigation.goBack()} />

      {/* Ambient glow */}
      <View style={styles.ambientGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero fingerprint circle with pulsing ring */}
        <View style={styles.heroWrap}>
          {/* Pulsing ring */}
          <Animated.View
            style={[
            styles.pulseRing,
            { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({
                inputRange: [0.85, 1.12],
                outputRange: [0.25, 0]
              }) }]
            } />
          
          {/* Main circle */}
          <View style={styles.heroCircle}>
            <Icon name="fingerprint" size={60} color={colors.gold} />
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.headline}>{t('auth.biometric_unavailable_title', 'Biometric sign-in unavailable')}</Text>
        <Text style={styles.subheadline}>
          {t('auth.biometric_unavailable_body', 'Biometric sign-in is not available in this app yet. You can continue with your PIN.')}
        </Text>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.BiometricContent.CTA_SKIP", 'Use PIN Only')}
            onPress={handleSkip}
            style={styles.primaryBtn}
            accessibilityLabel={t('auth.use_pin_only', 'Use PIN Only')} />
        </View>
      </ScrollView>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  ambientGlow: {
    position: 'absolute',
    top: 80,
    left: '50%',
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(175, 141, 17, 0.08)',
    zIndex: 0
  },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl
  },
  heroWrap: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.md
  },
  pulseRing: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 2,
    borderColor: colors.gold
  },
  heroCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8
  },
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 36
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    maxWidth: 320
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.15)',
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.xxl
  },
  badgePillText: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  featureCard: {
    width: '100%',
    marginBottom: spacing.md
  },
  cardSectionLabel: {
    ...textStyles.capsSm,
    color: colors.gold,
    letterSpacing: 1.5,
    marginBottom: spacing.lg
  },
  featureList: {
    gap: spacing.lg
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.elevatedSurface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  featureText: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    flex: 1
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.40)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.10)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxxl,
    width: '100%'
  },
  privacyContent: {
    flex: 1,
    gap: spacing.xs
  },
  privacyTitle: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  privacyBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18
  },
  ctaArea: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  primaryBtn: {
    borderRadius: radius.xl
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md
  },
  skipText: {
    ...textStyles.labelMd,
    color: colors.textMuted
  },
  footerNote: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.60)',
    textAlign: 'center'
  }
});

export default BiometricSetupScreen;
