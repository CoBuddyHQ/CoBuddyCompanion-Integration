import i18next from 'i18next';
/**
 * CPN-010 — CompanionWelcomeScreen
 * Visual parity: Stitch companion_welcome_screen_updated_theme/code.html
 *
 * Stitch layout:
 *  - Background: linear-gradient(180deg, #07111F → #0B1628)
 *  - Radial subtle gold glow overlay (top 30%)
 *  - Small brand header: 48×48 circle (diamond icon + gold border) + "CoBuddy Companion" caps
 *  - Hero text: gradient gold→bronze headline (approximated as gold flat color in RN)
 *  - Subtitle body text
 *  - 3 glass cards (glassmorphism, hover lift effect) — each: icon circle + bold title + body
 *  - Trust banner: border-t/border-b gold, "Designed for Professional Companions" + text
 *  - "Let's Begin" button: gold + arrow_forward icon
 *  - "Already onboarded? Sign In" text link
 *  - Footer disclaimer
 *
 * Content: CompanionWelcomeContent from authOnboardingContent.ts
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { OnboardingStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useTranslation } from "react-i18next";

type Props = StackScreenProps<OnboardingStackParamList, typeof Routes.COMPANION_WELCOME>;

const VALUE_CARDS = [
{
  icon: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_1_ICON"),
  title: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_1_TITLE"),
  body: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_1_BODY")
},
{
  icon: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_2_ICON"),
  title: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_2_TITLE"),
  body: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_2_BODY")
},
{
  icon: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_3_ICON"),
  title: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_3_TITLE"),
  body: i18next.t("content.auth_onboarding.CompanionWelcomeContent.POINT_3_BODY")
}];


const CompanionWelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleContinue = () => {
    navigation.navigate(Routes.ROLE_CONFIRMATION);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Radial glow overlay */}
      <View style={styles.radialGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Brand header */}
        <View style={styles.brandHeader}>
          <View style={styles.brandIconCircle}>
            <Icon name="diamond" size={22} color={colors.gold} />
          </View>
          <Text style={styles.brandLabel}> {t('onboarding.cobuddy_companion')} </Text>
        </View>

        {/* Hero headline — gold color (RN approx. of gold→bronze gradient text) */}
        <Text style={styles.heroHeadline}>{t("content.auth_onboarding.CompanionWelcomeContent.HEADLINE")}</Text>
        <Text style={styles.heroSubheadline}>{t("content.auth_onboarding.CompanionWelcomeContent.SUBHEADLINE")}</Text>

        {/* Value cards */}
        <View style={styles.cardList}>
          {VALUE_CARDS.map((card, idx) =>
          <GlassCard key={idx} borderStrength="subtle" style={styles.valueCard}>
              <View style={styles.valueCardInner}>
                <View style={styles.cardIconCircle}>
                  <Icon name={card.icon} size={22} color={colors.gold} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{t(card.title)}</Text>
                  <Text style={styles.cardBody}>{card.body}</Text>
                </View>
              </View>
            </GlassCard>
          )}
        </View>

        {/* Trust banner */}
        <View style={styles.trustBanner}>
          <Text style={styles.trustBannerTitle}> {t('onboarding.designed_for_professional_companions')} </Text>
          <Text style={styles.trustBannerBody}>
             {t('onboarding.everything_you_need_to_manage_availability_sessions_support_and_growth_in_one_place')} </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.CompanionWelcomeContent.CTA_PRIMARY")}
            onPress={handleContinue}
            rightIcon="arrow-forward"
            style={styles.primaryBtn}
            accessibilityLabel={t("accessibility.continue_to_companion_onboarding")} />
          
          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => navigation.navigate(Routes.PHONE_LOGIN as any)}>
            <Text style={styles.signInText}> {t('onboarding.already_onboarded')} {' '}</Text>
            <Text style={styles.signInCta}> {t('onboarding.sign_in')} </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
           {t('onboarding.by_continuing_you_agree_to_cobuddy_companion_standards_and_safety_policies')} </Text>
      </ScrollView>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  radialGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(214, 168, 79, 0.04)',
    zIndex: 0,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200
  },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center'
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxxl
  },
  brandIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(16, 27, 45, 0.60)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandLabel: {
    ...textStyles.labelSm,
    color: colors.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  heroHeadline: {
    ...textStyles.displayMd,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 38
  },
  heroSubheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
    maxWidth: 320
  },
  cardList: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xxl
  },
  valueCard: {
    width: '100%'
  },
  valueCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
  },
  cardIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardContent: {
    flex: 1,
    gap: spacing.xs
  },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold
  },
  cardBody: {
    ...textStyles.bodyXs,
    color: colors.textSecondary,
    lineHeight: 16
  },
  trustBanner: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.20)',
    backgroundColor: 'rgba(11, 22, 40, 0.40)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.sm
  },
  trustBannerTitle: {
    ...textStyles.headlineSm,
    color: colors.gold,
    textAlign: 'center'
  },
  trustBannerBody: {
    ...textStyles.bodyXs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280
  },
  ctaArea: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  primaryBtn: {
    width: '100%',
    borderRadius: radius.full
  },
  signInLink: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  signInText: {
    ...textStyles.labelMd,
    color: colors.textMuted
  },
  signInCta: {
    ...textStyles.labelMd,
    color: colors.gold,
    textDecorationLine: 'underline'
  },
  disclaimer: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.55)',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280
  }
});

export default CompanionWelcomeScreen;