import { useTranslation } from 'react-i18next';
/**
 * CPN-045 — Profile Setup Intro Screen
 * Phase 4C — First screen after CPN-022 Eligibility Confirmation.
 * Position: BEFORE profile data collection, BEFORE verification.
 * Entry point: EligibilityConfirmationScreen → navigate(PROFILE_SETUP_INTRO)
 * Exit: navigate(BASIC_DETAILS) (CPN-023)
 */
import React, { useCallback } from 'react';
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
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.PROFILE_SETUP_INTRO>;

export function ProfileSetupIntroScreen({ navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { setProfileSetupStarted, setCurrentStage, setApplicationResumeTarget, setDraftSaved } = useApplicationStore();

  const handleStart = useCallback(() => {
    setProfileSetupStarted(true);
    setCurrentStage('profile_setup_intro');
    navigation.navigate(Routes.BASIC_DETAILS);
  }, [setProfileSetupStarted, setCurrentStage, navigation]);

  const handleLater = useCallback(() => {
    setApplicationResumeTarget({ route: Routes.PROFILE_SETUP_INTRO });
    setDraftSaved(new Date().toISOString());
    navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
  }, [setApplicationResumeTarget, setDraftSaved, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.setupBadge}>
          <Icon name="edit-note" size={14} color={colors.gold} />
          <Text style={styles.setupBadgeText}>{t("content.application_kyc.ProfileSetupIntroContent.SETUP_BADGE")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="badge" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="person" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Setup badge ── */}

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t("content.application_kyc.ProfileSetupIntroContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ProfileSetupIntroContent.SUBHEADLINE")}</Text>

        {/* ── Setup journey card ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ProfileSetupIntroContent.SETUP_JOURNEY_TITLE").toUpperCase()}</Text>
          <Text style={styles.cardNote}>{t("content.application_kyc.ProfileSetupIntroContent.SETUP_JOURNEY_NOTE")}</Text>
          <View style={styles.stepList}>
            {((Array.isArray(t("content.application_kyc.ProfileSetupIntroContent.SETUP_STEPS", { returnObjects: true })) ? (t("content.application_kyc.ProfileSetupIntroContent.SETUP_STEPS", { returnObjects: true }) as any[]) : [])).map((step, i) =>
            <View key={`ui-opt-${i}-${t(step.label)}`} style={styles.stepRow}>
                <View style={styles.stepIconWrap}>
                  <Icon name={step.icon as any} size={22} color={colors.gold} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepLabel}>{t(step.label)}</Text>
                  <Text style={styles.stepDesc}>{t(step.description)}</Text>
                </View>
              </View>
            )}
          </View>
        </GlassCard>

        {/* ── Review note card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="workspace-premium" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ProfileSetupIntroContent.REVIEW_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* ── Standards card ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="shield" size={spacing.iconMd} color={colors.gold} />
            </View>
            <Text style={styles.noteText}>{t("content.application_kyc.ProfileSetupIntroContent.STANDARDS_NOTE")}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.ProfileSetupIntroContent.CTA_START")}
          onPress={handleStart}
          variant="primary"
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.start_profile_setup")} />
        
        <ActionButton
          label={t("content.application_kyc.ProfileSetupIntroContent.CTA_LATER")}
          onPress={handleLater}
          variant="ghost"
          style={styles.laterBtn}
          accessibilityLabel={t("accessibility.continue_profile_setup_later")} />
        
        <Text style={styles.laterNote}>{t("content.application_kyc.ProfileSetupIntroContent.LATER_NOTE")}</Text>
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg },

  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.cardSurface, borderWidth: 1, borderColor: `${colors.gold}30`,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  setupBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    alignSelf: 'center', backgroundColor: `${colors.gold}15`,
    borderRadius: radius.full, borderWidth: 1, borderColor: `${colors.gold}30`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  setupBadgeText: { ...textStyles.labelMd, color: colors.gold },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  card: { gap: spacing.md },
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },
  cardNote: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  stepList: { gap: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  stepContent: { flex: 1 },
  stepLabel: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 2 },
  stepDesc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteText: { flex: 1, ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  laterBtn: { marginTop: spacing.xs },
  laterNote: { ...textStyles.labelSm, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' }
});