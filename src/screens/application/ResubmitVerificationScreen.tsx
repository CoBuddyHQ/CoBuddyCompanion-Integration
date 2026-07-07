import { useTranslation } from 'react-i18next';
/**
 * CPN-056 — Resubmit Verification Screen
 * Phase 4C — Allows companion to upload corrected ID images and confirm before resubmitting.
 * Privacy: no raw document data stored in Zustand. Only local URIs handled in memory.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

type Props = StackScreenProps<VerificationStackParamList, typeof Routes.RESUBMIT_VERIFICATION>;

export function ResubmitVerificationScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setVerificationResubmitted, setVerificationStatus, basicDetails } = useApplicationStore();

  // Local state — no raw documents in Zustand. NEVER log these.
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canResubmit = frontUploaded && confirmed;

  const handleResubmit = useCallback(() => {
    // PRIVACY: only mark resubmitted — do NOT store URIs in Zustand.
    // Reset verificationStatus to 'pending' BEFORE replacing so CPN-052's
    // useEffect sees 'pending' and stays — it will NOT loop back to CPN-055.
    // Use replace() so back button cannot return to this rejected/resubmit screen.
    setVerificationResubmitted(true);
    setVerificationStatus('pending');
    navigation.replace(Routes.VERIFICATION_PENDING);
  }, [setVerificationResubmitted, setVerificationStatus, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="edit-document" size={44} color={colors.warningAmber} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="priority-high" size={16} color={colors.warningAmber} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.ResubmitVerificationContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ResubmitVerificationContent.SUBHEADLINE")}</Text>

        {/* ── Action required card ── */}
        <GlassCard style={StyleSheet.flatten([styles.card, styles.warningCard])}>
          <View style={styles.actionHeader}>
            <View style={styles.actionIconWrap}>
              <Icon name="error-outline" size={22} color={colors.warningAmber} />
            </View>
            <View>
              <Text style={styles.actionBadgeLabel}>{t("content.application_kyc.ResubmitVerificationContent.ACTION_BADGE")}</Text>
              <Text style={styles.reasonTitle}>{t("content.application_kyc.ResubmitVerificationContent.REASON_TITLE")}</Text>
            </View>
          </View>
          <Text style={styles.reasonDesc}>{t("content.application_kyc.ResubmitVerificationContent.REASON_DEFAULT")}</Text>
        </GlassCard>

        {/* ── Required items card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ResubmitVerificationContent.REQUIRED_TITLE").toUpperCase()}</Text>
          <View style={styles.reqList}>
            {((Array.isArray(t("content.application_kyc.ResubmitVerificationContent.REQUIRED_ITEMS", { returnObjects: true })) ? (t("content.application_kyc.ResubmitVerificationContent.REQUIRED_ITEMS", { returnObjects: true }) as any[]) : [])).map((item, index) =>
            <View key={`ui-opt-${index}-${t(item.label)}`} style={styles.reqRow}>
                <View style={styles.reqIconWrap}>
                  <Icon name={item.icon as any} size={20} color={colors.gold} />
                </View>
                <Text style={styles.reqLabel}>{t(item.label)}</Text>
                {item.required &&
              <View style={styles.reqBadge}>
                    <Text style={styles.reqBadgeText}>{t("content.application_kyc.CommonKycContent.REQUIRED")}</Text>
                  </View>
              }
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Upload images card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.update_id_images")}</Text>
          {/* Front */}
          <TouchableOpacity accessibilityRole="button"
            style={[styles.uploadArea, frontUploaded && styles.uploadAreaDone]}
            onPress={() => setFrontUploaded(true)}
            accessibilityLabel={t("accessibility.upload_updated_id_front")}>
            <View style={styles.uploadIconWrap}>
              <Icon name={frontUploaded ? 'check-circle' : 'upload-file'} size={28} color={frontUploaded ? colors.safetyGreen : colors.gold} />
            </View>
            <View>
              <Text style={styles.uploadLabel}>{t("content.application_kyc.ResubmitVerificationContent.UPLOAD_FRONT")}</Text>
              <Text style={styles.uploadHint}>{frontUploaded ? t("content.application.ResubmitVerificationScreen.image_selected") : t("content.application_kyc.ResubmitVerificationContent.UPLOAD_FRONT_HINT")}</Text>
            </View>
          </TouchableOpacity>
          {/* Back */}
          <TouchableOpacity accessibilityRole="button"
            style={[styles.uploadArea, backUploaded && styles.uploadAreaDone]}
            onPress={() => setBackUploaded(true)}
            accessibilityLabel={t("accessibility.upload_updated_id_back")}>
            <View style={styles.uploadIconWrap}>
              <Icon name={backUploaded ? 'check-circle' : 'upload-file'} size={28} color={backUploaded ? colors.safetyGreen : colors.gold} />
            </View>
            <View>
              <Text style={styles.uploadLabel}>{t("content.application_kyc.ResubmitVerificationContent.UPLOAD_BACK")}</Text>
              <Text style={styles.uploadHint}>{backUploaded ? t("content.application.ResubmitVerificationScreen.image_selected") : t("content.application_kyc.ResubmitVerificationContent.UPLOAD_BACK_HINT")}</Text>
            </View>
          </TouchableOpacity>
        </GlassCard>

        {/* ── Name field (read-only display from store) ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ResubmitVerificationContent.NAME_LABEL").toUpperCase()}</Text>
          <View style={styles.nameRow}>
            <View style={styles.nameIconWrap}>
              <Icon name="badge" size={20} color={colors.gold} />
            </View>
            <Text style={styles.nameValue}>{basicDetails.legalName || '—'}</Text>
          </View>
        </GlassCard>

        {/* ── Support note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="support-agent" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ResubmitVerificationContent.SUPPORT_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Confirmation checkbox ── */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.confirmRow}
          onPress={() => setConfirmed(!confirmed)}
          accessibilityLabel={t("accessibility.confirm_updated_details")}
          accessibilityState={{ checked: confirmed }}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed && <Icon name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.confirmLabel}>{t("content.application_kyc.ResubmitVerificationContent.CONFIRM_LABEL")}</Text>
        </TouchableOpacity>

        {/* ── Warning ── */}
        <Text style={styles.warningNote}>{t("content.application_kyc.ResubmitVerificationContent.WARNING")}</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ResubmitVerificationContent.CTA_RESUBMIT")}
          onPress={handleResubmit}
          variant="primary"
          rightIcon={t("application.send")}
          disabled={!canResubmit}
          accessibilityLabel={t("accessibility.resubmit_for_review")} />
        
        <ActionButton
          label={t("content.application_kyc.ResubmitVerificationContent.CTA_SUPPORT")}
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
    borderWidth: 1, borderColor: `${colors.warningAmber}40`, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.warningAmber, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: `${colors.warningAmber}30`,
    alignItems: 'center', justifyContent: 'center'
  },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  warningCard: { borderColor: `${colors.warningAmber}30` },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },

  actionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  actionIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.warningAmberSubtle,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  actionBadgeLabel: { ...textStyles.labelSm, color: colors.warningAmber, marginBottom: 2 },
  reasonTitle: { ...textStyles.labelMd, color: colors.textPrimary },
  reasonDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  reqList: { gap: spacing.sm },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reqIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  reqLabel: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },
  reqBadge: {
    backgroundColor: `${colors.errorRed}18`, borderRadius: radius.xs,
    paddingHorizontal: 6, paddingVertical: 3
  },
  reqBadgeText: { ...textStyles.labelSm, color: colors.errorRed },

  uploadArea: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.elevatedSurface, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed',
    padding: spacing.md
  },
  uploadAreaDone: { borderColor: `${colors.safetyGreen}50`, borderStyle: 'solid', backgroundColor: `${colors.safetyGreen}08` },
  uploadIconWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  uploadLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  uploadHint: { ...textStyles.bodySm, color: colors.textSecondary },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nameIconWrap: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'
  },
  nameValue: { ...textStyles.labelMd, color: colors.textPrimary },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  confirmRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2
  },
  checkboxChecked: { borderColor: colors.gold, backgroundColor: colors.gold },
  confirmLabel: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 20 },

  warningNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
  bottomPad: { height: spacing.xl },

  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  supportBtn: { marginTop: spacing.xs }
});