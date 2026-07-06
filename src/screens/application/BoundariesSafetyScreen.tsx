import { useTranslation } from 'react-i18next';
/**
 * CPN-032 — BoundariesSafetyScreen
 * Stitch ref: boundaries_safety_preferences_screen/code.html
 *
 * RULES:
 *  - Shows platform safety rules (locked/non-negotiable)
 *  - Shows companion rights
 *  - Requires explicit acceptance checkbox before CTA
 *  - CTA navigates to next existing placeholder (does NOT navigate to Dashboard, Auth, or Verification)
 *  - Ends Phase 4A — CPN-032 is the final screen in this batch
 *
 * Content: BoundariesSafetyContent from applicationKycContent.ts
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useApplicationStore } from '../../store/slices/applicationStore';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.BOUNDARIES_SAFETY>;

const BoundariesSafetyScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    boundariesAccepted, setBoundariesAccepted, setCurrentStage, recalculateCompletion,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const handleAccept = () => {
    if (!boundariesAccepted) {return;}
    setCurrentStage('boundaries_safety');
    recalculateCompletion();
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('boundaries');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.GOVERNMENT_ID_TYPE);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="shield" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.BoundariesSafetyContent.SECTION_BADGE")}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="local-hospital" size={42} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={14} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.BoundariesSafetyContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.BoundariesSafetyContent.SUBHEADLINE")}</Text>

        {/* Platform safety rules (locked) */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{t("content.application_kyc.BoundariesSafetyContent.PLATFORM_RULES_TITLE")}</Text>
              <Text style={styles.cardSubtitle}>{t("content.application_kyc.BoundariesSafetyContent.PLATFORM_RULES_SUBTITLE")}</Text>
            </View>
            <Icon name="lock" size={18} color={colors.textMuted} />
          </View>
          <View style={styles.ruleList}>
            {((Array.isArray(t("content.application_kyc.BoundariesSafetyContent.PLATFORM_RULES", { returnObjects: true })) ? (t("content.application_kyc.BoundariesSafetyContent.PLATFORM_RULES", { returnObjects: true }) as any[]) : [])).map((rule, index) =>
            <View key={`ui-opt-${index}-${t(rule.label)}`} style={styles.ruleRow}>
                <View style={styles.ruleIconWrap}>
                  <Icon name={rule.icon} size={18} color={colors.textMuted} />
                </View>
                <Text style={styles.ruleText}>{t(rule.label)}</Text>
                {/* Locked toggle indicator */}
                <View style={styles.lockedToggle}>
                  <Icon name="lock" size={12} color={colors.gold} />
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Companion rights */}
        <GlassCard style={styles.rightsCard}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.BoundariesSafetyContent.COMPANION_RIGHTS_TITLE")}</Text>
          <Text style={styles.cardSubtitle}>{t("content.application_kyc.BoundariesSafetyContent.COMPANION_RIGHTS_SUBTITLE")}</Text>
          <View style={styles.rightsList}>
            {((Array.isArray(t("content.application_kyc.BoundariesSafetyContent.COMPANION_RIGHTS", { returnObjects: true })) ? (t("content.application_kyc.BoundariesSafetyContent.COMPANION_RIGHTS", { returnObjects: true }) as any[]) : [])).map((right, index) =>
            <View key={`ui-opt-${index}-${t(right.label)}`} style={styles.rightRow}>
                <View style={styles.rightIconWrap}>
                  <Icon name={right.icon} size={18} color={colors.safetyGreen} />
                </View>
                <Text style={styles.rightText}>{t(right.label)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Acceptance checkbox */}
        <TouchableOpacity
          style={[styles.acceptRow, boundariesAccepted && styles.acceptRowChecked]}
          onPress={() => setBoundariesAccepted(!boundariesAccepted)}
          activeOpacity={0.75}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: boundariesAccepted }}
          accessibilityLabel={t("accessibility.accept_boundaries_and_safety_rules")}>
          <View style={[styles.acceptCheck, boundariesAccepted && styles.acceptCheckChecked]}>
            {boundariesAccepted && <Icon name="check" size={16} color={colors.rootBg} />}
          </View>
          <Text style={[styles.acceptLabel, boundariesAccepted && styles.acceptLabelChecked]}>
            {t("content.application_kyc.BoundariesSafetyContent.ACCEPTANCE_LABEL")}
          </Text>
        </TouchableOpacity>

        {/* Legal note */}
        <GlassCard style={styles.legalCard}>
          <View style={styles.legalRow}>
            <Icon name="info" size={16} color={colors.gold} />
            <Text style={styles.legalText}>{t("content.application_kyc.BoundariesSafetyContent.LEGAL_NOTE")}</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {!boundariesAccepted &&
        <Text style={styles.disabledTip}>{t("content.application_kyc.BoundariesSafetyContent.CTA_DISABLED_TIP")}</Text>
        }
        <ActionButton
          label={t("content.application_kyc.BoundariesSafetyContent.CTA_PRIMARY")}
          onPress={handleAccept}
          variant="primary"
          disabled={!boundariesAccepted}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.accept_boundaries_and_safety_rules_and_c")} />
        
      </View>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border
  },
  safetyBadgeText: {
    ...textStyles.labelSm,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  heroWrap: { alignSelf: 'center', position: 'relative' },
  heroCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6
  },
  heroBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headline: {
    ...textStyles.displaySm,
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-SemiBold'
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  card: { gap: spacing.md },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  cardHeaderText: { gap: 2, flex: 1 },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  cardSubtitle: {
    ...textStyles.bodySm,
    color: colors.textMuted
  },
  ruleList: { gap: spacing.sm },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    opacity: 0.8
  },
  ruleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.elevatedSurface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ruleText: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20
  },
  lockedToggle: {
    width: 38,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightsCard: { gap: spacing.md },
  rightsList: { gap: spacing.sm },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm
  },
  rightIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.safetyGreen}15`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  rightText: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22
  },
  acceptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  acceptRowChecked: {
    borderColor: colors.gold,
    backgroundColor: `${colors.gold}10`
  },
  acceptCheck: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1
  },
  acceptCheckChecked: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  acceptLabel: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22
  },
  acceptLabelChecked: { color: colors.textPrimary },
  legalCard: {},
  legalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  legalText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20
  },
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  disabledTip: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    textAlign: 'center'
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

export default BoundariesSafetyScreen;