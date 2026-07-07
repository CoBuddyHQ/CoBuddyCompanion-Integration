import { useTranslation } from 'react-i18next';
/**
 * CPN-025 — BackgroundDeclarationScreen
 * Stitch ref: background_declaration_screen/code.html
 *
 * Content: BackgroundDeclarationContent from applicationKycContent.ts
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

import { useApplicationStore, BackgroundDeclKey } from '../../store/slices/applicationStore';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.BACKGROUND_DECLARATION>;
type DeclKey = BackgroundDeclKey;

const BackgroundDeclarationScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    backgroundDeclaration, setBackgroundDeclaration, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const allConfirmed = ((Array.isArray(t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true })) ? (t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true }) as any[]) : [])).every(
    (d) => backgroundDeclaration[d.id as DeclKey]
  );

  const handleToggle = (id: string) => {
    const newVal = !backgroundDeclaration[id as DeclKey];
    setBackgroundDeclaration(id as DeclKey, newVal);
  };

  const handleContinue = () => {
    const vals = Object.values(backgroundDeclaration);
    const completed = vals.every(Boolean);
    if (!completed) {return;}
    setCurrentStage('background_declaration');
    // If opened from a hub screen for missing-requirement fix, return there instead.
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('background_declaration');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.WORK_PREFERENCE);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="shield" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.BackgroundDeclarationContent.SECTION_BADGE")}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="gavel" size={42} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.BackgroundDeclarationContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.BackgroundDeclarationContent.SUBHEADLINE")}</Text>

        {/* Declaration list */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.BackgroundDeclarationContent.SECTION_TITLE")}</Text>
          <Text style={styles.cardBody}>{t("content.application_kyc.BackgroundDeclarationContent.SECTION_BODY")}</Text>

          <View style={styles.declList}>
            {((Array.isArray(t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true })) ? (t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true }) as any[]) : [])).map((item, index) => {
              const checked = backgroundDeclaration[item.id as DeclKey];
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={`ui-opt-${index}-${item.id}`}
                  style={[styles.declRow, checked && styles.declRowChecked]}
                  onPress={() => handleToggle(item.id)}
                  activeOpacity={0.75}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={t(item.label)}>
                  <View style={[styles.declIcon, checked && styles.declIconChecked]}>
                    <Icon
                      name={checked ? 'check' : item.icon}
                      size={18}
                      color={checked ? colors.rootBg : colors.gold} />
                    
                  </View>
                  <Text style={[styles.declLabel, checked && styles.declLabelChecked]}>
                    {t(item.label)}
                  </Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Legal note */}
        <GlassCard style={styles.legalCard}>
          <View style={styles.legalRow}>
            <Icon name="info" size={16} color={colors.gold} />
            <Text style={styles.legalText}>{t("content.application_kyc.BackgroundDeclarationContent.LEGAL_NOTE")}</Text>
          </View>
        </GlassCard>

        {/* Progress */}
        <View style={styles.progressHint}>
          <Text style={styles.progressHintText}>
            {((Array.isArray(t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true })) ? (t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true }) as any[]) : [])).filter(
              (d) => backgroundDeclaration[d.id as DeclKey]
            ).length}{' '}
            / {((Array.isArray(t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true })) ? (t("content.application_kyc.BackgroundDeclarationContent.DECLARATIONS", { returnObjects: true }) as any[]) : [])).length}{t("application.confirmed")}
          </Text>
        </View>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.BackgroundDeclarationContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!allConfirmed}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.confirm_declaration_and_continue")} />
        
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
  cardBody: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    lineHeight: 20
  },
  declList: { gap: spacing.sm },
  declRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  declRowChecked: {
    borderColor: colors.border,
    backgroundColor: `${colors.gold}12`
  },
  declIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  declIconChecked: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  declLabel: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22
  },
  declLabelChecked: { color: colors.textPrimary },
  legalCard: {},
  legalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  legalText: {
    ...textStyles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20
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
    borderTopColor: colors.border
  }
});

export default BackgroundDeclarationScreen;