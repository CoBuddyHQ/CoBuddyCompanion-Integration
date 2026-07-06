/**
 * CoBuddy Companion App - Application Navigator (CPN-021 to CPN-050)
 * KYC / Application flow:
 *   Phase 4A (CPN-021 to CPN-032) — COMPLETE
 *   Phase 4B (CPN-033 to CPN-044) — COMPLETE
 *   Phase 4C (CPN-045+)           — PlaceholderScreen
 */
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ApplicationStackParamList} from '../types/navigation.types';
import {Routes} from './routes';
import {defaultStackScreenOptions} from './navigatorOptions';
import PlaceholderScreen from '../screens/states/PlaceholderScreen';
import {useApplicationStore} from '../store/slices/applicationStore';

// ─── Phase 4A screens (CPN-021 to CPN-032) ───────────────────────────────────
import JourneyIntroScreen from '../screens/application/JourneyIntroScreen';
import EligibilityConfirmationScreen from '../screens/application/EligibilityConfirmationScreen';
import BasicDetailsScreen from '../screens/application/BasicDetailsScreen';
import BioIntroductionScreen from '../screens/application/BioIntroductionScreen';
import BackgroundDeclarationScreen from '../screens/application/BackgroundDeclarationScreen';
import ExperienceCategoriesScreen from '../screens/application/ExperienceCategoriesScreen';
import InterestsPersonalityScreen from '../screens/application/InterestsPersonalityScreen';
import WorkPreferenceScreen from '../screens/application/WorkPreferenceScreen';
import CityServiceAreaScreen from '../screens/application/CityServiceAreaScreen';
import CommunicationActivityPreferencesScreen from '../screens/application/CommunicationActivityPreferencesScreen';
import PublicVenuePreferenceScreen from '../screens/application/PublicVenuePreferenceScreen';
import BoundariesSafetyScreen from '../screens/application/BoundariesSafetyScreen';

// ─── Phase 4B screens (CPN-033 to CPN-044) ───────────────────────────────────
import {CompanionPricingScreen} from '../screens/application/CompanionPricingScreen';
import {LanguagesSelectionScreen} from '../screens/application/LanguagesSelectionScreen';
import {ProfilePhotoUploadScreen} from '../screens/application/ProfilePhotoUploadScreen';
import {GovernmentIDTypeScreen} from '../screens/application/GovernmentIDTypeScreen';
import {GovernmentIDUploadScreen} from '../screens/application/GovernmentIDUploadScreen';
import {SelfieCaptureScreen} from '../screens/application/SelfieCaptureScreen';
import {LivenessDetectionScreen} from '../screens/application/LivenessDetectionScreen';
import {AddressVerificationScreen} from '../screens/application/AddressVerificationScreen';
import {PANTaxDetailsScreen} from '../screens/application/PANTaxDetailsScreen';
import {AddBankAccountScreen} from '../screens/application/AddBankAccountScreen';
import {BankAccountVerificationScreen} from '../screens/application/BankAccountVerificationScreen';
import {UPIDetailsScreen} from '../screens/application/UPIDetailsScreen';

// ─── Phase 4C screens (CPN-045 to CPN-050) ──────────────────────────────────
import {ProfileSetupIntroScreen}          from '../screens/application/ProfileSetupIntroScreen';
import {ProfileCompletionChecklistScreen} from '../screens/application/ProfileCompletionChecklistScreen';
import {ApplicationProgressScreen}        from '../screens/application/ApplicationProgressScreen';
import {ApplicationReviewInfoScreen}      from '../screens/application/ApplicationReviewInfoScreen';
import {SubmitProfileForApprovalScreen}   from '../screens/application/SubmitProfileForApprovalScreen';
import {ApplicationSavedDraftScreen}      from '../screens/application/ApplicationSavedDraftScreen';

const Stack = createStackNavigator<ApplicationStackParamList>();

const ApplicationNavigator: React.FC = () => {
  // Read the intended entry route for this mount.
  // Default is Routes.JOURNEY_INTRO for fresh application starts.
  // VerificationNavigator screens set this BEFORE calling setAuthStatus('applying')
  // to control which screen is shown when this navigator mounts.
  const {applicationEntryRoute, setApplicationEntryRoute} = useApplicationStore();

  useEffect(() => {
    // Reset to JOURNEY_INTRO after this mount has consumed the entry route.
    // The next mount will start from JOURNEY_INTRO unless the route is set again
    // before the next setAuthStatus('applying') call.
    if (applicationEntryRoute !== Routes.JOURNEY_INTRO) {
      setApplicationEntryRoute(Routes.JOURNEY_INTRO);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={applicationEntryRoute}
      screenOptions={defaultStackScreenOptions}>

      {/* ── Phase 4A: Application Profile (CPN-021 to CPN-032) ── */}
      <Stack.Screen name={Routes.JOURNEY_INTRO}           component={JourneyIntroScreen} />
      <Stack.Screen name={Routes.ELIGIBILITY_CONFIRMATION} component={EligibilityConfirmationScreen} />
      <Stack.Screen name={Routes.BASIC_DETAILS}           component={BasicDetailsScreen} />
      <Stack.Screen name={Routes.BIO_INTRODUCTION}        component={BioIntroductionScreen} />
      <Stack.Screen name={Routes.BACKGROUND_DECLARATION}  component={BackgroundDeclarationScreen} />
      <Stack.Screen name={Routes.EXPERIENCE_CATEGORIES}   component={ExperienceCategoriesScreen} />
      <Stack.Screen name={Routes.INTERESTS_PERSONALITY}   component={InterestsPersonalityScreen} />
      <Stack.Screen name={Routes.WORK_PREFERENCE}         component={WorkPreferenceScreen} />
      <Stack.Screen name={Routes.CITY_SERVICE_AREA}       component={CityServiceAreaScreen} />
      <Stack.Screen name={Routes.SERVICE_STYLE_PREFERENCES} component={CommunicationActivityPreferencesScreen} />
      <Stack.Screen name={Routes.PUBLIC_VENUE_PREFERENCE} component={PublicVenuePreferenceScreen} />
      <Stack.Screen name={Routes.BOUNDARIES_SAFETY}       component={BoundariesSafetyScreen} />

      {/* ── Phase 4B: Financial & Verification (CPN-033 to CPN-044) ── */}
      <Stack.Screen name={Routes.COMPANION_PRICING}          component={CompanionPricingScreen} />
      <Stack.Screen name={Routes.LANGUAGES_SELECTION}        component={LanguagesSelectionScreen} />
      <Stack.Screen name={Routes.PROFILE_PHOTO_UPLOAD}       component={ProfilePhotoUploadScreen} />
      <Stack.Screen name={Routes.GOVERNMENT_ID_TYPE}         component={GovernmentIDTypeScreen} />
      <Stack.Screen name={Routes.GOVERNMENT_ID_UPLOAD}       component={GovernmentIDUploadScreen} />
      <Stack.Screen name={Routes.SELFIE_CAPTURE}             component={SelfieCaptureScreen} />
      <Stack.Screen name={Routes.LIVENESS_DETECTION}         component={LivenessDetectionScreen} />
      <Stack.Screen name={Routes.ADDRESS_VERIFICATION}       component={AddressVerificationScreen} />
      <Stack.Screen name={Routes.PAN_TAX_DETAILS}            component={PANTaxDetailsScreen} />
      <Stack.Screen name={Routes.ADD_BANK_ACCOUNT}           component={AddBankAccountScreen} />
      <Stack.Screen name={Routes.BANK_ACCOUNT_VERIFICATION}  component={BankAccountVerificationScreen} />
      <Stack.Screen name={Routes.UPI_DETAILS}                component={UPIDetailsScreen} />

      {/* ── Phase 4C: Profile Setup & Draft (CPN-045 to CPN-050) ── */}
      <Stack.Screen name={Routes.PROFILE_SETUP_INTRO}          component={ProfileSetupIntroScreen} />
      <Stack.Screen name={Routes.PROFILE_COMPLETION_CHECKLIST} component={ProfileCompletionChecklistScreen} />
      <Stack.Screen name={Routes.APPLICATION_PROGRESS}          component={ApplicationProgressScreen} />
      <Stack.Screen name={Routes.APPLICATION_REVIEW_INFO}       component={ApplicationReviewInfoScreen} />
      <Stack.Screen name={Routes.SUBMIT_PROFILE_FOR_APPROVAL}   component={SubmitProfileForApprovalScreen} />
      <Stack.Screen name={Routes.APPLICATION_SAVED_DRAFT}       component={ApplicationSavedDraftScreen} />
    </Stack.Navigator>
  );
};

export default ApplicationNavigator;
