import i18next from 'i18next';
/**
 * CPN-012 — TermsConsentScreen
 * Visual parity: Stitch companion_terms_safety_consent_screen/code.html
 *
 * Stitch layout:
 *  - Sticky top header: back + centered "CoBuddy Companion" + spacer, blur backdrop
 *  - "Required before application" badge pill (verified_user icon)
 *  - H1 "Review Companion Standards" (Playfair) + subtitle
 *  - Large GlassCard: "Companion Safety Agreement" H2 + body
 *    + 4 policy items (icon + title + subtitle)
 *  - Checkbox section: 4 checkboxes (custom styled — approximated with TouchableOpacity in RN)
 *  - Links row: Terms · Safety Standards · Privacy Policy
 *  - Info note card: lock icon + "Your information is protected"
 *  - Gold "Accept & Continue" button + bronze "Review Later" ghost + footer note
 *
 * P1 FIX APPLIED: No "hospitality" copy. Uses TermsConsentContent exclusively.
 * Content: TermsConsentContent from authOnboardingContent.ts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { OnboardingStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useAuthStore } from '../../store/slices/authStore';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<OnboardingStackParamList, typeof Routes.TERMS_CONSENT>;



const CHECKBOX_LABELS = [i18next.t("content.auth_onboarding.TermsConsentContent.CHECKBOX_LABEL"),

...((Array.isArray(i18next.t("content.auth_onboarding.TermsConsentContent.SECTION_2_ITEMS", { returnObjects: true })) ? (i18next.t("content.auth_onboarding.TermsConsentContent.SECTION_2_ITEMS", { returnObjects: true }) as any[]) : [])).slice(0, 3)];


const TermsConsentScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const [checked, setChecked] = useState<boolean[]>(Array(CHECKBOX_LABELS.length).fill(false));
  const { setAuthStatus } = useAuthStore();

  const allChecked = checked.every(Boolean);

  const toggleCheck = (idx: number) => {
    const next = [...checked];
    next[idx] = !next[idx];
    setChecked(next);
  };

  const handleAccept = () => {
    // Persist consent + transition to Application stack via root navigator
    setAuthStatus('applying');
  };

  const handleReviewLater = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Badge pill */}
        <View style={styles.badgePill}>
          <Icon name="verified-user" size={14} color={colors.gold} />
          <Text style={styles.badgePillText}> {t('onboarding.required_before_application')} </Text>
        </View>

        {/* H1 */}
        <Text style={styles.headline}>{t("content.auth_onboarding.TermsConsentContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.auth_onboarding.TermsConsentContent.SUBHEADLINE")}</Text>

        {/* Safety Agreement glass card */}
        <GlassCard borderStrength="subtle" style={styles.agreementCard}>
          <Text style={styles.agreementTitle}> {t('onboarding.companion_safety_agreement')} </Text>
          <Text style={styles.agreementBody}>
            {t("content.auth_onboarding.TermsConsentContent.SECTION_1_BODY")}
          </Text>

          {/* Policy items */}
          <View style={styles.policyList}>
            {((Array.isArray(t("content.auth_onboarding.TermsConsentContent.POLICY_ITEMS", { returnObjects: true })) ? (t("content.auth_onboarding.TermsConsentContent.POLICY_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, idx) =>
            <View key={`ui-opt-${idx}-${idx}`} style={styles.policyRow}>
                <Icon name={item.icon} size={22} color={colors.gold} />
                <View style={styles.policyContent}>
                  <Text style={styles.policyTitle}>{t(item.title)}</Text>
                  <Text style={styles.policyBody}>{item.body}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Checkboxes */}
        <View style={styles.checkboxSection}>
          {CHECKBOX_LABELS.map((label, idx) =>
          <TouchableOpacity accessibilityRole="button"
            key={`ui-opt-${idx}-${idx}`}
            style={styles.checkRow}
            onPress={() => toggleCheck(idx)}
            activeOpacity={0.8}
            
            accessibilityState={{ checked: checked[idx] }}
            accessibilityLabel={label}>
              <View style={[styles.checkbox, checked[idx] && styles.checkboxChecked]}>
                {checked[idx] &&
              <Icon name="check" size={14} color={colors.rootBg} />
              }
              </View>
              <Text style={styles.checkLabel}>{label}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Links row */}
        <View style={styles.linksRow}>
          <TouchableOpacity accessibilityRole="button">
            <Text style={styles.linkText}>{t("content.auth_onboarding.TermsConsentContent.TERMS_LINK")}</Text>
          </TouchableOpacity>
          <Text style={styles.linkDot}>{t("content.onboarding.TermsConsentScreen.text")}</Text>
          <TouchableOpacity accessibilityRole="button">
            <Text style={styles.linkText}>{t("content.auth_onboarding.TermsConsentContent.SAFETY_LINK")}</Text>
          </TouchableOpacity>
          <Text style={styles.linkDot}>{t("content.onboarding.TermsConsentScreen.text")}</Text>
          <TouchableOpacity accessibilityRole="button">
            <Text style={styles.linkText}>{t("content.auth_onboarding.TermsConsentContent.PRIVACY_LINK")}</Text>
          </TouchableOpacity>
        </View>

        {/* Info note card */}
        <View style={styles.infoCard}>
          <Icon name="lock" size={20} color={colors.textMuted} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}> {t('onboarding.your_information_is_protected')} </Text>
            <Text style={styles.infoBody}>
               {t('onboarding.verification_details_are_used_only_for_trust_safety_compliance_and_platform_operations')} </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.TermsConsentContent.CTA_PRIMARY")}
            onPress={handleAccept}
            disabled={!allChecked}
            rightIcon="arrow-forward"
            accessibilityLabel={t("accessibility.accept_terms_and_continue")} />
          
          {!allChecked &&
          <Text style={styles.disabledNote}>{t("content.auth_onboarding.TermsConsentContent.CTA_DISABLED_NOTE")}</Text>
          }
          <TouchableOpacity accessibilityRole="button" style={styles.reviewLaterBtn} onPress={handleReviewLater}>
            <Text style={styles.reviewLaterText}> {t('onboarding.review_later')} </Text>
          </TouchableOpacity>
          <Text style={styles.consentNote}>
             {t('onboarding.consent_is_required_to_continue_as_a_cobuddy_companion')} </Text>
        </View>
      </ScrollView>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.massive
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
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 36
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
    lineHeight: 22
  },
  agreementCard: {
    marginBottom: spacing.xxl
  },
  agreementTitle: {
    ...textStyles.headlineMd,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  agreementBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xl
  },
  policyList: {
    gap: spacing.lg
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg
  },
  policyContent: {
    flex: 1,
    gap: spacing.xs
  },
  policyTitle: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  policyBody: {
    ...textStyles.bodyXs,
    color: colors.textSecondary,
    lineHeight: 16
  },
  checkboxSection: {
    gap: spacing.lg,
    marginBottom: spacing.xxl
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(184, 192, 204, 0.30)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2
  },
  checkboxChecked: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  checkLabel: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xxl
  },
  linkText: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    textDecorationLine: 'underline'
  },
  linkDot: {
    ...textStyles.labelSm,
    color: colors.textMuted
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(39, 42, 44, 0.30)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.08)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl
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
    lineHeight: 16
  },
  ctaArea: {
    gap: spacing.md,
    alignItems: 'center'
  },
  disabledNote: {
    ...textStyles.labelXs,
    color: colors.textMuted,
    textAlign: 'center'
  },
  reviewLaterBtn: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.bronze,
    borderRadius: radius.sm
  },
  reviewLaterText: {
    ...textStyles.labelMd,
    color: colors.bronze
  },
  consentNote: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.60)',
    textAlign: 'center',
    lineHeight: 16
  }
});

export default TermsConsentScreen;