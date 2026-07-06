import { useTranslation } from 'react-i18next';
/**
* CPN-043 • Bank Account Verification Screen
* Phase 4B Visual Consistency Polish
*
* Visual system: matches CPN-021 to CPN-042 approved pattern
*   - SafeAreaView + ScreenTopBar + ApplicationPhaseProgress
*   - Hero: 88×88, cardSurface bg, warningAmber glow (pending state), 44px hourglass-top icon
*   - Account preview card: icon row with lock badge
*   - Verification steps: timeline with icon per step (check-circle / schedule / cancel)
*   - SLA note: schedule icon (no 🕐 emoji)
*   - Security warning: GlassCard with warning icon (no ⚠️ emoji)
*   - Footer: ctaWrap with single primary ActionButton (no save-later on status screen)
*   - No emoji anywhere
*
* No sensitive data collected here.
* Shows only masked last 4 digits from applicationStore.bankAccountLast4.
*/

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView } from
'react-native';
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
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn } from '../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.BANK_ACCOUNT_VERIFICATION>;

type StepStatus = 'done' | 'pending' | 'failed';

function StepIcon({ status }: {status: StepStatus;}) {
  if (status === 'done') {
    return <Icon name="check-circle" size={spacing.iconMd} color={colors.safetyGreen} />;
  }
  if (status === 'failed') {
    return <Icon name="cancel" size={spacing.iconMd} color={colors.softWarning} />;
  }
  return <Icon name="schedule" size={spacing.iconMd} color={colors.warningAmber} />;
}

export function BankAccountVerificationScreen({ navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const {
    bankAccountLast4,
    bankName,
    accountType,
    setBankVerified,
    setCurrentStage,
    missingRequirementFixContext,
    completeMissingRequirementFix
  } = useApplicationStore();

  const handleContinue = useCallback(() => {
    setBankVerified(true);
    setCurrentStage('bank_verification');
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('bank');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.UPI_DETAILS);
  }, [setBankVerified, setCurrentStage, missingRequirementFixContext, completeMissingRequirementFix, navigation]);

  const maskedAccount = bankAccountLast4 ?
  `•••• •••• ${bankAccountLast4}` :
  '•••• ••••';

  // We map the steps array dynamically for i18n
  const steps = [
  { key: 'submitted', label: t('application.bank_verification_step_submitted'), status: 'done' },
  { key: 'checking', label: t('application.bank_verification_step_checking'), status: 'pending' },
  { key: 'kyc', label: t('application.bank_verification_step_kyc'), status: 'pending' },
  { key: 'activation', label: t('application.bank_verification_step_activation'), status: 'pending' }];


  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => navigation.navigate(Routes.ADD_BANK_ACCOUNT)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* •• Hero (pending state) •• */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t('application.bank_verification_section_badge')}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="hourglass-top" size={44} color={colors.warningAmber} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="account-balance" size={16} color={colors.gold} />
          </View>
        </View>

        {/* •• Headline •• */}
        <Text style={styles.headline}>{t('application.bank_verification_headline')}</Text>
        <Text style={styles.subheadline}>{t('application.bank_verification_subheadline')}</Text>

        {/* •• Account preview (masked) •• */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.bank_verification_account_preview').toUpperCase()}</Text>
          <View style={styles.accountPreviewRow}>
            <View style={styles.accountIconWrap}>
              <Icon name="account-balance" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.accountDetails}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.accountBank}>{bankName || 'Bank'}</Text>
                <View style={styles.pendingBadge}>
                  <Icon name="schedule" size={12} color={colors.warningAmber} />
                  <Text style={styles.pendingBadgeText}>{t('application.bank_verification_pending_status')}</Text>
                </View>
              </View>
              <Text style={styles.accountNumber} numberOfLines={1} adjustsFontSizeToFit>
                {maskedAccount}
              </Text>
              <Text style={styles.accountTypeText}>
                {accountType.charAt(0).toUpperCase() + accountType.slice(1)} {t('application.account')}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* •• Verification steps card •• */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.verification_steps")}</Text>
          {steps.map((step, i) =>
          <View key={step.key}>
              <View style={styles.stepRow}>
                <View style={styles.stepIconWrap}>
                  <StepIcon status={step.status as StepStatus} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[
                styles.stepLabel,
                step.status === 'done' && styles.stepLabelDone]
                }>
                    {t(step.label)}
                  </Text>
                </View>
              </View>
              {i < steps.length - 1 && <View style={styles.stepConnector} />}
            </View>
          )}
        </GlassCard>

        {/* •• SLA note •• */}
        <View style={styles.slaRow}>
          <Icon name="schedule" size={14} color={colors.textSecondary} />
          <Text style={styles.slaNote}>{t('application.bank_verification_sla_note')}</Text>
        </View>

        {/* •• Security warning card •• */}
        <GlassCard style={styles.warningCard}>
          <View style={styles.warningRow}>
            <View style={styles.warningIconWrap}>
              <Icon name="warning" size={spacing.iconMd} color={colors.warningAmber} />
            </View>
            <Text style={styles.warningText}>{t('application.bank_verification_security_warning')}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* •• CTA Footer •• */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t('application.bank_verification_cta_continue')}
          onPress={handleContinue}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.continue_setup")} />

      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
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
    borderWidth: 1, borderColor: `${colors.warningAmber}40`,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.warningAmber, shadowOffset: { width: 0, height: 0 },
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

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Account preview
  accountPreviewRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md
  },
  accountIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  accountDetails: { flex: 1, gap: 2 },
  accountBank: { ...textStyles.labelMd, color: colors.textPrimary },
  accountNumber: {
    fontSize: 18, color: colors.textPrimary,
    fontFamily: 'Inter-Bold', letterSpacing: 2
  },
  accountTypeText: { ...textStyles.bodySm, color: colors.textSecondary },
  pendingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.warningAmberSubtle,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    alignSelf: 'flex-start'
  },
  pendingBadgeText: { ...textStyles.labelSm, color: colors.warningAmber },

  // Steps
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepIconWrap: { flexShrink: 0 },
  stepContent: { flex: 1 },
  stepLabel: { ...textStyles.bodyMd, color: colors.textSecondary },
  stepLabelDone: { color: colors.safetyGreen, fontFamily: 'Inter-SemiBold' },
  stepConnector: {
    width: 2, height: 12,
    backgroundColor: colors.border,
    marginLeft: 17,
    marginVertical: 2
  },

  // SLA
  slaRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    alignSelf: 'center'
  },
  slaNote: {
    ...textStyles.labelSm, color: colors.textSecondary,
    textAlign: 'center', fontStyle: 'italic'
  },

  // Warning card
  warningCard: {
    borderColor: `${colors.warningAmber}30`,
    gap: 0
  },
  warningRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  warningIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.warningAmberSubtle,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  warningText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomPad: { height: spacing.xl },

  // CTA footer
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
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
  }
});