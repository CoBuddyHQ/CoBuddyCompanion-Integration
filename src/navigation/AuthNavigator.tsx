/**
 * CoBuddy Companion App — Auth Navigator (CPN-001 to CPN-009)
 * All PlaceholderScreens replaced with real screen implementations.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackParamList} from '../types/navigation.types';
import {Routes} from './routes';
import {defaultStackScreenOptions} from './navigatorOptions';

import SplashScreen               from '../screens/auth/SplashScreen';
import PhoneLoginScreen           from '../screens/auth/PhoneLoginScreen';
import OTPVerificationScreen      from '../screens/auth/OTPVerificationScreen';
import LanguageSelectionScreen    from '../screens/auth/LanguageSelectionScreen';
import NotificationPermissionScreen from '../screens/auth/NotificationPermissionScreen';
import LocationPermissionScreen   from '../screens/auth/LocationPermissionScreen';
import CreatePINScreen            from '../screens/auth/CreatePINScreen';
import ConfirmPINScreen           from '../screens/auth/ConfirmPINScreen';
import BiometricSetupScreen       from '../screens/auth/BiometricSetupScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen
      name={Routes.SPLASH}
      component={SplashScreen}
      options={{animation: 'none', headerShown: false}}
    />
    <Stack.Screen
      name={Routes.PHONE_LOGIN}
      component={PhoneLoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.OTP_VERIFICATION}
      component={OTPVerificationScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.LANGUAGE_SELECTION}
      component={LanguageSelectionScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.NOTIFICATION_PERMISSION}
      component={NotificationPermissionScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.LOCATION_PERMISSION}
      component={LocationPermissionScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.CREATE_PIN}
      component={CreatePINScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.CONFIRM_PIN}
      component={ConfirmPINScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={Routes.BIOMETRIC_SETUP}
      component={BiometricSetupScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
