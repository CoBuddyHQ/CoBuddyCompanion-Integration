/**
 * CoBuddy Companion App - Sessions Stack (CPN-096 to CPN-120)
 * Also hosts Safety screens (CPN-121–136), reachable from active session flows
 * (SOS, safety timer, incident report, block/report customer).
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SessionsStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import PlaceholderScreen from '../../screens/states/PlaceholderScreen';
import {UpcomingSessionsScreen} from '../../screens/sessions/UpcomingSessionsScreen';
import {SessionDetailScreen} from '../../screens/sessions/SessionDetailScreen';
import {DigitalSessionPassScreen} from '../../screens/sessions/DigitalSessionPassScreen';
import {SessionPrepChecklistScreen} from '../../screens/sessions/SessionPrepChecklistScreen';
import {CustomerProfileSafetySummaryScreen} from '../../screens/sessions/CustomerProfileSafetySummaryScreen';
import {ArrivalCheckInScreen} from '../../screens/sessions/ArrivalCheckInScreen';
import {ActiveSessionScreen} from '../../screens/sessions/ActiveSessionScreen';
import {SessionCompleteScreen} from '../../screens/sessions/SessionCompleteScreen';
import {SessionReminderScreen} from '../../screens/sessions/SessionReminderScreen';
import {VenueMeetingPointDetailScreen} from '../../screens/sessions/VenueMeetingPointDetailScreen';
import {NavigationToVenueScreen} from '../../screens/sessions/NavigationToVenueScreen';
import {PreArrivalScreen} from '../../screens/sessions/PreArrivalScreen';
import {CustomerArrivalVerificationScreen} from '../../screens/sessions/CustomerArrivalVerificationScreen';
import {InSessionChatScreen} from '../../screens/sessions/InSessionChatScreen';
import {InSessionCallScreen} from '../../screens/sessions/InSessionCallScreen';
import {LiveLocationSharingScreen} from '../../screens/sessions/LiveLocationSharingScreen';
import {ExtendSessionRequestScreen} from '../../screens/sessions/ExtendSessionRequestScreen';
import {ExtendSessionConfirmationScreen} from '../../screens/sessions/ExtendSessionConfirmationScreen';
import {EarlyEndSessionScreen} from '../../screens/sessions/EarlyEndSessionScreen';
import {CancelSessionRequestScreen} from '../../screens/sessions/CancelSessionRequestScreen';
import {CancellationReasonScreen} from '../../screens/sessions/CancellationReasonScreen';
import {CancellationReviewPendingScreen} from '../../screens/sessions/CancellationReviewPendingScreen';
import {CustomerNoShowScreen} from '../../screens/sessions/CustomerNoShowScreen';
import {PostSessionNotesScreen} from '../../screens/sessions/PostSessionNotesScreen';
import {CustomerRatingFeedbackScreen} from '../../screens/sessions/CustomerRatingFeedbackScreen';
import {SafetyTimerScreen} from '../../screens/safety/SafetyTimerScreen';
import {SOSScreen} from '../../screens/safety/SOSScreen';
import {SOSConfirmationScreen} from '../../screens/safety/SOSConfirmationScreen';
import {SafetyGuidelinesScreen} from '../../screens/safety/SafetyGuidelinesScreen';
import {PublicVenueRulesScreen} from '../../screens/safety/PublicVenueRulesScreen';
import {CompanionSafetyHubScreen} from '../../screens/safety/CompanionSafetyHubScreen';
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
import {SupportCenterScreen} from '../../screens/support/SupportCenterScreen';

const Stack = createStackNavigator<SessionsStackParamList>();

const SessionsStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    {/* ── Sessions (CPN-096–120) ── */}
    <Stack.Screen name={Routes.UPCOMING_SESSIONS} component={UpcomingSessionsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SESSION_DETAIL} component={SessionDetailScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.DIGITAL_SESSION_PASS} component={DigitalSessionPassScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SESSION_REMINDER} component={SessionReminderScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SESSION_PREP_CHECKLIST} component={SessionPrepChecklistScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CUSTOMER_PROFILE_SAFETY_SUMMARY} component={CustomerProfileSafetySummaryScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.VENUE_MEETING_POINT_DETAIL} component={VenueMeetingPointDetailScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.NAVIGATION_TO_VENUE} component={NavigationToVenueScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PRE_ARRIVAL} component={PreArrivalScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.ARRIVAL_CHECK_IN} component={ArrivalCheckInScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CUSTOMER_ARRIVAL_VERIFICATION} component={CustomerArrivalVerificationScreen} options={{headerShown: false}} />
    <Stack.Screen
      name={Routes.ACTIVE_SESSION}
      component={ActiveSessionScreen}
      options={{headerShown: false, gestureEnabled: false, headerLeft: () => null}}
    />
    <Stack.Screen name={Routes.IN_SESSION_CHAT} component={InSessionChatScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.IN_SESSION_CALL} component={InSessionCallScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.LIVE_LOCATION_SHARING} component={LiveLocationSharingScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EXTEND_SESSION_REQUEST} component={ExtendSessionRequestScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EXTEND_SESSION_CONFIRMATION} component={ExtendSessionConfirmationScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.EARLY_END_SESSION} component={EarlyEndSessionScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CANCEL_SESSION_REQUEST} component={CancelSessionRequestScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CANCELLATION_REASON} component={CancellationReasonScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.CANCELLATION_REVIEW_PENDING} component={CancellationReviewPendingScreen}
      options={{headerShown: false, gestureEnabled: false}} />
    <Stack.Screen name={Routes.CUSTOMER_NO_SHOW} component={CustomerNoShowScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.POST_SESSION_NOTES} component={PostSessionNotesScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SESSION_COMPLETE} component={SessionCompleteScreen} options={{headerShown: false, gestureEnabled: false}} />
    <Stack.Screen name={Routes.CUSTOMER_RATING_FEEDBACK} component={CustomerRatingFeedbackScreen}
      options={{headerShown: false, gestureEnabled: false}} />

    {/* ── Safety (CPN-121–136) — triggered from session context ── */}
    <Stack.Screen name={Routes.COMPANION_SAFETY_HUB} component={CompanionSafetyHubScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.SUPPORT_CENTER} component={SupportCenterScreen} options={{headerShown: false}} />
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
  </Stack.Navigator>
);

export default SessionsStack;


