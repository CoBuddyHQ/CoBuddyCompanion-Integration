/**
 * CoBuddy Companion App — Onboarding Navigator (CPN-010 to CPN-012)
 * All PlaceholderScreens replaced with real screen implementations.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {OnboardingStackParamList} from '../types/navigation.types';
import {Routes} from './routes';
import {defaultStackScreenOptions} from './navigatorOptions';

import CompanionWelcomeScreen  from '../screens/onboarding/CompanionWelcomeScreen';
import RoleConfirmationScreen  from '../screens/onboarding/RoleConfirmationScreen';
import TermsConsentScreen      from '../screens/onboarding/TermsConsentScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen
      name={Routes.COMPANION_WELCOME}
      component={CompanionWelcomeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.ROLE_CONFIRMATION}
      component={RoleConfirmationScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.TERMS_CONSENT}
      component={TermsConsentScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default OnboardingNavigator;
