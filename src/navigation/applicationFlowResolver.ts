/**
 * applicationFlowResolver.ts
 *
 * CANONICAL PROGRESS ENGINE & NEXT-STEP RESOLVER for CoBuddy Companion Application Flow.
 *
 * Enforces:
 *   1. Identity-based step ordering (single source of truth).
 *   2. Authoritative backend + store synchronization.
 *   3. No completed step is ever reopened during linear advancement.
 *   4. Clean handling of Profile Correction context and Missing Requirement Fix context.
 *   5. Real forward navigation directly to the first incomplete step.
 */

import { Routes } from './routes';
import { useApplicationStore } from '../store/slices/applicationStore';
import {
  navigateToMissingRequirementReturn,
  type MandatoryRequirementKey,
} from './missingRequirementNavigation';
import type { ProfileCorrectionSection } from '../store/slices/applicationStore';

export interface ApplicationFlowStep {
  route: string;
  moduleKey?: string;
  isComplete: (state: ReturnType<typeof useApplicationStore.getState>) => boolean;
}

export const CANONICAL_APPLICATION_STEPS: ApplicationFlowStep[] = [
  {
    route: Routes.ELIGIBILITY_CONFIRMATION,
    moduleKey: 'eligibility',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('eligibility') ?? false) ||
      Object.values(s.eligibilityConfirmed).every(Boolean),
  },
  {
    route: Routes.BASIC_DETAILS,
    moduleKey: 'basic_details',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('basic_details') ?? false) ||
      ((s.basicDetails.displayName || s.basicDetails.legalName).trim().length > 0 &&
        !!s.basicDetails.dateOfBirth),
  },
  {
    route: Routes.BIO_INTRODUCTION,
    moduleKey: 'bio',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('bio') ?? false) ||
      Boolean(s.professionalBio && s.professionalBio.trim().length >= 50),
  },
  {
    route: Routes.INTERESTS_PERSONALITY,
    moduleKey: 'interests',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('interests') ?? false) ||
      (s.interestTags && s.interestTags.length > 0),
  },
  {
    route: Routes.EXPERIENCE_CATEGORIES,
    moduleKey: 'categories',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('categories') ?? false) ||
      (s.experienceCategories && s.experienceCategories.length > 0),
  },
  {
    route: Routes.LANGUAGES_SELECTION,
    moduleKey: 'languages',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('languages') ?? false) ||
      (s.spokenLanguages && s.spokenLanguages.length > 0),
  },
  {
    route: Routes.PROFILE_PHOTO_UPLOAD,
    moduleKey: 'photo',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('photo') ?? false) ||
      s.profilePhotoComplete,
  },
  {
    route: Routes.BACKGROUND_DECLARATION,
    moduleKey: 'declaration',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('declaration') ?? false) ||
      Object.values(s.backgroundDeclaration).every(Boolean),
  },
  {
    route: Routes.WORK_PREFERENCE,
    moduleKey: 'work_preference',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('work_preference') ?? false) ||
      (s.workPreference.durations.length > 0 && s.workPreference.days.length > 0),
  },
  {
    route: Routes.CITY_SERVICE_AREA,
    moduleKey: 'service_area',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('service_area') ?? false) ||
      Boolean(s.city && s.city.trim().length > 0),
  },
  {
    route: Routes.SERVICE_STYLE_PREFERENCES,
    moduleKey: 'service_style',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('service_style') ?? false) ||
      !!(s.commActivityPrefs.commStyle || s.commActivityPrefs.activityPace),
  },
  {
    route: Routes.PUBLIC_VENUE_PREFERENCE,
    moduleKey: 'public_venue',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('public_venue') ?? false) ||
      (s.venuePreferences && s.venuePreferences.length > 0),
  },
  {
    route: Routes.BOUNDARIES_SAFETY,
    moduleKey: 'boundaries',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('boundaries') ?? false) ||
      s.boundariesAccepted,
  },
  {
    route: Routes.GOVERNMENT_ID_TYPE,
    moduleKey: 'government_id_type',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('government_id') ?? false) ||
      !!s.selectedIdType ||
      s.idSubmittedForReview,
  },
  {
    route: Routes.GOVERNMENT_ID_UPLOAD,
    moduleKey: 'government_id',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('government_id') ?? false) ||
      s.idSubmittedForReview,
  },
  {
    route: Routes.SELFIE_CAPTURE,
    moduleKey: 'selfie_capture',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('selfie') ?? false) ||
      s.selfieCaptureComplete,
  },
  {
    route: Routes.LIVENESS_DETECTION,
    moduleKey: 'selfie',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('selfie') ?? false) ||
      (s.selfieCaptureComplete && s.livenessComplete),
  },
  {
    route: Routes.ADDRESS_VERIFICATION,
    moduleKey: 'address',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('address') ?? false) ||
      s.addressDetailsComplete,
  },
  {
    route: Routes.COMPANION_PRICING,
    moduleKey: 'pricing',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('pricing') ?? false) ||
      s.sessionRateINR > 0,
  },
  {
    route: Routes.PAN_TAX_DETAILS,
    moduleKey: 'pan',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('pan') ?? false) ||
      s.panConfirmed,
  },
  {
    route: Routes.ADD_BANK_ACCOUNT,
    moduleKey: 'bank_account',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('bank') ?? false) ||
      !!s.bankAccountLast4 ||
      s.bankVerified,
  },
  {
    route: Routes.BANK_ACCOUNT_VERIFICATION,
    moduleKey: 'bank',
    isComplete: (s) =>
      (s.onboardingStatus?.completedModules?.includes('bank') ?? false) ||
      s.bankVerified,
  },
  {
    route: Routes.UPI_DETAILS,
    moduleKey: 'upi',
    isComplete: (s) => true, // UPI is optional
  },
];

/**
 * Resolves the next incomplete application route after currentRoute.
 * If all subsequent steps are complete, returns APPLICATION_REVIEW_INFO.
 */
export function getNextApplicationStep(currentRoute: string): {
  route: string;
  params?: any;
} {
  const state = useApplicationStore.getState();
  const currentIndex = CANONICAL_APPLICATION_STEPS.findIndex(
    (step) => step.route === currentRoute,
  );

  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;

  for (let i = startIndex; i < CANONICAL_APPLICATION_STEPS.length; i++) {
    const step = CANONICAL_APPLICATION_STEPS[i];
    if (!step.isComplete(state)) {
      if (step.route === Routes.GOVERNMENT_ID_UPLOAD) {
        return {
          route: step.route,
          params: { idType: state.selectedIdType || 'AADHAAR' },
        };
      }
      return { route: step.route };
    }
  }

  return { route: Routes.APPLICATION_REVIEW_INFO };
}

/**
 * Deterministically navigates forward from the current screen:
 *  1. If in Profile Correction mode: marks correction complete and returns to Checklist.
 *  2. If in Missing Requirement Fix mode: marks fix complete and returns to calling hub.
 *  3. In linear flow: skips any completed steps and opens the first incomplete step.
 */
export function navigateToNextApplicationStep(
  navigation: any,
  currentRoute: string,
  options?: {
    correctionSection?: ProfileCorrectionSection;
    missingRequirementKey?: MandatoryRequirementKey;
    params?: any;
  },
): void {
  const store = useApplicationStore.getState();

  // 1. Handle Profile Correction return
  if (store.profileCorrectionContext.isActive && options?.correctionSection) {
    store.completeProfileCorrection(options.correctionSection);
    navigation.navigate(Routes.PROFILE_COMPLETION_CHECKLIST, { mode: 'correction' });
    return;
  }

  // 2. Handle Missing Requirement Fix return
  if (
    store.missingRequirementFixContext.isActive &&
    store.missingRequirementFixContext.returnRoute &&
    options?.missingRequirementKey
  ) {
    store.completeMissingRequirementFix(options.missingRequirementKey);
    navigateToMissingRequirementReturn(
      navigation,
      store.missingRequirementFixContext.returnRoute,
    );
    return;
  }

  // 3. Normal sequential progression
  const next = getNextApplicationStep(currentRoute);
  const targetParams = options?.params || next.params;

  if (targetParams) {
    navigation.navigate(next.route, targetParams);
  } else {
    navigation.navigate(next.route);
  }
}
