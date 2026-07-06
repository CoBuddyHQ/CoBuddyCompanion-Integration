/**
 * CoBuddy Companion App - Dashboard Stack (CPN-061 to CPN-066)
 * Also hosts Availability screens (CPN-071–078), reachable via Dashboard quick actions.
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DashboardStackParamList} from '../../types/navigation.types';
import {Routes} from '../routes';
import HomeDashboardScreen from '../../screens/dashboard/HomeDashboardScreen';
import {TodayOverviewScreen} from '../../screens/dashboard/TodayOverviewScreen';
import {QuickActionsScreen} from '../../screens/dashboard/QuickActionsScreen';
import {PerformanceInsightsScreen} from '../../screens/dashboard/PerformanceInsightsScreen';
import {NotificationCenterScreen} from '../../screens/dashboard/NotificationCenterScreen';
import {ImportantAnnouncementsScreen} from '../../screens/dashboard/ImportantAnnouncementsScreen';
import {defaultStackScreenOptions} from '../navigatorOptions';

const Stack = createStackNavigator<DashboardStackParamList>();

const DashboardStack: React.FC = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    {/* ── Dashboard (CPN-061–066) ── */}
    <Stack.Screen name={Routes.HOME_DASHBOARD} component={HomeDashboardScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.TODAY_OVERVIEW} component={TodayOverviewScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.QUICK_ACTIONS} component={QuickActionsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.PERFORMANCE_INSIGHTS} component={PerformanceInsightsScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.NOTIFICATION_CENTER} component={NotificationCenterScreen} options={{headerShown: false}} />
    <Stack.Screen name={Routes.IMPORTANT_ANNOUNCEMENTS} component={ImportantAnnouncementsScreen} options={{headerShown: false}} />
  </Stack.Navigator>
);

export default DashboardStack;
