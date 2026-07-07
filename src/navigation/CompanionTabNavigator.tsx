import i18next from "i18next";
import { useTranslation } from "react-i18next"; /**
 * CoBuddy Companion App — Companion Tab Navigator
 * 5 tabs: Home | Requests | Sessions | Earnings | Profile
 * Uses custom BottomTabBar with CoBuddy gold active state.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompanionTabParamList } from '../types/navigation.types';
import { colors } from '../theme/colors';

import DashboardStack from './stacks/DashboardStack';
import RequestsStack from './stacks/RequestsStack';
import SessionsStack from './stacks/SessionsStack';
import EarningsStack from './stacks/EarningsStack';
import ProfileStack from './stacks/ProfileStack';
import BottomTabBar from '../components/layout/BottomTabBar';

const Tab = createBottomTabNavigator<CompanionTabParamList>();

const CompanionTabNavigator: React.FC = () =>
// Nested component extraction: BottomTabBar is now passed directly as a reference rather than an inline arrow function that recreates it on every render.
// Props (state/descriptors/navigation) are automatically passed by Tab.Navigator.
<Tab.Navigator
  tabBar={(props) => <BottomTabBar {...props} />}
  screenOptions={{
    headerShown: false
  }}
  initialRouteName="DashboardTab">
    <Tab.Screen
    name="DashboardTab"
    component={DashboardStack}
    options={{ tabBarLabel: i18next.t("content.navigation.CompanionTabNavigator.home") }} />
  
    <Tab.Screen
    name="RequestsTab"
    component={RequestsStack}
    options={{ tabBarLabel: i18next.t("content.navigation.CompanionTabNavigator.requests") }} />
  
    <Tab.Screen
    name="SessionsTab"
    component={SessionsStack}
    options={{ tabBarLabel: i18next.t("content.navigation.CompanionTabNavigator.sessions") }} />
  
    <Tab.Screen
    name="EarningsTab"
    component={EarningsStack}
    options={{ tabBarLabel: i18next.t("content.navigation.CompanionTabNavigator.earnings") }} />
  
    <Tab.Screen
    name="ProfileTab"
    component={ProfileStack}
    options={{ tabBarLabel: i18next.t("content.navigation.CompanionTabNavigator.profile") }} />
  
  </Tab.Navigator>;


export default CompanionTabNavigator;