import i18next from 'i18next';
import { useTranslation } from "react-i18next"; /**
* CPN-006 — LocationPermissionScreen
* Visual parity: Stitch location_permission_screen_fixed/code.html
*
* Stitch layout:
*  - ScreenTopBar (3-column: back | centered label | spacer)
*  - Radial gold glow (absolute top center)
*  - HeroIcon: location_on + shield badge (128×128, gold border/30, glow)
*  - Centered H1 (Playfair 28px) + body text
*  - GlassCard "How location helps": 3 benefit rows with 32×32 white/5 icon circles
*  - Privacy card: lock icon + "Private by design" + body text
*  - "Allow Location Access" gold rounded-full button + "Not Now" ghost
*  - Footer note
*
* CONTENT OVERRIDE: Stitch had wrong copy (phone_login copy pasted).
* Use LocationPermContent from authOnboardingContent.ts exclusively.
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
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import HeroIcon from '../../components/feedback/HeroIcon';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { AuthStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';


type Props = StackScreenProps<AuthStackParamList, typeof Routes.LOCATION_PERMISSION>;

const BULLETS = [
{ icon: i18next.t("content.auth_onboarding.LocationPermContent.BULLET_1_ICON"), text: i18next.t("content.auth_onboarding.LocationPermContent.BULLET_1") },
{ icon: i18next.t("content.auth_onboarding.LocationPermContent.BULLET_2_ICON"), text: i18next.t("content.auth_onboarding.LocationPermContent.BULLET_2") },
{ icon: i18next.t("content.auth_onboarding.LocationPermContent.BULLET_3_ICON"), text: i18next.t("content.auth_onboarding.LocationPermContent.BULLET_3") }];


const LocationPermissionScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const handleAllow = () => {
    // In production: call Permissions.requestLocation()
    navigation.navigate(Routes.CREATE_PIN);
  };

  const handleSkip = () => {
    navigation.navigate(Routes.CREATE_PIN);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      {/* Radial gold glow */}
      <View style={styles.radialGlow} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <HeroIcon
            iconName="location-on"
            iconSize={56}
            showBadge
            badgeIcon="shield" />
          
        </View>

        {/* Heading */}
        <Text style={styles.headline}>{t("content.auth_onboarding.LocationPermContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.auth_onboarding.LocationPermContent.SUBHEADLINE")}</Text>

        {/* Benefits glass card */}
        <GlassCard style={styles.benefitCard}>
          <Text style={styles.cardSectionLabel}>{t("content.auth_onboarding.LocationPermContent.HOW_HELPS")}</Text>
          {BULLETS.map((b, idx) =>
          <View
            key={idx}
            style={[
            styles.benefitRow,
            idx < BULLETS.length - 1 && styles.benefitRowBorder]
            }>
              <View style={styles.benefitIconCircle}>
                <Icon name={b.icon} size={18} color={colors.gold} />
              </View>
              <Text style={styles.benefitText}>{t(b.text)}</Text>
            </View>
          )}
        </GlassCard>

        {/* Privacy card */}
        <GlassCard style={styles.privacyCard}>
          <View style={styles.privacyRow}>
            <Icon name="lock" size={20} color={colors.textMuted} />
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>{t("content.auth_onboarding.LocationPermContent.PRIVATE_DESIGN")}</Text>
              <Text style={styles.privacyBody}>{t("content.auth_onboarding.LocationPermContent.PRIVACY_NOTE")}</Text>
            </View>
          </View>
        </GlassCard>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.LocationPermContent.CTA_PRIMARY")}
            onPress={handleAllow}
            style={styles.primaryBtn}
            accessibilityLabel={t("accessibility.allow_location_access")} />
          
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>{t("content.auth_onboarding.LocationPermContent.CTA_SKIP")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>{t("content.auth_onboarding.LocationPermContent.SKIP_NOTE")}</Text>
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
    top: 60,
    left: '50%',
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(214, 168, 79, 0.07)',
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
    marginBottom: spacing.xxl,
    marginTop: spacing.sm
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
    marginBottom: spacing.xxl,
    lineHeight: 22
  },
  benefitCard: {
    width: '100%',
    marginBottom: spacing.md
  },
  cardSectionLabel: {
    ...textStyles.capsSm,
    color: colors.gold,
    letterSpacing: 1.5,
    marginBottom: spacing.lg
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md
  },
  benefitRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 192, 204, 0.08)'
  },
  benefitIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2
  },
  benefitText: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20
  },
  privacyCard: {
    width: '100%',
    marginBottom: spacing.xxxl
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
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
    borderRadius: radius.full
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

export default LocationPermissionScreen;