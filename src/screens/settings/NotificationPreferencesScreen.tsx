import i18next from "i18next"; /**
* NotificationPreferencesScreen
* Companion controls push/email notification preferences per event category.
* Accessed from: AccountSettingsScreen → Preferences → "Notification Preferences".
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, StatusBar, ActivityIndicator } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useSettingsStore, NotificationPrefs } from '../../store/slices/settingsStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = 'Push' | 'Email';

interface NotifItem {
  key: string;
  label: string;
  subtitle?: string;
  channel: Channel;
  locked?: boolean; // true = always ON, cannot be toggled
}

interface NotifGroup {
  title: string;
  icon: string;
  iconColor: string;
  items: NotifItem[];
}

const GROUPS: NotifGroup[] = [{ title: "content.settings.NotificationPreferencesScreen.groups.0.title", icon: "event-available", items: "content.settings.NotificationPreferencesScreen.groups.0.items" }, { title: "content.settings.NotificationPreferencesScreen.groups.1.title", icon: "shield", items: "content.settings.NotificationPreferencesScreen.groups.1.items" }, { title: "content.settings.NotificationPreferencesScreen.groups.2.title", icon: "account-balance-wallet", iconColor: "content.settings.NotificationPreferencesScreen.groups.2.iconColor", items: "content.settings.NotificationPreferencesScreen.groups.2.items" }, { title: "content.settings.NotificationPreferencesScreen.groups.3.title", icon: "campaign", items: "content.settings.NotificationPreferencesScreen.groups.3.items" }] as any[];

















































// Seed all toggles to true by default
function buildInitialState(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  GROUPS.forEach((g) => {
    const items = (Array.isArray(i18next.t(g.items as any, { returnObjects: true })) ? (i18next.t(g.items as any, { returnObjects: true }) as any[]) : []);
    items.forEach((it) => {state[it.key] = true;});
  });
  return state;
}

// ─── Channel badge ────────────────────────────────────────────────────────────

const ChannelBadge: React.FC<{channel: Channel;}> = ({ channel }) =>
<View style={[
badgeStyles.wrap,
channel === 'Push' ? badgeStyles.push : badgeStyles.email]
}>
    <Icon
    name={channel === 'Push' ? 'notifications' : 'email'}
    size={10}
    color={channel === 'Push' ? colors.gold : '#8EABFF'} />
  
    <Text style={[badgeStyles.text, channel === 'Email' && badgeStyles.textEmail]}>
      {channel}
    </Text>
  </View>;


const badgeStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 3,
    borderRadius: radius.full, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1 },
  push: { backgroundColor: 'rgba(214,168,79,0.10)', borderColor: 'rgba(214,168,79,0.25)' },
  email: { backgroundColor: 'rgba(142,171,255,0.10)', borderColor: 'rgba(142,171,255,0.25)' },
  text: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.gold },
  textEmail: { color: '#8EABFF' }
});

// ─── Notif Row ────────────────────────────────────────────────────────────────

interface NotifRowProps {
  item: NotifItem;
  value: boolean;
  onToggle: () => void;
  last?: boolean;
}

const NotifRow: React.FC<NotifRowProps> = ({ item, value, onToggle, last }) =>
<View style={[rowStyles.row, last && rowStyles.rowLast]}>
    <View style={rowStyles.mid}>
      <View style={rowStyles.labelRow}>
        <Text style={rowStyles.label}>{i18next.t(item.label)}</Text>
        <ChannelBadge channel={item.channel} />
        {item.locked &&
      <Icon name="lock" size={12} color={colors.textMuted} />
      }
      </View>
      {item.subtitle &&
    <Text style={rowStyles.subtitle}>{i18next.t(item.subtitle)}</Text>
    }
    </View>
    <Switch
    value={value}
    onValueChange={item.locked ? undefined : onToggle}
    disabled={item.locked}
    trackColor={{ false: colors.elevatedSurface, true: 'rgba(109,214,165,0.30)' }}
    thumbColor={item.locked ?
    colors.safetyGreen // always green
    : value ? colors.gold : colors.border} />
  
  </View>;


const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: spacing.sm
  },
  rowLast: { borderBottomWidth: 0 },
  mid: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  label: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 3 }
});

// ─── Group card ───────────────────────────────────────────────────────────────

interface GroupCardProps {
  group: NotifGroup;
  state: NotificationPrefs;
  onToggle: (key: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, state, onToggle }) => {
  const { t } = useTranslation();
  const items = (Array.isArray(t(group.items as any, { returnObjects: true })) ? (t(group.items as any, { returnObjects: true }) as any[]) : []);
  const enabledCount = items.filter((it) => state[it.key]).length;

  return (
    <View style={groupStyles.card}>
      {/* Header */}
      <View style={groupStyles.header}>
        <View style={[groupStyles.iconWrap, { backgroundColor: `${group.iconColor}18` }]}>
          <Icon name={group.icon as any} size={17} color={group.iconColor} />
        </View>
        <Text style={groupStyles.title}>{t(group.title)}</Text>
        <Text style={groupStyles.count}>
          {enabledCount}/{items.length}  {t('settings.on')} </Text>
      </View>

      {/* Rows */}
      {items.map((item, idx) =>
      <NotifRow
        key={`ui-opt-${idx}-${item.key || idx}`}
        item={item}
        value={state[item.key] ?? true}
        onToggle={() => onToggle(item.key)}
        last={idx === items.length - 1} />

      )}
    </View>);

};

const groupStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  title: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, flex: 1 },
  count: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function NotificationPreferencesScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const storedPrefs = useSettingsStore((s) => s.notificationPrefs);
  const updateNotificationPrefs = useSettingsStore((s) => s.updateNotificationPrefs);

  const [prefs, setPrefs] = useState(storedPrefs);
  const [loading, setLoading] = useState(false);

  const toggle = (key: string) =>
  setPrefs((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const handleSave = () => {

    if (loading) {return;}
    setLoading(true);
    // Persist to global settingsStore
    updateNotificationPrefs(prefs);
    setTimeout(() => {
      setLoading(false);
      navigation.canGoBack() ? navigation.goBack() : undefined;
    }, 400); // brief visual feedback only
  };

  // Count active across all groups
  const totalOn = Object.values(prefs).filter(Boolean).length;
  const totalAll = Object.keys(prefs).length;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('settings.notifications')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
                 INFO BANNER
              ══════════════════════════════════════════ */}
        <View style={styles.infoBanner}>
          <Icon name="info-outline" size={16} color={colors.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          <Text style={styles.infoBannerText}>
             {t('settings.choose_how_you_want_to_be_notified_we_recommend_keeping')} {' '}
            <Text style={styles.infoBannerBold}> {t('settings.booking')} </Text>
            {' '} {t('settings.and')} {' '}
            <Text style={styles.infoBannerBold}> {t('settings.safety')} </Text>
            {' '} {t('settings.alerts_on')} </Text>
        </View>

        {/* Active summary pill */}
        <View style={styles.summaryRow}>
          <Icon name="notifications-active" size={14} color={colors.safetyGreen} />
          <Text style={styles.summaryText}>
            {totalOn}  {t('settings.of')} {totalAll}  {t('settings.notifications_active')} </Text>
        </View>

        {/* ══════════════════════════════════════════
                 NOTIFICATION GROUPS
              ══════════════════════════════════════════ */}
        {GROUPS.map((group) =>
        <GroupCard
          key={t(group.title)}
          group={group}
          state={prefs}
          onToggle={toggle} />

        )}

        {/* Safety lock note */}
        <View style={styles.lockNote}>
          <Icon name="lock" size={13} color={colors.textMuted} />
          <Text style={styles.lockNoteText}>
             {t('settings.safety_alerts_cannot_be_turned_off_they_are_required_to_keep_you_and_your_customers_safe')} </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
               STICKY SAVE BAR
            ══════════════════════════════════════════ */}
      <View style={styles.stickyBar}>
        <TouchableOpacity accessibilityRole="button"
          style={[styles.saveBtn, loading && styles.saveBtnLoading]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.save_notification_preferences")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} /> :

          <>
              <Icon name="check-circle" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}> {t('settings.save_preferences')} </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default NotificationPreferencesScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm
  },
  infoBannerText: {
    fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textSecondary, lineHeight: 19, flex: 1
  },
  infoBannerBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  summaryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md
  },
  summaryText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.safetyGreen },

  lockNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    paddingHorizontal: spacing.xs
  },
  lockNoteText: {
    fontFamily: fontFamily.interRegular, fontSize: 11,
    color: colors.textMuted, flex: 1, lineHeight: 17
  },

  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  saveBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  saveBtnLoading: { opacity: 0.75 },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});