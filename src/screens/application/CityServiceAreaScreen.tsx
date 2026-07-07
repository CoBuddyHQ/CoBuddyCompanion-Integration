import { useTranslation } from 'react-i18next';
/**
 * CPN-029 — CityServiceAreaScreen (FIX: Broad service areas required)
 * Stitch ref: city_service_area_selection_screen/code.html
 *
 * PRIVACY:
 *   - City and broad area only. No GPS. No home address. No coordinates.
 *   - "Only your selected city and broad service areas are used for matching.
 *      Your exact residential location is never shown to customers."
 *
 * RULES:
 *   - Must select at least 1 broad area (mandatory, not optional).
 *   - Maximum 8 broad areas.
 *   - Changing city clears previously selected broad areas.
 *   - Back navigation preserves city + areas from applicationStore.
 *
 * Content: CITY_BROAD_AREAS from applicationKycContent.ts
 */

import React, { useState, useMemo } from 'react';
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

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.CITY_SERVICE_AREA>;

const BROAD_AREA_MIN = 1;
const BROAD_AREA_MAX = 8;

const CityServiceAreaScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const CITY_BROAD_AREAS: Record<string, string[]> = {
    "Mumbai": [
      "Andheri",
      "Bandra",
      "Borivali",
      "Colaba",
      "Dadar",
      "Goregaon",
      "Juhu",
      "Kandivali",
      "Kurla",
      "Malad",
      "Mulund",
      "Navi Mumbai",
      "Powai",
      "Thane",
      "Worli"
    ],
    "Delhi": [
      "Connaught Place",
      "Dwarka",
      "East Delhi",
      "Hauz Khas",
      "Janakpuri",
      "Lajpat Nagar",
      "Noida Border",
      "Rohini",
      "Saket",
      "South Delhi",
      "Vasant Kunj",
      "West Delhi"
    ],
    "Bengaluru": [
      "Indiranagar",
      "Jayanagar",
      "JP Nagar",
      "Koramangala",
      "Marathahalli",
      "MG Road",
      "Rajajinagar",
      "Whitefield",
      "Electronic City",
      "Hebbal",
      "HSR Layout",
      "Yelahanka"
    ],
    "Hyderabad": [
      "Banjara Hills",
      "Gachibowli",
      "Hitech City",
      "Jubilee Hills",
      "Kukatpally",
      "Madhapur",
      "Mehdipatnam",
      "Secunderabad",
      "Uppal"
    ],
    "Chennai": [
      "Adyar",
      "Anna Nagar",
      "Chromepet",
      "Guindy",
      "Nungambakkam",
      "Porur",
      "T Nagar",
      "Velachery"
    ],
    "Kolkata": [
      "Ballygunge",
      "Behala",
      "Dum Dum",
      "Howrah",
      "Lake Town",
      "New Town",
      "Park Street",
      "Salt Lake"
    ],
    "Pune": [
      "Aundh",
      "Baner",
      "Hadapsar",
      "Hinjewadi",
      "Kalyani Nagar",
      "Kothrud",
      "Magarpatta",
      "Viman Nagar"
    ],
    "Ahmedabad": [
      "Bodakdev",
      "CG Road",
      "Maninagar",
      "Navrangpura",
      "Prahladnagar",
      "Satellite",
      "Vastrapur"
    ],
    "Jaipur": [
      "C-Scheme",
      "Mansarovar",
      "Malviya Nagar",
      "Vaishali Nagar",
      "Tonk Road"
    ],
    "Lucknow": [
      "Aliganj",
      "Gomti Nagar",
      "Hazratganj",
      "Indira Nagar"
    ],
    "Chandigarh": [
      "Sector 17",
      "Sector 22",
      "Sector 35",
      "Mohali",
      "Panchkula"
    ],
    "Kochi": [
      "Aluva",
      "Edapally",
      "Ernakulam",
      "Fort Kochi",
      "Kakkanad",
      "Vyttila"
    ],
    "Surat": [
      "Adajan",
      "Althan",
      "Katargam",
      "Piplod",
      "Udhna"
    ],
    "Indore": [
      "Palasia",
      "Rajwada",
      "Vijay Nagar",
      "Scheme 54"
    ],
    "Nagpur": [
      "Civil Lines",
      "Dharampeth",
      "Ramdaspeth",
      "Sitabuldi",
      "Trimurti Nagar"
    ]
  };
  const CITY_OPTIONS = Object.keys(CITY_BROAD_AREAS);

  const {
    city, broadAreas, willingToTravel, setCity, toggleBroadArea, setWillingToTravel, setCurrentStage,
    missingRequirementFixContext, completeMissingRequirementFix, clearMissingRequirementFix
  } = useApplicationStore();

  const [showCityPicker, setShowCityPicker] = useState(false);

  // Derived: areas for selected city
  const availableAreas: string[] = useMemo(
    () => city ? CITY_BROAD_AREAS[city] ?? [] : [],
    [city, CITY_BROAD_AREAS]
  );

  const areaCount = broadAreas.length;
  const atMax = areaCount >= BROAD_AREA_MAX;

  const canContinue =
  city.trim().length > 0 &&
  areaCount >= BROAD_AREA_MIN;

  const handleCitySelect = (selected: string) => {
    if (selected === city) {
      setShowCityPicker(false);
      return;
    }
    // Change city → clear incompatible broad areas
    setCity(selected);
    // Clear all broadAreas that are not in the new city's list
    const newAreas = CITY_BROAD_AREAS[selected] ?? [];
    const toRemove = broadAreas.filter((a) => !newAreas.includes(a));
    toRemove.forEach((a) => toggleBroadArea(a)); // toggles will remove them
    setShowCityPicker(false);
  };

  const handleToggleArea = (area: string) => {
    const isSelected = broadAreas.includes(area);
    if (!isSelected && atMax) {return;} // at max, ignore new selections
    toggleBroadArea(area);
  };

  const handleContinue = () => {
    if (!canContinue) {return;}
    setCurrentStage('city_service_area');
    if (missingRequirementFixContext.isActive && missingRequirementFixContext.returnRoute) {
      completeMissingRequirementFix('city');
      navigateToMissingRequirementReturn(navigation, missingRequirementFixContext.returnRoute);
      return;
    }
    navigation.navigate(Routes.SERVICE_STYLE_PREFERENCES);
  };

  const areaCountLabel = t('application.city_service_area_count_label').
  replace('{count}', String(areaCount)).
  replace('{max}', String(BROAD_AREA_MAX));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenTopBar
        title={t("application.cobuddy_companion")}
        onBack={() => cancelMissingRequirementFixAndReturn(navigation, missingRequirementFixContext.isActive, missingRequirementFixContext.returnRoute, clearMissingRequirementFix)} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="shield" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t('application.city_service_section_badge')}</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Icon name="apartment" size={42} color={colors.gold} />
          </View>
        </View>

        <Text style={styles.headline}>{t('application.city_service_headline')}</Text>
        <Text style={styles.subheadline}>{t('application.city_service_subheadline')}</Text>

        {/* City picker */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.city_service_city_label')} *</Text>

          <TouchableOpacity accessibilityRole="button"
            style={[styles.cityButton, city ? styles.cityButtonSelected : null]}
            onPress={() => setShowCityPicker(!showCityPicker)}
            activeOpacity={0.8}
            
            accessibilityLabel={city || t('application.city_service_city_placeholder')}>
            <Icon name="location-on" size={20} color={city ? colors.gold : colors.textMuted} />
            <Text style={[styles.cityButtonText, city ? styles.cityButtonTextSelected : null]}>
              {city || t('application.city_service_city_placeholder')}
            </Text>
            <Icon
              name={showCityPicker ? 'expand-less' : 'expand-more'}
              size={20}
              color={colors.textMuted} />

          </TouchableOpacity>

          {showCityPicker &&
          <View style={styles.cityDropdown}>
              <ScrollView style={styles.cityDropdownScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {CITY_OPTIONS.map((c) =>
              <TouchableOpacity accessibilityRole="button"
                key={c}
                style={[styles.cityOption, city === c ? styles.cityOptionSelected : null]}
                onPress={() => handleCitySelect(c)}
                
                accessibilityState={{ selected: city === c }}>
                    <Text style={[styles.cityOptionText, city === c ? styles.cityOptionTextSelected : null]}>{c}</Text>
                    {city === c && <Icon name="check" size={16} color={colors.gold} />}
                  </TouchableOpacity>
              )}
              </ScrollView>
            </View>
          }
        </GlassCard>

        {/* Broad service areas — shown only after city is selected */}
        {city ?
        <GlassCard style={styles.card}>
            <View style={styles.areaHeader}>
              <Text style={[styles.cardTitle, { flex: 1, marginRight: 8 }]} numberOfLines={1} adjustsFontSizeToFit>
                {t('application.city_service_area_label')} *
              </Text>
              <View style={[styles.areaCountPill, areaCount > 0 ? styles.areaCountPillActive : null]}>
                <Text style={[styles.areaCountText, areaCount > 0 ? styles.areaCountTextActive : null]}>
                  {areaCountLabel}
                </Text>
              </View>
            </View>

            <Text style={styles.cardSubtitle}>{t('application.city_service_area_sublabel')}</Text>
            <Text style={styles.areaHint}>{t('application.city_service_area_hint')}</Text>

            {/* Area chips */}
            <View style={styles.areaGrid}>
              {availableAreas.map((area) => {
              const selected = broadAreas.includes(area);
              const disabled = atMax && !selected;
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={area}
                  style={[
                  styles.areaChip,
                  selected ? styles.areaChipSelected : null,
                  disabled ? styles.areaChipDisabled : null]
                  }
                  onPress={() => handleToggleArea(area)}
                  activeOpacity={disabled ? 1 : 0.75}
                  
                  accessibilityState={{ checked: selected, disabled }}
                  accessibilityLabel={area}>
                    {selected && <Icon name="check" size={13} color={colors.gold} />}
                    <Text style={[styles.areaChipText, selected ? styles.areaChipTextSelected : null, disabled ? styles.areaChipTextDisabled : null]}>
                      {area}
                    </Text>
                  </TouchableOpacity>);

            })}
            </View>

            {/* Area requirement hint */}
            {areaCount === 0 &&
          <View style={styles.areaRequiredRow}>
                <Icon name="info" size={14} color={colors.softWarning} />
                <Text style={styles.areaRequiredText}>{t("application.select_at_least_1_area_to_continue")}</Text>
              </View>
          }
            {atMax &&
          <View style={styles.areaMaxRow}>
                <Icon name="check-circle" size={14} color={colors.gold} />
                <Text style={styles.areaMaxText}>{t("application.maximum")} {BROAD_AREA_MAX} {t("application.areas_reached")}</Text>
              </View>
          }
          </GlassCard> :

        <GlassCard style={styles.areaPlaceholder}>
            <Icon name="apartment" size={28} color={colors.textMuted} />
            <Text style={styles.areaPlaceholderText}>{t("application.select_your_city_first_to_choose_broad_s")}</Text>
          </GlassCard>
        }

        {/* Travel preference */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('application.city_service_travel_label')}</Text>
          <View style={styles.travelOptions}>
            {[
            t('application.city_service_travel_opt_yes'),
            t('application.city_service_travel_opt_no')].
            map((opt, i) => {
              const isYes = i === 0;
              const selected = isYes ? willingToTravel : !willingToTravel;
              return (
                <TouchableOpacity accessibilityRole="button"
                  key={opt}
                  style={[styles.travelChip, selected ? styles.travelChipSelected : null]}
                  onPress={() => setWillingToTravel(isYes)}
                  activeOpacity={0.75}
                  
                  accessibilityState={{ selected }}>
                  {selected && <Icon name="check" size={14} color={colors.gold} />}
                  <Text style={[styles.travelChipText, selected ? styles.travelChipTextSelected : null]}>{opt}</Text>
                </TouchableOpacity>);

            })}
          </View>
        </GlassCard>

        {/* Privacy note */}
        <GlassCard style={styles.privacyCard}>
          <View style={styles.privacyRow}>
            <Icon name="lock" size={16} color={colors.gold} />
            <Text style={styles.privacyText}>{t('application.city_service_privacy_note')}</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {!canContinue &&
        <Text style={styles.disabledTip}>
            {!city ? t('application.city_service_disabled_tip_city') : t('application.city_service_disabled_tip_area')}
          </Text>
        }
        <ActionButton
          label={t('application.city_service_cta_primary')}
          onPress={handleContinue}
          variant="primary"
          disabled={!canContinue}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t('application.city_service_cta_primary')} />

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
  cardSubtitle: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    lineHeight: 18
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  cityButtonSelected: { borderColor: colors.border },
  cityButtonText: {
    ...textStyles.bodyMd,
    color: colors.textMuted,
    flex: 1
  },
  cityButtonTextSelected: { color: colors.textPrimary },
  cityDropdown: {
    borderRadius: radius.sm,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 220,
    overflow: 'hidden'
  },
  cityDropdownScroll: { maxHeight: 220 },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  cityOptionSelected: { backgroundColor: `${colors.gold}10` },
  cityOptionText: {
    ...textStyles.bodyMd,
    color: colors.textSecondary
  },
  cityOptionTextSelected: { color: colors.gold },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  areaCountPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  areaCountPillActive: {
    backgroundColor: colors.goldSubtle,
    borderColor: colors.border
  },
  areaCountText: {
    ...textStyles.labelSm,
    color: colors.textMuted,
    fontSize: 11
  },
  areaCountTextActive: { color: colors.gold },
  areaHint: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    lineHeight: 18
  },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  areaChipSelected: {
    backgroundColor: `${colors.gold}14`,
    borderColor: colors.gold
  },
  areaChipDisabled: { opacity: 0.4 },
  areaChipText: {
    ...textStyles.labelSm,
    color: colors.textSecondary
  },
  areaChipTextSelected: { color: colors.gold },
  areaChipTextDisabled: { color: colors.textMuted },
  areaRequiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  areaRequiredText: {
    ...textStyles.bodySm,
    color: colors.softWarning
  },
  areaMaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  areaMaxText: {
    ...textStyles.bodySm,
    color: colors.gold
  },
  areaPlaceholder: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    opacity: 0.6
  },
  areaPlaceholderText: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    textAlign: 'center'
  },
  travelOptions: { gap: spacing.sm },
  travelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border
  },
  travelChipSelected: {
    backgroundColor: `${colors.gold}12`,
    borderColor: colors.border
  },
  travelChipText: {
    ...textStyles.bodyMd,
    color: colors.textSecondary
  },
  travelChipTextSelected: { color: colors.textPrimary },
  privacyCard: {},
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  privacyText: {
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

export default CityServiceAreaScreen;