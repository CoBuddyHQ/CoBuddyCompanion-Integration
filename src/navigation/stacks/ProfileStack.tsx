/**
 * CoBuddy Companion App - Profile Stack (CPN-175 to CPN-195)
 * Also hosts:
 *   Safety (CPN-121–136)    — Profile > Safety Hub / Trusted Contacts
 *   Reviews & Trust (CPN-156–161) — Profile > Reviews & Trust card
 *   Training (CPN-162–164)  — Profile > Training & Development
 *   Support & Disputes (CPN-166–174) — Profile > Help & Support
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProfileStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import PlaceholderScreen from '../../screens/states/PlaceholderScreen';
import {SupportCenterScreen} from '../../screens/support/SupportCenterScreen';
import {CreateSupportTicketScreen} from '../../screens/support/CreateSupportTicketScreen';
import {SupportTicketDetailScreen} from '../../screens/support/SupportTicketDetailScreen';
import {LiveSupportChatScreen} from '../../screens/support/LiveSupportChatScreen';
import {HelpArticleScreen} from '../../screens/support/HelpArticleScreen';
import {DisputeCenterScreen} from '../../screens/support/DisputeCenterScreen';
import {DisputeDetailScreen} from '../../screens/support/DisputeDetailScreen';
import {AppealDecisionScreen} from '../../screens/support/AppealDecisionScreen';
import {TrainingHubScreen} from '../../screens/training/TrainingHubScreen';
import {TrainingLessonScreen} from '../../screens/training/TrainingLessonScreen';
import {TrainingCompletedScreen} from '../../screens/training/TrainingCompletedScreen';
import {CompanionProfileScreen} from '../../screens/profile/CompanionProfileScreen';
import {PolicyCenterScreen} from '../../screens/settings/PolicyCenterScreen';
import {EditBioScreen} from '../../screens/profile/EditBioScreen';
import {EditCategoriesScreen} from '../../screens/profile/EditCategoriesScreen';
import {EditLanguagesScreen} from '../../screens/profile/EditLanguagesScreen';
import {EditPricingScreen} from '../../screens/profile/EditPricingScreen';
import {ProfilePreviewScreen} from '../../screens/profile/ProfilePreviewScreen';
import {EditServiceAreasScreen} from '../../screens/profile/EditServiceAreasScreen';
import {ServiceAreaMapScreen} from '../../screens/profile/ServiceAreaMapScreen';
import {TravelRadiusPreferenceScreen} from '../../screens/profile/TravelRadiusPreferenceScreen';
// EditPhotosScreen removed — using GalleryPhotoManagerScreen
import {ReviewsDashboardScreen} from '../../screens/reviews/ReviewsDashboardScreen';
import {ReviewDetailScreen} from '../../screens/profile/ReviewDetailScreen';
import {TrustScoreDashboardScreen} from '../../screens/profile/TrustScoreDashboardScreen';
import {TrustScoreSummaryScreen} from '../../screens/profile/TrustScoreSummaryScreen';
import {TrustScoreImprovementTasksScreen} from '../../screens/profile/TrustScoreImprovementTasksScreen';
import {BadgesAchievementsScreen} from '../../screens/profile/BadgesAchievementsScreen';
import {EditBasicProfileScreen} from '../../screens/profile/EditBasicProfileScreen';
import {AccountSettingsScreen} from '../../screens/settings/AccountSettingsScreen';
import {GalleryPhotoManagerScreen} from '../../screens/profile/GalleryPhotoManagerScreen';
import {CompanionSafetyHubScreen} from '../../screens/safety/CompanionSafetyHubScreen';
import {BankDetailsScreen} from '../../screens/settings/BankDetailsScreen';
import {PrivacyControlsScreen} from '../../screens/settings/PrivacyControlsScreen';
import {AppLanguageSettingsScreen} from '../../screens/settings/AppLanguageSettingsScreen';
import {AccessibilitySettingsScreen} from '../../screens/settings/AccessibilitySettingsScreen';
import {LegalAgreementsScreen} from '../../screens/settings/LegalAgreementsScreen';
import {DataDownloadScreen} from '../../screens/settings/DataDownloadScreen';
import {DeleteAccountScreen} from '../../screens/settings/DeleteAccountScreen';
import {ChangePinScreen} from '../../screens/settings/ChangePinScreen';
import {NotificationPreferencesScreen} from '../../screens/settings/NotificationPreferencesScreen';
import {SafetyTimerScreen} from '../../screens/safety/SafetyTimerScreen';
import {SOSScreen} from '../../screens/safety/SOSScreen';
import {SOSConfirmationScreen} from '../../screens/safety/SOSConfirmationScreen';
import {SafetyGuidelinesScreen} from '../../screens/safety/SafetyGuidelinesScreen';
import {PublicVenueRulesScreen} from '../../screens/safety/PublicVenueRulesScreen';
import {TrustedContactsScreen} from '../../screens/safety/TrustedContactsScreen';
import {AddTrustedContactScreen} from '../../screens/safety/AddTrustedContactScreen';
import {EditTrustedContactScreen} from '../../screens/safety/EditTrustedContactScreen';
import {EmergencyContactSetupScreen} from '../../screens/safety/EmergencyContactSetupScreen';
import {SafetyQuizScreen} from '../../screens/safety/SafetyQuizScreen';
import {BlockCustomerScreen} from '../../screens/safety/BlockCustomerScreen';
import {ReportCustomerScreen} from '../../screens/safety/ReportCustomerScreen';
import {IncidentReportScreen} from '../../screens/safety/IncidentReportScreen';
import {IncidentEvidenceUploadScreen} from '../../screens/safety/IncidentEvidenceUploadScreen';
import {IncidentSubmittedScreen} from '../../screens/safety/IncidentSubmittedScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    {/* ── Profile (CPN-175–186) ── */}
    <Stack.Screen name={Routes.COMPANION_PROFILE} component={CompanionProfileScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PROFILE_PREVIEW} component={ProfilePreviewScreen} options={{headerShown: false}} />
    {/* ── Reviews & Trust (CPN-156–161) ── */}
    <Stack.Screen name={Routes.REVIEWS_DASHBOARD} component={ReviewsDashboardScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.REVIEW_DETAIL} component={ReviewDetailScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRUST_SCORE_DASHBOARD} component={TrustScoreDashboardScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRUST_SCORE_SUMMARY} component={TrustScoreSummaryScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRUST_SCORE_IMPROVEMENT_TASKS} component={TrustScoreImprovementTasksScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.BADGES_ACHIEVEMENTS} component={BadgesAchievementsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_BASIC_PROFILE} component={EditBasicProfileScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_BIO} component={EditBioScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_CATEGORIES} component={EditCategoriesScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_LANGUAGES} component={EditLanguagesScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_SERVICE_AREAS} component={EditServiceAreasScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_PRICING} component={EditPricingScreen} options={{headerShown: false}} />
    {/* EDIT_PHOTOS route removed — Gallery managed via GALLERY_PHOTO_MANAGER */}
    <Stack.Screen name={Routes.GALLERY_PHOTO_MANAGER} component={GalleryPhotoManagerScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRAVEL_RADIUS_PREFERENCE} component={TravelRadiusPreferenceScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SERVICE_AREA_MAP} component={ServiceAreaMapScreen} options={{headerShown: false}} />

    {/* ── Settings (CPN-187–195) ── */}
    <Stack.Screen name={Routes.ACCOUNT_SETTINGS} component={AccountSettingsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.NOTIFICATION_PREFERENCES} component={NotificationPreferencesScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PRIVACY_CONTROLS} component={PrivacyControlsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.LANGUAGE_SETTINGS} component={AppLanguageSettingsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.ACCESSIBILITY_TEXT_SIZE} component={AccessibilitySettingsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.POLICY_CENTER} component={PolicyCenterScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.LEGAL_AGREEMENTS} component={LegalAgreementsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.DATA_DOWNLOAD} component={DataDownloadScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.DELETE_ACCOUNT} component={DeleteAccountScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.BANK_DETAILS} component={BankDetailsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CHANGE_PIN} component={ChangePinScreen} options={{headerShown: false}} />

    {/* ── Safety (CPN-121–136) — Profile > Safety Hub ── */}
    <Stack.Screen name={Routes.COMPANION_SAFETY_HUB} component={CompanionSafetyHubScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SAFETY_TIMER} component={SafetyTimerScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SOS} component={SOSScreen}
      options={{headerShown: false, gestureEnabled: false, presentation: 'modal'}} />
    <Stack.Screen name={Routes.SOS_CONFIRMATION} component={SOSConfirmationScreen}
      options={{headerShown: false, gestureEnabled: false}} />
    <Stack.Screen name={Routes.SAFETY_GUIDELINES} component={SafetyGuidelinesScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PUBLIC_VENUE_RULES} component={PublicVenueRulesScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SAFETY_QUIZ} component={SafetyQuizScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EMERGENCY_CONTACT_SETUP} component={EmergencyContactSetupScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRUSTED_CONTACTS} component={TrustedContactsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.ADD_TRUSTED_CONTACT} component={AddTrustedContactScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_TRUSTED_CONTACT} component={EditTrustedContactScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.BLOCK_CUSTOMER} component={BlockCustomerScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.REPORT_CUSTOMER} component={ReportCustomerScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.INCIDENT_REPORT} component={IncidentReportScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.INCIDENT_EVIDENCE_UPLOAD} component={IncidentEvidenceUploadScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.INCIDENT_SUBMITTED} component={IncidentSubmittedScreen}
      options={{headerShown: false, gestureEnabled: false}} />

    {/* Reviews & Trust screens moved to top of stack (lines 79–85) */}

    {/* ── Training (CPN-162–164) — Profile > Training ── */}
    <Stack.Screen name={Routes.TRAINING_HUB} component={TrainingHubScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRAINING_LESSON} component={TrainingLessonScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TRAINING_COMPLETED} component={TrainingCompletedScreen}
      options={{headerShown: false, gestureEnabled: false}} />

    {/* ── Support & Disputes (CPN-166–174) — Profile > Help & Support ── */}
    <Stack.Screen name={Routes.SUPPORT_CENTER} component={SupportCenterScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CREATE_SUPPORT_TICKET} component={CreateSupportTicketScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SUPPORT_TICKET_DETAIL} component={SupportTicketDetailScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.LIVE_SUPPORT_CHAT} component={LiveSupportChatScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.HELP_ARTICLE} component={HelpArticleScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.DISPUTE_CENTER} component={DisputeCenterScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.DISPUTE_DETAIL} component={DisputeDetailScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.APPEAL_DECISION} component={AppealDecisionScreen} options={{headerShown: false}} />
  </Stack.Navigator>
);

export default ProfileStack;

