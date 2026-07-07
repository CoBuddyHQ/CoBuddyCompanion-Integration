import { useTranslation } from 'react-i18next';
/**
 * CPN-022 — EligibilityConfirmationScreen
 * Stitch ref: eligibility_confirmation_screen/code.html
 *
 * Layout:
 *  - ScreenTopBar + phase badge
 *  - Shield icon + headline
 *  - 5 confirmation checkboxes in GlassCard
 *  - Primary CTA gated on all 5 checked
 *
 * Content: EligibilityContent from applicationKycContent.ts
 */

import React, { useState } from 'react';
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
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useApplicationStore, EligibilityKey } from '../../store/slices/applicationStore';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.ELIGIBILITY_CONFIRMATION>;

const EligibilityConfirmationScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const { eligibilityConfirmed, setEligibilityConfirmed, setCurrentStage } = useApplicationStore();

  const allConfirmed = ((Array.isArray(t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true })) ? (t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true }) as any[]) : [])).every(
    (c) => eligibilityConfirmed[c.id as EligibilityKey]
  );

  const handleToggle = (id: string) => {
    setEligibilityConfirmed(id as EligibilityKey, !eligibilityConfirmed[id as EligibilityKey]);
  };

  const handleContinue = () => {
    if (!allConfirmed) {return;}
    setCurrentStage('eligibility');
    navigation.navigate(Routes.PROFILE_SETUP_INTRO);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => navigation.goBack()} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="shield" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.EligibilityContent.BADGE_LABEL")}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="fact-check" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.EligibilityContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.EligibilityContent.SUBHEADLINE")}</Text>

        {/* Confirmation list */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.EligibilityContent.SECTION_TITLE")}</Text>
          <Text style={styles.cardBody}>{t("content.application_kyc.EligibilityContent.SECTION_BODY")}</Text>

          <View style={styles.confirmList}>
            {((Array.isArray(t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true })) ? (t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true }) as any[]) : [])).map((item, index) => {
              const checked = eligibilityConfirmed[item.id as EligibilityKey];
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={`ui-opt-${index}-${item.id}`}
                  style={[styles.confirmRow, checked && styles.confirmRowChecked]}
                  onPress={() => handleToggle(item.id)}
                  activeOpacity={0.75}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={t(item.label)}>
                  {/* Icon */}
                  <View style={[styles.confirmIcon, checked && styles.confirmIconChecked]}>
                    <Icon
                      name={checked ? 'check-circle' : item.icon}
                      size={20}
                      color={checked ? colors.rootBg : colors.gold} />
                    
                  </View>
                  {/* Text */}
                  <View style={styles.confirmText}>
                    <Text style={[styles.confirmLabel, checked && styles.confirmLabelChecked]}>
                      {t(item.label)}
                    </Text>
                    {item.note ?
                    <Text style={styles.confirmNote}>{item.note}</Text> :
                    null}
                  </View>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Progress hint */}
        <View style={styles.progressHint}>
          <Text style={styles.progressHintText}>
            {((Array.isArray(t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true })) ? (t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true }) as any[]) : [])).filter(
              (c) => eligibilityConfirmed[c.id as EligibilityKey]
            ).length}{' '}
            / {((Array.isArray(t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true })) ? (t("content.application_kyc.EligibilityContent.CONFIRMATIONS", { returnObjects: true }) as any[]) : [])).length}{t("application.confirmed")}
          </Text>
        </View>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {!allConfirmed &&
        <Text style={styles.disabledTip}>{t("content.application_kyc.EligibilityContent.CTA_DISABLED_TIP")}</Text>
        }
        <ActionButton
          label={t("content.application_kyc.EligibilityContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!allConfirmed}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.confirm_eligibility_and_continue")} />
        
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
  phaseBadge: {
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
  phaseBadgeText: {
    ...textStyles.labelSm,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  heroWrap: {
    alignSelf: 'center',
    position: 'relative'
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5
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
  confirmList: { gap: spacing.sm },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  confirmRowChecked: {
    borderColor: colors.border,
    backgroundColor: `${colors.gold}12`
  },
  confirmIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  confirmIconChecked: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  confirmText: { flex: 1, gap: 2 },
  confirmLabel: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    lineHeight: 22
  },
  confirmLabelChecked: { color: colors.textPrimary },
  confirmNote: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    lineHeight: 18
  },
  progressHint: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  progressHintText: {
    ...textStyles.labelSm,
    color: colors.textMuted
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
  }
});

export default EligibilityConfirmationScreen;