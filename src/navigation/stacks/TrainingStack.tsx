/**
 * CoBuddy Companion App — Training Stack (CPN-162 → CPN-164)
 * Reachable from Dashboard or Profile, not a standalone bottom tab.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {TrainingStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import PlaceholderScreen from '../../screens/states/PlaceholderScreen';

const Stack = createStackNavigator<TrainingStackParamList>();

const TrainingStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name={Routes.TRAINING_HUB} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.TRAINING_LESSON} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.TRAINING_COMPLETED} component={PlaceholderScreen} />
  </Stack.Navigator>
);

export default TrainingStack;
