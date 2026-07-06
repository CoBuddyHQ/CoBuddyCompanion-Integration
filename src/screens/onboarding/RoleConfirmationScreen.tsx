import i18next from 'i18next';
/**
 * CPN-011 — RoleConfirmationScreen
 * Visual parity: Stitch companion_role_confirmation_screen/code.html
 *
 * Stitch layout:
 *  - Ambient gold glow (absolute top center)
 *  - Back + "CoBuddy Companion" label header
 *  - H1 + subtitle (left aligned)
 *  - GlassCard (gold border): 48×48 icon circle (gold/10 bg) + verified_user icon
 *    + "Companion Partner" H2 + role subtitle
 *    Then 4 feature rows: icon + text (muted icon color)
 *  - Trust note card: bg #112240 + "Before you continue" label + text
 *  - Gold "Confirm & Continue" button (rounded-lg) + ghost "Not a companion?" + footer note
 *
 * Content: RoleConfirmContent from authOnboardingContent.ts
 */

import React from 'react';
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

import { useTranslation } from "react-i18next";

type Props = StackScreenProps<OnboardingStackParamList, typeof Routes.ROLE_CONFIRMATION>;

const COMMITMENTS = [
{ icon: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_1_ICON"), text: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_1") },
{ icon: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_2_ICON"), text: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_2") },
{ icon: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_3_ICON"), text: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_3") },
{ icon: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_4_ICON"), text: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_4") },
{ icon: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_5_ICON"), text: i18next.t("content.auth_onboarding.RoleConfirmContent.COMMIT_5") }];


const RoleConfirmationScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      {/* Ambient glow */}
      <View style={styles.ambientGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.headline}>{t("content.auth_onboarding.RoleConfirmContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.auth_onboarding.RoleConfirmContent.SUBHEADLINE")}</Text>

        {/* Role glass card */}
        <GlassCard borderStrength="strong" style={styles.roleCard}>
          {/* Card header: icon + title */}
          <View style={styles.roleCardHeader}>
            <View style={styles.roleIconCircle}>
              <Icon name="verified-user" size={24} color={colors.gold} />
            </View>
            <View style={styles.roleTitleGroup}>
              <Text style={styles.roleTitle}>{t("content.auth_onboarding.RoleConfirmContent.ROLE_TITLE")}</Text>
              <Text style={styles.roleSubtitle}>
                {t("content.auth_onboarding.RoleConfirmContent.ROLE_SUBTITLE")}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* Commitment rows */}
          <View style={styles.commitmentList}>
            {COMMITMENTS.map((c, idx) =>
            <View key={idx} style={styles.commitRow}>
                <Icon name={c.icon} size={20} color={colors.textMuted} />
                <Text style={styles.commitText}>{t(c.text)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Trust note card */}
        <View style={styles.trustCard}>
          <Text style={styles.trustCardLabel}>{t("content.auth_onboarding.RoleConfirmContent.TRUST_LABEL")}</Text>
          <Text style={styles.trustCardBody}>
            {t("content.auth_onboarding.RoleConfirmContent.TRUST_BODY")}
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.RoleConfirmContent.CTA_PRIMARY")}
            onPress={() => navigation.navigate(Routes.TERMS_CONSENT)}
            accessibilityLabel={t("accessibility.confirm_role_and_continue_to_terms")} />
          
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.ghostBtnText}> {t('onboarding.not_a_companion_go_back')} </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.guidelinesRow}>
          <Icon name="menu-book" size={14} color={colors.gold} />
          <TouchableOpacity>
            <Text style={styles.guidelinesLink}>{t("content.auth_onboarding.RoleConfirmContent.CTA_SECONDARY")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
           {t('onboarding.your_identity_and_profile_details_will_be_verified_before_your_profile_goes_live')} </Text>
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
    top: -40,
    left: '50%',
    marginLeft: -400,
    width: 800,
    height: 800,
    borderRadius: 400,
    backgroundColor: colors.gold,
    opacity: 0.04,
    zIndex: 0
  },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl
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
  roleCard: {
    marginBottom: spacing.md
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  roleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  roleTitleGroup: {
    flex: 1,
    gap: spacing.xs
  },
  roleTitle: {
    ...textStyles.headlineMd,
    color: colors.textPrimary
  },
  roleSubtitle: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(184, 192, 204, 0.12)',
    marginBottom: spacing.lg
  },
  commitmentList: {
    gap: spacing.lg
  },
  commitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
  },
  commitText: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22
  },
  trustCard: {
    backgroundColor: '#112240',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.20)',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxxl,
    gap: spacing.xs
  },
  trustCardLabel: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  trustCardBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18
  },
  ctaArea: {
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md
  },
  ghostBtnText: {
    ...textStyles.labelMd,
    color: colors.textMuted
  },
  guidelinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md
  },
  guidelinesLink: {
    ...textStyles.labelMd,
    color: colors.gold
  },
  disclaimer: {
    ...textStyles.labelXs,
    color: 'rgba(126, 136, 150, 0.55)',
    textAlign: 'center',
    lineHeight: 18
  }
});

export default RoleConfirmationScreen;