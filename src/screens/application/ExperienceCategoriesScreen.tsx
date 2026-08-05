import { useTranslation } from 'react-i18next';
/**
 * CPN-026 ï¿½ ExperienceCategoriesScreen
 * Stitch ref: experience_categories_selection_screen/code.html
 *
 * Content: ExperienceCategoriesContent from applicationKycContent.ts
 * Layout: 2-column grid of selectable category tiles
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
import { ProfileService } from '../../services/api/services/profile.service';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.EXPERIENCE_CATEGORIES>;

const ExperienceCategoriesScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    experienceCategories, toggleExperienceCategory, setCurrentStage,
    profileCorrectionContext, completeProfileCorrection,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const count = experienceCategories.length;
  const canContinue = count >= 1;

  const handleContinue = async () => {
    if (!canContinue) {return;}
    setCurrentStage('experience_categories');

    try {
      await ProfileService.updateCategories({ categories: experienceCategories });
    } catch (e) {
      // ApiClient logs request & response
    }

    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('experience_categories');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'correction' });
      return;
    }
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('experience');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.LANGUAGES_SELECTION);
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
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.ExperienceCategoriesContent.SECTION_BADGE")}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="category" size={42} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.ExperienceCategoriesContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.ExperienceCategoriesContent.SUBHEADLINE")}</Text>

        {/* Selection info pill */}
        <View style={styles.selectionPill}>
          <Icon
            name={count > 0 ? 'check-circle' : 'radio-button-unchecked'}
            size={14}
            color={count > 0 ? colors.safetyGreen : colors.textMuted} />
          
          <Text style={[styles.selectionPillText, count > 0 && styles.selectionPillTextActive]}>
            {t("content.application_kyc.ExperienceCategoriesContent.SELECTION_COUNT_LABEL").replace('{count}', String(count))}
          </Text>
        </View>

        {/* Grid */}
        <GlassCard style={styles.gridCard}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.ExperienceCategoriesContent.SECTION_TITLE")}</Text>
          <Text style={styles.cardBody}>{t("content.application_kyc.ExperienceCategoriesContent.SECTION_BODY")}</Text>

          <View style={styles.grid}>
            {((Array.isArray(t("content.application_kyc.ExperienceCategoriesContent.CATEGORIES", { returnObjects: true })) ? (t("content.application_kyc.ExperienceCategoriesContent.CATEGORIES", { returnObjects: true }) as any[]) : [])).map((cat, index) => {
              const selected = experienceCategories.includes(cat.id);
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={`ui-opt-${index}-${cat.id}`}
                  style={[styles.tile, selected && styles.tileSelected]}
                  onPress={() => toggleExperienceCategory(cat.id)}
                  activeOpacity={0.75}
                  
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={t(cat.label)}>
                  {selected &&
                  <View style={styles.tileCheck}>
                      <Icon name="check-circle" size={16} color={colors.gold} />
                    </View>
                  }
                  <View style={[styles.tileIconWrap, selected && styles.tileIconWrapSelected]}>
                    <Icon
                      name={cat.icon}
                      size={24}
                      color={selected ? colors.gold : colors.textSecondary} />
                    
                  </View>
                  <Text style={[styles.tileLabel, selected && styles.tileLabelSelected]}>
                    {t(cat.label)}
                  </Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Approved note */}
        <View style={styles.approvedNote}>
          <Icon name="verified-user" size={14} color={colors.safetyGreen} />
          <Text style={styles.approvedNoteText}>{t("content.application_kyc.ExperienceCategoriesContent.APPROVED_NOTE")}</Text>
        </View>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {!canContinue &&
        <Text style={styles.disabledTip}>{t("content.application_kyc.ExperienceCategoriesContent.MIN_HINT")}</Text>
        }
        <ActionButton
          label={t("content.application_kyc.ExperienceCategoriesContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.save_experience_categories_and_continue")} />
        
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
  selectionPill: {
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
  selectionPillText: {
    ...textStyles.labelSm,
    color: colors.textMuted
  },
  selectionPillTextActive: { color: colors.safetyGreen },
  gridCard: { gap: spacing.md },
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  tile: {
    width: '47%',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    position: 'relative'
  },
  tileSelected: {
    borderColor: colors.gold,
    backgroundColor: `${colors.gold}10`
  },
  tileCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm
  },
  tileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.cardSurface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileIconWrapSelected: { backgroundColor: `${colors.gold}15` },
  tileLabel: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  tileLabelSelected: { color: colors.textPrimary },
  approvedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'center'
  },
  approvedNoteText: {
    ...textStyles.bodySm,
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

export default ExperienceCategoriesScreen;