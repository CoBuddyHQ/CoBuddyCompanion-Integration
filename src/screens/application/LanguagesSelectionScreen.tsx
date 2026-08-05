import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
/**
 * CPN-034 — Languages Selection Screen
 * Phase 4B Visual Consistency Polish
 *
 * Visual system: matches CPN-021 to CPN-032
 *   - ScreenTopBar (shared, consistent)
 *   - ApplicationPhaseProgress: "Financial Setup"
 *   - Hero circle: 88×88, cardSurface bg, colors.border, gold glow, 44px icon
 *   - Headline: textStyles.displayMd (Playfair SemiBold), centered
 *   - Cards: GlassCard
 *   - Primary CTA: ActionButton variant="primary"
 *   - Secondary: ActionButton variant="ghost"
 *
 * BUSINESS LOGIC PRESERVED (unchanged):
 *   - setLanguages(spoken, primary, comfort[]) from applicationStore
 *   - minimum 1 language required
 *   - navigation CPN-034 → CPN-035
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert } from
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

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.LANGUAGES_SELECTION>;

const ALL_LANGUAGES = ['Hindi', 'English', 'Hinglish', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi'];

export function LanguagesSelectionScreen({ navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const {
    setLanguages,
    setCurrentStage,
    setApplicationResumeTarget,
    setDraftSaved,
    profileCorrectionContext,
    completeProfileCorrection,
    missingRequirementFixContext,
    completeMissingRequirementFix,
    clearMissingRequirementFix
  } = useApplicationStore();

  // Comfort labels come from i18n — no hardcoding
  const COMFORT_LABELS = [
  t('application.languages_comfort_1'),
  t('application.languages_comfort_2'),
  t('application.languages_comfort_3')];


  const [selected, setSelected] = useState<Set<string>>(
    new Set(['Hindi', 'English', 'Hinglish'])
  );
  const [primaryLang, setPrimary] = useState<string | null>('Hinglish');
  const [comfort, setComfort] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true });

  const toggleLang = useCallback(
    (lang: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(lang)) {
          next.delete(lang);
          if (primaryLang === lang) {
            setPrimary(null);
          }
        } else {
          next.add(lang);
        }
        return next;
      });
    },
    [primaryLang]
  );

  const toggleComfort = useCallback((idx: number) => {
    setComfort((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const handleContinue = useCallback(async () => {
    if (selected.size === 0) {
      Alert.alert(
        t('application.languages_required_alert_title'),
        t('application.languages_required_alert_body')
      );
      return;
    }
    const comfortLabels = COMFORT_LABELS.filter((_, idx) => comfort[idx]);
    const langArray = [...selected];
    setLanguages(langArray, primaryLang ?? '', comfortLabels);
    setCurrentStage('languages_selection');

    try {
      await ProfileService.updateLanguages({
        languages: langArray,
        primaryLanguage: primaryLang ?? '',
      });
    } catch (e) {
      // ApiClient logs request & response
    }

    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('languages');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'correction' });
      return;
    }
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('languages');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.PROFILE_PHOTO_UPLOAD);
  }, [
  selected,
  primaryLang,
  comfort,
  COMFORT_LABELS,
  setLanguages,
  setCurrentStage,
  profileCorrectionContext,
  completeProfileCorrection,
  missingRequirementFixContext,
  completeMissingRequirementFix,
  clearMissingRequirementFix,
  navigation]
  );

  const primaryOptions = ALL_LANGUAGES.filter((l) => selected.has(l));

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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Phase badge ── */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t('application.languages_section_badge')}</Text>
        </View>

        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="translate" size={44} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={16} color={colors.gold} />
          </View>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>{t('application.languages_headline')}</Text>
        <Text style={styles.subheadline}>{t('application.languages_subheadline')}</Text>

        {/* ── Card 1: Languages You Speak ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.languages_title').toUpperCase()}</Text>
          <Text style={styles.cardBody}>{t('application.languages_subtitle')}</Text>
          <View style={styles.chipGrid}>
            {ALL_LANGUAGES.map((lang, index) => {
              const isSelected = selected.has(lang);
              
              let resolvedScript = lang[0];
              if (lang === 'Hindi') resolvedScript = 'हिं';
              if (lang === 'English') resolvedScript = 'En';
              if (lang === 'Hinglish') resolvedScript = 'Hi-En';
              if (lang === 'Bengali') resolvedScript = 'বাं';
              if (lang === 'Marathi') resolvedScript = 'म';
              if (lang === 'Telugu') resolvedScript = 'తె';
              if (lang === 'Tamil') resolvedScript = 'த';
              if (lang === 'Gujarati') resolvedScript = 'गु';
              if (lang === 'Urdu') resolvedScript = 'اُ';
              if (lang === 'Kannada') resolvedScript = 'ಕ';
              if (lang === 'Odia') resolvedScript = 'ଓ';
              if (lang === 'Malayalam') resolvedScript = 'മ';
              if (lang === 'Punjabi') resolvedScript = 'ਪੰ';
              
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={`lang-chip-${index}-${lang}`}
                  style={[styles.langChip, isSelected && styles.langChipSelected]}
                  onPress={() => toggleLang(lang)}
                  
                  accessibilityState={{ checked: isSelected }}>
                  {isSelected &&
                  <View style={styles.langCheckBadge}>
                      <Icon name="check" size={10} color={colors.rootBg} />
                    </View>
                  }
                  <Text style={styles.langChipScript}>
                    {resolvedScript}
                  </Text>
                  <Text
                    style={[
                    styles.langChipText,
                    isSelected && styles.langChipTextSelected]
                    }>
                    {lang}
                  </Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* ── Card 2: Primary Language ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.languages_primary_title').toUpperCase()}</Text>
          <Text style={styles.cardBody}>{t('application.languages_primary_subtitle')}</Text>
          <View style={styles.radioList}>
            {(primaryOptions.length > 0 ? primaryOptions : ['Hindi', 'English', 'Hinglish']).map(
              (lang, index) => {
                const isSelected = primaryLang === lang;
                
                return (
                  <TouchableOpacity accessibilityRole="button"
                    key={`primary-lang-${index}-${lang}`}
                    style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                    onPress={() => setPrimary(lang)}
                    
                    accessibilityState={{ selected: isSelected }}>
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {lang}
                    </Text>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSel]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>);

              }
            )}
          </View>
        </GlassCard>

        {/* ── Card 3: Communication Comfort ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.languages_comfort_title').toUpperCase()}</Text>
          {COMFORT_LABELS.map((label, idx) =>
          <View key={`comfort-row-${idx}`}>
              <View style={styles.comfortRow}>
                <Text style={styles.comfortLabel}>{label}</Text>
                <Switch
                value={comfort[idx] ?? false}
                onValueChange={() => toggleComfort(idx)}
                trackColor={{ false: colors.borderSurface, true: colors.gold }}
                thumbColor={colors.white}
                accessibilityLabel={label} />
              
              </View>
              {idx < COMFORT_LABELS.length - 1 && <View style={styles.comfortDivider} />}
            </View>
          )}
        </GlassCard>

        {/* ── Review Note ── */}
        <GlassCard style={styles.card}>
          <View style={styles.reviewRow}>
            <Icon name="lock" size={spacing.iconLg} color={colors.gold} />
            <Text style={styles.reviewText}>{t('application.languages_review_note')}</Text>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t('application.languages_cta_primary')}
          onPress={handleContinue}
          variant="primary"
          rightIcon={t('application.arrow_forward')}
          accessibilityLabel={t('application.languages_cta_primary')} />
        
        <ActionButton
          label={t('application.save_draft')}
          onPress={() => {
            setApplicationResumeTarget({ route: Routes.LANGUAGES_SELECTION });
            setDraftSaved(new Date().toISOString());
            navigation.navigate(Routes.APPLICATION_SAVED_DRAFT);
          }}
          variant="ghost"
          style={styles.draftBtn}
          accessibilityLabel={t('application.save_draft')} />
        
        <Text style={styles.draftNote}>{t('application.languages_draft_note')}</Text>
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

  // Cards
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

  // Language chip grid
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    marginTop: spacing.sm
  },
  langChip: {
    width: '31.5%',
    minHeight: 72,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    position: 'relative'
  },
  langChipSelected: {
    borderColor: colors.gold,
    borderWidth: 1.5,
    backgroundColor: 'rgba(214, 168, 79, 0.08)'
  },
  langCheckBadge: {
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
  langChipScript: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28
  },
  langChipText: {
    ...textStyles.labelSm,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  langChipTextSelected: {
    color: colors.gold
  },

  // Primary language radio
  radioList: { gap: spacing.xs },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSurface,
    backgroundColor: colors.elevatedSurface
  },
  radioRowSelected: {
    borderColor: colors.border,
    backgroundColor: colors.goldSubtle
  },
  radioLabel: { ...textStyles.bodyMd, color: colors.textPrimary },
  radioLabelSelected: { color: colors.gold, fontFamily: 'Inter-SemiBold' },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSel: { borderColor: colors.gold },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold },

  // Comfort
  comfortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm
  },
  comfortLabel: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    paddingRight: spacing.md
  },
  comfortDivider: { height: 1, backgroundColor: colors.borderSurface },

  // Review note
  reviewRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  reviewText: {
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
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  draftBtn: { marginTop: spacing.xs },
  draftNote: {
    ...textStyles.labelXs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingTop: spacing.xs
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