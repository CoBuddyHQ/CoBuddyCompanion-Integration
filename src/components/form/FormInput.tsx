/**
 * CoBuddy Companion App — FormInput Component
 * Standard text input with gold focus border, label, error, and helper text.
 * Used across all forms in the KYC, profile, and settings flows.
 */

import React, {useState, forwardRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  /** For password/sensitive fields — shows eye toggle */
  secure?: boolean;
}

const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      secure = false,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSecure, setShowSecure] = useState(false);

    const hasError = !!error;
    const borderColor = hasError
      ? colors.softWarning
      : isFocused
      ? colors.gold
      : colors.borderSurface;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={[
            styles.inputRow,
            {borderColor},
            isFocused && styles.focused,
          ]}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={spacing.iconMd}
              color={isFocused ? colors.gold : colors.textMuted}
              style={styles.leftIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.gold}
            cursorColor={colors.gold}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={secure && !showSecure}
            {...props}
          />

          {/* Right icon or secure toggle */}
          {secure ? (
            <TouchableOpacity accessibilityRole="button"
              onPress={() => setShowSecure(v => !v)}
              style={styles.rightIconBtn}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon
                name={showSecure ? 'visibility' : 'visibility-off'}
                size={spacing.iconMd}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ) : rightIcon ? (
            <TouchableOpacity accessibilityRole="button"
              onPress={onRightIconPress}
              style={styles.rightIconBtn}
              disabled={!onRightIconPress}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon
                name={rightIcon}
                size={spacing.iconMd}
                color={isFocused ? colors.gold : colors.textMuted}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Error or helper */}
        {hasError ? (
          <View style={styles.errorRow}>
            <Icon name="error-outline" size={12} color={colors.softWarning} style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : helper ? (
          <Text style={styles.helperText}>{helper}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.labelMd,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  focused: {
    borderWidth: 1.5,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...textStyles.bodyMd,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  rightIconBtn: {
    marginLeft: spacing.sm,
    padding: 2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    ...textStyles.labelXs,
    color: colors.softWarning,
    flex: 1,
  },
  helperText: {
    ...textStyles.labelXs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

FormInput.displayName = 'FormInput';

export default FormInput;
