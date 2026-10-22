import i18next from 'i18next';
/**
 * CPN-005 — NotificationPermissionScreen
 * Visual parity: Stitch notification_permission_screen/code.html
 *
 * Stitch layout:
 *  - ScreenTopBar (left-aligned)
 *  - HeroIcon: notifications_active + shield badge
 *  - Centered H1 (Playfair 28px) + body text
 *  - GlassCard "Why notifications matter" (gold section header):
 *    4 benefit rows with 32×32 gold/10 icon circles + title + subtitle
 *  - Trust card: verified_user icon + privacy text
 *  - "Allow Notifications" gold button + "Skip for Now" ghost
 *  - Footer note
 *
 * Content: NotificationPermContent from authOnboardingContent.ts
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
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
import { requestNotificationAccess } from '../../services/devicePermissions';

import { useTranslation } from "react-i18next";

type Props = StackScreenProps<AuthStackParamList, typeof Routes.NOTIFICATION_PERMISSION>;

const BENEFITS = [
{ icon: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_1_ICON"), text: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_1") },
{ icon: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_2_ICON"), text: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_2") },
{ icon: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_3_ICON"), text: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_3") },
{ icon: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_4_ICON"), text: i18next.t("content.auth_onboarding.NotificationPermContent.BULLET_4") }];


const NotificationPermissionScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [requesting, setRequesting] = useState(false);
  const requestPending = useRef(false);
  const handleAllow = async () => {
    if (requestPending.current) return;
    requestPending.current = true;
    setRequesting(true);
    try {
      const result = await requestNotificationAccess();
      if (result === 'granted' || result === 'not-required') {
        navigation.navigate(Routes.LOCATION_PERMISSION);
      } else {
        const message = result === 'blocked'
          ? t('auth.notifications_blocked', 'Notifications are blocked. You can change this in device settings or select Skip for Now.')
          : result === 'denied'
            ? t('auth.notifications_denied', 'Notification permission was not granted. You can try again or select Skip for Now.')
            : t('auth.notifications_unavailable', 'Notification permission cannot be requested in this app on this device. You can select Skip for Now to continue.');
        Alert.alert(t('auth.notifications_not_enabled', 'Notifications not enabled'), message);
      }
    } finally {
      requestPending.current = false;
      setRequesting(false);
    }
  };

  const handleSkip = () => {
    if (requestPending.current) return;
    navigation.navigate(Routes.LOCATION_PERMISSION);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero icon */}
        <View style={styles.heroWrap}>
          <HeroIcon
            iconName="notifications-active"
            iconSize={56}
            showBadge
            badgeIcon="shield" />
          
        </View>

        {/* Heading */}
        <Text style={styles.headline}>{t("content.auth_onboarding.NotificationPermContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.auth_onboarding.NotificationPermContent.SUBHEADLINE")}</Text>

        {/* Benefits glass card */}
        <GlassCard style={styles.benefitCard}>
          <Text style={styles.cardSectionLabel}>{t("content.auth_onboarding.NotificationPermContent.WHY_MATTER")}</Text>
          {BENEFITS.map((b, idx) =>
          <View
            key={idx}
            style={[
            styles.benefitRow,
            idx < BENEFITS.length - 1 && styles.benefitRowBorder]
            }>
              <View style={styles.benefitIconCircle}>
                <Icon name={b.icon} size={18} color={colors.gold} />
              </View>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          )}
        </GlassCard>

        {/* Trust card */}
        <View style={styles.trustCard}>
          <Icon name="verified-user" size={20} color={colors.textMuted} />
          <Text style={styles.trustText}>
             {t('auth.notifications_are_never_used_for_marketing_only_session_relevant_alerts_are_sent')} </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.NotificationPermContent.CTA_PRIMARY")}
            onPress={handleAllow}
            loading={requesting}
            accessibilityLabel={t("accessibility.allow_notifications")} />
          
          <TouchableOpacity accessibilityRole="button" style={styles.skipBtn} onPress={handleSkip} disabled={requesting}>
            <Text style={styles.skipText}>{t("content.auth_onboarding.NotificationPermContent.CTA_SKIP")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>{t("content.auth_onboarding.NotificationPermContent.SKIP_NOTE")}</Text>
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl
  },
  heroWrap: {
    marginBottom: spacing.xxl,
    marginTop: spacing.md
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
    alignItems: 'center',
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
    backgroundColor: colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  benefitText: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.40)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.10)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxxl,
    width: '100%'
  },
  trustText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18
  },
  ctaArea: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl
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

export default NotificationPermissionScreen;
