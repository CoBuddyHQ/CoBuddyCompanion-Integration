import i18next from "i18next";
/**
 * applicationReadinessSelector.ts
 *
 * SINGLE SOURCE OF TRUTH for application readiness.
 *
 * CPN-047 ApplicationProgress       ─┐
 * CPN-049 SubmitProfileForApproval  ─┤─── all derive from this helper
 * CPN-051 VerificationHub           ─┘
 *
 * Never duplicate these rules inside screens.
 *
 * UPI PRODUCT RULE (documented here for auditability):
 *   Source: UPIDetailsContent.OPTIONAL_NOTE in applicationKycContent.ts
 *   "UPI is optional if you have already added a verified bank account."
 *   Decision: UPI is OPTIONAL — excluded from mandatory total and submission gate.
 *   The UPI screen MUST expose a "Skip for Now" CTA.
 *
 * bankVerified INVARIANT:
 *   AddBankAccountScreen calls setBankAccount(last4, ...) then navigates to
 *   BankAccountVerificationScreen which calls setBankVerified(true).
 *   ∴ bankVerified === true logically implies a bank account was added.
 *   No separate bankAccountAdded boolean is needed.
 */

import { Routes } from '../../navigation/routes';
import type { MandatoryRequirementKey } from '../../navigation/missingRequirementNavigation';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MandatoryItemResult {
  key: MandatoryRequirementKey;
  label: string;
  route: string;
  done: boolean;
  /** true = excluded from mandatory total and submission gate */
  optional?: boolean;
}

export interface ModuleResult {
  title: string;
  icon: string;
  items: MandatoryItemResult[];
  /** Count of mandatory (non-optional) items that are done */
  completedCount: number;
  /** Count of mandatory (non-optional) items */
  totalCount: number;
  allDone: boolean;
}

export interface ApplicationReadinessResult {
  modules: {
    profile: ModuleResult;
    safetyService: ModuleResult;
    identity: ModuleResult;
    financial: ModuleResult;
  };
  completedMandatory: number;
  totalMandatory: number;
  percentage: number;
  ready: boolean;
  /** Items where done === false and optional !== true */
  missing: MandatoryItemResult[];
}

// ─── Selector input type ─────────────────────────────────────────────────────

export interface ReadinessSelectorInput {
  onboardingStatus?: { completedModules?: string[] } | null;
  basicDetails: {
    legalName: string;
    displayName: string;
    dateOfBirth: string;
    gender: string;
  };
  professionalBio: string;
  interestTags: string[];
  experienceCategories: string[];
  spokenLanguages: string[];
  profilePhotoComplete: boolean;
  backgroundDeclaration: Record<string, boolean>;
  workPreference: {durations: string[];days: string[];timeRanges: string[];};
  city: string;
  broadAreas: string[];
  commActivityPrefs: {commStyle: string;activityPace: string;groupPreference: string;};
  venuePreferences: string[];
  boundariesAccepted: boolean;
  selectedIdType: string;
  idSubmittedForReview: boolean;
  selfieCaptureComplete: boolean;
  livenessComplete: boolean;
  addressDetailsComplete: boolean;
  addressProofSubmitted: boolean;
  sessionRateINR: number;
  panConfirmed: boolean;
  bankVerified: boolean;
  upiVerified: boolean;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildModule(
title: string,
icon: string,
items: MandatoryItemResult[])
: ModuleResult {
  const mandatory = items.filter((i) => !i.optional);
  const completedCount = mandatory.filter((i) => i.done).length;
  const totalCount = mandatory.length;
  return { title, icon, items, completedCount, totalCount, allDone: completedCount === totalCount };
}

// ─── Main selector ───────────────────────────────────────────────────────────

/**
 * Pure function — takes a state snapshot, returns a consistent readiness result.
 * Call with `get()` in Zustand or subscribe via `useApplicationStore(s => getApplicationReadiness(s))`.
 */
export function getApplicationReadiness(s: ReadinessSelectorInput): ApplicationReadinessResult {
  const backendCompleted = s.onboardingStatus?.completedModules || [];
  const isDone = (backendKey: string, localDone: boolean) => backendCompleted.includes(backendKey) || localDone;

  // ── 1. Profile Module ────────────────────────────────────────────────────
  const bd = s.basicDetails;
  const profileItems: MandatoryItemResult[] = [
  {
    key: 'basic_details', label: i18next.t("content.selectors.applicationReadinessSelector.basic_details"), route: Routes.BASIC_DETAILS,
    done: isDone('basic_details', !!(bd.displayName || bd.legalName))
  },
  {
    key: 'bio', label: i18next.t("content.selectors.applicationReadinessSelector.professional_bio"), route: Routes.BIO_INTRODUCTION,
    done: isDone('bio', !!(s.professionalBio && s.professionalBio.trim().length > 0))
  },
  {
    key: 'interests', label: i18next.t("content.selectors.applicationReadinessSelector.interests_personality"), route: Routes.INTERESTS_PERSONALITY,
    done: isDone('interests', s.interestTags.length > 0)
  },
  {
    key: 'experience', label: i18next.t("content.selectors.applicationReadinessSelector.experience_categories"), route: Routes.EXPERIENCE_CATEGORIES,
    done: isDone('categories', s.experienceCategories.length > 0)
  },
  {
    key: 'languages', label: i18next.t("content.selectors.applicationReadinessSelector.languages"), route: Routes.LANGUAGES_SELECTION,
    done: isDone('languages', s.spokenLanguages.length > 0)
  },
  {
    key: 'profile_photo', label: i18next.t("content.selectors.applicationReadinessSelector.profile_photo"), route: Routes.PROFILE_PHOTO_UPLOAD,
    done: isDone('photo', s.profilePhotoComplete)
  }];

  // bgDone = true when all declarations have been confirmed
  const bgDone = Object.values(s.backgroundDeclaration).every(Boolean);
  const wp = s.workPreference;
  const cap = s.commActivityPrefs;
  const safetyItems: MandatoryItemResult[] = [
  {
    key: 'background_declaration', label: i18next.t("content.selectors.applicationReadinessSelector.background_declaration"),
    route: Routes.BACKGROUND_DECLARATION, done: isDone('declaration', isDone('eligibility', bgDone))
  },
  {
    key: 'work_preference', label: i18next.t("content.selectors.applicationReadinessSelector.work_preferences"), route: Routes.WORK_PREFERENCE,
    done: isDone('work_preference', wp.durations.length > 0 || wp.days.length > 0)
  },
  {
    key: 'city', label: i18next.t("content.selectors.applicationReadinessSelector.city_service_areas"), route: Routes.CITY_SERVICE_AREA,
    done: isDone('service_area', !!s.city)
  },
  {
    key: 'comm_activity', label: i18next.t("content.selectors.applicationReadinessSelector.communication_activity_preferences"),
    route: Routes.SERVICE_STYLE_PREFERENCES,
    done: isDone('service_style', !!(cap.commStyle || cap.activityPace))
  },
  {
    key: 'venue_preference', label: i18next.t("content.selectors.applicationReadinessSelector.venue_preferences"), route: Routes.PUBLIC_VENUE_PREFERENCE,
    done: isDone('public_venue', s.venuePreferences.length > 0)
  },
  {
    key: 'boundaries', label: i18next.t("content.selectors.applicationReadinessSelector.boundaries_safety"), route: Routes.BOUNDARIES_SAFETY,
    done: isDone('boundaries', s.boundariesAccepted)
  }];

  // ── 3. Identity Module ────────────────────────────────────────────────────
  const identityItems: MandatoryItemResult[] = [
  {
    key: 'id_type', label: i18next.t("content.selectors.applicationReadinessSelector.government_id_type"), route: Routes.GOVERNMENT_ID_TYPE,
    done: isDone('government_id', !!s.selectedIdType || s.idSubmittedForReview)
  },
  {
    key: 'id_submitted', label: i18next.t("content.selectors.applicationReadinessSelector.government_id_submitted"), route: Routes.GOVERNMENT_ID_UPLOAD,
    done: isDone('government_id', s.idSubmittedForReview)
  },
  {
    key: 'selfie_liveness', label: i18next.t("content.selectors.applicationReadinessSelector.selfie_liveness_check"), route: Routes.SELFIE_CAPTURE,
    done: isDone('selfie', s.selfieCaptureComplete && s.livenessComplete)
  },
  {
    key: 'address_details', label: i18next.t("content.selectors.applicationReadinessSelector.address_details"), route: Routes.ADDRESS_VERIFICATION,
    done: isDone('address', s.addressDetailsComplete)
  },
  {
    key: 'address_proof', label: i18next.t("content.selectors.applicationReadinessSelector.address_proof_uploaded"), route: Routes.ADDRESS_VERIFICATION,
    done: isDone('address', s.addressProofSubmitted),
    optional: true
  }];

  // ── 4. Financial Module ───────────────────────────────────────────────────
  const financialItems: MandatoryItemResult[] = [
  {
    key: 'pricing', label: i18next.t("content.selectors.applicationReadinessSelector.companion_pricing"), route: Routes.COMPANION_PRICING,
    done: isDone('pricing', s.sessionRateINR > 0)
  },
  {
    key: 'pan', label: i18next.t("content.selectors.applicationReadinessSelector.pan_tax_details"), route: Routes.PAN_TAX_DETAILS,
    done: isDone('pan', s.panConfirmed)
  },
  {
    key: 'bank', label: i18next.t("content.selectors.applicationReadinessSelector.bank_account_verified"), route: Routes.BANK_ACCOUNT_VERIFICATION,
    done: isDone('bank', s.bankVerified)
  },
  {
    key: 'upi', label: i18next.t("content.selectors.applicationReadinessSelector.upi_payout_details"), route: Routes.UPI_DETAILS,
    done: isDone('upi', s.upiVerified),
  }];


  // --- Aggregate -------------------------------------------------------------
  const profile = buildModule('1. Profile Setup', 'person', profileItems);
  const safetyService = buildModule('2. Safety & Service', 'shield', safetyItems);
  const identity = buildModule('3. Identity', 'badge', identityItems);
  const financial = buildModule('4. Financial & Payout', 'account-balance', financialItems);

  const allModules = [profile, safetyService, identity, financial];
  const completedMandatory = allModules.reduce((sum, m) => sum + m.completedCount, 0);
  const totalMandatory = allModules.reduce((sum, m) => sum + m.totalCount, 0);
  const percentage = totalMandatory > 0 ? Math.round(completedMandatory / totalMandatory * 100) : 0;

  const allItems = [...profileItems, ...safetyItems, ...identityItems, ...financialItems];
  const missing = allItems.filter((i) => !i.done && !i.optional);
  const ready = missing.length === 0;

  return {
    modules: { profile, safetyService, identity, financial },
    completedMandatory,
    totalMandatory,
    percentage,
    ready,
    missing
  };
}