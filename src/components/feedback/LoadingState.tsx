/**
 * CoBuddy Companion App — LoadingState Component
 * Gold spinner with optional message. Used for all loading states.
 */

import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
  /** Full screen overlay mode */
  overlay?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = 'large',
  style,
  overlay = false,
}) => (
  <View style={[styles.container, overlay && styles.overlay, style]}>
    <ActivityIndicator size={size} color={colors.gold} />
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.massive,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    paddingVertical: 0,
    zIndex: 999,
  },
  message: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default LoadingState;
