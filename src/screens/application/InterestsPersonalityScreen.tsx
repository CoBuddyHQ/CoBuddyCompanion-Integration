import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
/**
 * CPN-027 — InterestsPersonalityScreen
 * Phase 4B Visual Consistency Polish
 *
 * Design system: matches LanguagesSelectionScreen (CPN-034)
 *   - ScreenTopBar (shared, consistent)
 *   - Phase badge · Hero circle 88×88 · gold glow
 *   - Headline: PlayfairDisplay-SemiBold, centered
 *   - Cards: GlassCard
 *   - Tags: flex-wrap pill chips with gold check badge overlay
 *   - Count pill: live counter
 *   - Primary CTA: ActionButton variant="primary"
 *
 * BUSINESS LOGIC PRESERVED (unchanged):
 *   - interestTags, toggleInterestTag from applicationStore
 *   - max 8 tags total
 *   - navigation CPN-027 → CPN-028
 */

import React, { useCallback } from 'react';
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

import { useApplicationStore } from '../../store/slices/applicationStore';
import { ProfileService } from '../../services/api/services/profile.service';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import {
  navigateToMissingRequirementReturn,
  cancelMissingRequirementFixAndReturn } from
'../../navigation/missingRequirementNavigation';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.INTERESTS_PERSONALITY>;

// Tag id → i18n key suffix map (drives translation without hardcoding labels)
const TAG_KEY_MAP: Record<string, string> = {
  great_listener: 'interests_tag_great_listener',
  good_conversationalist: 'interests_tag_good_conversationalist',
  thoughtful: 'interests_tag_thoughtful',
  encouraging: 'interests_tag_encouraging',
  calm_presence: 'interests_tag_calm_presence',
  observant: 'interests_tag_observant',
  multilingual: 'interests_tag_multilingual',
  patient: 'interests_tag_patient',
  art_lover: 'interests_tag_art_lover',
  bookworm: 'interests_tag_bookworm',
  foodie: 'interests_tag_foodie',
  city_explorer: 'interests_tag_city_explorer',
  culture_enthusiast: 'interests_tag_culture_enthusiast',
  nature_walk: 'interests_tag_nature_walk',
  cinema_buff: 'interests_tag_cinema_buff',
  events_networking: 'interests_tag_events_networking',
  wellness_yoga: 'interests_tag_wellness_yoga',
  history_heritage: 'interests_tag_history_heritage',
  photography: 'interests_tag_photography',
  music_concerts: 'interests_tag_music_concerts'
};

const MAX_TAGS = 5;

export function InterestsPersonalityScreen({ navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const {
    interestTags,
    toggleInterestTag,
    setCurrentStage,
    profileCorrectionContext,
    completeProfileCorrection,
    missingRequirementFixContext,
    completeMissingRequirementFix,
    clearMissingRequirementFix
  } = useApplicationStore();

  const count = interestTags.length;
  const atMax = count >= MAX_TAGS;
  const canContinue = count > 0;

  const countLabel = t('application.interests_count_label').
  replace('{count}', String(count)).
  replace('{max}', String(MAX_TAGS));

  const handleContinue = useCallback(async () => {
    if (!canContinue) {return;}
    setCurrentStage('interests_personality');

    try {
      await ProfileService.updateCommActivity({ interests: interestTags });
    } catch (e) {
      // ApiClient logs request & response
    }

    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('interests');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'correction' });
      return;
    }
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('interests');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.EXPERIENCE_CATEGORIES);
  }, [
  canContinue,
  interestTags,
  setCurrentStage,
  profileCorrectionContext,
  completeProfileCorrection,
  missingRequirementFixContext,
  completeMissingRequirementFix,
  navigation]
  );

  type TagItem = {readonly id: string;readonly label: string;};

  const renderTagSection = (tags: ReadonlyArray<TagItem>) =>
  <View style={styles.tagGrid}>
      {tags.map((tag, index) => {
      const selected = interestTags.includes(tag.id);
      const disabled = atMax && !selected;
      const label = t(`application.${TAG_KEY_MAP[tag.id]}`) || tag.label;
      return (
        <TouchableOpacity accessibilityRole="button"
          key={`ui-opt-${index}-${tag.id}`}
          style={[
          styles.tag,
          selected && styles.tagSelected,
          disabled && styles.tagDisabled]
          }
          onPress={() => {if (!disabled) {toggleInterestTag(tag.id);}}}
          activeOpacity={disabled ? 1 : 0.75}
          
          accessibilityState={{ checked: selected, disabled }}
          accessibilityLabel={label}>
            {selected &&
          <View style={styles.tagCheckBadge}>
                <Icon name="check" size={9} color={colors.rootBg} />
              </View>
          }
            <Text style={[
          styles.tagText,
          selected && styles.tagTextSelected,
          disabled && styles.tagTextDisabled]
          }>
              {label}
            </Text>
          </TouchableOpacity>);

    })}
    </View>;


  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar
        title={t('application.cobuddy_companion')}
        onBack={() =>
        cancelMissingRequirementFixAndReturn(
          navigation,
          missingRequirementFixContext.isActive,
          missingRequirementFixContext.returnRoute,
          clearMissingRequirementFix
        )
        } />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Phase badge ── */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t('application.interests_section_badge')}</Text>
        </View>

        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="tag" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="auto-awesome" size={14} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t('application.interests_headline')}</Text>
        <Text style={styles.subheadline}>{t('application.interests_subheadline')}</Text>

        {/* ── Count pill ── */}
        <View style={[styles.countPill, atMax && styles.countPillMax]}>
          <Icon
            name={atMax ? 'check-circle' : 'tag'}
            size={14}
            color={atMax ? colors.gold : colors.textMuted} />
          
          <Text style={[styles.countPillText, atMax && styles.countPillTextMax]}>
            {countLabel}
          </Text>
        </View>

        {/* ── Card 1: Communication Style ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.interests_comm_title').toUpperCase()}</Text>
          {renderTagSection((Array.isArray(t("content.application_kyc.InterestsPersonalityContent.COMM_TAGS", { returnObjects: true })) ? (t("content.application_kyc.InterestsPersonalityContent.COMM_TAGS", { returnObjects: true }) as any[]) : []))}
        </GlassCard>

        {/* ── Card 2: Activity Interests ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.interests_activity_title').toUpperCase()}</Text>
          {renderTagSection((Array.isArray(t("content.application_kyc.InterestsPersonalityContent.ACTIVITY_TAGS", { returnObjects: true })) ? (t("content.application_kyc.InterestsPersonalityContent.ACTIVITY_TAGS", { returnObjects: true }) as any[]) : []))}
        </GlassCard>

        {/* ── Safety note ── */}
        <GlassCard style={styles.card}>
          <View style={styles.safetyRow}>
            <Icon name="shield" size={spacing.iconLg} color={colors.safetyGreen} />
            <Text style={styles.safetyText}>{t('application.interests_safety_note')}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t('application.interests_cta_primary')}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t('application.arrow_forward')}
          accessibilityLabel={t('application.interests_cta_primary')} />
        
      </View>
    </SafeAreaView>);

}

export default InterestsPersonalityScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  },

  // Phase badge
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
  },

  // Hero
  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
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

  // Count pill
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  countPillMax: {
    backgroundColor: colors.goldSubtle,
    borderColor: colors.gold
  },
  countPillText: { ...textStyles.labelSm, color: colors.textMuted },
  countPillTextMax: { color: colors.gold },

  // Cards
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },

  // Tag grid — 3-column layout matching Language screen chips
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    marginTop: spacing.xs
  },
  tag: {
    width: '31.5%',
    minHeight: 60,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    position: 'relative'
  },
  tagSelected: {
    backgroundColor: 'rgba(214, 168, 79, 0.10)',
    borderColor: colors.gold,
    borderWidth: 1.5
  },
  tagDisabled: { opacity: 0.38 },
  tagCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagText: {
    ...textStyles.labelSm,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  tagTextSelected: { color: colors.gold },
  tagTextDisabled: { color: colors.textMuted },

  // Safety note
  safetyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  safetyText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20
  },

  bottomPad: { height: spacing.xl },

  // CTA footer
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});