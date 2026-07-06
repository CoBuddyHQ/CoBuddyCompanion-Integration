import { useTranslation } from 'react-i18next';
/**
 * CPN-055 — Verification Rejected Screen
 * Phase 4C — Rejection state with required updates list and resubmit path.
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

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.VERIFICATION_REJECTED>;

export function VerificationRejectedScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setVerificationStatus } = useApplicationStore();

  useEffect(() => {
    setVerificationStatus('rejected');
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero (error red) ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="report-problem" size={44} color={colors.errorRed} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="shield" size={16} color={colors.errorRed} />
          </View>
        </View>

        {/* ── Status badges ── */}
        <View style={styles.badgeRow}>
          <View style={styles.errorBadge}>
            <Icon name="close" size={14} color={colors.errorRed} />
            <Text style={styles.errorBadgeText}>{t("content.application_kyc.CommonKycContent.VERIFICATION_NOT_APPROVED")}</Text>
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.VerificationRejectedContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.VerificationRejectedContent.SUBHEADLINE")}</Text>

        {/* ── Review result card ── */}
        <GlassCard style={StyleSheet.flatten([styles.card, styles.resultCard])}>
          <View style={styles.resultHeader}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.VerificationRejectedContent.RESULT_TITLE").toUpperCase()}</Text>
            <View style={styles.actionBadge}>
              <Icon name="assignment-late" size={12} color={colors.warningAmber} />
              <Text style={styles.actionBadgeText}>{t("content.application_kyc.VerificationRejectedContent.RESULT_BADGE")}</Text>
            </View>
          </View>
          <Text style={styles.resultDesc}>{t("content.application_kyc.VerificationRejectedContent.RESULT_DESC")}</Text>
        </GlassCard>

        {/* ── Required updates card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.VerificationRejectedContent.UPDATE_TITLE").toUpperCase()}</Text>
          <View style={styles.itemList}>
            {((Array.isArray(t("content.application_kyc.VerificationRejectedContent.REQUIRED_UPDATES", { returnObjects: true })) ? (t("content.application_kyc.VerificationRejectedContent.REQUIRED_UPDATES", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.itemRow}>
                <View style={StyleSheet.flatten([styles.itemIconWrap, styles.itemIconError])}>
                  <Icon name={item.icon as any} size={22} color={colors.errorRed} />
                </View>
                <View style={styles.itemContent}>
                  <View style={styles.itemLabelRow}>
                    <Text style={styles.itemLabel}>{t(item.label)}</Text>
                    <View style={styles.actionTag}>
                      <Text style={styles.actionTagText}>{item.action}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemDesc}>{t(item.description)}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Resubmit note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="edit-note" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.VerificationRejectedContent.RESUBMIT_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Support note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="support-agent" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.VerificationRejectedContent.SUPPORT_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Warning ── */}
        <Text style={styles.warningNote}>{t("content.application_kyc.VerificationRejectedContent.WARNING")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.VerificationRejectedContent.CTA_RESUBMIT")}
          onPress={() => navigation.navigate(Routes.RESUBMIT_VERIFICATION)}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.review_and_resubmit_verification")} />
        
        <ActionButton
          label={t("content.application_kyc.VerificationRejectedContent.CTA_SUPPORT")}
          onPress={() => {}}
          variant="ghost"
          style={styles.supportBtn}
          accessibilityLabel={t("accessibility.contact_support")} />
        
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
    borderWidth: 1, borderColor: `${colors.errorRed}40`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.errorRed, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: `${colors.errorRed}30`,
    alignItems: 'center', justifyContent: 'center'
  },

  badgeRow: { alignSelf: 'center' },
  errorBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: `${colors.errorRed}18`, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.errorRed}30`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  errorBadgeText: { ...textStyles.labelMd, color: colors.errorRed },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  resultCard: { borderColor: `${colors.errorRed}25` },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  actionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 4
  },
  actionBadgeText: { ...textStyles.labelSm, color: colors.warningAmber },
  resultDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  itemList: { gap: spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  itemIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  itemIconError: { borderColor: `${colors.errorRed}30`, backgroundColor: `${colors.errorRed}10` },
  itemContent: { flex: 1 },
  itemLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  itemLabel: { ...textStyles.labelMd, color: colors.textPrimary },
  actionTag: {
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.xs,
    paddingHorizontal: 6, paddingVertical: 2
  },
  actionTagText: { ...textStyles.labelSm, color: colors.warningAmber },
  itemDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

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
  supportBtn: { marginTop: spacing.xs }
});