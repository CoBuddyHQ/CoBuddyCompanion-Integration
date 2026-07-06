import { useTranslation } from 'react-i18next';
/**
 * CPN-031 — PublicVenuePreferenceScreen
 * Stitch ref: public_venue_preference_screen/code.html
 *
 * RULES:
 *  - Permitted venues: cafÃ©, restaurant, park, gallery/museum, bookstore, mall, cinema, event, wellness
 *  - NEVER permitted: private home, hotel room, isolated location, vehicle-only meetup
 *
 * Content: PublicVenuePreferenceContent from applicationKycContent.ts
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

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.PUBLIC_VENUE_PREFERENCE>;

const PublicVenuePreferenceScreen: React.FC<Props> = ({ navigation }) => {const { t } = useTranslation();
  const {
    venuePreferences, toggleVenuePreference, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const count = venuePreferences.length;
  const canContinue = count >= 1;

  const handleContinue = () => {
    if (!canContinue) {return;}
    setCurrentStage('public_venue_pref');
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('venue_preference');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.BOUNDARIES_SAFETY);
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
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.PublicVenuePreferenceContent.SECTION_BADGE")}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="store" size={42} color={colors.gold} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="verified-user" size={14} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t("content.application_kyc.PublicVenuePreferenceContent.HEADLINE")}</Text>
        <Text style={styles.subheadline}>{t("content.application_kyc.PublicVenuePreferenceContent.SUBHEADLINE")}</Text>

        {/* Status pills */}
        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Icon name="public" size={13} color={colors.bronze} />
            <Text style={styles.pillText}>{t("application.approved_public_venues_only")}</Text>
          </View>
          <View style={[styles.pill, count > 0 && styles.pillActive]}>
            <Icon
              name={count > 0 ? 'check-circle' : 'radio-button-unchecked'}
              size={13}
              color={count > 0 ? colors.gold : colors.textMuted} />
            
            <Text style={[styles.pillText, count > 0 && styles.pillTextActive]}>
              {count}{t("application.selected")}
            </Text>
          </View>
        </View>

        {/* Venue grid */}
        <GlassCard style={styles.gridCard}>
          <Text style={styles.cardTitle}>{t("content.application_kyc.PublicVenuePreferenceContent.SECTION_TITLE")}</Text>
          <View style={styles.grid}>
            {((Array.isArray(t("content.application_kyc.PublicVenuePreferenceContent.VENUES", { returnObjects: true })) ? (t("content.application_kyc.PublicVenuePreferenceContent.VENUES", { returnObjects: true }) as any[]) : [])).map((v, index) => {
              const selected = venuePreferences.includes(v.id);
              return (
                <TouchableOpacity
                  key={`ui-opt-${index}-${v.id}`}
                  style={[styles.tile, selected && styles.tileSelected]}
                  onPress={() => toggleVenuePreference(v.id)}
                  activeOpacity={0.75}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={t(v.label)}>
                  {selected &&
                  <View style={styles.tileCheck}>
                      <Icon name="check-circle" size={16} color={colors.gold} />
                    </View>
                  }
                  <Icon name={v.icon} size={24} color={selected ? colors.gold : colors.textSecondary} />
                  <Text style={[styles.tileLabel, selected && styles.tileLabelSelected]}>{t(v.label)}</Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Never allowed */}
        <GlassCard style={styles.neverCard}>
          <Text style={styles.neverTitle}>{t("content.application_kyc.PublicVenuePreferenceContent.NEVER_ALLOWED_TITLE")}</Text>
          <View style={styles.neverList}>
            {((Array.isArray(t("content.application_kyc.PublicVenuePreferenceContent.NEVER_ALLOWED", { returnObjects: true })) ? (t("content.application_kyc.PublicVenuePreferenceContent.NEVER_ALLOWED", { returnObjects: true }) as any[]) : [])).map((n, index) =>
            <View key={`ui-opt-${index}-${t(n.label)}`} style={styles.neverRow}>
                <Icon name="block" size={16} color={colors.softWarning} />
                <Icon name={n.icon} size={16} color={colors.textMuted} />
                <Text style={styles.neverText}>{t(n.label)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Approved note */}
        <GlassCard style={styles.approvedCard}>
          <View style={styles.approvedRow}>
            <Icon name="verified-user" size={16} color={colors.safetyGreen} />
            <Text style={styles.approvedText}>{t("content.application_kyc.PublicVenuePreferenceContent.APPROVED_NOTE")}</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {!canContinue &&
        <Text style={styles.disabledTip}>{t("content.application_kyc.PublicVenuePreferenceContent.MIN_HINT")}</Text>
        }
        <ActionButton
          label={t("content.application_kyc.PublicVenuePreferenceContent.CTA_PRIMARY")}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.save_venue_preferences_and_continue")} />
        
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
  heroWrap: { alignSelf: 'center', position: 'relative' },
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
  heroBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
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
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  pillActive: { borderColor: colors.border },
  pillText: {
    ...textStyles.labelSm,
    color: colors.textMuted
  },
  pillTextActive: { color: colors.gold },
  gridCard: { gap: spacing.md },
  cardTitle: {
    ...textStyles.labelMd,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2
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
    position: 'relative',
    alignItems: 'flex-start'
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
  tileLabel: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  tileLabelSelected: { color: colors.textPrimary },
  neverCard: { gap: spacing.sm },
  neverTitle: {
    ...textStyles.labelMd,
    color: colors.softWarning,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  neverList: { gap: spacing.sm },
  neverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2
  },
  neverText: {
    ...textStyles.bodySm,
    color: colors.textMuted
  },
  approvedCard: {},
  approvedRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  approvedText: {
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
    borderTopColor: colors.border,
    gap: spacing.xs
  },
  disabledTip: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    textAlign: 'center'
  }
});

export default PublicVenuePreferenceScreen;