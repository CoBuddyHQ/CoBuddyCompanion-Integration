import { useTranslation } from "react-i18next"; /**
 * CoBuddy Companion App — AppHeader Component
 * Standard screen header: back button, title, optional right action.
 * Material Icons only. No random icon packs.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle } from
'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { textStyles, fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface AppHeaderProps {
  /** Screen title */
  title: string;
  /** Subtitle shown below title (optional) */
  subtitle?: string;
  /** Show back button (default: true) */
  showBack?: boolean;
  /** Custom back press handler */
  onBackPress?: () => void;
  /** Right action icon name (Material Icon) */
  rightIcon?: string;
  /** Right action handler */
  onRightPress?: () => void;
  /** Right action text label (e.g. "Reset") */
  rightText?: string;
  /** Right action text press handler */
  onRightTextPress?: () => void;
  /** Right action badge count */
  rightBadge?: number;
  /** Override container style */
  style?: ViewStyle;
  /** Transparent header (no surface background) */
  transparent?: boolean;
  /** CPN screen badge (e.g. "CPN-061") shown in dev mode */
  cpnId?: string;
  /**
   * Tab-screen mode — renders a Home-DNA left-aligned layout with no back-button
   * dead-space. Use ONLY on root bottom-tab screens. Default: false.
   */
  tabScreen?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightIcon,
  onRightPress,
  rightText,
  onRightTextPress,
  rightBadge,
  style,
  transparent = false,
  cpnId,
  tabScreen = false
}) => {const { t } = useTranslation();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // ── Tab-screen layout (Home DNA) ────────────────────────────────────────────
  if (tabScreen) {
    return (
      <View style={tabStyles.tabBar}>
        <View>
          <Text style={tabStyles.tabTitle}>{title}</Text>
          {subtitle ? <Text style={tabStyles.tabSubtitle}>{subtitle}</Text> : null}
        </View>
        {rightIcon ?
        <TouchableOpacity
          style={tabStyles.tabIconWrap}
          onPress={onRightPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.icon_action", { icon: rightIcon })}>
            <Icon name={rightIcon} size={24} color={colors.gold} />
            {rightBadge != null && rightBadge > 0 ?
          <View style={tabStyles.badgeDot} /> :
          null}
          </TouchableOpacity> :
        null}
      </View>);

  }

  // ── Standard secondary-screen layout (unchanged) ──────────────────────────
  return (
    <View
      style={[
      styles.container,
      !transparent && styles.surface,
      !transparent && shadows.sm,
      style]
      }>
      {/* Left — back button */}
      <View style={styles.left}>
        {showBack &&
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.go_back")}>
            <Icon name="arrow-back" size={spacing.iconLg} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      </View>

      {/* Center — title */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ?
        <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text> :
        null}
      </View>

      {/* Right — action icon or text */}
      <View style={styles.right}>
        {rightText ?
        <TouchableOpacity
          onPress={onRightTextPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.icon_action', { icon: rightText })}>
            <Text style={styles.rightText}>{rightText}</Text>
          </TouchableOpacity> :
        rightIcon ?
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onRightPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.icon_action", { icon: rightIcon })}>
            <Icon name={rightIcon} size={spacing.iconLg} color={colors.textPrimary} />
            {rightBadge != null && rightBadge > 0 ?
          <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {rightBadge > 99 ? '99+' : rightBadge}
                </Text>
              </View> :
          null}
          </TouchableOpacity> :
        null}
      </View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    height: spacing.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md
  },
  surface: {
    backgroundColor: colors.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSurface
  },
  left: {
    width: 44,
    alignItems: 'flex-start'
  },
  center: {
    flex: 1,
    alignItems: 'center'
  },
  right: {
    width: 44,
    alignItems: 'flex-end'
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18
  },
  title: {
    ...textStyles.labelLg,
    color: colors.textPrimary
  },
  subtitle: {
    ...textStyles.labelXs,
    color: colors.textMuted,
    marginTop: 1
  },
  rightText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.gold
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.softWarning,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    ...textStyles.labelXs,
    color: colors.white,
    fontSize: 9
  }
});

// ── Tab-screen styles (Home DNA) ─────────────────────────────────────────────
const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.rootBg
  },
  tabTitle: {
    fontFamily: fontFamily.playfairBold, fontSize: 18, color: colors.gold
  },
  tabSubtitle: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    marginTop: 1
  },
  tabIconWrap: {
    marginLeft: 14, position: 'relative'
  },
  badgeDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.softWarning,
    borderWidth: 1, borderColor: colors.rootBg
  }
});

export default AppHeader;