import { useTranslation } from 'react-i18next';
/**
 * CPN-028 — WorkPreferenceScreen
 * Stitch ref: work_preference_screen/code.html
 *
 * Content: WorkPreferenceContent from applicationKycContent.ts
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

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.WORK_PREFERENCE>;

const WorkPreferenceScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    workPreference, updateWorkPreference, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const toggleList = (
  field: 'durations' | 'days' | 'timeRanges',
  id: string) =>
  {
    const current = workPreference[field];
    const next = current.includes(id) ?
    current.filter((x) => x !== id) :
    [...current, id];
    updateWorkPreference({ [field]: next });
  };

  const canContinue =
  workPreference.durations.length > 0 &&
  workPreference.days.length > 0 &&
  workPreference.timeRanges.length > 0;

  const handleContinue = () => {
    if (!canContinue) {return;}
    setCurrentStage('work_preference');
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('work_preference');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.CITY_SERVICE_AREA);
  };

  const renderChipGroup = (
  options: ReadonlyArray<{id: string;label: string;sub?: string;}>,
  field: 'durations' | 'timeRanges') =>

  <View style={styles.chipGroup}>
      {options.map((o, index) => {
      const selected = workPreference[field].includes(o.id);
      return (
        <TouchableOpacity accessibilityRole="button"
          key={`ui-opt-${index}-${o.id}`}
          style={[styles.chip, selected && styles.chipSelected]}
          onPress={() => toggleList(field, o.id)}
          activeOpacity={0.75}
          
          accessibilityState={{ checked: selected }}>
            {selected && <Icon name="check" size={13} color={colors.gold} />}
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{t(o.label)}</Text>
            {o.sub && <Text style={styles.chipSub}>{t(o.sub)}</Text>}
          </TouchableOpacity>);

    })}
    </View>;


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
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.WorkPreferenceContent.SECTION_BADGE")}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="work" size={42} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.WorkPreferenceContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.WorkPreferenceContent.SUBHEADLINE")}</Text>

        {/* Session duration */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.WorkPreferenceContent.DURATION_TITLE")}</Text>
          {renderChipGroup((Array.isArray(t("content.application_kyc.WorkPreferenceContent.DURATION_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.WorkPreferenceContent.DURATION_OPTIONS", { returnObjects: true }) as any[]) : []), 'durations')}
        </GlassCard>

        {/* Available days */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.WorkPreferenceContent.DAYS_TITLE")}</Text>
          <View style={styles.dayGrid}>
            {((Array.isArray(t("content.application_kyc.WorkPreferenceContent.DAY_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.WorkPreferenceContent.DAY_OPTIONS", { returnObjects: true }) as any[]) : [])).map((day, index) => {
              const selected = workPreference.days.includes(day);
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={`ui-opt-${index}-${day}`}
                  style={[styles.dayChip, selected && styles.dayChipSelected]}
                  onPress={() => toggleList('days', day)}
                  activeOpacity={0.75}
                  
                  accessibilityState={{ checked: selected }}>
                  <Text style={[styles.dayChipText, selected && styles.dayChipTextSelected]}>
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Time range */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.WorkPreferenceContent.TIME_TITLE")}</Text>
          {renderChipGroup((Array.isArray(t("content.application_kyc.WorkPreferenceContent.TIME_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.WorkPreferenceContent.TIME_OPTIONS", { returnObjects: true }) as any[]) : []), 'timeRanges')}
        </GlassCard>

        {/* Frequency */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.WorkPreferenceContent.FREQ_TITLE")}</Text>
          <View style={styles.chipGroup}>
            {((Array.isArray(t("content.application_kyc.WorkPreferenceContent.FREQ_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.WorkPreferenceContent.FREQ_OPTIONS", { returnObjects: true }) as any[]) : [])).map((f, index) => {
              const selected = workPreference.frequency === f.id;
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={`ui-opt-${index}-${f.id}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => updateWorkPreference({ frequency: selected ? '' : f.id })}
                  activeOpacity={0.75}
                  
                  accessibilityState={{ selected }}>
                  {selected && <Icon name="check" size={13} color={colors.gold} />}
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{t(f.label)}</Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Venue note */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <Icon name="verified-user" size={16} color={colors.safetyGreen} />
            <Text style={styles.noteText}>{t("content.application_kyc.WorkPreferenceContent.VENUE_NOTE")}</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.WorkPreferenceContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.save_work_preferences_and_continue")} />
        
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
  heroWrap: { alignSelf: 'center' },
  heroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4
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
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipSelected: {
    backgroundColor: `${colors.gold}14`,
    borderColor: colors.gold
  },
  chipText: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  chipTextSelected: { color: colors.gold },
  chipSub: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    fontSize: 11
  },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dayChip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayChipSelected: {
    backgroundColor: `${colors.gold}14`,
    borderColor: colors.gold
  },
  dayChipText: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  dayChipTextSelected: { color: colors.gold },
  noteCard: {},
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  noteText: {
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
  }
});

export default WorkPreferenceScreen;