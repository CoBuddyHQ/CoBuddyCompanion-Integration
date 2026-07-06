/**
 * CPN-001 — SplashScreen
 * Visual parity: Stitch splash_screen/code.html
 *
 * Stitch layout:
 *  - Full center, dark bg #0A192F with radial gold glow at center
 *  - 96×96 circle (rounded-full, gold border /30, shadow glow): shield_person icon 48px
 *  - Outer subtle ring at 110% scale
 *  - "CoBuddy" in Playfair Display ~40px
 *  - "Companion App" subtitle in gold /90 headline-md
 *  - Pill badge: verified icon + "Verified Companion Partner Platform"
 *  - Bottom: pulsing dot + "SAFE. VERIFIED. PROFESSIONAL."
 *
 * Content: SplashContent from authOnboardingContent.ts
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import { useTranslation } from "react-i18next";

type Props = StackScreenProps<AuthStackParamList, typeof Routes.SPLASH>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Logo fade + scale in
    Animated.parallel([
    Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    Animated.spring(logoScale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true })]
    ).start();

    // Tagline
    Animated.sequence([
    Animated.delay(400),
    Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true })]
    ).start();

    // Badge pill
    Animated.sequence([
    Animated.delay(650),
    Animated.timing(badgeOpacity, { toValue: 1, duration: 400, useNativeDriver: true })]
    ).start();

    // Bottom trustline
    Animated.sequence([
    Animated.delay(900),
    Animated.timing(bottomOpacity, { toValue: 1, duration: 400, useNativeDriver: true })]
    ).start();

    // Infinite pulse for the dot
    Animated.loop(
      Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0.6, duration: 1000, useNativeDriver: true })]
      )
    ).start();

    const timer = setTimeout(() => {
      navigation.replace(Routes.PHONE_LOGIN);
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigation, logoOpacity, logoScale, taglineOpacity, badgeOpacity, bottomOpacity, pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      {/* Radial gold glow behind logo */}
      <View style={styles.glowCenter} />

      {/* Logo cluster */}
      <Animated.View
        style={[
        styles.logoCluster,
        { opacity: logoOpacity, transform: [{ scale: logoScale }] }]
        }>

        {/* Outer ring */}
        <View style={styles.outerRing} />

        {/* Logo circle */}
        <View style={styles.logoCircle}>
          <Icon name="verified-user" size={48} color={colors.gold} />
        </View>

        {/* Brand name — Playfair Display via textStyles.displayMd */}
        <Text style={styles.brandName}>{t("content.auth_onboarding.SplashContent.BRAND_NAME")}</Text>

        {/* Subtitle in gold */}
        <Animated.Text style={[styles.companionLabel, { opacity: taglineOpacity }]}>
           {t('auth.companion_app')} </Animated.Text>
      </Animated.View>

      {/* Badge pill */}
      <Animated.View style={[styles.badge, { opacity: badgeOpacity }]}>
        <Icon name="verified" size={14} color={colors.gold} />
        <Text style={styles.badgeText}>{t("content.auth_onboarding.SplashContent.VERIFIED_PLATFORM")}</Text>
      </Animated.View>

      {/* Bottom trust line */}
      <Animated.View style={[styles.bottomArea, { opacity: bottomOpacity }]}>
        {/* Pulsing dot */}
        <View style={styles.dotWrap}>
          <View style={styles.dotRing} />
          <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
        </View>
        <Text style={styles.trustLine}>{t("content.auth_onboarding.SplashContent.TRUST_LINE")}</Text>
      </Animated.View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.rootBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  glowCenter: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(214, 168, 79, 0.07)',
    top: '20%',
    alignSelf: 'center'
  },
  logoCluster: {
    alignItems: 'center'
  },
  outerRing: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.10)',
    alignSelf: 'center',
    top: -8
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
    shadowColor: colors.gold,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8
  },
  brandName: {
    ...textStyles.displayLg,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  companionLabel: {
    ...textStyles.headlineSm,
    color: 'rgba(214, 168, 79, 0.90)',
    letterSpacing: 0.5
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(16, 27, 45, 0.60)',
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.18)',
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.xxxxl
  },
  badgeText: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    letterSpacing: 0.3
  },
  bottomArea: {
    position: 'absolute',
    bottom: spacing.massive,
    alignItems: 'center',
    gap: spacing.md
  },
  dotWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(214, 168, 79, 0.20)'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold
  },
  trustLine: {
    ...textStyles.capsSm,
    color: 'rgba(126, 136, 150, 0.70)',
    letterSpacing: 2
  }
});

export default SplashScreen;