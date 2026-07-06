import i18next from "i18next"; /**
 * CoBuddy Companion App — BottomTabBar Component
 * Custom 5-tab bar with CoBuddy gold active state.
 * Tabs: Home | Requests | Sessions | Earnings | Profile
 * Material Icons only.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet } from
'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Routes } from '../../navigation/routes';

// Tab configuration: tab name → icon
const TAB_CONFIG: Record<string, {icon: string;activeIcon: string;label: string;}> = {
  DashboardTab: { icon: 'home', activeIcon: 'home', label: i18next.t("content.layout.BottomTabBar.home") },
  RequestsTab: { icon: 'inbox', activeIcon: 'inbox', label: i18next.t("content.layout.BottomTabBar.requests") },
  SessionsTab: { icon: 'event', activeIcon: 'event', label: i18next.t("content.layout.BottomTabBar.sessions") },
  EarningsTab: { icon: 'account-balance-wallet', activeIcon: 'account-balance-wallet', label: i18next.t("content.layout.BottomTabBar.earnings") },
  ProfileTab: { icon: 'person', activeIcon: 'person', label: i18next.t("content.layout.BottomTabBar.profile") }
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // Hide Tab Bar when navigating deep into stack screens
  const currentRoute = state.routes[state.index];
  const focusedRouteName = getFocusedRouteNameFromRoute(currentRoute);

  const rootRoutes = [
  Routes.HOME_DASHBOARD,
  Routes.BOOKING_REQUESTS_INBOX,
  Routes.UPCOMING_SESSIONS,
  Routes.EARNINGS_DASHBOARD,
  Routes.COMPANION_PROFILE];


  const isDeepScreen = focusedRouteName !== undefined && !rootRoutes.includes(focusedRouteName as any);

  if (isDeepScreen) {
    return null; // Don't render the tab bar at all on nested screens
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });
            if (!isFocused && !event.defaultPrevented) {
              if (route.name === 'RequestsTab') {
                navigation.navigate('RequestsTab', { screen: Routes.BOOKING_REQUESTS_INBOX });
              } else if (route.name === 'SessionsTab') {
                navigation.navigate('SessionsTab', { screen: Routes.UPCOMING_SESSIONS });
              } else {
                navigation.navigate(route.name);
              }
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityLabel={config.label}
              accessibilityState={{ selected: isFocused }}>
              {/* Active indicator dot */}
              {isFocused && <View style={styles.activeIndicator} />}

              {/* Icon */}
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Icon
                  name={isFocused ? config.activeIcon : config.icon}
                  size={spacing.iconLg}
                  color={isFocused ? colors.gold : colors.textMuted} />
                
              </View>

              {/* Label */}
              <Text
                style={[
                styles.label,
                isFocused ? styles.labelActive : styles.labelInactive]
                }>
                {config.label}
              </Text>
            </TouchableOpacity>);

        })}
      </View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSurface,
    ...shadows.md
  },
  bar: {
    flexDirection: 'row',
    height: spacing.tabBarHeight,
    alignItems: 'center'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    position: 'relative'
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.gold
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: spacing.xxs
  },
  iconWrapActive: {
    backgroundColor: colors.goldSubtle
  },
  label: {
    ...textStyles.labelXs,
    letterSpacing: 0.3
  },
  labelActive: {
    color: colors.gold
  },
  labelInactive: {
    color: colors.textMuted
  }
});

export default BottomTabBar;