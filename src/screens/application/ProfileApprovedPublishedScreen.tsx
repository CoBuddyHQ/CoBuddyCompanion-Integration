import { useTranslation } from 'react-i18next';
/**
 * CPN-058 — Profile Approved & Published Screen
 * Phase 4C — Success state: profile is live. Shows next steps and safety reminder.
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
import { useAuthStore } from '../../store/slices/authStore';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { VerificationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.PROFILE_APPROVED_PUBLISHED>;

export function ProfileApprovedPublishedScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setProfileReviewStatus, basicDetails } = useApplicationStore();
  const { setAuthStatus } = useAuthStore();
  const displayName = basicDetails.displayName || 'You';

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setProfileReviewStatus('approved');
    Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
    Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true })]
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero (double-starred premium glow) ── */}
        {/* Profile Live badge */}
        <View style={styles.publishedBadge}>
          <Icon name="workspace-premium" size={12} color={colors.safetyGreen} />
          <Text style={styles.publishedBadgeText}>{t("content.application_kyc.ProfileApprovedPublishedContent.STATUS_BADGE")}</Text>
        </View>
        <Animated.View style={[styles.heroWrap, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.heroCircle}>
            <Icon name="auto-awesome" size={48} color={colors.gold} />
          </View>
          <View style={styles.heroBadgeLeft}>
            <Icon name="verified" size={14} color={colors.safetyGreen} />
          </View>
          <View style={styles.heroBadgeRight}>
            <Icon name="verified" size={14} color={colors.safetyGreen} />
          </View>
        </Animated.View>


        <Text style={styles.headline}>{t("content.application_kyc.ProfileApprovedPublishedContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ProfileApprovedPublishedContent.SUBHEADLINE")}</Text>

        {/* ── Publishing status card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileApprovedPublishedContent.STATUS_TITLE").toUpperCase()}</Text>
          <View style={styles.statusGrid}>
            {((Array.isArray(t("content.application_kyc.ProfileApprovedPublishedContent.STATUS_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.ProfileApprovedPublishedContent.STATUS_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.statusCell}>
                <View style={styles.statusCellIconWrap}>
                  <Icon name={item.icon as any} size={20} color={colors.safetyGreen} />
                </View>
                <Text style={styles.statusCellLabel}>{t(item.label)}</Text>
                <Text style={styles.statusCellStatus}>{item.status}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── What you can do next card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileApprovedPublishedContent.NEXT_STEPS_TITLE").toUpperCase()}</Text>
          <View style={styles.nextList}>
            {((Array.isArray(t("content.application_kyc.ProfileApprovedPublishedContent.NEXT_STEPS", { returnObjects: true })) ? (t("content.application_kyc.ProfileApprovedPublishedContent.NEXT_STEPS", { returnObjects: true }) as any[]) : [])).map((step, index) =>
            <View key={`ui-opt-${index}-${t(step.label)}`} style={styles.nextRow}>
                <View style={styles.nextIconWrap}>
                  <Icon name={step.icon as any} size={22} color={colors.gold} />
                </View>
                <View style={styles.nextContent}>
                  <Text style={styles.nextLabel}>{t(step.label)}</Text>
                  <Text style={styles.nextDesc}>{t(step.description)}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.textMuted} />
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Profile preview card ── */}
        <GlassCard style={styles.previewCard}>
          <Text style={styles.previewTitle}>{t("application.public_profile_preview")}</Text>
          <View style={styles.previewContent}>
            <View style={styles.previewAvatar}>
              <Icon name="person" size={28} color={colors.gold} />
            </View>
            <View style={styles.previewInfo}>
              <View style={styles.previewNameRow}>
                <Text style={styles.previewName}>{displayName}</Text>
                <Icon name="verified" size={16} color={colors.safetyGreen} />
              </View>
              <Text style={styles.previewSub}>{t("application.premium_executive_companion")}</Text>
              <View style={styles.previewMetaRow}>
                <View style={styles.previewMeta}>
                  <Icon name="location-on" size={12} color={colors.textMuted} />
                  <Text style={styles.previewMetaText}>{t("application.india")}</Text>
                </View>
                <View style={styles.previewMeta}>
                  <Icon name="star" size={12} color={colors.gold} />
                  <Text style={styles.previewMetaText}>{t("application.top_rated")}</Text>
                </View>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ── Safety reminder card ── */}
        <GlassCard style={styles.safetyCard}>
          <View style={styles.safetyHeader}>
            <View style={styles.safetyIconWrap}>
              <Icon name="lock" size={20} color={colors.gold} />
            </View>
            <Text style={styles.safetyTitle}>{t("content.application_kyc.ProfileApprovedPublishedContent.SAFETY_TITLE")}</Text>
          </View>
          {((Array.isArray(t("content.application_kyc.ProfileApprovedPublishedContent.SAFETY_RULES", { returnObjects: true })) ? (t("content.application_kyc.ProfileApprovedPublishedContent.SAFETY_RULES", { returnObjects: true }) as any[]) : [])).map((rule, index) =>
          <View key={`ui-opt-${index}-${rule}`} style={styles.safetyRow}>
              <Icon name="check" size={14} color={colors.safetyGreen} />
              <Text style={styles.safetyText}>{rule}</Text>
            </View>
          )}
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ProfileApprovedPublishedContent.CTA_DASHBOARD")}
          onPress={() => setAuthStatus('active')}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.go_to_dashboard")} />
        
        <ActionButton
          label={t("content.application_kyc.ProfileApprovedPublishedContent.CTA_PREVIEW")}
          onPress={() => {}}
          variant="ghost"
          leftIcon={t("application.visibility")}
          style={styles.previewBtn}
          accessibilityLabel={t("accessibility.view_profile_preview")} />
        
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
    borderWidth: 2, borderColor: `${colors.gold}50`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 28, elevation: 12
  },
  heroBadgeLeft: {
    position: 'absolute', top: 4, left: -4, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: `${colors.safetyGreen}40`,
    alignItems: 'center', justifyContent: 'center'
  },
  heroBadgeRight: {
    position: 'absolute', bottom: 4, right: -4, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: `${colors.safetyGreen}40`,
    alignItems: 'center', justifyContent: 'center'
  },

  badgeRow: { flexDirection: 'row', gap: spacing.sm, alignSelf: 'center' },
  stepBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 5
  },
  stepBadgeText: { ...textStyles.labelSm, color: colors.gold },
  publishedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`, paddingHorizontal: spacing.sm, paddingVertical: 5
  },
  publishedBadgeText: { ...textStyles.labelSm, color: colors.safetyGreen },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statusCell: {
    flex: 1, minWidth: '45%', backgroundColor: colors.elevatedSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, alignItems: 'flex-start', gap: 4
  },
  statusCellIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: `${colors.safetyGreen}15`,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`, alignItems: 'center', justifyContent: 'center'
  },
  statusCellLabel: { ...textStyles.labelSm, color: colors.textSecondary, marginTop: 4 },
  statusCellStatus: { ...textStyles.labelMd, color: colors.safetyGreen },

  nextList: { gap: spacing.md },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  nextContent: { flex: 1 },
  nextLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  nextDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

  previewCard: { gap: spacing.md },
  previewTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },
  previewContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  previewAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.elevatedSurface,
    borderWidth: 1.5, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  previewInfo: { flex: 1 },
  previewNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 4 },
  previewName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: colors.textPrimary },
  previewSub: { ...textStyles.labelSm, color: colors.textSecondary, marginBottom: 6 },
  previewMetaRow: { flexDirection: 'row', gap: spacing.md },
  previewMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewMetaText: { ...textStyles.labelSm, color: colors.textMuted },

  safetyCard: { borderColor: `${colors.safetyGreen}25`, gap: spacing.sm },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  safetyIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'
  },
  safetyTitle: { ...textStyles.labelLg, color: colors.textPrimary },
  safetyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  safetyText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  previewBtn: { marginTop: spacing.xs }
});