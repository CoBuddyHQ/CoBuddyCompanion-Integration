/**
 * CoBuddy Companion App — HeroIcon
 * Large circular hero icon with optional shield badge accent.
 * Used on CPN-005, CPN-006, CPN-009.
 *
 * Matches Stitch: 128×128 circle, gold border/30, glow shadow,
 * optional -bottom-2/-right-2 shield badge.
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';

interface HeroIconProps {
  iconName: string;
  iconSize?: number;
  /** Show shield badge accent in bottom-right */
  showBadge?: boolean;
  /** Badge icon (default: 'shield') */
  badgeIcon?: string;
}

const HeroIcon: React.FC<HeroIconProps> = ({
  iconName,
  iconSize = 60,
  showBadge = true,
  badgeIcon = 'shield',
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Ambient glow behind circle */}
      <View style={styles.glow} />

      {/* Main circle */}
      <View style={styles.circle}>
        <Icon name={iconName} size={iconSize} color={colors.gold} />
      </View>

      {/* Shield badge */}
      {showBadge && (
        <View style={styles.badge}>
          <Icon name={badgeIcon} size={18} color={colors.gold} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(214, 168, 79, 0.08)',
  },
  circle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    // Glow shadow
    shadowColor: colors.gold,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.40)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
});

export default HeroIcon;
