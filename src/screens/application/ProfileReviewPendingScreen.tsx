import { useTranslation } from 'react-i18next';
/**
 * CPN-057 — Profile Review Pending Screen
 * Phase 4C — Profile submitted for CoBuddy review by Trust & Safety team.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.PROFILE_REVIEW_PENDING>;

const STATUS_COLORS = {
  completed: colors.safetyGreen,
  active: colors.gold,
  pending: colors.textMuted
};

const STATUS_ICONS = {
  completed: 'check-circle',
  active: 'radio-button-checked',
  pending: 'radio-button-unchecked'
};

export function ProfileReviewPendingScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { profileReviewStatus } = useApplicationStore();
  const { setAuthStatus } = useAuthStore();

  const handleCheckStatus = () => {
    if (profileReviewStatus === 'approved') {
      navigation.navigate(Routes.PROFILE_APPROVED_PUBLISHED);
    } else if (profileReviewStatus === 'rejected') {
      navigation.navigate(Routes.PROFILE_EDIT_REJECTED);
    }
    // If still 'pending' or 'not_submitted', stay on this screen — no navigation.
    // The companion can pull-to-refresh or check back later.
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.stepBadge}>
          <Icon name="adjust" size={14} color={colors.gold} />
          <Text style={styles.stepBadgeText}>{t("content.application_kyc.ProfileReviewPendingContent.STEP_LABEL")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="hourglass-top" size={44} color={colors.warningAmber} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="admin-panel-settings" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Step badge ── */}

        {/* ── Status badge ── */}
        <View style={styles.statusBadge}>
          <Icon name="schedule" size={14} color={colors.warningAmber} />
          <Text style={styles.statusBadgeText}>{t("content.application_kyc.ProfileReviewPendingContent.STATUS_BADGE")}</Text>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.ProfileReviewPendingContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ProfileReviewPendingContent.SUBHEADLINE")}</Text>

        {/* ── Status card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileReviewPendingContent.STATUS_TITLE").toUpperCase()}</Text>
          <View style={styles.statusLabelRow}>
            <View style={styles.statusLabelIconWrap}>
              <Icon name="admin-panel-settings" size={20} color={colors.gold} />
            </View>
            <View>
              <Text style={styles.statusLabel}>{t("content.application_kyc.ProfileReviewPendingContent.STATUS_LABEL")}</Text>
              <Text style={styles.statusDesc}>{t("content.application_kyc.ProfileReviewPendingContent.STATUS_DESC")}</Text>
            </View>
          </View>
          <View style={styles.statusItemList}>
            {((Array.isArray(t("content.application_kyc.ProfileReviewPendingContent.STATUS_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.ProfileReviewPendingContent.STATUS_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) => {
              const s = item.status as keyof typeof STATUS_COLORS;
              return (
                <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.statusItemRow}>
                  <Icon name={STATUS_ICONS[s] as any} size={18} color={STATUS_COLORS[s]} />
                  <Text style={[styles.statusItemLabel, { color: STATUS_COLORS[s] }]}>{t(item.label)}</Text>
                  {'detail' in item && item.detail ?
                  <Text style={styles.statusItemDetail}>{item.detail}</Text> :
                  null}
                </View>);

            })}
          </View>
        </GlassCard>

        {/* ── What CoBuddy reviews card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileReviewPendingContent.REVIEW_TITLE").toUpperCase()}</Text>
          <View style={styles.itemList}>
            {((Array.isArray(t("content.application_kyc.ProfileReviewPendingContent.REVIEW_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.ProfileReviewPendingContent.REVIEW_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.itemRow}>
                <View style={styles.itemIconWrap}>
                  <Icon name={item.icon as any} size={22} color={colors.gold} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel}>{t(item.label)}</Text>
                  <Text style={styles.itemDesc}>{t(item.description)}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Timeline card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.CommonKycContent.REVIEW_TIMELINE")}</Text>
          <View style={styles.timelineRow}>
            {((Array.isArray(t("content.application_kyc.ProfileReviewPendingContent.TIMELINE_STEPS", { returnObjects: true })) ? (t("content.application_kyc.ProfileReviewPendingContent.TIMELINE_STEPS", { returnObjects: true }) as any[]) : [])).map((step, i) =>
            <React.Fragment key={`ui-opt-${i}-${step}`}>
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineDot, i === 0 && styles.timelineDotDone, i === 1 && styles.timelineDotActive]}>
                    <Icon name={i === 0 ? 'task-alt' : i === 1 ? 'manage-search' : 'workspace-premium'} size={14} color={i === 0 ? '#fff' : i === 1 ? colors.gold : colors.textMuted} />
                  </View>
                  <Text style={[styles.timelineLabel, i === 1 && styles.timelineLabelActive]}>{step}</Text>
                </View>
                {i < ((Array.isArray(t("content.application_kyc.ProfileReviewPendingContent.TIMELINE_STEPS", { returnObjects: true })) ? (t("content.application_kyc.ProfileReviewPendingContent.TIMELINE_STEPS", { returnObjects: true }) as any[]) : [])).length - 1 && <View style={styles.timelineConnector} />}
              </React.Fragment>
            )}
          </View>
        </GlassCard>

        {/* ── Editing limited note ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ProfileReviewPendingContent.EDITING_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Not public note ── */}
        <Text style={styles.notPublicNote}>{t("content.application_kyc.ProfileReviewPendingContent.NOT_PUBLIC_NOTE")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={
          profileReviewStatus === 'approved' ? t("content.application.ProfileReviewPendingScreen.view_approval") :

          profileReviewStatus === 'rejected' ? t("content.application.ProfileReviewPendingScreen.view_feedback") :
          t("content.application_kyc.ProfileReviewPendingContent.CTA_CHECK_STATUS")

          }
          onPress={handleCheckStatus}
          variant="primary"
          leftIcon={
          profileReviewStatus === 'approved' ?
          'verified' :
          profileReviewStatus === 'rejected' ?
          'edit-note' :
          'refresh'
          }
          accessibilityLabel={t("accessibility.check_review_status")} />
        
        <ActionButton
          label={t("content.application_kyc.ProfileReviewPendingContent.CTA_SUPPORT")}
          onPress={() => {}}
          variant="ghost"
          style={styles.supportBtn}
          accessibilityLabel={t("accessibility.contact_support")} />
        
        {/* ─── DEV BYPASS — remove before production release ─── */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.devBypass}
          onPress={() => setAuthStatus('active')}
          accessibilityLabel={t("accessibility.dev_bypass_force_approve")}>
          <Text style={styles.devBypassText}>{t("application.dev_bypass_skip_to_main_app")}</Text>
        </TouchableOpacity>
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

  stepBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  stepBadgeText: { ...textStyles.labelSm, color: colors.gold },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`, paddingHorizontal: spacing.md, paddingVertical: 6
  },
  statusBadgeText: { ...textStyles.labelMd, color: colors.warningAmber },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  statusLabelRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  statusLabelIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  statusLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  statusDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

  statusItemList: { gap: spacing.sm, marginTop: spacing.xs },
  statusItemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusItemLabel: { flex: 1, ...textStyles.labelMd },
  statusItemDetail: { ...textStyles.labelSm, color: colors.textMuted },

  itemList: { gap: spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  itemIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  itemContent: { flex: 1 },
  itemLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  itemDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

  timelineRow: { flexDirection: 'row', alignItems: 'center' },
  timelineStep: { alignItems: 'center', gap: spacing.xs, flex: 1 },
  timelineDot: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'
  },
  timelineDotDone: { backgroundColor: colors.safetyGreen, borderColor: colors.safetyGreen },
  timelineDotActive: { borderColor: colors.gold },
  timelineLabel: { ...textStyles.labelSm, color: colors.textSecondary, textAlign: 'center' },
  timelineLabelActive: { color: colors.gold },
  timelineConnector: { height: 1, flex: 0.3, backgroundColor: colors.border },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  notPublicNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
  bottomPad: { height: spacing.xl },

  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  supportBtn: { marginTop: spacing.xs },
  devBypass: {
    marginTop: spacing.xs,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.25)',
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  devBypassText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 0.5
  }
});