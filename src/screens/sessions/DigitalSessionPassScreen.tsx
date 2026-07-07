import i18next from "i18next";
/**
 * CPN-098 — Digital Session Pass Screen
 * Shows the companion's scannable pass for premium venue entry.
 */
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.DIGITAL_SESSION_PASS>;

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    cafe_conversation: 'Café Conversation', city_walk: 'City Walk',
    art_culture: 'Art & Culture', food_experience: 'Food Experience',
    shopping_assistance: 'Shopping Assistance', events: 'Public Event',
    business_networking: 'Networking', bookstore: 'Bookstore Visit',
    wellness_walk: 'Wellness Walk', movies: 'Cinema'
  };
  return map[cat] ?? cat.replace(/_/g, ' ');
}

function formatShort(iso: string): string {
  const d = new Date(iso);
  const now = new Date(),tom = new Date(now);
  tom.setDate(tom.getDate() + 1);
  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === tom.toDateString();
  const day = isToday ? i18next.t("content.sessions.DigitalSessionPassScreen.today") : isTomorrow ? i18next.t("content.sessions.DigitalSessionPassScreen.tomorrow") :
  d.toLocaleDateString(i18next.language || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const t = d.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}, ${t}`;
}

// ─── QR Code Placeholder ─────────────────────────────────────────────────────
// Renders a grid of tiny squares simulating a QR pattern.

const QRPlaceholder: React.FC<{size: number;}> = ({ size }) => {
  return (
    <View style={{
      width: size, height: size, backgroundColor: '#fff',
      alignItems: 'center', justifyContent: 'center',
      borderRadius: 12, elevation: 2,
      shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
    }}>
      <Icon name="qr-code-2" size={size - 32} color="#1A2540" />
    </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function DigitalSessionPassScreen({ route, navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const sessionId: string = route.params?.sessionId ?? '';

  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : [])].
  find((ses) => ses.sessionId === sessionId) ?? null
  );

  const passCode = session?.sessionPassCode ?? 'PASS-???';
  const activity = session ? categoryLabel(session.category) : '—';
  const venueName = session?.venue.name ?? '—';
  const dateLabel = session ? formatShort(session.scheduledStart) : '—';
  const customerInit = session?.customer.displayInitials ?? '—';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={i18next.t('sessions.digital_pass')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Session context strip ── */}
        <View style={styles.contextStrip}>
          <Icon name="event" size={14} color={colors.textMuted} />
          <Text style={styles.contextText}>{activity}{i18next.t("content.sessions.DigitalSessionPassScreen.text")}{dateLabel}</Text>
        </View>

        {/* ─────────────────── PASS CARD ─────────────────── */}
        <View style={styles.passCard}>
          {/* Pass header */}
          <View style={styles.passHeader}>
            <View style={styles.passLogoRow}>
              <Icon name="shield" size={20} color={colors.gold} />
              <Text style={styles.passLogoText}> {i18next.t('sessions.cobuddy')} </Text>
            </View>
            <View style={styles.passBadge}>
              <Text style={styles.passBadgeText}> {i18next.t('sessions.premium_entry')} </Text>
            </View>
          </View>

          <View style={styles.passDividerDashed} />

          {/* QR Code */}
          <View style={styles.qrWrap}>
            <QRPlaceholder size={180} />
          </View>

          {/* Pass code */}
          <Text style={styles.passCode}>{passCode}</Text>

          <View style={styles.passDividerDashed} />

          {/* Venue info rows */}
          <View style={styles.passInfoGrid}>
            <View style={styles.passInfoCell}>
              <Text style={styles.passInfoLabel}> {i18next.t('sessions.activity')} </Text>
              <Text style={styles.passInfoValue}>{activity}</Text>
            </View>
            <View style={styles.passInfoCell}>
              <Text style={styles.passInfoLabel}> {i18next.t('sessions.with')} </Text>
              <Text style={styles.passInfoValue}>{customerInit}</Text>
            </View>
            <View style={styles.passInfoCell}>
              <Text style={styles.passInfoLabel}> {i18next.t('sessions.venue')} </Text>
              <Text style={styles.passInfoValue}>{venueName}</Text>
            </View>
            <View style={styles.passInfoCell}>
              <Text style={styles.passInfoLabel}> {i18next.t('sessions.date_time')} </Text>
              <Text style={styles.passInfoValue}>{dateLabel}</Text>
            </View>
          </View>

          {/* Pass footer */}
          <View style={styles.passFooter}>
            <Icon name="verified-user" size={13} color={colors.safetyGreen} />
            <Text style={styles.passFooterText}> {i18next.t('sessions.issued_by_cobuddy_trust_safety')} </Text>
          </View>
        </View>

        {/* ── Instructions ── */}
        <View style={styles.instructionCard}>
          <Icon name="info-outline" size={16} color={colors.textMuted} style={{ flexShrink: 0 }} />
          <Text style={styles.instructionText}>
             {i18next.t('sessions.present_this_qr_code_to_venue_staff_at_the_entrance_valid_only')} <Text style={{ fontFamily: fontFamily.interBold, color: colors.gold }}>
               {i18next.t('sessions.15_minutes_before')} </Text>  {i18next.t('sessions.your_session_start_time')} </Text>
        </View>

        {/* ── Safety reminder ── */}
        <View style={styles.safetyReminder}>
          <Icon name="shield" size={15} color={colors.safetyGreen} />
          <Text style={styles.safetyReminderText}>
             {i18next.t('sessions.safety_tools_activate_automatically_once_your_session_begins')} </Text>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>);

}

export default DigitalSessionPassScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: {
    paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxxxl,
    alignItems: 'center'
  },

  contextStrip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.lg
  },
  contextText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },

  // Pass card — light theme to stand out against dark bg
  passCard: {
    width: '100%', maxWidth: 340,
    backgroundColor: '#F7F8FA',
    borderRadius: radius.xxl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25, shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10
  },

  passHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: '#1A2540'
  },
  passLogoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  passLogoText: { fontFamily: fontFamily.interBold, fontSize: 16, color: '#F7F8FA' },
  passBadge: {
    backgroundColor: 'rgba(214,168,79,0.18)',
    borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.50)',
    paddingHorizontal: 10, paddingVertical: 3
  },
  passBadgeText: { fontFamily: fontFamily.interBold, fontSize: 10, color: colors.gold, letterSpacing: 1 },

  passDividerDashed: {
    height: 1, marginHorizontal: 0,
    borderStyle: 'dashed', borderWidth: 1, borderColor: '#D0D5DE'
  },

  qrWrap: { alignItems: 'center', paddingVertical: spacing.lg },

  passCode: {
    fontFamily: 'Courier New',
    fontSize: 22, fontWeight: '700',
    color: '#1A2540', textAlign: 'center',
    letterSpacing: 4, paddingBottom: spacing.md
  },

  passInfoGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md
  },
  passInfoCell: { width: '50%', paddingVertical: 6 },
  passInfoLabel: {
    fontFamily: fontFamily.interMedium, fontSize: 9,
    color: '#8A92A0', letterSpacing: 1.2, marginBottom: 3
  },
  passInfoValue: { fontFamily: fontFamily.interBold, fontSize: 12, color: '#1A2540' },

  passFooter: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: '#EFF1F5',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm
  },
  passFooterText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: '#6B7280' },

  // Instructions
  instructionCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    marginTop: spacing.lg, paddingHorizontal: spacing.md
  },
  instructionText: {
    fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textMuted, lineHeight: 20, flex: 1, textAlign: 'center'
  },

  safetyReminder: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: 'rgba(109,214,165,0.08)',
    borderRadius: radius.md, borderWidth: 1,
    borderColor: 'rgba(109,214,165,0.20)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    alignSelf: 'stretch'
  },
  safetyReminderText: {
    fontFamily: fontFamily.interRegular, fontSize: 12,
    color: colors.safetyGreen, lineHeight: 18, flex: 1
  }
});