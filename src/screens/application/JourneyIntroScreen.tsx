import { useTranslation } from 'react-i18next';
/**
* CPN-021 — JourneyIntroScreen
* Stitch ref: companion_journey_intro_screen/code.html
*
* Layout:
*  - ScreenTopBar (back disabled on first screen)
*  - Gold circle icon (rocket_launch) with glow + badge
*  - Playfair headline + subtitle
*  - 5 phase steps (vertical list with icons, labels, descriptions)
*  - Save note pill
*  - Privacy note (GlassCard)
*  - "Begin Application" primary CTA
*
* Content: JourneyIntroContent from applicationKycContent.ts
*/

import React, { useEffect } from 'react';
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
import { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useApplicationStore } from '../../store/slices/applicationStore';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.JOURNEY_INTRO>;

const APPLICATION_PHASES = [
  { id: 'phase1', icon: 'person' },
  { id: 'phase2', icon: 'badge' },
  { id: 'phase3', icon: 'account-balance' },
  { id: 'phase4', icon: 'task-alt' }
];

const JourneyIntroScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { setCurrentStage } = useApplicationStore();

  useEffect(() => {
    setCurrentStage('journey_intro');
  }, [setCurrentStage]);

  const handleBegin = () => {
    navigation.navigate(Routes.ELIGIBILITY_CONFIRMATION);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Hero icon */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.JourneyIntroContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="flight-takeoff" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>{t("content.application_kyc.JourneyIntroContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.JourneyIntroContent.SUBHEADLINE")}</Text>

        {/* Phase overview card */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.JourneyIntroContent.SECTION_TITLE")}</Text>
          <Text style={styles.cardBody}>{t("content.application_kyc.JourneyIntroContent.SECTION_BODY")}</Text>

          <View style={styles.phaseList}>
            {APPLICATION_PHASES.map((phase, idx) => {
              const phaseLabel = ((Array.isArray(t("content.application_kyc.JourneyIntroContent.PHASE_LABELS", { returnObjects: true })) ? (t("content.application_kyc.JourneyIntroContent.PHASE_LABELS", { returnObjects: true }) as any[]) : []))[idx];
              return (
                <View key={`ui-opt-${idx}-${phase.id}`} style={styles.phaseRow}>
                  <View style={styles.phaseIconWrap}>
                    <Icon name={phase.icon} size={20} color={colors.gold} />
                  </View>
                  <View style={styles.phaseTextWrap}>
                    <View style={styles.phaseLabelRow}>
                      <Text style={styles.phaseStep}>{`${idx + 1}.`}</Text>
                      <Text style={styles.phaseLabel}>{phaseLabel?.phase}</Text>
                    </View>
                    <Text style={styles.phaseDesc}>{phaseLabel?.desc}</Text>
                  </View>
                </View>);

            })}
          </View>
        </GlassCard>

        {/* Save note */}
        <View style={styles.savePill}>
          <Icon name="save" size={14} color={colors.safetyGreen} />
          <Text style={styles.savePillText}>{t("content.application_kyc.JourneyIntroContent.SAVE_NOTE")}</Text>
        </View>

        {/* Privacy card */}
        <GlassCard style={styles.privacyCard}>
          <View style={styles.privacyRow}>
            <Icon name="lock" size={18} color={colors.gold} />
            <Text style={styles.privacyText}>{t("content.application_kyc.JourneyIntroContent.PRIVACY_NOTE")}</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.JourneyIntroContent.CTA_PRIMARY")}
          onPress={handleBegin}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.begin_your_companion_application")} />
        
      </View>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },
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
  phaseList: { gap: spacing.md, marginTop: spacing.sm },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md
  },
  phaseIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.elevatedSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  phaseTextWrap: { flex: 1, gap: 2 },
  phaseLabelRow: { flexDirection: 'row', gap: spacing.xs },
  phaseStep: {
    ...textStyles.labelMd,
    color: colors.gold
  },
  phaseLabel: {
    ...textStyles.labelMd,
    color: colors.textPrimary
  },
  phaseDesc: {
    ...textStyles.bodySm,
    color: colors.textSecondary
  },
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: `${colors.safetyGreen}18`,
    borderWidth: 1,
    borderColor: `${colors.safetyGreen}30`
  },
  savePillText: {
    ...textStyles.labelSm,
    color: colors.safetyGreen
  },
  privacyCard: {},
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm
  },
  privacyText: {
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
  } });

export default JourneyIntroScreen;