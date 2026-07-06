import { useTranslation } from 'react-i18next';
/**
 * CPN-053 — Verification Processing Screen
 * Phase 4C — Active processing state with sync spinner, checking items, and what-next timeline.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
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

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.VERIFICATION_PROCESSING>;

export function VerificationProcessingScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { verificationStatus } = useApplicationStore();

  // Branch when verificationStatus changes.
  // Use replace() so back cannot return to a stale status screen.
  useEffect(() => {
    if (verificationStatus === 'approved') {
      navigation.replace(Routes.VERIFICATION_APPROVED);
    } else if (verificationStatus === 'rejected') {
      navigation.replace(Routes.VERIFICATION_REJECTED);
    } else if (verificationStatus === 'pending') {
      // Processing was completed without a final decision; return to the pending screen.
      navigation.replace(Routes.VERIFICATION_PENDING);
    }
    // 'processing' state remains on this screen \u2014 review is in progress.
  }, [verificationStatus, navigation]);

  // Rotating sync animation
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1800, useNativeDriver: true, easing: Easing.linear })
    ).start();
    return () => spin.stopAnimation();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Icon name="sync" size={44} color={colors.gold} />
            </Animated.View>
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Status badge ── */}
        <View style={styles.statusBadge}>
          <Icon name="hourglass-top" size={14} color={colors.gold} />
          <Text style={styles.statusBadgeText}>{t("content.application_kyc.VerificationProcessingContent.STATUS_BADGE")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.VerificationProcessingContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.VerificationProcessingContent.SUBHEADLINE")}</Text>

        {/* ── Checking items card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.CommonKycContent.REVIEW_STARTED")}</Text>
          <View style={styles.itemList}>
            {((Array.isArray(t("content.application_kyc.VerificationProcessingContent.CHECKING_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.VerificationProcessingContent.CHECKING_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.itemRow}>
                <View style={styles.itemIconWrap}>
                  <Icon name={item.icon as any} size={22} color={colors.gold} />
                </View>
                <Text style={styles.itemLabel}>{t(item.label)}</Text>
                <View style={styles.checkingBadge}>
                  <Text style={styles.checkingBadgeText}>{item.status}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── What happens next card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.CommonKycContent.WHAT_HAPPENS_NEXT")}</Text>
          <View style={styles.nextList}>
            {((Array.isArray(t("content.application_kyc.VerificationProcessingContent.NEXT_STEPS", { returnObjects: true })) ? (t("content.application_kyc.VerificationProcessingContent.NEXT_STEPS", { returnObjects: true }) as any[]) : [])).map((step, i) =>
            <View key={`ui-opt-${i}-${t(step.label)}`} style={styles.nextRow}>
                <View style={styles.nextIconWrap}>
                  <Icon name={step.icon as any} size={20} color={colors.gold} />
                </View>
                <Text style={styles.nextLabel}>{t(step.label)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Schedule note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="schedule" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.VerificationProcessingContent.SCHEDULE_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Do not duplicate warning ── */}
        <Text style={styles.warningNote}>{t("content.application_kyc.VerificationProcessingContent.DO_NOT_DUPLICATE")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.VerificationProcessingContent.CTA_VIEW_STATUS")}
          onPress={() => navigation.navigate(Routes.VERIFICATION_PENDING)}
          variant="primary"
          rightIcon={t("application.refresh")}
          accessibilityLabel={t("accessibility.view_verification_status")} />
        
        <ActionButton
          label={t("content.application_kyc.VerificationProcessingContent.CTA_CLOSE")}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.closeBtn}
          accessibilityLabel={t("accessibility.close_for_now")} />
        
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
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  statusBadgeText: { ...textStyles.labelMd, color: colors.gold },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  itemList: { gap: spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  itemIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  itemLabel: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  checkingBadge: {
    backgroundColor: `${colors.warningAmber}18`, borderRadius: radius.sm,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`,
    paddingHorizontal: spacing.sm, paddingVertical: 3
  },
  checkingBadgeText: { ...textStyles.labelSm, color: colors.warningAmber },

  nextList: { gap: spacing.sm },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  nextLabel: { ...textStyles.labelMd, color: colors.textPrimary },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  warningNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  closeBtn: { marginTop: spacing.xs }
});