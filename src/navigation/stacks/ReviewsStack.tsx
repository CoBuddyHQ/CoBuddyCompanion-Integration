/**
 * CoBuddy Companion App — Reviews & Trust Stack (CPN-156 → CPN-161)
 * Reachable from Profile tab, not a standalone bottom tab.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ReviewsStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import {defaultStackScreenOptions} from '../navigatorOptions';
import PlaceholderScreen from '../../screens/states/PlaceholderScreen';

const Stack = createStackNavigator<ReviewsStackParamList>();

const ReviewsStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name={Routes.REVIEWS_DASHBOARD} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.REVIEW_DETAIL} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.TRUST_SCORE_DASHBOARD} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.TRUST_SCORE_SUMMARY} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.TRUST_SCORE_IMPROVEMENT_TASKS} component={PlaceholderScreen} />
    <Stack.Screen name={Routes.BADGES_ACHIEVEMENTS} component={PlaceholderScreen} />
  </Stack.Navigator>
);

export default ReviewsStack;
