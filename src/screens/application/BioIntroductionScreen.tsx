import { useTranslation } from 'react-i18next';
/**
 * CPN-024 ï¿½ BioIntroductionScreen
 * Stitch ref: bio_introduction_screen/code.html
 *
 * Content: BioIntroContent from applicationKycContent.ts
 * Validator: validateBio from validators.ts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput } from
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
import { validateBio } from '../../utils/validators';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.BIO_INTRODUCTION>;

const BioIntroductionScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    professionalBio, setProfessionalBio, setCurrentStage,
    profileCorrectionContext, completeProfileCorrection,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();
  const [bioError, setBioError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const charCount = professionalBio.trim().length;
  const canContinue = charCount >= 150 && charCount <= 1000 && !bioError;

  const handleContinue = () => {
    const err = validateBio(professionalBio);
    setBioError(err);
    if (err) {return;}
    setCurrentStage('bio_intro');
    if (profileCorrectionContext.isActive) {
      completeProfileCorrection('bio');
      navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'correction' });
      return;
    }
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('bio');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.INTERESTS_PERSONALITY);
  };

  const charHint = t("content.application_kyc.BioIntroContent.CHAR_HINT").
  replace('{current}', String(charCount)).
  replace('{max}', String(1000));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Phase badge */}
          <View style={styles.phaseBadge}>
            <Icon name="badge" size={13} color={colors.gold} />
            <Text style={styles.phaseBadgeText}>{t("content.application_kyc.BioIntroContent.SECTION_BADGE")}</Text>
          </View>

          {/* Hero */}
          <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="edit" size={42} color={colors.gold} />
            </View>
          </View>

          <Text style={styles.headline}>{t("content.application_kyc.BioIntroContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.BioIntroContent.SUBHEADLINE")}</Text>

          {/* Bio text area */}
          <GlassCard style={styles.card}>
            <Text style={styles.fieldLabel}>{t("content.application_kyc.BioIntroContent.BIO_LABEL")}</Text>
            <View style={[styles.textAreaWrap, focused && styles.textAreaFocused, bioError ? styles.textAreaError : null]}>
              <TextInput
                style={styles.textArea}
                value={professionalBio}
                onChangeText={(v) => {
                  setProfessionalBio(v);
                  if (bioError) {setBioError(validateBio(v));}
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  setBioError(validateBio(professionalBio));
                }}
                placeholder={t("content.application_kyc.BioIntroContent.BIO_PLACEHOLDER")}
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={1000}
                returnKeyType="default"
                textAlignVertical="top"
                accessibilityLabel={t("accessibility.professional_bio")} />
              
            </View>
            {/* Char count */}
            <View style={styles.charRow}>
              {bioError ?
              <Text style={styles.errorText}>{bioError}</Text> :
              charCount < 150 ?
              <Text style={styles.charHintWarn}>
                  {`Minimum ${150} characters required`}
                </Text> :

              <Text style={styles.charHintOk}>{charHint}</Text>
              }
            </View>
          </GlassCard>

          {/* Writing guidelines */}
          <GlassCard style={styles.card}>
            <Text style={styles.guideTitle}>{t("content.application_kyc.BioIntroContent.GUIDELINES_TITLE")}</Text>
            <View style={styles.guideList}>
              {((Array.isArray(t("content.application_kyc.BioIntroContent.GUIDELINES", { returnObjects: true })) ? (t("content.application_kyc.BioIntroContent.GUIDELINES", { returnObjects: true }) as any[]) : [])).map((g, i) => {
                const isDo = g.icon === 'check_circle';
                return (
                  <View key={`ui-opt-${i}-${i}`} style={styles.guideRow}>
                    <Icon
                      name={isDo ? 'check-circle' : 'cancel'}
                      size={18}
                      color={isDo ? colors.safetyGreen : colors.softWarning} />
                    
                    <Text style={[styles.guideText, !isDo && styles.guideTextDont]}>{t(g.text)}</Text>
                  </View>);

              })}
            </View>
          </GlassCard>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.BioIntroContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.save_bio_and_continue")} />
        
      </View>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  flex: { flex: 1 },
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
  card: { gap: spacing.sm },
  fieldLabel: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  textAreaWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.elevatedSurface,
    padding: spacing.md,
    minHeight: 160
  },
  textAreaFocused: { borderColor: colors.gold },
  textAreaError: { borderColor: colors.softWarning },
  textArea: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    minHeight: 136,
    lineHeight: 24
  },
  charRow: { marginTop: 2 },
  charHintOk: {
    ...textStyles.bodySm,
    color: colors.textMuted
  },
  charHintWarn: {
    ...textStyles.bodySm,
    color: colors.gold
  },
  errorText: {
    ...textStyles.bodySm,
    color: colors.softWarning,
    lineHeight: 18
  },
  guideTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  guideList: { gap: spacing.sm },
  guideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  guideText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18
  },
  guideTextDont: { color: colors.textMuted },
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});

export default BioIntroductionScreen;