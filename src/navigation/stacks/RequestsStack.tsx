/**
 * CoBuddy Companion App - Requests Stack (CPN-081 to CPN-090)
 * NOTE: CUSTOMER_TRUST_SNAPSHOT, SUGGEST_DIFFERENT_TIME,
 *       EXPIRED_BOOKING_REQUEST, BOOKING_REQUEST_EMPTY_STATE
 *       are registered globally in RootNavigator — DO NOT add them here.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RequestsStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import {BookingRequestsInboxScreen} from '../../screens/requests/BookingRequestsInboxScreen';
import {NewBookingRequestDetailScreen} from '../../screens/requests/NewBookingRequestDetailScreen';
import {BookingAcceptConfirmationScreen} from '../../screens/requests/BookingAcceptConfirmationScreen';
import {BookingAcceptedSuccessScreen} from '../../screens/requests/BookingAcceptedSuccessScreen';
import {BookingRejectReasonScreen} from '../../screens/requests/BookingRejectReasonScreen';
import {BookingDeclinedSuccessScreen} from '../../screens/requests/BookingDeclinedSuccessScreen';

const Stack = createStackNavigator<RequestsStackParamList>();

const RequestsStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions} initialRouteName={Routes.BOOKING_REQUESTS_INBOX}>
    <Stack.Screen name={Routes.BOOKING_REQUESTS_INBOX}    component={BookingRequestsInboxScreen}        options={{headerShown: false}} />
    <Stack.Screen name={Routes.NEW_BOOKING_REQUEST_DETAIL} component={NewBookingRequestDetailScreen}    options={{headerShown: false}} />
    <Stack.Screen name={Routes.BOOKING_ACCEPT_CONFIRMATION} component={BookingAcceptConfirmationScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.BOOKING_ACCEPTED_SUCCESS}  component={BookingAcceptedSuccessScreen}      options={{headerShown: false}} />
    <Stack.Screen name={Routes.BOOKING_REJECT_REASON}     component={BookingRejectReasonScreen}         options={{headerShown: false}} />
    <Stack.Screen name={Routes.BOOKING_DECLINED_SUCCESS}  component={BookingDeclinedSuccessScreen}      options={{headerShown: false}} />
  </Stack.Navigator>
);

export default RequestsStack;
