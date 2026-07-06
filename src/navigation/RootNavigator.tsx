/**
 * CoBuddy Companion App — Root Navigator
 * Top-level navigator that switches between Auth, Application, and MainApp flows.
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthStore} from '../store/slices/authStore';
import {RootStackParamList} from '../types/navigation.types';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import ApplicationNavigator from './ApplicationNavigator';
import VerificationNavigator from './VerificationNavigator';
import CompanionTabNavigator from './CompanionTabNavigator';
import ProfileStack from './stacks/ProfileStack';
import {Routes} from './routes';
import {defaultStackScreenOptions} from './navigatorOptions';
import PlaceholderScreen from '../screens/states/PlaceholderScreen';
import {AvailabilityCalendarScreen} from '../screens/availability/AvailabilityCalendarScreen';
import {WeeklyRecurringAvailabilityScreen} from '../screens/availability/WeeklyRecurringAvailabilityScreen';
import {BlockTimeDayOffScreen} from '../screens/availability/BlockTimeDayOffScreen';
import {SOSScreen} from '../screens/safety/SOSScreen';
import {SOSConfirmationScreen} from '../screens/safety/SOSConfirmationScreen';
import {SupportCenterScreen} from '../screens/support/SupportCenterScreen';
import {PayoutRequestScreen} from '../screens/earnings/PayoutRequestScreen';
import {PayoutReviewScreen} from '../screens/earnings/PayoutReviewScreen';
import {PayoutSuccessScreen} from '../screens/earnings/PayoutSuccessScreen';
import {PayoutFailedScreen} from '../screens/earnings/PayoutFailedScreen';
import {BankDetailsScreen} from '../screens/settings/BankDetailsScreen';
import {CreateSupportTicketScreen} from '../screens/support/CreateSupportTicketScreen';
import {SupportTicketDetailScreen} from '../screens/support/SupportTicketDetailScreen';
import {BookingRequestsInboxScreen} from '../screens/requests/BookingRequestsInboxScreen';
import {UpcomingSessionsScreen} from '../screens/sessions/UpcomingSessionsScreen';
import {EarningsDashboardScreen} from '../screens/earnings/EarningsDashboardScreen';
import {NewBookingRequestDetailScreen} from '../screens/requests/NewBookingRequestDetailScreen';
import {SessionDetailScreen} from '../screens/sessions/SessionDetailScreen';
import {CompanionSafetyHubScreen} from '../screens/safety/CompanionSafetyHubScreen';
import {CompanionProfileScreen} from '../screens/profile/CompanionProfileScreen';
import {AddAvailabilitySlotScreen}    from '../screens/availability/AddAvailabilitySlotScreen';
import {EditAvailabilitySlotScreen}   from '../screens/availability/EditAvailabilitySlotScreen';
import {AvailabilityConflictScreen}   from '../screens/availability/AvailabilityConflictScreen';
import {LiveAvailabilityToggleScreen} from '../screens/availability/LiveAvailabilityToggleScreen';
import {VacationModeScreen}           from '../screens/availability/VacationModeScreen';
import {CustomerTrustSnapshotScreen}     from '../screens/requests/CustomerTrustSnapshotScreen';
import {SuggestDifferentTimeScreen}      from '../screens/requests/SuggestDifferentTimeScreen';
import {ExpiredBookingRequestScreen}     from '../screens/requests/ExpiredBookingRequestScreen';
import {BookingRequestEmptyStateScreen}  from '../screens/requests/BookingRequestEmptyStateScreen';
import {BookingRequestsFilterScreen}     from '../screens/requests/BookingRequestsFilterScreen';
import {BookingAcceptConfirmationScreen} from '../screens/requests/BookingAcceptConfirmationScreen';
import {BookingAcceptedSuccessScreen}    from '../screens/requests/BookingAcceptedSuccessScreen';
import {BookingRejectReasonScreen}       from '../screens/requests/BookingRejectReasonScreen';
import {BookingDeclinedSuccessScreen}    from '../screens/requests/BookingDeclinedSuccessScreen';
import {AccountSuspendedScreen}          from '../screens/account/AccountSuspendedScreen';
import {AccountDeactivatedScreen}        from '../screens/account/AccountDeactivatedScreen';
import {AccountUnderManualReviewScreen}  from '../screens/account/AccountUnderManualReviewScreen';
import {AccountReactivationRequestScreen} from '../screens/account/AccountReactivationRequestScreen';
import {PolicyViolationNoticeScreen}     from '../screens/account/PolicyViolationNoticeScreen';
import {NetworkErrorScreen}              from '../screens/system/NetworkErrorScreen';
import {MaintenanceModeScreen}           from '../screens/system/MaintenanceModeScreen';
import {ForceUpdateScreen}               from '../screens/system/ForceUpdateScreen';
import {IncomingCallScreen}              from '../screens/sessions/IncomingCallScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {authStatus} = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={defaultStackScreenOptions}>
      {authStatus === 'unauthenticated' ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : authStatus === 'onboarding' ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : authStatus === 'applying' ? (
        <Stack.Screen name="Application" component={ApplicationNavigator} />
      ) : authStatus === 'pending_verification' ? (
        <Stack.Screen name="Verification" component={VerificationNavigator} />
      ) : (
        <Stack.Screen name="MainApp" component={CompanionTabNavigator} />
      )}

      {/* System-level modal screens accessible from anywhere */}
      <Stack.Screen
        name={Routes.ACCOUNT_SUSPENDED}
        component={AccountSuspendedScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.ACCOUNT_DEACTIVATED}
        component={AccountDeactivatedScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.ACCOUNT_UNDER_MANUAL_REVIEW}
        component={AccountUnderManualReviewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.ACCOUNT_REACTIVATION_REQUEST}
        component={AccountReactivationRequestScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.POLICY_VIOLATION_NOTICE}
        component={PolicyViolationNoticeScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.NETWORK_ERROR}
        component={NetworkErrorScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.MAINTENANCE_MODE}
        component={MaintenanceModeScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.FORCE_UPDATE}
        component={ForceUpdateScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.INCOMING_CALL}
        component={IncomingCallScreen}
        options={{headerShown: false, gestureEnabled: false, presentation: 'modal'}}
      />
      {/* ── Global cross-tab screens ── */}
      <Stack.Screen
        name={Routes.AVAILABILITY_CALENDAR}
        component={AvailabilityCalendarScreen}
        options={{headerShown: false, presentation: 'modal'}}
      />
      <Stack.Screen
        name={Routes.WEEKLY_RECURRING_AVAILABILITY}
        component={WeeklyRecurringAvailabilityScreen}
        options={{headerShown: false, presentation: 'modal'}}
      />
      <Stack.Screen
        name={Routes.BLOCK_TIME_DAY_OFF}
        component={BlockTimeDayOffScreen}
        options={{headerShown: false, presentation: 'modal'}}
      />
      <Stack.Screen
        name={Routes.VACATION_MODE}
        component={VacationModeScreen}
        options={{headerShown: false}}
      />
      {/* ── Global SOS modals — reachable from any screen ── */}
      <Stack.Screen
        name={Routes.SOS}
        component={SOSScreen}
        options={{headerShown: false, gestureEnabled: false, presentation: 'modal'}}
      />
      <Stack.Screen
        name={Routes.SOS_CONFIRMATION}
        component={SOSConfirmationScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      {/* ── Global Support screen — reachable from any tab ── */}
      <Stack.Screen
        name={Routes.SUPPORT_CENTER}
        component={SupportCenterScreen}
        options={{headerShown: false}}
      />
      {/* ── Global earnings/support screens — reachable from Quick Actions ── */}
      <Stack.Screen
        name={Routes.PAYOUT_REQUEST}
        component={PayoutRequestScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.PAYOUT_REVIEW}
        component={PayoutReviewScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.PAYOUT_SUCCESS}
        component={PayoutSuccessScreen as any}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.PAYOUT_FAILED}
        component={PayoutFailedScreen as any}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={Routes.BANK_DETAILS}
        component={BankDetailsScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.CREATE_SUPPORT_TICKET}
        component={CreateSupportTicketScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.SUPPORT_TICKET_DETAIL}
        component={SupportTicketDetailScreen as any}
        options={{headerShown: false}}
      />
      {/* ── Global cross-tab screens — wired from HomeDashboard and other hubs ── */}
      <Stack.Screen
        name={Routes.BOOKING_REQUESTS_INBOX}
        component={BookingRequestsInboxScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.UPCOMING_SESSIONS}
        component={UpcomingSessionsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.EARNINGS_DASHBOARD}
        component={EarningsDashboardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.NEW_BOOKING_REQUEST_DETAIL}
        component={NewBookingRequestDetailScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.SESSION_DETAIL}
        component={SessionDetailScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.COMPANION_SAFETY_HUB}
        component={CompanionSafetyHubScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.COMPANION_PROFILE}
        component={CompanionProfileScreen}
        options={{headerShown: false}}
      />
      {/* Global standalone stack for Profile/Safety accessed without switching tabs */}
      <Stack.Screen
        name="GlobalProfileStack"
        component={ProfileStack}
        options={{headerShown: false}}
      />
      {/* ── Availability sub-screens — reachable from Calendar (global modal) ── */}
      <Stack.Screen
        name={Routes.ADD_AVAILABILITY_SLOT}
        component={AddAvailabilitySlotScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.EDIT_AVAILABILITY_SLOT}
        component={EditAvailabilitySlotScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.AVAILABILITY_CONFLICT}
        component={AvailabilityConflictScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.LIVE_AVAILABILITY_TOGGLE}
        component={LiveAvailabilityToggleScreen}
        options={{headerShown: false}}
      />
      {/* ── Booking Request sub-screens (globally accessible) ── */}
      <Stack.Screen
        name={Routes.CUSTOMER_TRUST_SNAPSHOT}
        component={CustomerTrustSnapshotScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.SUGGEST_DIFFERENT_TIME}
        component={SuggestDifferentTimeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.EXPIRED_BOOKING_REQUEST}
        component={ExpiredBookingRequestScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.BOOKING_REQUEST_EMPTY_STATE}
        component={BookingRequestEmptyStateScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.BOOKING_REQUESTS_FILTER}
        component={BookingRequestsFilterScreen as any}
        options={{headerShown: false, presentation: 'modal'}}
      />
      {/* ── Booking request flow screens (globally promoted so screens outside RequestsStack can navigate to them) ── */}
      <Stack.Screen
        name={Routes.BOOKING_ACCEPT_CONFIRMATION}
        component={BookingAcceptConfirmationScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.BOOKING_ACCEPTED_SUCCESS}
        component={BookingAcceptedSuccessScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.BOOKING_REJECT_REASON}
        component={BookingRejectReasonScreen as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.BOOKING_DECLINED_SUCCESS}
        component={BookingDeclinedSuccessScreen as any}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
