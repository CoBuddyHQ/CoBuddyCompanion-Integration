/**
 * CPN-187 — Account Settings Screen
 * Central hub for all companion preferences, accessed via the gear icon on
 * the Profile tab. Logout here sends the user back to the Auth flow via
 * authStore.logout() → RootNavigator re-renders AuthNavigator.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, StatusBar, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useAuthStore } from '../../store/slices/authStore';
import { useProfileStore } from '../../store/slices/profileStore';
import { useUIStore } from '../../store/slices/uiStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard: React.FC<{title: string;children: React.ReactNode;}> = ({ title, children }) =>
<View style={styles.sectionWrap}>
    <Text style={styles.sectionLabel}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>;


// ─── Setting row variants ─────────────────────────────────────────────────────

interface RowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}

const SettingRow: React.FC<RowProps> = ({ icon, label, subtitle, onPress, danger, last }) =>
<TouchableOpacity
  style={[styles.row, last && styles.rowLast]}
  onPress={onPress}
  activeOpacity={0.7}
  disabled={!onPress}>
    <View style={[styles.rowIconWrap, danger && styles.rowIconWrapDanger]}>
      <Icon name={icon as any} size={18} color={danger ? colors.softWarning : colors.gold} />
    </View>
    <View style={styles.rowMid}>
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    {onPress &&
  <Icon name="chevron-right" size={18} color={danger ? colors.softWarning : colors.textMuted} />
  }
  </TouchableOpacity>;


interface ToggleRowProps extends Omit<RowProps, 'onPress'> {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, label, subtitle, value, onValueChange, last }) =>
<View style={[styles.row, last && styles.rowLast]}>
    <View style={styles.rowIconWrap}>
      <Icon name={icon as any} size={18} color={colors.gold} />
    </View>
    <View style={styles.rowMid}>
      <Text style={styles.rowLabel}>{label}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Switch
    value={value}
    onValueChange={onValueChange}
    trackColor={{ false: colors.elevatedSurface, true: 'rgba(214,168,79,0.35)' }}
    thumbColor={value ? colors.gold : colors.border} />
  
  </View>;


// ─── Screen ───────────────────────────────────────────────────────────────────

export function AccountSettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const logout = useAuthStore((s) => s.logout);
  const maskedPhone = useAuthStore((s) => s.maskedPhone);
  const profile = useProfileStore((s) => s.profile);

  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const setDarkMode = useUIStore((s) => s.setDarkMode);

  const displayName = profile?.displayName ?? 'Companion';
  const phone = maskedPhone ?? profile?.maskedPhone ?? '';
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const confirmLogout = () => {
    Alert.alert(t("alerts.log_out"), t("alerts.are_you_sure_you_want_to_log_out_of_cobu"),


    [
    { text: t("alerts.cancel"), style: 'cancel' },
    {
      text: t("alerts.log_out"),
      style: 'destructive',
      onPress: () => logout() // RootNavigator auto-switches to AuthNavigator
    }]

    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(t("alerts.delete_account"), t("alerts.this_action_is_permanent_and_cannot_be_u"),


    [
    { text: t("alerts.cancel"), style: 'cancel' },
    { text: t("alerts.continue"), style: 'destructive',
      onPress: () => navigation.navigate(Routes.DELETE_ACCOUNT) }]

    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('settings.settings')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
             PROFILE SUMMARY
          ══════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.profileRow}
          onPress={() => navigation.navigate(Routes.EDIT_BASIC_PROFILE)}
          activeOpacity={0.8}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profilePhone}>{phone}</Text>
          </View>
          <View style={styles.profileEditBadge}>
            <Icon name="edit" size={14} color={colors.gold} />
            <Text style={styles.profileEditText}> {t('settings.edit')} </Text>
          </View>
        </TouchableOpacity>

        {/* ══════════════════════════════════════════
             GROUP 1: ACCOUNT & SECURITY
          ══════════════════════════════════════════ */}
        <SectionCard title={t('settings.account_security')}>
          <SettingRow
            icon="person"
            label={t('settings.personal_information')}
            subtitle={t('settings.name_bio_and_public_details')}
            onPress={() => navigation.navigate(Routes.EDIT_BASIC_PROFILE)} />
          
          <SettingRow
            icon="account-balance"
            label={t('settings.bank_payout_details')}
            subtitle={t('settings.manage_your_withdrawal_account')}
            onPress={() => navigation.navigate(Routes.BANK_DETAILS)} />
          
          <SettingRow
            icon="lock"
            label={t('settings.change_pin_password')}
            subtitle={t('settings.update_your_app_lock_pin')}
            onPress={() => navigation.navigate(Routes.CHANGE_PIN)} />
          
          <SettingRow
            icon="security"
            label={t('settings.privacy_controls')}
            subtitle={t('settings.manage_who_can_see_your_profile')}
            onPress={() => navigation.navigate(Routes.PRIVACY_CONTROLS)}
            last />
          
        </SectionCard>

        {/* ══════════════════════════════════════════
             GROUP 2: PREFERENCES
          ══════════════════════════════════════════ */}
        <SectionCard title={t('settings.preferences')}>
          <SettingRow
            icon="notifications"
            label={t('settings.notification_preferences')}
            subtitle={t('settings.manage_push_email_and_safety_alerts')}
            onPress={() => navigation.navigate(Routes.NOTIFICATION_PREFERENCES)} />
          
          <ToggleRow
            icon="dark-mode"
            label={t('settings.dark_mode')}
            subtitle={t('settings.currently_active')}
            value={isDarkMode}
            onValueChange={setDarkMode} />
          
          <SettingRow
            icon="language"
            label={t('settings.language_preferences')}
            subtitle={t('settings.app_display_language')}
            onPress={() => navigation.navigate(Routes.LANGUAGE_SETTINGS)} />
          
          <SettingRow
            icon="accessibility"
            label={t('settings.text_size_accessibility')}
            onPress={() => navigation.navigate(Routes.ACCESSIBILITY_TEXT_SIZE)}
            last />
          
        </SectionCard>

        {/* ══════════════════════════════════════════
             GROUP 3: ABOUT & SUPPORT
          ══════════════════════════════════════════ */}
        <SectionCard title={t('settings.about_support')}>
          <SettingRow
            icon="help-center"
            label={t('settings.help_center')}
            subtitle={t('settings.faqs_and_guides')}
            onPress={() => navigation.navigate(Routes.SUPPORT_CENTER)} />
          
          <SettingRow
            icon="policy"
            label={t('settings.terms_privacy_policy')}
            onPress={() => navigation.navigate(Routes.POLICY_CENTER)} />
          
          <SettingRow
            icon="gavel"
            label={t('settings.legal_agreements')}
            onPress={() => navigation.navigate(Routes.LEGAL_AGREEMENTS)} />
          
          <SettingRow
            icon="download"
            label={t('settings.download_my_data')}
            subtitle={t('settings.request_a_copy_of_your_account_data')}
            onPress={() => navigation.navigate(Routes.DATA_DOWNLOAD)}
            last />
          
        </SectionCard>

        {/* App version strip */}
        <View style={styles.versionStrip}>
          <Icon name="info-outline" size={14} color={colors.textMuted} />
          <Text style={styles.versionText}> {t('settings.cobuddy_companion_v1_0_0_build_42')} </Text>
        </View>

        {/* ══════════════════════════════════════════
             DANGER ZONE
          ══════════════════════════════════════════ */}
        <SectionCard title={t('settings.danger_zone')}>
          <SettingRow
            icon="logout"
            label={t('settings.log_out')}
            subtitle={t('settings.you_will_need_to_sign_in_again')}
            onPress={confirmLogout}
            danger />
          
          <SettingRow
            icon="delete-forever"
            label={t('settings.delete_account')}
            subtitle={t('settings.permanently_remove_your_data')}
            onPress={confirmDeleteAccount}
            danger
            last />
          
        </SectionCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>);

}

export default AccountSettingsScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Profile row
  profileRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)',
    marginBottom: spacing.lg, gap: spacing.md
  },
  profileAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#1A2540',
    borderWidth: 2, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  profileInitials: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.gold },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  profilePhone: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  profileEditBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.goldSubtle,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    paddingHorizontal: 10, paddingVertical: 4
  },
  profileEditText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },

  // Section
  sectionWrap: { marginBottom: spacing.lg },
  sectionLabel: {
    fontFamily: fontFamily.interSemiBold, fontSize: 11,
    color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: spacing.sm, paddingLeft: 4
  },
  sectionCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden'
  },

  // Row
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  rowLast: { borderBottomWidth: 0 },
  rowIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  rowIconWrapDanger: {
    backgroundColor: 'rgba(217,108,108,0.10)',
    borderColor: 'rgba(217,108,108,0.22)'
  },
  rowMid: { flex: 1 },
  rowLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  rowLabelDanger: { color: colors.softWarning },
  rowSubtitle: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },

  // Version strip
  versionStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: spacing.sm, marginBottom: spacing.md
  },
  versionText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted }
});