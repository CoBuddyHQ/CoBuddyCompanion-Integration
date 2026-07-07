import i18next from "i18next";import { useTranslation } from 'react-i18next';
/**
* CPN-046 — Profile Completion Checklist Screen
* Phase 4C — Context-aware checklist that supports two distinct modes.
*
* Mode A: `profile_setup`
*   Entry: ProfilePhotoUploadScreen (CPN-035)
*   Shows: 6 profile-setup items (basic details, bio, interests, categories, languages, photo)
*   CTA: → CPN-025 BackgroundDeclaration
*
* Mode B: `correction`
*   Entry: ProfileEditRejectedScreen (CPN-059)
*   Shows: Rejected sections from applicationStore.profileEditRejectionSections
*   Each item has a "Fix Required" label and direct Edit action.
*   CTA: → CPN-048 ApplicationReviewInfo → CPN-049 Submit
*/
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenTopBar from '../../components/layout/ScreenTopBar';
import GlassCard from '../../components/cards/GlassCard';
import ActionButton from '../../components/actions/ActionButton';
import { useApplicationStore } from '../../store/slices/applicationStore';
import type { ProfileCorrectionSection } from '../../store/slices/applicationStore';

import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { ApplicationStackParamList } from '../../types/navigation.types';
import { Routes } from '../../navigation/routes';

type Props = StackScreenProps<ApplicationStackParamList, typeof Routes.PROFILE_COMPLETION_CHECKLIST>;

// ─── Shared Row Components ─────────────────────────────────────────────────────

type ChecklistRowProps = {
  icon: string;
  label: string;
  description: string;
  isComplete: boolean;
};

function ChecklistRow({ icon, label, description, isComplete }: ChecklistRowProps) {
  const iconColor = isComplete ? colors.safetyGreen : colors.gold;
  const statusIcon = isComplete ? 'check-circle' : 'radio-button-unchecked';
  const statusColor = isComplete ? colors.safetyGreen : colors.textMuted;

  return (
    <View style={checkRowStyles.row}>
      <View style={checkRowStyles.iconWrap}>
        <Icon name={icon as any} size={22} color={iconColor} />
      </View>
      <View style={checkRowStyles.content}>
        <Text style={checkRowStyles.label}>{label}</Text>
        <Text style={checkRowStyles.desc}>{description}</Text>
      </View>
      <Icon name={statusIcon as any} size={20} color={statusColor} />
    </View>);

}

type CorrectionRowProps = {
  icon: string;
  label: string;
  description: string;
  status: 'fix_required' | 'corrected' | 'pending';
  onEdit: () => void;
};

function CorrectionRow({ icon, label, description, status, onEdit }: CorrectionRowProps) {const { t } = useTranslation();
  const statusColor = status === 'corrected' ? colors.safetyGreen : status === 'fix_required' ? colors.errorRed : colors.textMuted;
  const statusIconName = status === 'corrected' ? 'check-circle' : status === 'fix_required' ? 'assignment-late' : 'radio-button-unchecked';
  const statusLabel = status === 'corrected' ? t("content.application.ProfileCompletionChecklistScreen.corrected") : status === 'fix_required' ? t("content.application.ProfileCompletionChecklistScreen.fix_required") : t("content.application.ProfileCompletionChecklistScreen.pending");
  const badgeBg = status === 'corrected' ? `${colors.safetyGreen}15` : status === 'fix_required' ? colors.warningAmberSubtle : `${colors.textMuted}15`;

  return (
    <View style={corrRowStyles.row}>
      <View style={[corrRowStyles.iconWrap, { borderColor: `${statusColor}30`, backgroundColor: `${statusColor}10` }]}>
        <Icon name={icon as any} size={22} color={statusColor} />
      </View>
      <View style={corrRowStyles.content}>
        <View style={corrRowStyles.labelRow}>
          <Text style={corrRowStyles.label}>{label}</Text>
          <View style={[corrRowStyles.fixBadge, { backgroundColor: badgeBg }]}>
            <Icon name={statusIconName as any} size={12} color={statusColor} />
            <Text style={[corrRowStyles.fixBadgeText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={corrRowStyles.desc}>{description}</Text>
      </View>
      {status !== 'corrected' &&
      <TouchableOpacity accessibilityRole="button"
        style={corrRowStyles.editBtn}
        onPress={onEdit}
        accessibilityLabel={t("accessibility.edit_item", { label: label })}>
          <Icon name="edit" size={16} color={colors.gold} />
          <Text style={corrRowStyles.editText}>{t("application.edit")}</Text>
        </TouchableOpacity>
      }
      {status === 'corrected' &&
      <View style={[corrRowStyles.editBtn, { backgroundColor: `${colors.safetyGreen}10`, borderColor: `${colors.safetyGreen}30` }]}>
          <Icon name="check" size={16} color={colors.safetyGreen} />
          <Text style={[corrRowStyles.editText, { color: colors.safetyGreen }]}>{t("application.done")}</Text>
        </View>
      }
    </View>);

}

const checkRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  content: { flex: 1 },
  label: { ...textStyles.labelMd, color: colors.textPrimary },
  desc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16, marginTop: 2 }
});

const corrRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: `${colors.errorRed}10`,
    borderWidth: 1, borderColor: `${colors.errorRed}30`, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  content: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2, flexWrap: 'wrap' },
  label: { ...textStyles.labelMd, color: colors.textPrimary },
  desc: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 16 },
  fixBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.xs,
    paddingHorizontal: 6, paddingVertical: 2
  },
  fixBadgeText: { ...textStyles.labelSm, color: colors.warningAmber },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    backgroundColor: colors.elevatedSurface, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border, flexShrink: 0
  },
  editText: { ...textStyles.labelSm, color: colors.gold }
});

// ─── Profile setup items (Mode A only) ────────────────────────────────────────

const PROFILE_SETUP_ITEMS: {
  icon: string;label: string;description: string;
  storeKey: 'basicDetails' | 'professionalBio' | 'interestTags' | 'experienceCategories' | 'spokenLanguages' | 'profilePhotoComplete';
}[] = [
{ icon: 'person', label: i18next.t("content.application.ProfileCompletionChecklistScreen.basic_details"), description: i18next.t("content.application.ProfileCompletionChecklistScreen.name_date_of_birth_and_display_name"), storeKey: 'basicDetails' },
{ icon: 'edit-note', label: i18next.t("content.application.ProfileCompletionChecklistScreen.professional_bio"), description: i18next.t("content.application.ProfileCompletionChecklistScreen.at_least_50_characters"), storeKey: 'professionalBio' },
{ icon: 'interests', label: i18next.t("content.application.ProfileCompletionChecklistScreen.interests_personality"), description: i18next.t("content.application.ProfileCompletionChecklistScreen.at_least_1_interest_tag"), storeKey: 'interestTags' },
{ icon: 'category', label: i18next.t("content.application.ProfileCompletionChecklistScreen.experience_categories"), description: i18next.t("content.application.ProfileCompletionChecklistScreen.at_least_1_category_selected"), storeKey: 'experienceCategories' },
{ icon: 'translate', label: i18next.t("content.application.ProfileCompletionChecklistScreen.languages"), description: i18next.t("content.application.ProfileCompletionChecklistScreen.at_least_1_language_selected"), storeKey: 'spokenLanguages' },
{ icon: 'add-a-photo', label: i18next.t("content.application.ProfileCompletionChecklistScreen.profile_photo"), description: i18next.t("content.application.ProfileCompletionChecklistScreen.clear_professional_image"), storeKey: 'profilePhotoComplete' }];


// Maps rejected section labels → exact screen route for the Edit button.
// Every label that ProfileEditRejectedScreen can emit must be covered here.
const SECTION_EDIT_ROUTES: Record<string, keyof typeof Routes> = {
  'Gallery photos': 'PROFILE_PHOTO_UPLOAD',
  'Profile photo': 'PROFILE_PHOTO_UPLOAD',
  'Bio wording': 'BIO_INTRODUCTION',
  'Professional bio': 'BIO_INTRODUCTION',
  'Experience categories': 'EXPERIENCE_CATEGORIES',
  'Interests': 'INTERESTS_PERSONALITY',
  'Interests/Personality': 'INTERESTS_PERSONALITY',
  'Languages': 'LANGUAGES_SELECTION',
  'Basic details': 'BASIC_DETAILS',
  'Pricing': 'COMPANION_PRICING'
};

// Per-section rejection reasons shown under each row label.
const SECTION_REJECTION_REASONS: Record<string, string> = {
  'Gallery photos': 'Images must be clear, professional, and appropriate for the platform.',
  'Profile photo': 'Photo must clearly show your face with good lighting. No filters.',
  'Bio wording': 'Bio must be professional, accurate, and free of promotional claims.',
  'Professional bio': 'Bio must be professional, accurate, and free of promotional claims.',
  'Experience categories': 'At least one valid experience category is required.',
  'Interests': 'Interest tags must reflect genuine personal interests.',
  'Interests/Personality': 'Interest tags must reflect genuine personal interests.',
  'Languages': 'At least one language must be selected.',
  'Basic details': 'Name, date of birth, or display name details require correction.',
  'Pricing': 'Pricing must be within platform-allowed ranges.'
};

// Maps rejected section display labels → ProfileCorrectionSection key (store type).
// Used to track which sections have been corrected in correctedSections{}.
const SECTION_TO_CORRECTION_KEY: Record<string, ProfileCorrectionSection> = {
  'Gallery photos': 'profile_photo',
  'Profile photo': 'profile_photo',
  'Bio wording': 'bio',
  'Professional bio': 'bio',
  'Experience categories': 'experience_categories',
  'Interests': 'interests',
  'Interests/Personality': 'interests',
  'Languages': 'languages',
  'Basic details': 'basic_details',
  'Pricing': 'pricing'
};

// Exhaustive typed navigate for correction Edit buttons — zero 'as any'.
// Sets correction context in store BEFORE navigating so the edit screen knows
// to return to CPN-046 on save instead of continuing the normal chain.
function navigateToCorrectionEdit(
navigation: StackNavigationProp<ApplicationStackParamList>,
routeKey: keyof typeof Routes,
section: ProfileCorrectionSection,
startCorrection: (s: ProfileCorrectionSection) => void)
: void {
  startCorrection(section);
  switch (Routes[routeKey]) {
    case Routes.PROFILE_PHOTO_UPLOAD:
      navigation.navigate(Routes.PROFILE_PHOTO_UPLOAD);
      break;
    case Routes.BIO_INTRODUCTION:
      navigation.navigate(Routes.BIO_INTRODUCTION);
      break;
    case Routes.EXPERIENCE_CATEGORIES:
      navigation.navigate(Routes.EXPERIENCE_CATEGORIES);
      break;
    case Routes.INTERESTS_PERSONALITY:
      navigation.navigate(Routes.INTERESTS_PERSONALITY);
      break;
    case Routes.LANGUAGES_SELECTION:
      navigation.navigate(Routes.LANGUAGES_SELECTION);
      break;
    case Routes.BASIC_DETAILS:
      navigation.navigate(Routes.BASIC_DETAILS);
      break;
    case Routes.COMPANION_PRICING:
      navigation.navigate(Routes.COMPANION_PRICING);
      break;
    default:
      navigation.navigate(Routes.APPLICATION_REVIEW_INFO);
      break;
  }
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ProfileCompletionChecklistScreen({ navigation, route }: Props): React.JSX.Element {const { t } = useTranslation();
  const {
    basicDetails, professionalBio, interestTags, experienceCategories,
    spokenLanguages, profilePhotoComplete, profileEditRejectionSections,
    profileChecklistMode: storeMode, setProfileChecklistMode,
    startProfileCorrection, completeProfileCorrection: _completeCorrection,
    clearProfileCorrection, correctedSections
  } = useApplicationStore();

  // Mode resolution order (explicit, never heuristic):
  // 1. route.params?.mode — set by ProfilePhotoUploadScreen.navigate(..., {mode: 'profile_setup'})
  // 2. store.profileChecklistMode — set by ProfileEditRejectedScreen.setProfileChecklistMode('correction')
  //    or ProfilePhotoUploadScreen.setProfileChecklistMode('profile_setup') before navigate
  // Never infer from array length, navigation history, or applicationEntryRoute.
  const mode: 'profile_setup' | 'correction' = route.params?.mode ?? storeMode;

  // ─── Mode A: Profile Setup ──────────────────────────────────────────────────

  if (mode === 'profile_setup') {
    const getIsComplete = (key: typeof PROFILE_SETUP_ITEMS[0]['storeKey']): boolean => {
      switch (key) {
        case 'basicDetails':return basicDetails.legalName.trim().length > 1;
        case 'professionalBio':return professionalBio.trim().length >= 50;
        case 'interestTags':return interestTags.length > 0;
        case 'experienceCategories':return experienceCategories.length > 0;
        case 'spokenLanguages':return spokenLanguages.length > 0;
        case 'profilePhotoComplete':return profilePhotoComplete;
        default:return false;
      }
    };

    const completedCount = PROFILE_SETUP_ITEMS.filter((item) => getIsComplete(item.storeKey)).length;
    const total = PROFILE_SETUP_ITEMS.length;
    const pct = Math.round(completedCount / total * 100);

    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* ── Hero ── */}
          {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.ProfileCompletionChecklistContent.SECTION_BADGE")}</Text>
        </View>

        <View style={styles.heroWrap}>
            <View style={styles.heroCircle}>
              <Icon name="checklist" size={44} color={colors.gold} />
            </View>
            <View style={styles.heroBadge}>
              <Icon name="shield" size={16} color={colors.gold} />
            </View>
          </View>

          <Text style={styles.headline}>{t("application.profile_readiness")}</Text>
          <Text style={styles.subheadline}>{t("application.complete_these_profile_sections_before_c")}</Text>

          {/* ── Progress bar ── */}
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{t("content.application_kyc.CommonKycContent.PROFILE_SETUP_PROGRESS")}</Text>
              <Text style={styles.progressPct}>{pct}{t("content.application.ProfileCompletionChecklistScreen.text")}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pct}%` as any }]} />
            </View>
            <Text style={styles.progressSubtext}>{completedCount}{t("application.of")}{total}{t("application.profile_items_complete")}</Text>
          </GlassCard>

          {/* ── Profile items ── */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t("content.application_kyc.CommonKycContent.PROFILE_SETUP_PROGRESS")}</Text>
            <View style={styles.itemList}>
              {PROFILE_SETUP_ITEMS.map((item) =>
              <ChecklistRow
                key={t(item.label)}
                icon={item.icon}
                label={t(item.label)}
                description={t(item.description)}
                isComplete={getIsComplete(item.storeKey)} />

              )}
            </View>
          </GlassCard>

          {/* ── Next step note ── */}
          <GlassCard style={styles.noteCard}>
            <View style={styles.noteRow}>
              <View style={styles.noteIconWrap}>
                <Icon name="lightbulb" size={spacing.iconMd} color={colors.gold} />
              </View>
              <View style={styles.noteContent}>
                <Text style={styles.noteTitleText}>{t("content.application_kyc.CommonKycContent.NEXT_STEP")}</Text>
                <Text style={styles.noteText}>{t("application.after_completing_your_profile_details_yo")}</Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.bottomPad} />
        </ScrollView>

        {/* ── CTA Footer ── */}
        <View style={styles.ctaWrap}>
          <ActionButton
            label={t("application.continue_to_safety")}
            onPress={() => navigation.navigate(Routes.BACKGROUND_DECLARATION)}
            variant="primary"
            rightIcon={t("application.arrow_forward")}
            accessibilityLabel={t("accessibility.continue_to_background_declaration")} />
          
        </View>
      </SafeAreaView>);

  }

  // ─── Mode B: Correction ─────────────────────────────────────────────────────

  // Build correction items from store's rejected section labels
  const correctionItems = profileEditRejectionSections.map((section) => {
    const routeKey = (SECTION_EDIT_ROUTES[section] ?? 'APPLICATION_REVIEW_INFO') as keyof typeof Routes;
    const sectionKey = SECTION_TO_CORRECTION_KEY[section] ?? null;
    const isCorrected = sectionKey !== null && !!correctedSections[sectionKey];
    return {
      label: section,
      icon: section.toLowerCase().includes('photo') || section.toLowerCase().includes('gallery') ?
      'collections' :
      section.toLowerCase().includes('bio') ?
      'edit-note' :
      section.toLowerCase().includes('categor') ?
      'category' :
      section.toLowerCase().includes('pricing') ?
      'payments' :
      section.toLowerCase().includes('language') ?
      'translate' :
      section.toLowerCase().includes('interest') ?
      'interests' :
      section.toLowerCase().includes('basic') || section.toLowerCase().includes('detail') ?
      'person' :
      'warning',
      description: SECTION_REJECTION_REASONS[section] ?? 'CoBuddy requires changes to this section before your profile can be approved.',
      editRouteKey: routeKey,
      correctionSectionKey: sectionKey,
      status: (isCorrected ? 'corrected' : t("content.application.ProfileCompletionChecklistScreen.fix_required_1")) as 'corrected' | 'fix_required' | 'pending'
    };
  });

  const allCorrected = correctionItems.length > 0 && correctionItems.every((i) => i.status === 'corrected');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenTopBar title={t("application.cobuddy_companion")} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero (error state) ── */}
        {/* Phase badge */}
        <View style={styles.phaseBadge}>
          <Icon name="adjust" size={13} color={colors.gold} />
          <Text style={styles.phaseBadgeText}>{t("content.application_kyc.ProfileCompletionChecklistContent.SECTION_BADGE")}</Text>
        </View>
        <View style={styles.heroWrap}>
          <View style={[styles.heroCircle, styles.heroCorrectionCircle]}>
            <Icon name="assignment-late" size={44} color={colors.warningAmber} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="edit" size={16} color={colors.warningAmber} />
          </View>
        </View>

        {/* ── Status badge ── */}
        <View style={styles.correctionBadge}>
          <Icon name="assignment-late" size={14} color={colors.warningAmber} />
          <Text style={styles.correctionBadgeText}>{t("content.application_kyc.CommonKycContent.CORRECTIONS_REQUIRED")}</Text>
        </View>

        <Text style={styles.headline}>{t("application.profile_corrections_needed")}</Text>
        <Text style={styles.subheadline}>{t("application.cobuddy_has_reviewed_your_profile_and_id")}

        </Text>

        {/* ── Rejected items ── */}
        <GlassCard style={styles.correctionCard}>
          <Text style={styles.cardTitle}>{t("application.sections_to_fix")}</Text>
          <Text style={styles.cardSubtitle}>{t("application.update_each_section_below_only_these_sec")}</Text>
          <View style={styles.itemList}>
            {correctionItems.length > 0 ?
            correctionItems.map((item) =>
            <CorrectionRow
              key={t(item.label)}
              icon={item.icon}
              label={t(item.label)}
              description={t(item.description)}
              status={item.status}
              onEdit={() => navigateToCorrectionEdit(
                navigation,
                item.editRouteKey,
                item.correctionSectionKey ?? 'bio',
                startProfileCorrection
              )} />

            ) :

            <View style={styles.emptyRow}>
                <Icon name="info" size={18} color={colors.textMuted} />
                <Text style={styles.emptyText}>{t("application.no_specific_sections_flagged_contact_cob")}</Text>
              </View>
            }
          </View>
        </GlassCard>

        {/* ── Safety note ── */}
        <GlassCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <View style={styles.noteIconWrap}>
              <Icon name="shield" size={spacing.iconMd} color={colors.gold} />
            </View>
            <View style={styles.noteContent}>
              <Text style={styles.noteTitleText}>{t("application.your_existing_profile_is_still_active")}</Text>
              <Text style={styles.noteText}>{t("application.only_the_sections_listed_above_need_upda")}</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── CTA Footer ── */}
      <View style={styles.ctaWrap}>
        <ActionButton
          label={t("application.review_resubmit")}
          onPress={() => {
            // All sections corrected — clear context, reset mode, proceed to review.
            clearProfileCorrection();
            setProfileChecklistMode('profile_setup');
            navigation.navigate(Routes.APPLICATION_REVIEW_INFO);
          }}
          variant={allCorrected ? 'primary' : 'secondary'}
          disabled={!allCorrected}
          rightIcon={t("application.arrow_forward")}
          accessibilityLabel={t("accessibility.review_and_resubmit_profile")} />
        
        {!allCorrected &&
        <Text style={styles.correctionGateNote}>{t("application.complete_all_corrections_above_to_contin")}

        </Text>
        }
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg },

  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.sm },
  heroCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6
  },
  heroCorrectionCircle: {
    borderColor: `${colors.warningAmber}30`,
    shadowColor: colors.warningAmber
  },
  heroBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  correctionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'center',
    backgroundColor: colors.warningAmberSubtle, borderRadius: radius.full,
    borderWidth: 1, borderColor: `${colors.warningAmber}30`,
    paddingHorizontal: spacing.md, paddingVertical: 6
  },
  correctionBadgeText: { ...textStyles.labelMd, color: colors.warningAmber },

  headline: { ...textStyles.displayMd, color: colors.textPrimary, textAlign: 'center', fontFamily: 'PlayfairDisplay-SemiBold' },
  subheadline: { ...textStyles.bodyMd, color: colors.textSecondary, textAlign: 'center' },

  progressCard: { gap: spacing.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { ...textStyles.labelMd, color: colors.textPrimary },
  progressPct: { fontSize: 20, fontFamily: 'Inter-Bold', color: colors.gold },
  progressBarBg: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: colors.gold, borderRadius: radius.full },
  progressSubtext: { ...textStyles.labelSm, color: colors.textSecondary },

  card: { gap: spacing.md },
  correctionCard: { gap: spacing.md, borderColor: `${colors.warningAmber}25` } as const,
  cardTitle: { ...textStyles.labelMd, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2 },
  cardSubtitle: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },
  itemList: { gap: spacing.md },

  emptyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  emptyText: { flex: 1, ...textStyles.bodySm, color: colors.textMuted, lineHeight: 18 },

  noteCard: { gap: 0 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  noteIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  noteContent: { flex: 1 },
  noteTitleText: { ...textStyles.labelMd, color: colors.textPrimary, marginBottom: 4 },
  noteText: { ...textStyles.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bottomPad: { height: spacing.xl },
  ctaWrap: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs
  },
  dashBtn: { marginTop: spacing.xs },
  correctionGateNote: {
    ...textStyles.bodySm, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs
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
  } });