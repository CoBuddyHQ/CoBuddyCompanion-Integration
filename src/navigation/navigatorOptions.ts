import {colors} from '../theme/colors';
import {StackNavigationOptions} from '@react-navigation/stack';

/**
 * CoBuddy Companion App - Shared Navigator Screen Options
 * Centralises screenOptions used across all stack navigators.
 * NEVER hardcode colors directly in navigator files.
 */
export const defaultStackScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: {backgroundColor: colors.rootBg},
};
