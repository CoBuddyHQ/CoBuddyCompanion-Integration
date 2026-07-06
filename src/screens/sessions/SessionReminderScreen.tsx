/**
 * SessionReminderScreen (CPN-099)
 * Shown before a session as a push-notification entry point.
 */
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function SessionReminderScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';

  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);

  const fmtTime = (iso?: string) => {
    if (!iso) {return '—';}
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const sessionData = {
    countdown: '2h 30m',
    customer: session?.customer?.displayInitials ?? 'Customer',
    activity: session?.category ? session.category.replace(/_/g, ' ') : t("content.sessions.SessionReminderScreen.session"),
    venue: session?.venue?.name ? `${session.venue.name}, ${session.venue.area}` : '—',
    time: session?.scheduledStart ?
    `Today, ${fmtTime(session.scheduledStart)} – ${fmtTime(session.scheduledEnd)}` :
    '—',
    sessionId: sessionId || 'SES—'
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('sessions.session_reminder')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

        {/* Countdown card */}
        <View style={styles.countdownCard}>
          <View style={styles.countdownGlow} />
          <Icon name="access-time" size={32} color={colors.gold} />
          <Text style={styles.countdownLabel}> {t('sessions.starting_in')} </Text>
          <Text style={styles.countdownValue}>{sessionData.countdown}</Text>
          <Text style={styles.countdownSub}> {t('sessions.get_ready_your_session_is_coming_up')} </Text>
        </View>

        {/* Session summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}> {t('sessions.session_details')} </Text>
          {[
          { icon: 'person', label: t("content.sessions.SessionReminderScreen.customer"), value: sessionData.customer },
          { icon: 'category', label: t("content.sessions.SessionReminderScreen.activity"), value: sessionData.activity },
          { icon: 'place', label: t("content.sessions.SessionReminderScreen.venue"), value: sessionData.venue },
          { icon: 'schedule', label: t("content.sessions.SessionReminderScreen.time"), value: sessionData.time }].
          map((row, i, arr) =>
          <View key={t(row.label)} style={[styles.detailRow, i === arr.length - 1 && styles.detailRowLast]}>
              <View style={styles.detailIconWrap}>
                <Icon name={row.icon as any} size={16} color={colors.gold} />
              </View>
              <View style={styles.detailMid}>
                <Text style={styles.detailLabel}>{t(row.label)}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}> {t('sessions.quick_actions')} </Text>
          {[
          { icon: 'confirmation-number', label: t("content.sessions.SessionReminderScreen.view_session_pass"), route: Routes.DIGITAL_SESSION_PASS, color: colors.gold },
          { icon: 'navigation', label: t("content.sessions.SessionReminderScreen.get_directions"), route: Routes.NAVIGATION_TO_VENUE, color: '#8EABFF' },
          { icon: 'checklist', label: t("content.sessions.SessionReminderScreen.view_prep_checklist"), route: Routes.SESSION_PREP_CHECKLIST, color: colors.safetyGreen }].
          map((action, i, arr) =>
          <TouchableOpacity
            key={t(action.label)}
            style={[styles.actionRow, i === arr.length - 1 && styles.actionRowLast]}
            onPress={() => navigation.navigate(action.route, { sessionId: sessionData.sessionId })}
            activeOpacity={0.75}>
              <View style={[styles.actionIconWrap, { backgroundColor: `${action.color}18` }]}>
                <Icon name={action.icon as any} size={19} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{t(action.label)}</Text>
              <Icon name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Dismiss */}
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
          activeOpacity={0.7}>
          <Text style={styles.dismissText}> {t('sessions.dismiss_reminder')} </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}

export default SessionReminderScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  countdownCard: {
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.xxl, padding: spacing.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', marginBottom: spacing.md,
    overflow: 'hidden', position: 'relative'
  },
  countdownGlow: {
    position: 'absolute', top: -50, left: '50%', marginLeft: -70,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(214,168,79,0.08)'
  },
  countdownLabel: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
  countdownValue: { fontFamily: fontFamily.playfairBold, fontSize: 52, color: colors.gold, letterSpacing: -1 },
  countdownSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },

  summaryCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  summaryTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.goldSubtle, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  detailMid: { flex: 1 },
  detailLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  detailValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary, marginTop: 2 },

  actionsCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  actionsTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  actionRowLast: { borderBottomWidth: 0 },
  actionIconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  actionLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, flex: 1 },

  dismissBtn: { alignItems: 'center', paddingVertical: spacing.md },
  dismissText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted }
});