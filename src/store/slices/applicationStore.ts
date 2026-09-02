/**
 * CoBuddy Companion App — Application Store (Zustand)
 * In-memory state for the KYC / Application flow (CPN-021 → CPN-059).
 *
 * PRIVACY:
 *   - No AsyncStorage persistence. In-memory only.
 *   - No GPS coordinates stored.
 *   - Home address (CPN-040): in-memory only, never AsyncStorage, never logged.
 *   - Government ID images: only local device URIs — cleared after upload stub.
 *   - PAN (CPN-041): only masked display string stored after confirmation.
 *   - Bank account (CPN-042): only last 4 digits stored after submission.
 *   - UPI ID (CPN-044): only masked display string stored after confirmation.
 *   - Selfie/liveness: only boolean flags — no image data stored.
 *   - No logging of any sensitive field values anywhere in this slice.
 *
 * SCOPE: Phase 4A (CPN-021–032) + Phase 4B (CPN-033–044) + Phase 4C (CPN-045–059).
 */

import {create} from 'zustand';
import {Routes} from '../../navigation/routes';
import {getApplicationReadiness, MandatoryItemResult} from '../selectors/applicationReadinessSelector';
import type {MandatoryRequirementKey} from '../../navigation/missingRequirementNavigation';
import type {OnboardingStatus} from '../types/store.types';

// ─── Types ────────────────────────────────────────────────────────────────────

// Exported key types for use in screens
export type EligibilityKey = 'age' | 'public_venues' | 'conduct' | 'in_app' | 'verification';
export type BackgroundDeclKey = 'accurate_info' | 'public_venue_only' | 'professional_conduct' | 'no_private_contact' | 'safety_policy' | 'no_misrepresentation';

export type ApplicationPhase =
  | 'identity'    // CPN-021 → CPN-024
  | 'safety'      // CPN-025 → CPN-032
  | 'financial'   // CPN-033 → CPN-044 (Phase 4B)
  | 'profile'     // CPN-045 → CPN-048 (Phase 4C)
  | 'submit';     // CPN-049 → CPN-050 (Phase 4C)

// Valid entry routes when ApplicationNavigator is remounted after an authStatus swap.
// Restricted to routes where re-entry from VerificationNavigator makes semantic sense.
// Default is JOURNEY_INTRO for normal fresh application starts.
export type ApplicationEntryRoute =
  | typeof Routes.JOURNEY_INTRO
  | typeof Routes.PROFILE_SETUP_INTRO
  // PROFILE_COMPLETION_CHECKLIST: used as initialRoute via setApplicationEntryRoute in ProfileEditRejectedScreen.
  // When mounted as initialRoute (not via navigate()), RN Navigation does not enforce params at runtime.
  // ApplicationSavedDraftScreen uses 'as any' on navigate(destination) so the params mismatch is suppressed there.
  | typeof Routes.PROFILE_COMPLETION_CHECKLIST
  | typeof Routes.APPLICATION_REVIEW_INFO
  | typeof Routes.SUBMIT_PROFILE_FOR_APPROVAL
  | typeof Routes.APPLICATION_SAVED_DRAFT
  // Additional resumable screens — set by Save Draft CTAs
  | typeof Routes.LANGUAGES_SELECTION
  | typeof Routes.COMPANION_PRICING
  | typeof Routes.PROFILE_PHOTO_UPLOAD
  | typeof Routes.GOVERNMENT_ID_UPLOAD
  | typeof Routes.ADD_BANK_ACCOUNT
  | typeof Routes.APPLICATION_PROGRESS;

// ─── ApplicationResumeTarget ──────────────────────────────────────────────────
// Typed resume target for the saved-draft system.
// Each variant carries exactly the route + any params that screen requires.
// GOVERNMENT_ID_UPLOAD needs idType preserved so the screen renders the
// correct document side labels on resume.
export type ApplicationResumeTarget =
  | { route: typeof Routes.PROFILE_SETUP_INTRO }
  | { route: typeof Routes.LANGUAGES_SELECTION }
  | { route: typeof Routes.COMPANION_PRICING }
  | { route: typeof Routes.PROFILE_PHOTO_UPLOAD }
  | { route: typeof Routes.GOVERNMENT_ID_UPLOAD; params: { idType: string } }
  | { route: typeof Routes.ADD_BANK_ACCOUNT }
  | { route: typeof Routes.PAN_TAX_DETAILS }
  | { route: typeof Routes.ADDRESS_VERIFICATION }
  | { route: typeof Routes.APPLICATION_PROGRESS }

  | { route: typeof Routes.APPLICATION_REVIEW_INFO }
  | { route: typeof Routes.SUBMIT_PROFILE_FOR_APPROVAL }
  | { route: typeof Routes.PROFILE_COMPLETION_CHECKLIST; params: { mode: 'profile_setup' | 'correction' } };


// Safe default — no params required.
export const DEFAULT_RESUME_TARGET: ApplicationResumeTarget = {
  route: Routes.APPLICATION_REVIEW_INFO,
};

// ─── ProfileCorrectionContext ─────────────────────────────────────────────────────────────────────
// Explicitly set by CPN-046 navigateToCorrectionEdit() before opening an edit screen.
// Never inferred from navigation history.
export type ProfileCorrectionSection =
  | 'basic_details'
  | 'bio'
  | 'interests'
  | 'experience_categories'
  | 'languages'
  | 'profile_photo'
  | 'pricing';

export interface ProfileCorrectionContext {
  isActive: boolean;
  returnRoute: typeof Routes.PROFILE_COMPLETION_CHECKLIST;
  section: ProfileCorrectionSection | null; // null when isActive is false
}

export const DEFAULT_CORRECTION_CONTEXT: ProfileCorrectionContext = {
  isActive: false,
  returnRoute: Routes.PROFILE_COMPLETION_CHECKLIST,
  section: null,
};

// ─── MissingRequirementFixContext ──────────────────────────────────────────────────────────
// Set by CPN-047/048/049/051/052/053 when tapping a missing-item row.
// The target screen calls completeMissingRequirementFix(key) + replace(returnRoute) on success.
// clearMissingRequirementFix() is called after safe return.
export type MissingRequirementSource =
  | 'application_progress'
  | 'application_review'
  | 'submit_application'
  | 'verification_hub'
  | 'verification_pending'
  | 'verification_processing';

export type MissingRequirementReturnRoute =
  | typeof Routes.APPLICATION_PROGRESS
  | typeof Routes.APPLICATION_REVIEW_INFO
  | typeof Routes.SUBMIT_PROFILE_FOR_APPROVAL
  | typeof Routes.VERIFICATION_HUB
  | typeof Routes.VERIFICATION_PENDING
  | typeof Routes.VERIFICATION_PROCESSING;

export interface MissingRequirementFixContext {
  isActive: boolean;
  source: MissingRequirementSource | null;
  requirementKey: MandatoryRequirementKey | null;  // exact key from MandatoryItemResult.key
  returnRoute: MissingRequirementReturnRoute | null;
}

export const DEFAULT_FIX_CONTEXT: MissingRequirementFixContext = {
  isActive: false,
  source: null,
  requirementKey: null,
  returnRoute: null,
};

export type BankAccountType = 'savings' | 'current' | 'salary';

export type AddressType = 'current_residence' | 'permanent_residence';

export type ApplicationStage =
  | 'not_started'
  | 'journey_intro'
  | 'eligibility'
  | 'basic_details'
  | 'bio_intro'
  | 'background_declaration'
  | 'experience_categories'
  | 'interests_personality'
  | 'work_preference'
  | 'city_service_area'
  | 'comm_activity_prefs'
  | 'public_venue_pref'
  | 'boundaries_safety'
  | 'phase_2_complete'
  // Phase 4B stages
  | 'companion_pricing'
  | 'languages_selection'
  | 'profile_photo'
  | 'government_id_type'
  | 'government_id_upload'
  | 'selfie_capture'
  | 'liveness_detection'
  | 'address_verification'
  | 'pan_tax_details'
  | 'bank_account'
  | 'bank_verification'
  | 'upi_details'
  | 'phase_3_complete'
  // Phase 4C stages
  | 'profile_setup_intro'
  | 'profile_completion_checklist'
  | 'application_progress'
  | 'application_review_info'
  | 'submit_profile_for_approval'
  | 'application_saved_draft'
  | 'verification_hub'
  | 'verification_pending'
  | 'verification_processing'
  | 'verification_approved'
  | 'verification_rejected'
  | 'resubmit_verification'
  | 'profile_review_pending'
  | 'profile_approved_published'
  | 'profile_edit_rejected';

// Basic details — no PII logging, purely form fields
interface BasicDetails {
  legalName:    string;
  displayName:  string;
  email:        string;
  dateOfBirth:  string; // ISO date string 'YYYY-MM-DD'
  gender:       string;
}

// Work preferences
interface WorkPreference {
  durations:   string[]; // e.g. ['1h', '2h']
  days:        string[]; // e.g. ['Monday', 'Wednesday']
  timeRanges:  string[]; // e.g. ['morning', 'evening']
  frequency:   string;   // e.g. '3-5'
}

// ─── Phase 4B types ──────────────────────────────────────────────────────────

// CPN-040: Residential address (SENSITIVE — never shown to customers, never logged)
interface ResidentialAddress {
  line1:       string; // SENSITIVE: never log
  line2:       string;
  city:        string;
  state:       string;
  pinCode:     string;
  addressType: AddressType;
}

// Communication & activity preferences
interface CommActivityPrefs {
  commStyle:       string; // 'chatty' | 'balanced' | 'quiet'
  activityPace:    string; // 'relaxed' | 'moderate' | 'active'
  groupPreference: string; // 'one_on_one' | 'small_group' | 'any'
  accessibilityNote: string;
}

// ─── State interface ──────────────────────────────────────────────────────────

interface ApplicationState {
  // Master Onboarding Status from Backend
  onboardingStatus: OnboardingStatus | null;

  // Stage tracking
  currentStage:   ApplicationStage;
  currentPhase:   ApplicationPhase;
  completionPct:  number; // 0–100

  // CPN-022: Eligibility
  eligibilityConfirmed: {
    age:           boolean;
    public_venues: boolean;
    conduct:       boolean;
    in_app:        boolean;
    verification:  boolean;
  };

  // CPN-023: Basic details
  basicDetails: BasicDetails;

  // CPN-024: Professional bio
  professionalBio: string;

  // CPN-025: Background declaration
  backgroundDeclaration: {
    accurate_info:        boolean;
    public_venue_only:    boolean;
    professional_conduct: boolean;
    no_private_contact:   boolean;
    safety_policy:        boolean;
    no_misrepresentation: boolean;
  };

  // CPN-026: Experience categories
  experienceCategories: string[]; // list of category IDs

  // CPN-027: Interests & personality tags
  interestTags: string[]; // list of tag IDs

  // CPN-028: Work preferences
  workPreference: WorkPreference;

  // CPN-029: City & service area
  city:         string;
  broadAreas:   string[];
  willingToTravel: boolean;

  // CPN-030: Communication & activity preferences
  commActivityPrefs: CommActivityPrefs;

  // CPN-031: Public venue preferences
  venuePreferences: string[]; // list of venue IDs

  // CPN-032: Boundaries & safety acceptance
  boundariesAccepted: boolean;

  // ─── Phase 4B: Financial & Verification (CPN-033 → CPN-044) ──────────────

  // CPN-033: Companion pricing
  sessionRateINR:      number;  // INR per hour
  sessionDurationMins: number;  // default 90

  // CPN-034: Languages
  spokenLanguages:  string[];
  primaryLanguage:  string;
  languageComfort:  string[];

  // CPN-035: Profile photo completion status (non-sensitive boolean)
  // Raw URI stays ONLY in component local state — never in Zustand.
  profilePhotoComplete: boolean;

  // CPN-036: ID type selection
  selectedIdType: string;

  // CPN-037: Gov ID submission status (actual URIs are NOT stored in Zustand)
  idSubmittedForReview: boolean;

  // CPN-038: Selfie capture completion (non-sensitive boolean)
  // Raw selfie URI is ephemeral — cleared after liveness, never persisted.
  selfieCaptureComplete: boolean;

  // CPN-039: Liveness result
  livenessComplete: boolean;

  // CPN-040: Residential address — SENSITIVE — never AsyncStorage, never log
  address: ResidentialAddress;
  addressDetailsComplete: boolean;  // set after address form validation succeeds
  addressProofSubmitted: boolean;   // set after proof uploaded AND form valid

  // CPN-041: PAN tax details — SENSITIVE — only masked display stored after confirmation
  panName:      string;  // Name as per PAN
  panMasked:    string;  // Display only: 'AB••••••XY'
  taxResidency: string;  // default 'India'
  hasGST:       boolean;
  gstNumber:    string;  // optional
  panConfirmed: boolean;

  // CPN-042: Bank account — SENSITIVE — only last 4 digits after submission
  bankAccountLast4: string;     // e.g. '4821'
  bankName:         string;
  ifscCode:         string;
  accountType:      BankAccountType;
  bankVerified:     boolean;

  // CPN-044: UPI — SENSITIVE — only masked display stored after confirmation
  upiMasked:   string;  // e.g. 'name••••@upi'
  upiPrimary:  boolean;
  upiVerified: boolean;

  // ─── Phase 4C: Profile Setup & Review (CPN-045 → CPN-059) ──────────────────

  // CPN-045: Profile setup intro (just tracking navigation reached)
  profileSetupStarted: boolean;

  // CPN-046: Profile completion checklist — computed from existing fields
  // (no new fields — reads Phase 4A/4B fields for completion status)

  // CPN-047: Application progress (tracked via stage)

  // CPN-048: Application review info (tracked via stage)

  // CPN-049: Submit profile for approval
  profileSubmittedForApproval: boolean;

  // CPN-050: Application saved draft
  draftSavedAt: string; // ISO timestamp, '' if not saved

  // CPN-051: Verification hub entry (status of verification pipeline)
  verificationStarted: boolean;

  // CPN-052/053: Verification status
  verificationStatus: 'not_started' | 'pending' | 'processing' | 'approved' | 'rejected';

  // CPN-055/056: Rejection reason (from backend, stub for Phase 4C)
  verificationRejectionReason: string;

  // CPN-056: Resubmit tracking
  verificationResubmitted: boolean;

  // CPN-057: Profile review status after submission to CoBuddy
  profileReviewStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';

  // CPN-059: Profile edit rejection details
  profileEditRejectionSections: string[];

  // ─── CPN-046 checklist mode (explicit, not inferred) ─────────────────────
  // Set by the screen initiating navigation to CPN-046.
  // Resolved by CPN-046 in order: route.params?.mode ?? store.profileChecklistMode
  // Reset to 'profile_setup' when correction flow finishes or user resubmits.
  profileChecklistMode: 'profile_setup' | 'correction';

  // ─── CPN-046 correction context ───────────────────────────────────────────
  // Set by navigateToCorrectionEdit BEFORE opening an edit screen.
  // The edit screen reads isActive; on save, calls completeProfileCorrection.
  // Never inferred from navigation history.
  profileCorrectionContext: ProfileCorrectionContext;

  // Tracks which rejected sections have been corrected this session.
  // Key: section string from profileEditRejectionSections
  // Value: true when completeProfileCorrection(section) has been called
  correctedSections: Record<string, boolean>;

  // ─── CPN-047/048/049/051/052/053 missing-requirement fix return context ─────────────
  // Set before navigating to a missing-requirement target screen.
  // The target screen reads isActive; on success calls completeMissingRequirementFix
  // + navigation.replace(returnRoute). Cleared after safe return.
  missingRequirementFixContext: MissingRequirementFixContext;

  // ─── Navigator entry routing ──────────────────────────────────────────────
  // Set this to the desired screen BEFORE calling setAuthStatus('applying').
  // ApplicationNavigator reads this on mount.
  // Default: Routes.JOURNEY_INTRO (fresh application start).
  applicationEntryRoute: ApplicationEntryRoute;

  // ─── Saved draft resume target ────────────────────────────────────────────
  // Set by any "Save & Exit" CTA before navigating to APPLICATION_SAVED_DRAFT.
  // Carries the route + any required params.
  // CPN-050 Continue CTA reads this, navigates, then resets to DEFAULT_RESUME_TARGET.
  applicationResumeTarget: ApplicationResumeTarget;

  // ─── Actions ─────────────────────────────────────────────────────

  // Master Backend Hydration
  hydrateOnboardingStatus: (status: OnboardingStatus) => void;
  hydrateProfileData: (profile: any) => void;

  // Stage
  setCurrentStage: (stage: ApplicationStage) => void;

  // Eligibility
  setEligibilityConfirmed: (id: keyof ApplicationState['eligibilityConfirmed'], value: boolean) => void;

  // Basic details
  updateBasicDetails: (updates: Partial<BasicDetails>) => void;

  // Bio
  setProfessionalBio: (bio: string) => void;

  // Background declaration
  setBackgroundDeclaration: (id: keyof ApplicationState['backgroundDeclaration'], value: boolean) => void;

  // Experience categories
  toggleExperienceCategory: (id: string) => void;

  // Interests
  toggleInterestTag: (id: string) => void;

  // Work preferences
  updateWorkPreference: (updates: Partial<WorkPreference>) => void;

  // City & area
  setCity: (city: string) => void;
  toggleBroadArea: (area: string) => void;
  setWillingToTravel: (val: boolean) => void;

  // Comm & activity prefs
  updateCommActivityPrefs: (updates: Partial<CommActivityPrefs>) => void;

  // Venue preferences
  toggleVenuePreference: (id: string) => void;

  // Boundaries
  setBoundariesAccepted: (val: boolean) => void;

  // ─── Phase 4B actions ────────────────────────────────────────────────────

  // CPN-033
  setPricing: (rateINR: number, durationMins: number) => void;

  // CPN-034
  setLanguages: (spoken: string[], primary: string, comfort: string[]) => void;

  // CPN-035: mark photo accepted (raw URI stays in component state only)
  setProfilePhotoComplete: (val: boolean) => void;

  // CPN-036
  setSelectedIdType: (idType: string) => void;

  // CPN-037
  setIdSubmitted: (val: boolean) => void;

  // CPN-038: mark selfie captured (raw selfie cleared after liveness)
  setSelfieCaptureComplete: (val: boolean) => void;

  // CPN-039
  setLivenessComplete: (val: boolean) => void;

  // CPN-040
  setAddress: (addr: Partial<ResidentialAddress>) => void;
  setAddressDetailsComplete: (val: boolean) => void;
  setAddressProofSubmitted: (val: boolean) => void;

  // CPN-041
  setPANDetails: (name: string, masked: string, residency: string, hasGST: boolean, gstNumber: string) => void;
  setPANConfirmed: (val: boolean) => void;

  // CPN-042
  setBankAccount: (last4: string, bankName: string, ifsc: string, type: BankAccountType) => void;
  setBankVerified: (val: boolean) => void;

  // CPN-044
  setUPI: (masked: string, primary: boolean) => void;
  setUPIVerified: (val: boolean) => void;

  // ─── Phase 4C actions ────────────────────────────────────────────────────

  // CPN-045
  setProfileSetupStarted: (val: boolean) => void;

  // CPN-049
  setProfileSubmittedForApproval: (val: boolean) => void;

  // CPN-050
  setDraftSaved: (timestamp: string) => void;

  // CPN-051
  setVerificationStarted: (val: boolean) => void;

  // CPN-052/053
  setVerificationStatus: (status: ApplicationState['verificationStatus']) => void;

  // CPN-055
  setVerificationRejectionReason: (reason: string) => void;

  // CPN-056
  setVerificationResubmitted: (val: boolean) => void;

  // CPN-057
  setProfileReviewStatus: (status: ApplicationState['profileReviewStatus']) => void;

  // CPN-059
  setProfileEditRejectionSections: (sections: string[]) => void;

  // CPN-046 checklist mode
  setProfileChecklistMode: (mode: 'profile_setup' | 'correction') => void;

  // CPN-046 correction context actions
  startProfileCorrection: (section: ProfileCorrectionSection) => void;
  completeProfileCorrection: (section: ProfileCorrectionSection) => void;
  clearProfileCorrection: () => void;

  // CPN-047/048/049/051/052/053 missing-requirement fix return actions
  startMissingRequirementFix: (ctx: Omit<MissingRequirementFixContext, 'isActive'>) => void;
  completeMissingRequirementFix: (requirementKey: MandatoryRequirementKey) => void;
  clearMissingRequirementFix: () => void;

  // Submission readiness selector — derives from real store state
  isApplicationReadyForSubmission: () => {
    ready: boolean;
    missing: import('../selectors/applicationReadinessSelector').MandatoryItemResult[];
  };

  // Navigator entry routing
  setApplicationEntryRoute: (route: ApplicationEntryRoute) => void;

  // Saved draft resume target — set by any "Save & Exit" CTA
  setApplicationResumeTarget: (target: ApplicationResumeTarget) => void;

  // Completion
  recalculateCompletion: () => void;

  // Reset (full clear)
  resetApplication: () => void;

  // Backend Integration
  saveDraftToBackend: () => Promise<void>;
  submitApplicationToBackend: () => Promise<void>;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: Omit<
  ApplicationState,
  | 'hydrateOnboardingStatus'
  | 'setCurrentStage'
  | 'setEligibilityConfirmed'
  | 'updateBasicDetails'
  | 'setProfessionalBio'
  | 'setBackgroundDeclaration'
  | 'toggleExperienceCategory'
  | 'toggleInterestTag'
  | 'updateWorkPreference'
  | 'setCity'
  | 'toggleBroadArea'
  | 'setWillingToTravel'
  | 'updateCommActivityPrefs'
  | 'toggleVenuePreference'
  | 'setBoundariesAccepted'
  | 'setPricing'
  | 'setLanguages'
  | 'setProfilePhotoComplete'
  | 'setSelectedIdType'
  | 'setIdSubmitted'
  | 'setSelfieCaptureComplete'
  | 'setLivenessComplete'
  | 'setAddress'
  | 'setAddressDetailsComplete'
  | 'setAddressProofSubmitted'
  | 'setPANDetails'
  | 'setPANConfirmed'
  | 'setBankAccount'
  | 'setBankVerified'
  | 'setUPI'
  | 'setUPIVerified'
  | 'setProfileSetupStarted'
  | 'setProfileSubmittedForApproval'
  | 'setDraftSaved'
  | 'setVerificationStarted'
  | 'setVerificationStatus'
  | 'setVerificationRejectionReason'
  | 'setVerificationResubmitted'
  | 'setProfileReviewStatus'
  | 'setProfileEditRejectionSections'
  | 'setProfileChecklistMode'
  | 'startProfileCorrection'
  | 'completeProfileCorrection'
  | 'clearProfileCorrection'
  | 'startMissingRequirementFix'
  | 'completeMissingRequirementFix'
  | 'clearMissingRequirementFix'
  | 'setApplicationEntryRoute'
  | 'setApplicationResumeTarget'
  | 'isApplicationReadyForSubmission'
  | 'recalculateCompletion'
  | 'resetApplication'
  | 'saveDraftToBackend'
  | 'submitApplicationToBackend'
  | 'hydrateProfileData'
> = {
  onboardingStatus: null,
  currentStage:  'not_started',
  currentPhase:  'identity',
  completionPct: 0,

  eligibilityConfirmed: {
    age:           false,
    public_venues: false,
    conduct:       false,
    in_app:        false,
    verification:  false,
  },

  basicDetails: {
    legalName:   '',
    displayName: '',
    email:       '',
    dateOfBirth: '',
    gender:      '',
  },

  professionalBio: '',

  backgroundDeclaration: {
    accurate_info:        false,
    public_venue_only:    false,
    professional_conduct: false,
    no_private_contact:   false,
    safety_policy:        false,
    no_misrepresentation: false,
  },

  experienceCategories: [],
  interestTags:         [],

  workPreference: {
    durations:  [],
    days:       [],
    timeRanges: [],
    frequency:  '',
  },

  city:            '',
  broadAreas:      [],
  willingToTravel: true,

  commActivityPrefs: {
    commStyle:         '',
    activityPace:      '',
    groupPreference:   '',
    accessibilityNote: '',
  },

  venuePreferences: [],
  boundariesAccepted: false,

  // Phase 4B
  sessionRateINR:      0,
  sessionDurationMins: 90,

  spokenLanguages:  [],
  primaryLanguage:  '',
  languageComfort:  [],

  profilePhotoComplete: false,

  selectedIdType: '',

  idSubmittedForReview: false,

  selfieCaptureComplete: false,

  livenessComplete: false,

  // SENSITIVE: residential address — in-memory only
  address: {
    line1:       '',
    line2:       '',
    city:        '',
    state:       '',
    pinCode:     '',
    addressType: 'current_residence',
  },
  addressDetailsComplete: false,
  addressProofSubmitted: false,

  // SENSITIVE: PAN — only masked stored after confirmation
  panName:      '',
  panMasked:    '',
  taxResidency: 'India',
  hasGST:       false,
  gstNumber:    '',
  panConfirmed: false,

  // SENSITIVE: bank — only last 4 digits stored
  bankAccountLast4: '',
  bankName:         '',
  ifscCode:         '',
  accountType:      'savings',
  bankVerified:     false,

  // SENSITIVE: UPI — only masked stored
  upiMasked:   '',
  upiPrimary:  false,
  upiVerified: false,

  // Phase 4C
  profileSetupStarted:           false,
  profileSubmittedForApproval:   false,
  draftSavedAt:                  '',
  verificationStarted:           false,
  verificationStatus:            'not_started',
  verificationRejectionReason:   '',
  verificationResubmitted:       false,
  profileReviewStatus:           'not_submitted',
  profileEditRejectionSections:  [],

  // CPN-046 mode — explicit, not inferred. Default to 'profile_setup'.
  profileChecklistMode: 'profile_setup',

  // CPN-046 correction context — inactive by default
  profileCorrectionContext: DEFAULT_CORRECTION_CONTEXT,

  // Tracks which rejected sections have been corrected in the current correction session
  correctedSections: {},

  // Missing-requirement fix context — inactive by default
  missingRequirementFixContext: DEFAULT_FIX_CONTEXT,

  // Navigator entry routing — defaults to JOURNEY_INTRO (fresh start).
  applicationEntryRoute: Routes.JOURNEY_INTRO,

  // Saved draft resume target — default to APPLICATION_REVIEW_INFO with no params.
  applicationResumeTarget: DEFAULT_RESUME_TARGET,

};


// ─── Completion calculator ────────────────────────────────────────────────────

function calcCompletion(state: Omit<ApplicationState, keyof Pick<ApplicationState,
  'setCurrentStage' | 'setEligibilityConfirmed' | 'updateBasicDetails' | 'setProfessionalBio' |
  'setBackgroundDeclaration' | 'toggleExperienceCategory' | 'toggleInterestTag' | 'updateWorkPreference' |
  'setCity' | 'toggleBroadArea' | 'setWillingToTravel' | 'updateCommActivityPrefs' |
  'toggleVenuePreference' | 'setBoundariesAccepted' | 'recalculateCompletion' | 'resetApplication'
>>): number {
  let done = 0;
  const total = 12; // CPN-021 to CPN-032

  // Journey intro viewed
  if (state.currentStage !== 'not_started') { done++; }

  // Eligibility: all 5 confirmed
  if (Object.values(state.eligibilityConfirmed).every(Boolean)) { done++; }

  // Basic details: legal name, display name, email
  const bd = state.basicDetails;
  if (bd.legalName.trim().length > 1 && bd.displayName.trim().length > 1 && bd.email.trim().length > 3) { done++; }

  // Bio: min 50 chars
  if (state.professionalBio.trim().length >= 50) { done++; }

  // Background declaration: all 6 confirmed
  if (Object.values(state.backgroundDeclaration).every(Boolean)) { done++; }

  // Experience categories: at least 1
  if (state.experienceCategories.length > 0) { done++; }

  // Interest tags: at least 1
  if (state.interestTags.length > 0) { done++; }

  // Work preference: at least 1 duration, 1 day, 1 time range
  const wp = state.workPreference;
  if (wp.durations.length > 0 && wp.days.length > 0 && wp.timeRanges.length > 0) { done++; }

  // City set
  if (state.city.trim().length > 0) { done++; }

  // Comm & activity prefs
  const cap = state.commActivityPrefs;
  if (cap.commStyle && cap.activityPace ) { done++; }

  // Venue preferences: at least 1
  if (state.venuePreferences.length > 0) { done++; }

  // Boundaries accepted
  if (state.boundariesAccepted) { done++; }

  return Math.round((done / total) * 100);
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  ...initialState,

  hydrateOnboardingStatus: (status) =>
    set((s) => {
      const completed = status?.completedModules || [];

      const bgDone = completed.includes('declaration') || completed.includes('eligibility');
      const selfieDone = completed.includes('selfie');
      const idDone = completed.includes('government_id');
      const addressDone = completed.includes('address');
      const panDone = completed.includes('pan');
      const bankDone = completed.includes('bank');
      const upiDone = completed.includes('upi');
      const boundariesDone = completed.includes('boundaries');

      return {
        onboardingStatus: status,
        completionPct: status.profileCompletion,
        verificationStatus: status.verificationStatus as any,
        profileReviewStatus: status.applicationStatus as any,
        draftSavedAt: status.lastUpdated,
        applicationResumeTarget: { route: status.resumeRoute as any },

        idSubmittedForReview: idDone || s.idSubmittedForReview,
        panConfirmed: panDone || s.panConfirmed,
        bankVerified: bankDone || s.bankVerified,
        upiVerified: upiDone || s.upiVerified,
        selfieCaptureComplete: selfieDone || s.selfieCaptureComplete,
        livenessComplete: selfieDone || s.livenessComplete,
        addressDetailsComplete: addressDone || s.addressDetailsComplete,
        boundariesAccepted: boundariesDone || s.boundariesAccepted,

        backgroundDeclaration: bgDone
          ? {
              accurate_info: true,
              public_venue_only: true,
              professional_conduct: true,
              no_private_contact: true,
              safety_policy: true,
              no_misrepresentation: true,
            }
          : s.backgroundDeclaration,
      };
    }),

  hydrateProfileData: (profile) =>
    set((s) => {
      let dobFormatted = s.basicDetails.dateOfBirth;
      if (profile.dateOfBirth) {
        try {
          const d = new Date(profile.dateOfBirth);
          if (!isNaN(d.getTime())) {
            dobFormatted = d.toISOString().split('T')[0];
          }
        } catch {
          // Keep current dob
        }
      }

      return {
        professionalBio: profile.bio || s.professionalBio,
        basicDetails: {
          ...s.basicDetails,
          displayName: profile.displayName || s.basicDetails.displayName,
          email: profile.email || s.basicDetails.email,
          dateOfBirth: dobFormatted,
          gender: profile.gender || s.basicDetails.gender,
        },
        experienceCategories: profile.categories || s.experienceCategories,
        interestTags: profile.interestTags || s.interestTags,
        spokenLanguages: profile.languages || s.spokenLanguages,
        primaryLanguage: profile.primaryLanguage || s.primaryLanguage,
        sessionRateINR: profile.hourlyRate || s.sessionRateINR,
        venuePreferences: profile.serviceAreas || s.venuePreferences,
        workPreference: profile.workPreference ? { ...s.workPreference, ...profile.workPreference } : s.workPreference,
        commActivityPrefs: profile.commActivity ? { ...s.commActivityPrefs, ...profile.commActivity } : s.commActivityPrefs,
        profilePhotoComplete: !!profile.photoUrl || s.profilePhotoComplete,
      };
    }),

  setCurrentStage: (stage) =>
    set((s) => {
      const phase: ApplicationPhase =
        ['journey_intro', 'eligibility', 'basic_details', 'bio_intro'].includes(stage)
          ? 'identity'
          : stage === 'phase_2_complete'
          ? 'financial'
          : 'safety';
      return { currentStage: stage, currentPhase: phase };
    }),

  setEligibilityConfirmed: (id, value) =>
    set((s) => ({
      eligibilityConfirmed: { ...s.eligibilityConfirmed, [id]: value },
    })),

  updateBasicDetails: (updates) =>
    set((s) => ({ basicDetails: { ...s.basicDetails, ...updates } })),

  setProfessionalBio: (bio) => set({ professionalBio: bio }),

  setBackgroundDeclaration: (id, value) =>
    set((s) => ({
      backgroundDeclaration: { ...s.backgroundDeclaration, [id]: value },
    })),

  toggleExperienceCategory: (id) =>
    set((s) => ({
      experienceCategories: s.experienceCategories.includes(id)
        ? s.experienceCategories.filter((c) => c !== id)
        : [...s.experienceCategories, id],
    })),

  toggleInterestTag: (id) =>
    set((s) => {
      if (s.interestTags.includes(id)) {
        return { interestTags: s.interestTags.filter((t) => t !== id) };
      }
      if (s.interestTags.length >= 8) { return s; } // max 8
      return { interestTags: [...s.interestTags, id] };
    }),

  updateWorkPreference: (updates) =>
    set((s) => ({ workPreference: { ...s.workPreference, ...updates } })),

  setCity: (city) => set({ city }),

  toggleBroadArea: (area) =>
    set((s) => ({
      broadAreas: s.broadAreas.includes(area)
        ? s.broadAreas.filter((a) => a !== area)
        : [...s.broadAreas, area],
    })),

  setWillingToTravel: (val) => set({ willingToTravel: val }),

  updateCommActivityPrefs: (updates) =>
    set((s) => ({ commActivityPrefs: { ...s.commActivityPrefs, ...updates } })),

  toggleVenuePreference: (id) =>
    set((s) => ({
      venuePreferences: s.venuePreferences.includes(id)
        ? s.venuePreferences.filter((v) => v !== id)
        : [...s.venuePreferences, id],
    })),

  setBoundariesAccepted: (val) => set({ boundariesAccepted: val }),

  // ─── Phase 4B actions ────────────────────────────────────────────────────

  setPricing: (rateINR, durationMins) => set({ sessionRateINR: rateINR, sessionDurationMins: durationMins }),

  setLanguages: (spoken, primary, comfort) => set({
    spokenLanguages: spoken,
    primaryLanguage: primary,
    languageComfort: comfort,
  }),

  // CPN-035: mark photo accepted — raw URI never enters Zustand
  setProfilePhotoComplete: (val) => set({ profilePhotoComplete: val }),

  setSelectedIdType: (idType) => set({ selectedIdType: idType }),

  setIdSubmitted: (val) => set({ idSubmittedForReview: val }),

  // CPN-038: mark selfie captured — raw file never persisted in Zustand
  // Reset with false on retake; liveness screen clears this when retaking.
  setSelfieCaptureComplete: (val) => set({ selfieCaptureComplete: val }),

  setLivenessComplete: (val) => set({ livenessComplete: val }),

  setAddress: (addr) => set((s) => ({ address: { ...s.address, ...addr } })),
  setAddressDetailsComplete: (val) => set({ addressDetailsComplete: val }),
  setAddressProofSubmitted: (val) => set({ addressProofSubmitted: val }),

  // PAN: name + masked display only — never log raw PAN
  setPANDetails: (name, masked, residency, hasGST, gstNumber) => set({
    panName: name,
    panMasked: masked,
    taxResidency: residency,
    hasGST,
    gstNumber,
  }),
  setPANConfirmed: (val) => set({ panConfirmed: val }),

  // Bank: only last 4 digits after submission
  setBankAccount: (last4, bankName, ifsc, type) => set({
    bankAccountLast4: last4,
    bankName,
    ifscCode: ifsc,
    accountType: type,
  }),
  setBankVerified: (val) => set({ bankVerified: val }),

  // UPI: only masked display after confirmation
  setUPI: (masked, primary) => set({ upiMasked: masked, upiPrimary: primary }),
  setUPIVerified: (val) => set({ upiVerified: val }),

  // ─── Phase 4C actions ────────────────────────────────────────────────────

  setProfileSetupStarted: (val) => set({ profileSetupStarted: val }),

  setProfileSubmittedForApproval: (val) => set({ profileSubmittedForApproval: val }),

  setDraftSaved: (timestamp) => set({ draftSavedAt: timestamp }),

  setVerificationStarted: (val) => set({ verificationStarted: val }),

  setVerificationStatus: (status) => set({ verificationStatus: status }),

  setVerificationRejectionReason: (reason) => set({ verificationRejectionReason: reason }),

  setVerificationResubmitted: (val) => set({ verificationResubmitted: val }),

  setProfileReviewStatus: (status) => set({ profileReviewStatus: status }),

  setProfileEditRejectionSections: (sections) => set({ profileEditRejectionSections: sections }),

  setProfileChecklistMode: (mode) => set({ profileChecklistMode: mode }),

  // CPN-046 correction context
  startProfileCorrection: (section) =>
    set({
      profileCorrectionContext: {
        isActive: true,
        returnRoute: Routes.PROFILE_COMPLETION_CHECKLIST,
        section,
      },
    }),

  completeProfileCorrection: (section) =>
    set((s) => ({
      correctedSections: { ...s.correctedSections, [section]: true },
      // Clear the active context so the edit screen exits cleanly
      profileCorrectionContext: DEFAULT_CORRECTION_CONTEXT,
    })),

  clearProfileCorrection: () =>
    set({
      profileCorrectionContext: DEFAULT_CORRECTION_CONTEXT,
      correctedSections: {},
      // Do NOT clear profileEditRejectionSections or profileChecklistMode here;
      // caller (CPN-046 Review & Resubmit CTA) resets those after navigating.
    }),

  // ─── Missing-requirement fix return system (CPN-047/048/049/051/052/053) ──────
  // Activated before navigating to a missing screen so that the target can return
  // to the calling screen on success instead of continuing the normal forward chain.
  startMissingRequirementFix: (ctx) => {
    if (__DEV__) { console.log('[FIX_FLOW] START', JSON.stringify(ctx)); }
    set({ missingRequirementFixContext: { isActive: true, ...ctx } });
  },

  completeMissingRequirementFix: (requirementKey) => {
    // The requirement itself is marked complete via its own existing store setter.
    // This action clears the fix context so the return route is safely consumed.
    if (__DEV__) { console.log('[FIX_FLOW] COMPLETE key=' + requirementKey); }
    set({ missingRequirementFixContext: DEFAULT_FIX_CONTEXT });
  },

  clearMissingRequirementFix: () => {
    if (__DEV__) { console.log('[FIX_FLOW] CLEAR (cancel/back)'); }
    set({ missingRequirementFixContext: DEFAULT_FIX_CONTEXT });
  },

  setApplicationEntryRoute: (route) => set({ applicationEntryRoute: route }),

  setApplicationResumeTarget: (target) => set({ applicationResumeTarget: target }),

  // ─── Submission readiness selector ──────────────────────────────────────────
  // Delegates to the shared getApplicationReadiness selector so that
  // CPN-047, CPN-049, and CPN-051 all derive from the SAME rules.
  isApplicationReadyForSubmission: () => {
    const s = get();
    const result = getApplicationReadiness(s);
    return { ready: result.ready, missing: result.missing as MandatoryItemResult[] };
  },

  recalculateCompletion: () => {
    // Deprecated: Backend ProgressEngineService now calculates completion.
    // This is handled by hydrateOnboardingStatus via client.ts interceptor.
  },

  resetApplication: () => set({ ...initialState }),

  saveDraftToBackend: async () => {
    try {
      const state = get();
      // Remove functions from state to just send data
      const dataToSave = JSON.parse(JSON.stringify(state));
      const { KycService } = require('../../services/api/services/kyc.service');
      await KycService.saveDraft({ draftData: dataToSave });
    } catch (e) {
      console.warn('Failed to save draft to backend:', e);
    }
  },

  submitApplicationToBackend: async () => {
    try {
      const state = get();
      const dataToSubmit = JSON.parse(JSON.stringify(state));
      const { KycService } = require('../../services/api/services/kyc.service');
      await KycService.submit({ applicationData: dataToSubmit });
    } catch (e) {
      console.warn('Failed to submit application to backend:', e);
      throw e;
    }
  }
}));
