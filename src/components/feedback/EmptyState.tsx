/**
 * CoBuddy Companion App — EmptyState Component
 * Shown when a list or section has no content.
 */

import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import ActionButton from '../actions/ActionButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCTA?: () => void;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  ctaLabel,
  onCTA,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.iconWrap}>
      <Icon name={icon} size={40} color={colors.textMuted} />
    </View>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
    {ctaLabel && onCTA ? (
      <ActionButton
        label={ctaLabel}
        onPress={onCTA}
        variant="secondary"
        size="md"
        fullWidth={false}
        style={styles.cta}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.massive,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.elevatedSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSurface,
  },
  title: {
    ...textStyles.headlineSm,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  cta: {
    marginTop: spacing.xl,
  },
});

export default EmptyState;
