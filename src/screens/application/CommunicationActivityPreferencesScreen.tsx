import { useTranslation } from 'react-i18next';
/**
 * CPN-030 — CommunicationActivityPreferencesScreen
 * Stitch ref: service_style_preferences_screen_fixed_theme/code.html
 *
 * IMPORTANT: Title is "Communication & Activity Preferences"
 * BANNED: "Service Style Preferences"
 *
 * Content: CommActivityPreferencesContent from applicationKycContent.ts
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { ProfileService } from '../../services/api/services/profile.service';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.SERVICE_STYLE_PREFERENCES>;

const CommunicationActivityPreferencesScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    commActivityPrefs, updateCommActivityPrefs, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const canContinue =
  !!commActivityPrefs.commStyle &&
  !!commActivityPrefs.activityPace &&
  !!commActivityPrefs.groupPreference;

  const handleContinue = async () => {
    if (!canContinue) {return;}
    setCurrentStage('comm_activity_prefs');

    try {
      await ProfileService.updateCommActivity(commActivityPrefs as unknown as Record<string, unknown>);
    } catch (e) {
      // ApiClient logs request & response
    }

    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('comm_activity');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.PUBLIC_VENUE_PREFERENCE);
  };

  const renderOptionRow = (
  options: ReadonlyArray<{id: string;label: string;icon: string;}>,
  field: 'commStyle' | 'activityPace') =>

  <View style={styles.optionList}>
      {options.map((o, index) => {
      const selected = commActivityPrefs[field] === o.id;
      return (
        <TouchableOpacity accessibilityRole="button"
          key={`ui-opt-${index}-${o.id}`}
          style={[styles.optionRow, selected && styles.optionRowSelected]}
          onPress={() => updateCommActivityPrefs({ [field]: selected ? '' : o.id })}
          activeOpacity={0.75}
          
          accessibilityState={{ selected }}>
            <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
              <Icon name={o.icon} size={20} color={selected ? colors.rootBg : colors.gold} />
            </View>
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{t(o.label)}</Text>
            {selected && <Icon name="check-circle" size={18} color={colors.gold} />}
          </TouchableOpacity>);

    })}
    </View>;


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
            <Icon name="shield" size={13} color={colors.gold} />
            <Text style={styles.phaseBadgeText}>{t("content.application_kyc.CommActivityPreferencesContent.SECTION_BADGE")}</Text>
          </View>

          {/* Hero */}
          <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="tune" size={42} color={colors.gold} />
            </View>
          </View>

          <Text style={styles.headline}>{t("content.application_kyc.CommActivityPreferencesContent.HEADLINE")}</Text>
          <Text style={styles.subheadline}>{t("content.application_kyc.CommActivityPreferencesContent.SUBHEADLINE")}</Text>

          {/* Communication style */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.CommActivityPreferencesContent.COMM_TITLE")}</Text>
            {renderOptionRow((Array.isArray(t("content.application_kyc.CommActivityPreferencesContent.COMM_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.CommActivityPreferencesContent.COMM_OPTIONS", { returnObjects: true }) as any[]) : []), 'commStyle')}
          </GlassCard>

          {/* Activity pace */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.CommActivityPreferencesContent.PACE_TITLE")}</Text>
            {renderOptionRow((Array.isArray(t("content.application_kyc.CommActivityPreferencesContent.PACE_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.CommActivityPreferencesContent.PACE_OPTIONS", { returnObjects: true }) as any[]) : []), 'activityPace')}
          </GlassCard>

          {/* Group preference */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.CommActivityPreferencesContent.GROUP_TITLE")}</Text>
            <View style={styles.groupOptions}>
              {((Array.isArray(t("content.application_kyc.CommActivityPreferencesContent.GROUP_OPTIONS", { returnObjects: true })) ? (t("content.application_kyc.CommActivityPreferencesContent.GROUP_OPTIONS", { returnObjects: true }) as any[]) : [])).map((g, index) => {
                const selected = commActivityPrefs.groupPreference === g.id;
                return (
                  <TouchableOpacity accessibilityRole="button"
                    key={`ui-opt-${index}-${g.id}`}
                    style={[styles.groupChip, selected && styles.groupChipSelected]}
                    onPress={() => updateCommActivityPrefs({ groupPreference: selected ? '' : g.id })}
                    activeOpacity={0.75}
                    
                    accessibilityState={{ selected }}>
                    {selected && <Icon name="check" size={14} color={colors.gold} />}
                    <Text style={[styles.groupChipText, selected && styles.groupChipTextSelected]}>{t(g.label)}</Text>
                  </TouchableOpacity>);

              })}
            </View>
          </GlassCard>

          {/* Accessibility (optional) */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.CommActivityPreferencesContent.ACCESSIBILITY_TITLE")}</Text>
            <Text style={styles.cardHint}>{t("content.application_kyc.CommActivityPreferencesContent.ACCESSIBILITY_HINT")}</Text>
            <View style={styles.accessibilityInputWrap}>
              <TextInput
                style={styles.accessibilityInput}
                value={commActivityPrefs.accessibilityNote}
                onChangeText={(v) => updateCommActivityPrefs({ accessibilityNote: v })}
                placeholder={t("content.application_kyc.CommActivityPreferencesContent.ACCESSIBILITY_PLACEHOLDER")}
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={200}
                textAlignVertical="top"
                returnKeyType="default"
                accessibilityLabel={t("accessibility.accessibility_considerations")} />
              
            </View>
          </GlassCard>

          {/* Privacy note */}
          <GlassCard style={styles.noteCard}>
            <View style={styles.noteRow}>
              <Icon name="info" size={16} color={colors.gold} />
              <Text style={styles.noteText}>{t("content.application_kyc.CommActivityPreferencesContent.PRIVACY_NOTE")}</Text>
            </View>
          </GlassCard>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("content.application_kyc.CommActivityPreferencesContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.save_communication_preferences_and_conti")} />
        
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
  card: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  cardHint: {
    ...textStyles.bodySm,
    color: colors.textMuted
  },
  optionList: { gap: spacing.sm },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  optionRowSelected: {
    backgroundColor: `${colors.gold}10`,
    borderColor: colors.border
  },
  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionIconSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold
  },
  optionLabel: {
    ...textStyles.bodyMd,
    color: colors.textSecondary,
    flex: 1
  },
  optionLabelSelected: { color: colors.textPrimary },
  groupOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  groupChip: {
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
  groupChipSelected: {
    backgroundColor: `${colors.gold}14`,
    borderColor: colors.gold
  },
  groupChipText: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  groupChipTextSelected: { color: colors.gold },
  accessibilityInputWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.elevatedSurface,
    padding: spacing.md,
    minHeight: 80
  },
  accessibilityInput: {
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    minHeight: 60,
    lineHeight: 22
  },
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

export default CommunicationActivityPreferencesScreen;