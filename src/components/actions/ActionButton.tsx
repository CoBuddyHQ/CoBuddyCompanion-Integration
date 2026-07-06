/**
 * CoBuddy Companion App — ActionButton Component
 * Primary, Secondary, Ghost, and Destructive variants.
 * Used for all CTAs throughout the app.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {shadows} from '../../theme/shadows';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'gold-outline';
type ButtonSize = 'lg' | 'md' | 'sm';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
  labelStyle,
  accessibilityLabel,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && shadows.goldGlow,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{disabled: isDisabled, busy: loading}}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.rootBg : colors.gold}
        />
      ) : (
        <View style={styles.inner}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={size === 'sm' ? spacing.iconSm : spacing.iconMd}
              color={getLabelColor(variant, isDisabled)}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.label,
              size === 'lg' ? textStyles.buttonLg : size === 'md' ? textStyles.buttonMd : textStyles.buttonSm,
              {color: getLabelColor(variant, isDisabled)},
              labelStyle,
            ]}>
            {label}
          </Text>
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={size === 'sm' ? spacing.iconSm : spacing.iconMd}
              color={getLabelColor(variant, isDisabled)}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

function getLabelColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) return colors.textMuted;
  switch (variant) {
    case 'primary': return colors.rootBg;
    case 'secondary': return colors.gold;
    case 'ghost': return colors.textSecondary;
    case 'destructive': return colors.white;
    case 'gold-outline': return colors.gold;
    default: return colors.rootBg;
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  // Sizes
  size_lg: {height: spacing.buttonHeightLg, paddingHorizontal: spacing.xxl},
  size_md: {height: spacing.buttonHeightMd, paddingHorizontal: spacing.lg},
  size_sm: {height: spacing.buttonHeightSm, paddingHorizontal: spacing.md},
  // Variants
  variant_primary: {
    backgroundColor: colors.gold,
  },
  variant_secondary: {
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_destructive: {
    backgroundColor: colors.softWarning,
  },
  'variant_gold-outline': {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    textAlign: 'center',
  },
  leftIcon: {marginRight: spacing.xs},
  rightIcon: {marginLeft: spacing.xs},
});

export default ActionButton;
