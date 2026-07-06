import { useTranslation } from 'react-i18next';
/**
 * CPN-054 — Verification Approved Screen
 * Phase 4C — Green success state after document verification approval.
 * Next: PROFILE_REVIEW_PENDING (CPN-057) — companion awaits CoBuddy's profile review decision.
 * NOTE: setAuthStatus is NOT called here. Profile setup was already done before submission.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { VerificationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.VERIFICATION_APPROVED>;

export function VerificationApprovedScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setVerificationStatus, setCurrentStage } = useApplicationStore();

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setVerificationStatus('approved');
    Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true })]
    ).start();
  }, []);

  const handleStartSetup = () => {
    setCurrentStage('verification_approved');
    // Document verification approved → return to CPN-057 ProfileReviewPending.
    // Stay inside VerificationNavigator — profile setup was already completed before
    // the companion submitted. Do NOT switch authStatus here.
    navigation.navigate(Routes.PROFILE_REVIEW_PENDING);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Animated hero ── */}
        <Animated.View style={[styles.heroWrap, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.heroCircle}>
            <Icon name="verified" size={48} color={colors.safetyGreen} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="security" size={16} color={colors.safetyGreen} />
          </View>
        </Animated.View>

        {/* ── Status badge ── */}
        <View style={styles.approvedBadge}>
          <Icon name="verified" size={14} color={colors.safetyGreen} />
          <Text style={styles.approvedBadgeText}>{t("content.application_kyc.VerificationApprovedContent.STATUS_BADGE")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.VerificationApprovedContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.VerificationApprovedContent.SUBHEADLINE")}</Text>

        {/* ── Verified companion badge ── */}
        <View style={styles.companionBadge}>
          <Icon name="verified-user" size={16} color={colors.safetyGreen} />
          <Text style={styles.companionBadgeText}>{t("application.verified_companion_applicant")}</Text>
        </View>

        {/* ── Approved items card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.CommonKycContent.VERIFICATION_COMPLETE")}</Text>
          <View style={styles.approvedList}>
            {((Array.isArray(t("content.application_kyc.VerificationApprovedContent.APPROVED_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.VerificationApprovedContent.APPROVED_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${item}`} style={styles.approvedRow}>
                <Icon name="check-circle" size={18} color={colors.safetyGreen} />
                <Text style={styles.approvedItemText}>{item}</Text>
                <View style={styles.approvedBadgeSmall}>
                  <Text style={styles.approvedBadgeSmallText}>{t("content.application_kyc.CommonKycContent.APPROVED")}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Next step card ── */}
        <GlassCard style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <View style={styles.nextIconWrap}>
              <Icon name="workspace-premium" size={22} color={colors.gold} />
            </View>
            <Text style={styles.nextTitle}>{t("content.application_kyc.VerificationApprovedContent.NEXT_STEP_TITLE")}</Text>
          </View>
          <Text style={styles.nextDesc}>{t("content.application_kyc.VerificationApprovedContent.NEXT_STEP_DESC")}</Text>
          <GlassCard style={styles.reviewNoteInner}>
            <View style={styles.reviewNoteRow}>
              <Icon name="info" size={14} color={colors.textMuted} />
              <Text style={styles.reviewNoteText}>{t("content.application_kyc.VerificationApprovedContent.REVIEW_NOTE")}</Text>
            </View>
          </GlassCard>
        </GlassCard>

        {/* ── Post approval note ── */}
        <Text style={styles.postNote}>{t("content.application_kyc.VerificationApprovedContent.POST_APPROVAL_NOTE")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.VerificationApprovedContent.CTA_CONTINUE_REVIEW")}
          onPress={handleStartSetup}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.start_profile_setup")} />
        
        <ActionButton
          label={t("content.application_kyc.VerificationApprovedContent.CTA_VIEW_SUMMARY")}
          onPress={() => navigation.navigate(Routes.VERIFICATION_HUB)}
          variant="ghost"
          style={styles.summaryBtn}
          accessibilityLabel={t("accessibility.view_verification_summary")} />
        
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg },

  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: colors.cardSurface,
    borderWidth: 2, borderColor: `${colors.safetyGreen}50`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.safetyGreen, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 10
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: `${colors.safetyGreen}40`,
    alignItems: 'center', justifyContent: 'center'
  },

  approvedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.safetyGreen}40`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  approvedBadgeText: { ...textStyles.labelMd, color: colors.safetyGreen },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  companionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.cardSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  companionBadgeText: { ...textStyles.labelMd, color: colors.safetyGreen },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  approvedList: { gap: spacing.sm },
  approvedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  approvedItemText: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  approvedBadgeSmall: {
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.sm,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`,
    paddingHorizontal: spacing.sm, paddingVertical: 3
  },
  approvedBadgeSmallText: { ...textStyles.labelSm, color: colors.safetyGreen },

  nextCard: { gap: spacing.md },
  nextHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  nextTitle: { ...textStyles.labelLg, color: colors.textPrimary },
  nextDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },
  reviewNoteInner: { marginTop: spacing.xs },
  reviewNoteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  reviewNoteText: { flex: 1, ...textStyles.labelSm, color: colors.textMuted, lineHeight: 16 },

  postNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  summaryBtn: { marginTop: spacing.xs }
});