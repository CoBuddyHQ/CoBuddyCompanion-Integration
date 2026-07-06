import { useTranslation } from "react-i18next"; /**
 * CoBuddy Companion App — ScreenTopBar
 * Sticky top navigation bar used on CPN-002 through CPN-012.
 * Layout: [BackButton]  [Centered Title]  [Spacer]
 *
 * Matches Stitch: arrow_back icon + "CoBuddy Companion" uppercase tracking-widest
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle } from
'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ScreenTopBarProps {
  onBack?: () => void;
  title?: string;
  style?: ViewStyle;
}

const ScreenTopBar: React.FC<ScreenTopBarProps> = ({
  onBack,
  title = 'CoBuddy Companion',
  style
}) => {const { t } = useTranslation();
  return (
    <View style={[styles.bar, style]}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t("accessibility.go_back")}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Icon name="arrow-back" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Centered title */}
      <Text style={styles.title} numberOfLines={1}>
        {title.toUpperCase()}
      </Text>

      {/* Spacer mirrors back button width */}
      <View style={styles.spacer} />
    </View>);

};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.rootBg
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.huge
  },
  title: {
    ...textStyles.labelMd,
    color: colors.textMuted,
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1
  },
  spacer: {
    width: 40
  }
});

export default ScreenTopBar;