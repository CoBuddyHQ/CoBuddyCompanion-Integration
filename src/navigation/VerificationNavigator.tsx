/**
 * CoBuddy Companion App - Verification Navigator (CPN-051 to CPN-059)
 * Phase 4C — Verification pipeline + Profile review status screens.
 *
 * Phase 4A/4B fix-target screens are also registered here so that VerificationHubScreen
 * can launch them as missing-requirement fix flows directly within this stack.
 * This avoids cross-stack navigation and eliminates "NAVIGATE not handled" errors.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {VerificationStackParamList} from '../types/navigation.types';
import {Routes} from './routes';
import {defaultStackScreenOptions} from './navigatorOptions';

// ─── Phase 4C: Verification Pipeline (CPN-051 to CPN-056) ────────────────────
import {VerificationHubScreen}        from '../screens/application/VerificationHubScreen';
import {VerificationPendingScreen}    from '../screens/application/VerificationPendingScreen';
import {VerificationProcessingScreen} from '../screens/application/VerificationProcessingScreen';
import {VerificationApprovedScreen}   from '../screens/application/VerificationApprovedScreen';
import {VerificationRejectedScreen}   from '../screens/application/VerificationRejectedScreen';
import {ResubmitVerificationScreen}   from '../screens/application/ResubmitVerificationScreen';

// ─── Phase 4C: Profile Review Status (CPN-057 to CPN-059) ────────────────────
import {ProfileReviewPendingScreen}     from '../screens/application/ProfileReviewPendingScreen';
import {ProfileApprovedPublishedScreen} from '../screens/application/ProfileApprovedPublishedScreen';
import {ProfileEditRejectedScreen}      from '../screens/application/ProfileEditRejectedScreen';

// ─── Phase 4A fix-target screens (CPN-021 to CPN-032) ────────────────────────
// Default exports
import BasicDetailsScreen              from '../screens/application/BasicDetailsScreen';
import BioIntroductionScreen           from '../screens/application/BioIntroductionScreen';
import BackgroundDeclarationScreen     from '../screens/application/BackgroundDeclarationScreen';
import InterestsPersonalityScreen      from '../screens/application/InterestsPersonalityScreen';
import WorkPreferenceScreen            from '../screens/application/WorkPreferenceScreen';
import CityServiceAreaScreen           from '../screens/application/CityServiceAreaScreen';
import PublicVenuePreferenceScreen     from '../screens/application/PublicVenuePreferenceScreen';
import BoundariesSafetyScreen          from '../screens/application/BoundariesSafetyScreen';
import CommunicationActivityPreferencesScreen from '../screens/application/CommunicationActivityPreferencesScreen';
// Named exports
import {LanguagesSelectionScreen}      from '../screens/application/LanguagesSelectionScreen';
import {ProfilePhotoUploadScreen}      from '../screens/application/ProfilePhotoUploadScreen';
import ExperienceCategoriesScreen      from '../screens/application/ExperienceCategoriesScreen';

// ─── Phase 4B fix-target screens (CPN-033 to CPN-044) ────────────────────────
import {CompanionPricingScreen}        from '../screens/application/CompanionPricingScreen';
import {GovernmentIDTypeScreen}        from '../screens/application/GovernmentIDTypeScreen';
import {GovernmentIDUploadScreen}      from '../screens/application/GovernmentIDUploadScreen';
import {SelfieCaptureScreen}           from '../screens/application/SelfieCaptureScreen';
import {LivenessDetectionScreen}       from '../screens/application/LivenessDetectionScreen';
import {AddressVerificationScreen}     from '../screens/application/AddressVerificationScreen';
import {PANTaxDetailsScreen}           from '../screens/application/PANTaxDetailsScreen';
import {AddBankAccountScreen}          from '../screens/application/AddBankAccountScreen';
import {BankAccountVerificationScreen} from '../screens/application/BankAccountVerificationScreen';
import {UPIDetailsScreen}              from '../screens/application/UPIDetailsScreen';
import {ApplicationSavedDraftScreen}   from '../screens/application/ApplicationSavedDraftScreen';
import {ApplicationReviewInfoScreen}   from '../screens/application/ApplicationReviewInfoScreen';
import {SubmitProfileForApprovalScreen} from '../screens/application/SubmitProfileForApprovalScreen';
import {ProfileSetupIntroScreen}        from '../screens/application/ProfileSetupIntroScreen';
import {ProfileCompletionChecklistScreen} from '../screens/application/ProfileCompletionChecklistScreen';
import {ApplicationProgressScreen}      from '../screens/application/ApplicationProgressScreen';

const Stack = createStackNavigator<VerificationStackParamList>();





const VerificationNavigator: React.FC = () => (
  // Initial screen is VERIFICATION_HUB (CPN-051):
  // Companion arrives here after submitting profile (CPN-049) via setAuthStatus('pending_verification').
  // The hub shows the document verification checklist. After all documents are submitted:
  //   CPN-051 → CPN-052 → CPN-053 → CPN-054 (approved) → CPN-057
  //                               ↘ CPN-055 (rejected) → CPN-056 → CPN-052
  // CPN-057 ProfileReviewPending is reached AFTER document verification is processed.
  <Stack.Navigator
    initialRouteName={Routes.VERIFICATION_HUB}
    screenOptions={defaultStackScreenOptions}>

    {/* ── CPN-051: Verification Hub ── */}
    <Stack.Screen name={Routes.VERIFICATION_HUB}           component={VerificationHubScreen} />
    {/* ── CPN-052: Verification Pending ── */}
    <Stack.Screen name={Routes.VERIFICATION_PENDING}       component={VerificationPendingScreen} />
    {/* ── CPN-053: Verification Processing ── */}
    <Stack.Screen name={Routes.VERIFICATION_PROCESSING}    component={VerificationProcessingScreen} />
    {/* ── CPN-054: Verification Approved ── */}
    <Stack.Screen name={Routes.VERIFICATION_APPROVED}      component={VerificationApprovedScreen} />
    {/* ── CPN-055: Verification Rejected ── */}
    <Stack.Screen name={Routes.VERIFICATION_REJECTED}      component={VerificationRejectedScreen} />
    {/* ── CPN-056: Resubmit Verification ── */}
    <Stack.Screen name={Routes.RESUBMIT_VERIFICATION}      component={ResubmitVerificationScreen} />
    {/* ── CPN-057: Profile Review Pending ── */}
    <Stack.Screen name={Routes.PROFILE_REVIEW_PENDING}     component={ProfileReviewPendingScreen} />
    {/* ── CPN-058: Profile Approved & Published ── */}
    <Stack.Screen name={Routes.PROFILE_APPROVED_PUBLISHED} component={ProfileApprovedPublishedScreen} />
    {/* ── CPN-059: Profile Edit Rejected ── */}
    <Stack.Screen name={Routes.PROFILE_EDIT_REJECTED}      component={ProfileEditRejectedScreen} />

    {/* ── Phase 4A fix-target screens (missing-requirement fix flows from VerificationHub) ── */}
    {/* CPN-022: Basic Details */}
    <Stack.Screen name={Routes.BASIC_DETAILS}              component={BasicDetailsScreen} />
    {/* CPN-023: Bio Introduction */}
    <Stack.Screen name={Routes.BIO_INTRODUCTION}           component={BioIntroductionScreen} />
    {/* CPN-025: Background Declaration */}
    <Stack.Screen name={Routes.BACKGROUND_DECLARATION}     component={BackgroundDeclarationScreen} />
    {/* CPN-026: Experience Categories */}
    <Stack.Screen name={Routes.EXPERIENCE_CATEGORIES}      component={ExperienceCategoriesScreen} />
    {/* CPN-027: Interests & Personality */}
    <Stack.Screen name={Routes.INTERESTS_PERSONALITY}      component={InterestsPersonalityScreen} />
    {/* CPN-028: Work Preference */}
    <Stack.Screen name={Routes.WORK_PREFERENCE}            component={WorkPreferenceScreen} />
    {/* CPN-029: City & Service Area */}
    <Stack.Screen name={Routes.CITY_SERVICE_AREA}          component={CityServiceAreaScreen} />
    {/* CPN-030: Communication & Activity Preferences (comm_activity key) */}
    <Stack.Screen name={Routes.SERVICE_STYLE_PREFERENCES}  component={CommunicationActivityPreferencesScreen} />
    {/* CPN-031: Public Venue Preference */}
    <Stack.Screen name={Routes.PUBLIC_VENUE_PREFERENCE}    component={PublicVenuePreferenceScreen} />
    {/* CPN-032: Boundaries & Safety */}
    <Stack.Screen name={Routes.BOUNDARIES_SAFETY}          component={BoundariesSafetyScreen} />
    {/* CPN-034: Languages Selection */}
    <Stack.Screen name={Routes.LANGUAGES_SELECTION}        component={LanguagesSelectionScreen} />
    {/* CPN-035: Profile Photo Upload */}
    <Stack.Screen name={Routes.PROFILE_PHOTO_UPLOAD}       component={ProfilePhotoUploadScreen} />

    {/* ── Phase 4B fix-target screens (missing-requirement fix flows from VerificationHub) ── */}
    {/* CPN-033: Companion Pricing */}
    <Stack.Screen name={Routes.COMPANION_PRICING}          component={CompanionPricingScreen} />
    {/* CPN-036: Government ID Type */}
    <Stack.Screen name={Routes.GOVERNMENT_ID_TYPE}         component={GovernmentIDTypeScreen} />
    {/* CPN-037: Government ID Upload */}
    <Stack.Screen name={Routes.GOVERNMENT_ID_UPLOAD}       component={GovernmentIDUploadScreen} />
    {/* CPN-038: Selfie Capture */}
    <Stack.Screen name={Routes.SELFIE_CAPTURE}             component={SelfieCaptureScreen} />
    {/* CPN-039: Liveness Detection */}
    <Stack.Screen name={Routes.LIVENESS_DETECTION}         component={LivenessDetectionScreen} />
    {/* CPN-040: Address Verification */}
    <Stack.Screen name={Routes.ADDRESS_VERIFICATION}       component={AddressVerificationScreen} />
    {/* CPN-041: PAN / Tax Details */}
    <Stack.Screen name={Routes.PAN_TAX_DETAILS}            component={PANTaxDetailsScreen} />
    {/* CPN-043: Add Bank Account */}
    <Stack.Screen name={Routes.ADD_BANK_ACCOUNT}           component={AddBankAccountScreen} />
    {/* CPN-042: Bank Account Verification */}
    <Stack.Screen name={Routes.BANK_ACCOUNT_VERIFICATION}  component={BankAccountVerificationScreen} />
    {/* CPN-044: UPI Details */}
    <Stack.Screen name={Routes.UPI_DETAILS}                component={UPIDetailsScreen} />
    {/* CPN-050: Application Saved Draft */}
    <Stack.Screen name={Routes.APPLICATION_SAVED_DRAFT as any} component={ApplicationSavedDraftScreen as any} />
    {/* Phase 4C resume screens */}
    <Stack.Screen name={Routes.APPLICATION_REVIEW_INFO as any} component={ApplicationReviewInfoScreen as any} />
    <Stack.Screen name={Routes.SUBMIT_PROFILE_FOR_APPROVAL as any} component={SubmitProfileForApprovalScreen as any} />
    <Stack.Screen name={Routes.PROFILE_SETUP_INTRO as any} component={ProfileSetupIntroScreen as any} />
    <Stack.Screen name={Routes.PROFILE_COMPLETION_CHECKLIST as any} component={ProfileCompletionChecklistScreen as any} />
    <Stack.Screen name={Routes.APPLICATION_PROGRESS as any} component={ApplicationProgressScreen as any} />
  </Stack.Navigator>
);




export default VerificationNavigator;
