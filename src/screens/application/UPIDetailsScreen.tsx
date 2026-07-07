import { useTranslation } from 'react-i18next';
/**
* CPN-044 — UPI Details Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-043 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88, cardSurface bg, gold glow, 44px payments icon
*   - P0 MANDATORY disclaimer: GlassCard with info icon (no ℹ️ emoji)
*   - UPI form card: FormInput fields + UPI-match indicator with icon
*   - Security rules card: shield icon rows
*   - Confirmation checkbox: Icon check
*   - Privacy note card: lock icon row
*   - Footer: ctaWrap outside KAV with primary + ghost ActionButton
*   - No emoji anywhere
*
* P0 REWRITE (unchanged): UPI is payout-only — mandatory disclaimer preserved.
*
* PRIVACY (SENSITIVE — FINANCIAL — unchanged):
*   - Full UPI ID NEVER stored in Zustand.
*   - Only masked display string (ra••••@okaxis) stored.
*   - Raw UPI cleared after store update.
*   - No console.log. No AsyncStorage.
*/

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import FormInput from '../../components/form/FormInput';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';

import { validateUPI } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.UPI_DETAILS>;

function maskUPI(upi: string): string {
  const atIdx = upi.lastIndexOf('@');
  if (atIdx < 2) {return upi;}
  const username = upi.slice(0, atIdx);
  const provider = upi.slice(atIdx);
  const prefix = username.slice(0, 2);
  const dots = '•'.repeat(Math.min(username.length - 2, 8));
  return `${prefix}${dots}${provider}`;
}

const SECURITY_RULE_ICONS = ['security', 'notifications-none', 'lock-outline'] as const;

export function UPIDetailsScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setUPI, setUPIVerified, setCurrentStage } = useApplicationStore();

  const [upiRaw, setUPIRaw] = useState('');
  const [upiConfirm, setUPIConfirm] = useState('');
  const [payoutLabel, setPayoutLabel] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [upiError, setUPIError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleUPIChange = useCallback((text: string) => {
    setUPIRaw(text.trim().toLowerCase());
    setUPIError(null);
    setConfirmError(null);
  }, []);

  const handleConfirmChange = useCallback((text: string) => {
    setUPIConfirm(text.trim().toLowerCase());
    setConfirmError(null);
  }, []);

  const canSubmit =
  upiRaw.length > 5 &&
  upiRaw === upiConfirm &&
  confirmed &&
  !upiError;

  const handleSubmit = useCallback(() => {
    const upiErr = validateUPI(upiRaw);
    if (upiErr) {setUPIError(upiErr);return;}
    if (upiRaw !== upiConfirm) {
      setConfirmError('UPI IDs do not match. Please re-enter.');
      return;
    }
    // PRIVACY: mask before storing — raw UPI cleared after this
    const masked = maskUPI(upiRaw);
    setUPI(masked, isPrimary);
    setUPIVerified(true);
    setCurrentStage('upi_details');

    // Clear sensitive local state
    setUPIRaw('');
    setUPIConfirm('');

    Alert.alert(t("alerts.upi_details_saved"), t("alerts.your_upi_details_have_been_recorded_for"),


    [
    {
      text: t("alerts.continue"),
      // CPN-044 → CPN-047: UPI is the last financial setup screen;
      // next is Application Progress (submission module).
      // CPN-045 ProfileSetupIntro is reached only after document verification is approved.
      onPress: () => navigation.navigate(Routes.APPLICATION_PROGRESS)
    }]

    );

  }, [upiRaw, upiConfirm, isPrimary, setUPI, setUPIVerified, setCurrentStage, navigation]);

  const upiMatch = upiConfirm.length > 0 && upiRaw === upiConfirm && !upiError;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => navigation.goBack()} />
      

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Hero ── */}
          {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.UPIDetailsContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="payments" size={44} color={colors.gold} />
            </View>
            <View style={styles.heroBadge}>
              <Icon name="lock" size={16} color={colors.gold} />
            </View>
          </View>

          {/* ── Headline ── */}
          <Text style={styles.headline}>{t("content.application_kyc.UPIDetailsContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.UPIDetailsContent.SUBHEADLINE")}</Text>

          {/* ── P0 MANDATORY: payout-only disclaimer ── */}
          <GlassCard style={styles.disclaimerCard}>
            <View style={styles.disclaimerRow}>
              <View style={styles.disclaimerIconWrap}>
                <Icon name="info" size={spacing.iconMd} color={colors.gold} />
              </View>
              <Text style={styles.disclaimerText}>{t("content.application_kyc.UPIDetailsContent.DISCLAIMER")}</Text>
            </View>
          </GlassCard>

          <Text style={styles.optionalNote}>{t("content.application_kyc.UPIDetailsContent.OPTIONAL_NOTE")}</Text>

          {/* ── UPI form card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("application.upi_payout_details")}</Text>

            <FormInput
              label={t("content.application_kyc.UPIDetailsContent.FIELD_LABEL")}
              value={upiRaw}
              onChangeText={handleUPIChange}
              placeholder={t("content.application_kyc.UPIDetailsContent.FIELD_PLACEHOLDER")}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              error={upiError ?? undefined}
              accessibilityLabel={t("accessibility.upi_id_for_payouts")}
              accessibilityHint={t('accessibility.enter_upi_id')} />
            

            <FormInput
              label={t("content.application_kyc.UPIDetailsContent.CONFIRM_LABEL")}
              value={upiConfirm}
              onChangeText={handleConfirmChange}
              placeholder={t("content.application_kyc.UPIDetailsContent.FIELD_PLACEHOLDER")}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              error={confirmError ?? undefined}
              accessibilityLabel={t("accessibility.confirm_upi_id")} />
            

            {/* UPI match indicator — no emoji */}
            {upiMatch &&
            <View style={styles.matchRow}>
                <Icon name="check-circle" size={16} color={colors.safetyGreen} />
                <Text style={styles.matchText}>{t("application.upi_ids_match")}</Text>
              </View>
            }

            {/* Name note */}
            <View style={styles.nameHintRow}>
              <Text style={styles.nameHintLabel}>{t("content.application_kyc.UPIDetailsContent.NAME_LABEL")}</Text>
              <Text style={styles.nameHintText}>{t("content.application_kyc.UPIDetailsContent.NAME_HINT")}</Text>
            </View>

            {/* Payout label (optional) */}
            <FormInput
              label={t("content.application_kyc.UPIDetailsContent.PAYOUT_LABEL")}
              value={payoutLabel}
              onChangeText={setPayoutLabel}
              placeholder={t("content.application_kyc.UPIDetailsContent.PAYOUT_LABEL_PLACEHOLDER")}
              autoCapitalize="words"
              accessibilityLabel={t("accessibility.payout_label_optional")} />
            

            {/* Primary toggle */}
            <TouchableOpacity accessibilityRole="button"
              style={styles.primaryToggleRow}
              onPress={() => setIsPrimary(!isPrimary)}
              accessibilityLabel={t("content.application_kyc.UPIDetailsContent.PRIMARY_TOGGLE")}
              accessibilityState={{ checked: isPrimary }}>
              <View style={[styles.checkbox, isPrimary && styles.checkboxChecked]}>
                {isPrimary && <Icon name="check" size={14} color="#fff" />}
              </View>
              <Text style={styles.primaryToggleText}>{t("content.application_kyc.UPIDetailsContent.PRIMARY_TOGGLE")}</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* ── Security rules card ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.UPIDetailsContent.SECURITY_RULES_TITLE").toUpperCase()}</Text>
            <View style={styles.ruleList}>
              {((Array.isArray(t("content.application_kyc.UPIDetailsContent.SECURITY_RULES", { returnObjects: true })) ? (t("content.application_kyc.UPIDetailsContent.SECURITY_RULES", { returnObjects: true }) as any[]) : [])).map((rule, i) =>
              <View key={`ui-opt-${i}-${i}`} style={styles.ruleRow}>
                  <View style={styles.ruleIconWrap}>
                    <Icon
                    name={SECURITY_RULE_ICONS[i % SECURITY_RULE_ICONS.length] as any}
                    size={spacing.iconMd}
                    color={colors.gold} />
                  
                  </View>
                  <Text style={styles.ruleText}>{t(rule.text)}</Text>
                </View>
              )}
            </View>
          </GlassCard>

          {/* ── Confirmation row ── */}
          <TouchableOpacity accessibilityRole="button"
            style={styles.confirmRow}
            onPress={() => setConfirmed(!confirmed)}
            accessibilityLabel={t("accessibility.confirm_upi_details_accuracy")}
            accessibilityState={{ checked: confirmed }}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
              {confirmed && <Icon name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.confirmLabel}>{t("application.i_confirm_this_upi_id_is_correct_and_wil")}

            </Text>
          </TouchableOpacity>

          {/* ── Privacy note card ── */}
          <GlassCard style={styles.card}>
            <View style={styles.privacyRow}>
              <View style={styles.privacyIconWrap}>
                <Icon name="lock" size={spacing.iconMd} color={colors.gold} />
              </View>
              <View style={styles.privacyContent}>
                <Text style={styles.privacyTitle}>{t("application.payout_security")}</Text>
                <Text style={styles.privacyBody}>{t("content.application_kyc.UPIDetailsContent.PRIVACY_NOTE")}</Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.UPIDetailsContent.CTA_PRIMARY")}
          onPress={handleSubmit}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          disabled={!canSubmit}
          accessibilityLabel={t("accessibility.submit_upi_for_verification")} />
        
        {/* UPI is optional (product rule: UPIDetailsContent.OPTIONAL_NOTE).
                 Skip navigates to Application Progress without setting upiVerified.
                 Bank account must already be verified for this CTA to be available. */}
        <ActionButton
          label={t("application.skip_for_now")}
          onPress={() => navigation.navigate(Routes.APPLICATION_PROGRESS)}
          variant="ghost"
          style={styles.saveBtn}
          accessibilityLabel={t("accessibility.skip_upi_setup_and_continue_to_applicati")} />
        
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },

  // Hero
  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  // Headline
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-SemiBold'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },

  // P0 Disclaimer card
  disclaimerCard: { borderColor: `${colors.gold}30` },
  disclaimerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  disclaimerIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  disclaimerText: { flex: 1, ...textStyles.labelMd, color: colors.gold, lineHeight: 20 },

  optionalNote: {
    ...textStyles.labelSm, color: colors.textMuted,
    textAlign: 'center', fontStyle: 'italic'
  },

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // UPI match
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  matchText: { ...textStyles.labelSm, color: colors.safetyGreen },

  // Name hint
  nameHintRow: { gap: 2 },
  nameHintLabel: { ...textStyles.labelSm, color: colors.textSecondary },
  nameHintText: { ...textStyles.bodySm, color: colors.textMuted, lineHeight: 16 },

  // Primary toggle
  primaryToggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  primaryToggleText: { flex: 1, ...textStyles.labelMd, color: colors.textPrimary },

  // Security rules
  ruleList: { gap: spacing.md },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  ruleIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  ruleText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  // Confirmation
  confirmRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2, backgroundColor: colors.cardSurface
  },
  checkboxChecked: { borderColor: colors.gold, backgroundColor: colors.gold },
  confirmLabel: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 20 },

  // Privacy
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  privacyIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  privacyContent: { flex: 1 },
  privacyTitle: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  privacyBody: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomPad: { height: spacing.xl },

  // CTA footer
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  saveBtn: { marginTop: spacing.xs },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.xl
  },
  phaseBadgeText: {
    ...textStyles.capsSm,
    color: colors.gold,
    letterSpacing: 1
  } });