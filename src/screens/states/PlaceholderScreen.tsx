/**
 * CoBuddy Companion App — Placeholder Screen
 * Temporary screen used as a scaffold for all 206 screens before implementation.
 * Shows the CPN screen name with CoBuddy brand styling.
 * Replace this component during Phase 3–13 implementation.
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import { useTranslation } from "react-i18next";

const PlaceholderScreen: React.FC = () => {
    const { t } = useTranslation();
    
  const route = useRoute();
  const screenName = route.name || 'Unknown Screen';

  // Extract CPN ID from route name (e.g. "CPN_061_HomeDashboard" → "CPN-061")
  const cpnMatch = screenName.match(/CPN_(\d+)/);
  const cpnId = cpnMatch ? `CPN-${cpnMatch[1]}` : '';

  // Format display name (e.g. "HomeDashboard" → "Home Dashboard")
  const displayName = screenName
    .replace(/^CPN_\d+_/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* CoBuddy wordmark */}
        <Text style={styles.brand}> {t('states.cobuddy')} </Text>
        <Text style={styles.panel}> {t('states.companion_panel')} </Text>

        {/* Gold separator */}
        <View style={styles.separator} />

        {/* Screen ID badge */}
        {cpnId ? <View style={styles.badge}><Text style={styles.badgeText}>{cpnId}</Text></View> : null}

        {/* Screen name */}
        <Text style={styles.screenName}>{displayName}</Text>

        {/* Build state notice */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}> {t('states.under_construction')} </Text>
          <Text style={styles.noticeSubText}> {t('states.this_screen_will_be_implemented_in_the_next_phase')} </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.rootBg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenH,
  },
  brand: {
    ...textStyles.displayMd,
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  panel: {
    ...textStyles.capsLg,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  separator: {
    width: 48,
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...textStyles.labelSm,
    color: colors.gold,
    letterSpacing: 1,
  },
  screenName: {
    ...textStyles.headlineMd,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  notice: {
    backgroundColor: colors.elevatedSurface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSurface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    maxWidth: 280,
  },
  noticeText: {
    ...textStyles.labelMd,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  noticeSubText: {
    ...textStyles.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default PlaceholderScreen;
