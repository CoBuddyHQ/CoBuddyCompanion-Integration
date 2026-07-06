/**
 * CoBuddy Companion App — Availability Stack (CPN-071 → CPN-078)
 * Reachable from Dashboard quick actions, not a bottom tab.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AvailabilityStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import {AddAvailabilitySlotScreen}     from '../../screens/availability/AddAvailabilitySlotScreen';
import {EditAvailabilitySlotScreen}    from '../../screens/availability/EditAvailabilitySlotScreen';
import {AvailabilityConflictScreen}    from '../../screens/availability/AvailabilityConflictScreen';
import {LiveAvailabilityToggleScreen}  from '../../screens/availability/LiveAvailabilityToggleScreen';
import {VacationModeScreen}            from '../../screens/availability/VacationModeScreen';
import {WeeklyRecurringAvailabilityScreen} from '../../screens/availability/WeeklyRecurringAvailabilityScreen';
import {BlockTimeDayOffScreen}         from '../../screens/availability/BlockTimeDayOffScreen';

const Stack = createStackNavigator<AvailabilityStackParamList>();

const AvailabilityStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    {/* Root screen now handled by RootNavigator (global modal) */}
    <Stack.Screen name={Routes.ADD_AVAILABILITY_SLOT}    component={AddAvailabilitySlotScreen}    options={{headerShown: false}} />
    <Stack.Screen name={Routes.EDIT_AVAILABILITY_SLOT}   component={EditAvailabilitySlotScreen}   options={{headerShown: false}} />
    <Stack.Screen name={Routes.WEEKLY_RECURRING_AVAILABILITY} component={WeeklyRecurringAvailabilityScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.BLOCK_TIME_DAY_OFF}       component={BlockTimeDayOffScreen}        options={{headerShown: false}} />
    <Stack.Screen name={Routes.AVAILABILITY_CONFLICT}    component={AvailabilityConflictScreen}   options={{headerShown: false}} />
    <Stack.Screen name={Routes.LIVE_AVAILABILITY_TOGGLE} component={LiveAvailabilityToggleScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.VACATION_MODE}            component={VacationModeScreen}           options={{headerShown: false}} />
  </Stack.Navigator>
);

export default AvailabilityStack;
