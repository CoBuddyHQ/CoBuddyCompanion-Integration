/**
 * CPN-004 — LanguageSelectionScreen
 * Visual parity: Stitch language_selection_screen/code.html
 *
 * Stitch layout:
 *  - ScreenTopBar with border-b
 *  - Centered header: translate icon + "Choose Your App Language" H1 + subtitle
 *  - GlassCard with gold left-bar accent wrapping radio list
 *    - Section label: "APP INTERFACE LANGUAGE"
 *    - Each language row: radio circle + label text + check_circle (when selected)
 *    - Selected row: gold border, gold circle, check_circle visible
 *  - Info note card below (lock icon + privacy note)
 *  - Sticky bottom: hint text + "Continue" gold button + "Use English for Now" ghost
 *
 * Content: LanguageContent from authOnboardingContent.ts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView } from
'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { AuthStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

import { useTranslation } from "react-i18next";

type Props = StackScreenProps<AuthStackParamList, typeof Routes.LANGUAGE_SELECTION>;

const LanguageSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedCode, setSelectedCode] = useState<string>('hi');

  const handleContinue = () => {
    navigation.navigate(Routes.NOTIFICATION_PERMISSION);
  };

  const handleEnglishFallback = () => {
    setSelectedCode('en');
    navigation.navigate(Routes.NOTIFICATION_PERMISSION);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenTopBar
        onBack={() => navigation.goBack()}
        style={styles.topBar} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.translatePill}>
            <Icon name="translate" size={16} color={colors.gold} />
            <Text style={styles.translatePillText}>{t("content.auth_onboarding.LanguageContent.APP_INTERFACE")}</Text>
          </View>
          <Text style={styles.headline}>{t("content.auth_onboarding.LanguageContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.auth_onboarding.LanguageContent.SUBHEADLINE")}</Text>
        </View>

        {/* Language list in gold left-bar glass card */}
        <GlassCard goldLeftBar style={styles.languageCard}>
          <Text style={styles.sectionLabel}>{t("content.auth_onboarding.LanguageContent.APP_INTERFACE_CAPS")}</Text>
          {((Array.isArray(t("content.auth_onboarding.LanguageContent.LANGUAGES", { returnObjects: true })) ? (t("content.auth_onboarding.LanguageContent.LANGUAGES", { returnObjects: true }) as any[]) : [])).map((lang, idx) => {
            const isSelected = selectedCode === lang.code;
            return (
              <TouchableOpacity
                key={`ui-opt-${idx}-${lang.code}`}
                style={[
                styles.langRow,
                idx < ((Array.isArray(t("content.auth_onboarding.LanguageContent.LANGUAGES", { returnObjects: true })) ? (t("content.auth_onboarding.LanguageContent.LANGUAGES", { returnObjects: true }) as any[]) : [])).length - 1 && styles.langRowBorder,
                isSelected && styles.langRowSelected]
                }
                onPress={() => setSelectedCode(lang.code)}
                activeOpacity={0.75}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={t('accessibility.language_selection', { native: lang.nativeLabel, en: lang.label })}>

                {/* Radio circle */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.langTextGroup}>
                  <Text style={[styles.langNative, isSelected && styles.langNativeSelected]}>
                    {t(lang.label)}
                  </Text>
                  {lang.nativeLabel !== lang.label &&
                  <Text style={styles.langEnglish}>{lang.nativeLabel}</Text>
                  }
                </View>

                {/* Check circle when selected */}
                {isSelected &&
                <Icon name="check-circle" size={20} color={colors.gold} />
                }
              </TouchableOpacity>);

          })}
        </GlassCard>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Icon name="lock" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>
             {t('auth.your_language_preference_is_saved_locally_and_can_be_changed_anytime_from_settings')} </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <ActionButton
            label={t("content.auth_onboarding.LanguageContent.CTA_PRIMARY")}
            onPress={handleContinue}
            disabled={!selectedCode}
            accessibilityLabel={t("accessibility.continue_with_selected_language")} />
          
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={handleEnglishFallback}>
            <Text style={styles.ghostBtnText}>{t("content.auth_onboarding.LanguageContent.USE_ENGLISH")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(214, 168, 79, 0.12)'
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl
  },
  translatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: spacing.huge,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.md
  },
  translatePillText: {
    ...textStyles.labelSm,
    color: colors.gold
  },
  headline: {
    ...textStyles.displayMd,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 36
  },
  subheadline: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  languageCard: {
    marginBottom: spacing.md,
    // GlassCard handles internal padding — override to 0 for custom rows
    padding: 0
  },
  sectionLabel: {
    ...textStyles.capsSm,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md
  },
  langRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 192, 204, 0.08)'
  },
  langRowSelected: {
    backgroundColor: 'rgba(214, 168, 79, 0.06)'
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(184, 192, 204, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  radioOuterSelected: {
    borderColor: colors.gold
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold
  },
  langTextGroup: {
    flex: 1,
    gap: 2
  },
  langNative: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    fontWeight: '500'
  },
  langNativeSelected: {
    color: colors.textPrimary,
    fontWeight: '600'
  },
  langEnglish: {
    ...textStyles.labelXs,
    color: colors.textMuted
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(16, 27, 45, 0.40)',
    borderWidth: 1,
    borderColor: 'rgba(184, 192, 204, 0.10)',
    borderLeftWidth: 3,
    borderLeftColor: colors.bronze,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xxxl
  },
  infoText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18
  },
  ctaArea: {
    gap: spacing.md
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.bronze,
    borderRadius: radius.sm
  },
  ghostBtnText: {
    ...textStyles.labelMd,
    color: colors.bronze
  }
});

export default LanguageSelectionScreen;