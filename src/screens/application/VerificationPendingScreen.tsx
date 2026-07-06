import { useTranslation } from 'react-i18next';
/**
 * CPN-052 — Verification Pending Screen
 * Phase 4C — All 6 steps submitted; waiting for manual CoBuddy review.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.VERIFICATION_PENDING>;

export function VerificationPendingScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { verificationStatus, setVerificationStatus } = useApplicationStore();

  // Branch immediately when the store reflects a changed verification outcome.
  // Use replace() so the back button cannot return to this stale status screen.
  useEffect(() => {
    if (verificationStatus === 'approved') {
      navigation.replace(Routes.VERIFICATION_APPROVED);
    } else if (verificationStatus === 'rejected') {
      navigation.replace(Routes.VERIFICATION_REJECTED);
    } else if (verificationStatus === 'processing') {
      navigation.replace(Routes.VERIFICATION_PROCESSING);
    }
    // 'pending' state remains on this screen — awaiting manual review.
  }, [verificationStatus, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero (pending = warningAmber) ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="pending-actions" size={44} color={colors.warningAmber} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Status badge ── */}
        <View style={styles.statusBadge}>
          <Icon name="schedule" size={14} color={colors.warningAmber} />
          <Text style={styles.statusBadgeText}>{t("content.application_kyc.VerificationPendingContent.STATUS_BADGE")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.VerificationPendingContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.VerificationPendingContent.SUBHEADLINE")}</Text>

        {/* ── Submitted steps card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.VerificationPendingContent.SUBMITTED_TITLE").toUpperCase()}</Text>
          <View style={styles.progressHeader}>
            <Text style={styles.progressSub}>{((Array.isArray(t("content.application_kyc.VerificationPendingContent.SUBMITTED_STEPS", { returnObjects: true })) ? (t("content.application_kyc.VerificationPendingContent.SUBMITTED_STEPS", { returnObjects: true }) as any[]) : [])).length}{t("application.of")}{((Array.isArray(t("content.application_kyc.VerificationPendingContent.SUBMITTED_STEPS", { returnObjects: true })) ? (t("content.application_kyc.VerificationPendingContent.SUBMITTED_STEPS", { returnObjects: true }) as any[]) : [])).length}{t("application.steps_completed")}</Text>
          </View>
          <View style={styles.stepList}>
            {((Array.isArray(t("content.application_kyc.VerificationPendingContent.SUBMITTED_STEPS", { returnObjects: true })) ? (t("content.application_kyc.VerificationPendingContent.SUBMITTED_STEPS", { returnObjects: true }) as any[]) : [])).map((step, index) =>
            <View key={`ui-opt-${index}-${step}`} style={styles.stepRow}>
                <Icon name="check-circle" size={18} color={colors.safetyGreen} />
                <Text style={styles.stepLabel}>{step}</Text>
                <View style={styles.submittedBadge}>
                  <Text style={styles.submittedBadgeText}>{t("content.application_kyc.CommonKycContent.SUBMITTED")}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── What happens next card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="info" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.VerificationPendingContent.NEXT_STEPS_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Do not resubmit warning ── */}
        <GlassCard style={styles.warningCard}>
          <View style={styles.noteRow}>
            <View style={styles.warningIconWrap}>
              <Icon name="warning" size={spacing.iconMd} color={colors.warningAmber} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.VerificationPendingContent.DO_NOT_RESUBMIT")}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("application.return_to_verification_hub")}
          onPress={() => navigation.navigate(Routes.VERIFICATION_HUB)}
          variant="primary"
          rightIcon={t("application.home")}
          accessibilityLabel={t("accessibility.return_to_verification_hub")} />
        
        <ActionButton
          label={t("content.application_kyc.VerificationPendingContent.CTA_VIEW_DETAILS")}
          onPress={() => navigation.navigate(Routes.VERIFICATION_HUB)}
          variant="ghost"
          style={styles.viewBtn}
          accessibilityLabel={t("accessibility.view_submitted_details")} />
        
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
    borderWidth: 1, borderColor: `${colors.warningAmber}40`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.warningAmber, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  statusBadgeText: { ...textStyles.labelMd, color: colors.warningAmber },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },
  progressHeader: { alignItems: 'flex-start' },
  progressSub: { ...textStyles.bodySm, color: colors.textSecondary },

  stepList: { gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepLabel: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  submittedBadge: {
    backgroundColor: `${colors.safetyGreen}18`, borderRadius: radius.sm,
    borderWidth: 1, borderColor: `${colors.safetyGreen}30`,
    paddingHorizontal: spacing.sm, paddingVertical: 3
  },
  submittedBadgeText: { ...textStyles.labelSm, color: colors.safetyGreen },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  warningCard: { borderColor: `${colors.warningAmber}30` },
  warningIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.warningAmberSubtle,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  viewBtn: { marginTop: spacing.xs }
});