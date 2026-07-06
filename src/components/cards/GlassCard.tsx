/**
 * CoBuddy Companion App — GlassCard
 * Semi-transparent deep-blue card with subtle gold border.
 * Approximates Stitch glassmorphism: rgba(17,34,64,0.7) + backdrop blur.
 *
 * Usage:
 *   <GlassCard>…children…</GlassCard>
 *   <GlassCard goldLeftBar>…</GlassCard>       // with gold left accent bar
 *   <GlassCard borderStrength="strong">…</GlassCard> // stronger gold border
 */

import React, {ReactNode} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {radius} from '../../theme/radius';
import {spacing} from '../../theme/spacing';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Adds a vertical gold→bronze left accent bar (used on CPN-004) */
  goldLeftBar?: boolean;
  /** Border intensity: 'subtle' | 'normal' | 'strong' */
  borderStrength?: 'subtle' | 'normal' | 'strong';
  /** Internal padding override */
  padding?: number;
}

const BORDER_COLORS = {
  subtle: 'rgba(214, 168, 79, 0.12)',
  normal: 'rgba(214, 168, 79, 0.22)',
  strong: 'rgba(214, 168, 79, 0.35)',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  goldLeftBar = false,
  borderStrength = 'normal',
  padding,
}) => {
  const contentPad = padding !== undefined ? {padding} : {};
  return (
    <View
      style={[
        styles.card,
        {borderColor: BORDER_COLORS[borderStrength]},
        style,
      ]}>
      {goldLeftBar && <View style={styles.leftBar} />}
      <View style={[goldLeftBar ? styles.contentWithBar : styles.content, contentPad]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(17, 34, 64, 0.72)',
    borderWidth: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  leftBar: {
    width: 3,
    backgroundColor: colors.gold,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  contentWithBar: {
    flex: 1,
    padding: spacing.lg,
    paddingLeft: spacing.md,
    gap: spacing.sm,
  },
});

export default GlassCard;
