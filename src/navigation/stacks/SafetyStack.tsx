/**
 * CoBuddy Companion App - Safety Stack (CPN-121 to CPN-136)
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SafetyStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import PlaceholderScreen from '../../screens/states/PlaceholderScreen';

const Stack = createStackNavigator<SafetyStackParamList>();

const SafetyStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name={Routes.COMPANION_SAFETY_HUB} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.SAFETY_TIMER} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.SOS} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.SOS_CONFIRMATION} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.SAFETY_GUIDELINES} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.PUBLIC_VENUE_RULES} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.SAFETY_QUIZ} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.EMERGENCY_CONTACT_SETUP} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.TRUSTED_CONTACTS} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.ADD_TRUSTED_CONTACT} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.EDIT_TRUSTED_CONTACT} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.BLOCK_CUSTOMER} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.REPORT_CUSTOMER} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.INCIDENT_REPORT} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.INCIDENT_EVIDENCE_UPLOAD} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.INCIDENT_SUBMITTED} component={PlaceholderScreen} />
  </Stack.Navigator>
);

export default SafetyStack;
