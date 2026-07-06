/**
 * CoBuddy Companion App — PremiumCard Component
 * Gold-bordered elevated card surface used throughout the app.
 * The foundational card component for all content blocks.
 */

import React, {ReactNode} from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {shadows} from '../../theme/shadows';

interface PremiumCardProps {
  children: ReactNode;
  /** Whether the card is tappable */
  onPress?: () => void;
  /** Whether to show the gold border */
  bordered?: boolean;
  /** Card padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Override container style */
  style?: ViewStyle;
  /** Show gold glow on active */
  glowing?: boolean;
  /** Elevated surface or card surface */
  elevated?: boolean;
  accessibilityLabel?: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  onPress,
  bordered = true,
  padding = 'md',
  style,
  glowing = false,
  elevated = false,
  accessibilityLabel,
}) => {
  const cardStyle = [
    styles.base,
    elevated ? styles.elevated : styles.card,
    bordered && styles.bordered,
    padding !== 'none' && styles[`pad_${padding}`],
    shadows.md,
    glowing && shadows.goldGlow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.cardSurface,
  },
  elevated: {
    backgroundColor: colors.elevatedSurface,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pad_sm: {padding: spacing.sm},
  pad_md: {padding: spacing.cardPad},
  pad_lg: {padding: spacing.lg},
});

export default PremiumCard;
