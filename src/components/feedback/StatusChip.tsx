/**
 * CoBuddy Companion App — StatusChip Component
 * Small status pills used for session status, request status, payout state, etc.
 * Only CoBuddy brand colors. No random colors.
 */

import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';

export type ChipVariant =
  | 'active'        // Safety green — live/active/online
  | 'pending'       // Gold — awaiting action
  | 'success'       // Safety green — completed/approved
  | 'warning'       // Amber — needs attention
  | 'error'         // Red — rejected/failed/cancelled
  | 'neutral'       // Muted — inactive/offline
  | 'info'          // Blue — informational
  | 'verified'      // Gold — verified status
  | 'draft';        // Muted — draft/saved

interface StatusChipProps {
  label: string;
  variant?: ChipVariant;
  icon?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const VARIANT_COLORS: Record<ChipVariant, {bg: string; text: string; border: string}> = {
  active:   {bg: colors.safetyGreenSubtle,  text: colors.safetyGreen,  border: 'rgba(109,214,165,0.25)'},
  pending:  {bg: colors.goldSubtle,         text: colors.gold,          border: colors.border},
  success:  {bg: colors.safetyGreenSubtle,  text: colors.safetyGreen,  border: 'rgba(109,214,165,0.25)'},
  warning:  {bg: colors.warningAmberSubtle, text: colors.warningAmber,  border: 'rgba(230,168,23,0.25)'},
  error:    {bg: colors.softWarningSubtle,  text: colors.softWarning,   border: 'rgba(217,108,108,0.25)'},
  neutral:  {bg: colors.elevatedSurface,    text: colors.textMuted,     border: colors.borderSurface},
  info:     {bg: colors.infoBlueSubtle,     text: colors.infoBlue,      border: 'rgba(91,155,213,0.25)'},
  verified: {bg: colors.goldSubtle,         text: colors.gold,          border: colors.border},
  draft:    {bg: colors.elevatedSurface,    text: colors.textMuted,     border: colors.borderSurface},
};

const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'sm',
  style,
}) => {
  const c = VARIANT_COLORS[variant];

  return (
    <View
      style={[
        styles.chip,
        size === 'md' ? styles.chipMd : styles.chipSm,
        {backgroundColor: c.bg, borderColor: c.border},
        style,
      ]}>
      {icon && (
        <Icon
          name={icon}
          size={size === 'md' ? 14 : 11}
          color={c.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          size === 'md' ? textStyles.labelSm : textStyles.labelXs,
          {color: c.text},
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
  },
  chipSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    height: spacing.chipHeight - 4,
  },
  chipMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    height: spacing.chipHeight,
  },
  icon: {
    marginRight: 3,
  },
});

export default StatusChip;
