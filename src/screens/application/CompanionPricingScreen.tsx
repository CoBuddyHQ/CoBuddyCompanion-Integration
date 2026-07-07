import { useTranslation } from 'react-i18next';
/**
 * CPN-033 ₹ Companion Pricing Setup Screen
 * Phase 4B Visual Consistency Polish
 *
 * Visual system: matches CPN-021 to CPN-032
 *   - ScreenTopBar (shared, consistent)
 *   - ApplicationPhaseProgress: "Financial Setup"
 *   - Hero circle: 88×88, cardSurface bg, colors.border, gold glow, 44px icon
 *   - Headline: textStyles.displayMd (Playfair SemiBold 30px), centered
 *   - Cards: GlassCard component
 *   - Primary CTA: ActionButton variant="primary" in ctaWrap footer
 *   - Secondary: ActionButton variant="ghost" for Save Draft
 *
 * BUSINESS LOGIC PRESERVED (unchanged):
 *   - setPricing(rate, duration) from applicationStore
 *   - validateSessionRate gate
 *   - rate/duration local state
 *   - navigation CPN-033 ? CPN-034
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { validateSessionRate } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { navigateToMissingRequirementReturn, cancelMissingRequirementFixAndReturn } from '../../navigation/missingRequirementNavigation';
import { RUPEE } from '../../utils/currency';
type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.COMPANION_PRICING>;
const MIN_RATE = 399;
const MAX_RATE = 1499;
const DEFAULT_RATE = 749;
const PLATFORM_FEE = 149;
const DURATIONS = [60, 90, 120] as const;
export function CompanionPricingScreen({
  navigation
}: Props): React.JSX.Element {
  const {
    t
  } = useTranslation();
  const {
    setPricing,
    setCurrentStage,
    setApplicationResumeTarget,
    setDraftSaved,
    profileCorrectionContext,
    completeProfileCorrection,
    missingRequirementFixContext,
    completeMissingRequirementFix,
    clearMissingRequirementFix
  } = useApplicationStore();
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [customInput, setCustomInput] = useState(String(DEFAULT_RATE));
  const [duration, setDuration] = useState<60 | 90 | 120>(90);
  const estimatedEarning = Math.max(0, rate - PLATFORM_FEE);
  const handleCustomInput = useCallback((val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setCustomInput(cleaned);
    const n = parseInt(cleaned, 10) || 0;
    if (n >= MIN_RATE && n <= MAX_RATE) {
      setRate(n);
    }
  }, []);
  const handleSliderStep = useCallback((dir: 'dec' | 'inc') => {
    setRate((r) => {
      const next = dir === 'inc' ? Math.min(r + 50, MAX_RATE) : Math.max(r - 50, MIN_RATE);
      setCustomInput(String(next));
      return next;
    });
  }, []);
  const handleContinue = useCallback(() => {
    const err = validateSessionRate(rate);
    if (err) {
      Alert.alert(t("alerts.rate_error"), err);
      return;
    }
    setPricing(rate, duration);
    setCurrentStage('companion_pricing');
    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('pricing');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, {
        mode: 'correction'
      });
      return;
    }
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('pricing');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.PAN_TAX_DETAILS);
  }, [rate, duration, setPricing, setCurrentStage, profileCorrectionContext, completeProfileCorrection, missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix, navigation]);
  return <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />
      

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.CompanionPricingContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="payments" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t("application.set_your_companion_pricing")}</Text>
        <Text style={styles.subheadline}>{t("application.choose_a_professional_rate_for_verified")}

        </Text>

        {/* ── Base Pricing Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.base_session_price")}</Text>
          <Text style={styles.cardBody}>{t("application.set_your_standard_price_for_a_verified_p")}</Text>

          {/* Price display */}
          <View style={styles.priceDisplay}>
            <Text style={styles.priceValue}>{RUPEE}{rate.toLocaleString('en-IN')}</Text>
            <Text style={styles.priceUnit}>{t("application.per_session")}</Text>
          </View>

          {/* Stepper row */}
          <View style={styles.sliderRow}>
            <View style={styles.sliderRangeRow}>
              <Text style={styles.rangeText}>{RUPEE}{MIN_RATE}</Text>
              <Text style={styles.rangeText}>{RUPEE}{MAX_RATE.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.stepperRow}>
              <TouchableOpacity accessibilityRole="button" style={styles.stepBtn} onPress={() => handleSliderStep('dec')} accessibilityLabel={t("accessibility.decrease_rate")}>
                <Icon name="remove" size={20} color={colors.gold} />
              </TouchableOpacity>
              <View style={styles.trackWrap}>
                <View style={styles.track} />
                <View style={[styles.trackFill, {
                width: `${(rate - MIN_RATE) / (MAX_RATE - MIN_RATE) * 100}%`
              }]} />
                
              </View>
              <TouchableOpacity accessibilityRole="button" style={styles.stepBtn} onPress={() => handleSliderStep('inc')} accessibilityLabel={t("accessibility.increase_rate")}>
                <Icon name="add" size={20} color={colors.gold} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Suggestion note */}
          <View style={styles.suggestionRow}>
            <Icon name="tips-and-updates" size={18} color={colors.gold} />
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionPrimary}>{t("application.suggested_range")}{RUPEE}{t("content.application.CompanionPricingScreen.599")}{RUPEE}999</Text>
              <Text style={styles.suggestionSecondary}>{t("application.based_on_similar_verified_companions_in")}

              </Text>
            </View>
          </View>

          {/* Custom input */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t("application.custom_session_price")}</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.currencySymbol}>{RUPEE}</Text>
              <TextInput style={styles.input} value={customInput} onChangeText={handleCustomInput} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} accessibilityLabel={t("accessibility.custom_session_price")} />
              
            </View>
          </View>
        </GlassCard>

        {/* ── Session Duration Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("application.session_duration")}</Text>
          <Text style={styles.cardBody}>{t("application.choose_the_default_session_length_custom")}</Text>
          <View style={styles.durationList}>
            {DURATIONS.map((d, idx) => {
            const sel = duration === d;
            return <TouchableOpacity  key={d} style={[styles.durationRow, idx < DURATIONS.length - 1 && styles.durationRowBorder, sel && styles.durationRowSelected]} onPress={() => setDuration(d)} accessibilityRole="radio" accessibilityState={{
              selected: sel
            }}>
                  {sel && <View style={styles.durationAccent} />}
                  <Text style={[styles.durationLabel, sel && styles.durationLabelSel]}>
                    {d}{t("application.minutes")}
                  </Text>
                  <View style={[styles.radioCircle, sel && styles.radioCircleSel]}>
                    {sel && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>;
          })}
          </View>
        </GlassCard>

        {/* ── Earnings Preview Card ── */}
        <GlassCard style={styles.card}>
          <View style={styles.earningsHeader}>
            <View style={styles.earningsIconWrap}>
              <Icon name="trending-up" size={16} color={colors.safetyGreen} />
            </View>
            <Text style={styles.cardTitle}>{t("application.estimated_earnings")}</Text>
          </View>

          <View style={styles.earningRow}>
            <Text style={[textStyles.bodyMd, {
            color: colors.textSecondary
          }]}>{t("content.application_kyc.CompanionPricingContent.EARNINGS_SESSION")}</Text>
            <Text style={[textStyles.bodyMd, {
            color: colors.textPrimary
          }]}>{RUPEE}{rate.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.earningDivider} />
          <View style={styles.earningRow}>
            <Text style={[textStyles.bodyMd, {
            color: colors.textSecondary
          }]}>{t("application.platform_fee")}</Text>
            <Text style={[textStyles.bodyMd, {
            color: colors.textMuted
          }]}>-{RUPEE}{PLATFORM_FEE}</Text>
          </View>
          <View style={styles.earningDivider} />
          <View style={styles.earningRow}>
            <Text style={[textStyles.labelMd, {
            color: colors.textPrimary
          }]}>{t("content.application_kyc.CompanionPricingContent.EARNINGS_YOU")}</Text>
            <Text style={[textStyles.metricSm, {
            color: colors.safetyGreen
          }]}>
              {RUPEE}{estimatedEarning.toLocaleString('en-IN')}
            </Text>
          </View>
        </GlassCard>

        {/* ── Pricing Rules Card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.CompanionPricingContent.PRICING_RULES_TITLE").toUpperCase()}</Text>
          <View style={styles.rulesList}>
            {[{
            icon: 'visibility',
            label: t("content.application.CompanionPricingScreen.transparent_pricing"),
            body: 'Customers see exactly what they pay upfront.'
          }, {
            icon: 'security',
            label: t("content.application.CompanionPricingScreen.platform_payments_only"),
            body: 'All transactions must happen on CoBuddy.'
          }, {
            icon: 'money-off',
            label: t("content.application.CompanionPricingScreen.no_cash_requests"),
            body: 'Off-platform payments are a policy violation.'
          }, {
            icon: 'gavel',
            label: t("content.application.CompanionPricingScreen.reviewed_before_publishing"),
            body: 'Unusual rates require additional verification.'
          }].map((rule) => <View key={t(rule.label)} style={styles.ruleRow}>
                <View style={styles.ruleIconWrap}>
                  <Icon name={rule.icon as any} size={spacing.iconMd} color={colors.gold} />
                </View>
                <View style={styles.ruleText}>
                  <Text style={[textStyles.labelMd, {
                color: colors.textPrimary
              }]}>{t(rule.label)}</Text>
                  <Text style={[textStyles.bodySm, {
                color: colors.textSecondary
              }]}>{rule.body}</Text>
                </View>
              </View>)}
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ₹ identical to CPN-021 to CPN-032 ── */}
      <View style={styles.ctaWrap}>
        <ActionButton label={t("content.application_kyc.CompanionPricingContent.CTA_PRIMARY")} onPress={handleContinue} variant="primary" rightIcon={t("application.arrow_forward")} accessibilityLabel={t("accessibility.save_pricing_and_continue")} />
        
        <ActionButton label={t("content.application_kyc.CompanionPricingContent.CTA_SAVE_DRAFT")} onPress={() => {
        setApplicationResumeTarget({
          route: Routes.COMPANION_PRICING
        });
        setDraftSaved(new Date().toISOString());
        navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
      }} variant="ghost" style={styles.draftBtn} accessibilityLabel={t("accessibility.save_draft")} />
        
      </View>
    </SafeAreaView>;
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },
  // Hero ₹ exactly matches CPN-021
  heroWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: spacing.sm
  },
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
    shadowOffset: {
      width: 0,
      height: 0
    },
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
  // Headline ₹ exactly matches CPN-021
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
  card: {
    gap: spacing.md
  },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  cardBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 20
  },
  // Price display
  priceDisplay: {
    alignItems: 'center',
    paddingVertical: spacing.md
  },
  priceValue: {
    ...textStyles.metricLg,
    color: colors.gold,
    fontSize: 44
  },
  priceUnit: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    letterSpacing: 0.5
  },
  // Stepper
  sliderRow: {
    gap: spacing.sm
  },
  sliderRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2
  },
  rangeText: {
    ...textStyles.labelSm,
    color: colors.textMuted
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackWrap: {
    flex: 1,
    height: 4,
    position: 'relative'
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.elevatedSurface,
    borderRadius: 2
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.gold,
    borderRadius: 2
  },
  // Suggestion
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md
  },
  suggestionContent: {
    flex: 1
  },
  suggestionPrimary: {
    ...textStyles.labelMd,
    color: colors.textPrimary,
    marginBottom: 2
  },
  suggestionSecondary: {
    ...textStyles.bodySm,
    color: colors.textSecondary
  },
  // Custom input
  inputBlock: {
    gap: spacing.xs
  },
  inputLabel: {
    ...textStyles.labelSm,
    color: colors.textMuted
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: spacing.inputHeight
  },
  currencySymbol: {
    paddingLeft: spacing.md,
    ...textStyles.bodyLg,
    color: colors.textMuted
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    ...textStyles.bodyLg,
    color: colors.textPrimary
  },
  // Duration list
  durationList: {
    gap: 0
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    position: 'relative'
  },
  durationRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSurface
  },
  durationRowSelected: {
    backgroundColor: colors.goldSubtle
  },
  durationAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.gold,
    borderRadius: 2
  },
  durationLabel: {
    ...textStyles.bodyMd,
    color: colors.textPrimary
  },
  durationLabelSel: {
    color: colors.gold,
    fontFamily: 'Inter-SemiBold'
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSel: {
    borderColor: colors.gold
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold
  },
  // Earnings
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  earningsIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.safetyGreenSubtle,
    borderWidth: 1,
    borderColor: `${colors.safetyGreen}30`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  earningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  earningDivider: {
    height: 1,
    backgroundColor: colors.borderSurface
  },
  // Rules
  rulesList: {
    gap: spacing.md,
    marginTop: spacing.xs
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
  },
  ruleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ruleText: {
    flex: 1,
    gap: 2
  },
  bottomPad: {
    height: spacing.xl
  },
  // CTA footer ₹ exact copy from CPN-021
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  draftBtn: {
    marginTop: spacing.xs
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