import i18next from "i18next";
/**
 * CPN-096 — Upcoming Sessions Screen
 * Landing page for the Sessions tab.
 * Shows confirmed and upcoming sessions from sessionStore.
 */
import { useTranslation } from 'react-i18next';
import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import type { Session, SessionStatus } from '../../store/types/store.types';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = 'upcoming' | 'completed' | 'cancelled';

const TAB_STATUSES: Record<TabKey, SessionStatus[]> = {
  upcoming: ['upcoming', 'pre_arrival', 'checked_in', 'active', 'extending'],
  completed: ['completed'],
  cancelled: ['cancelled', 'no_show', 'disputed']
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    cafe_conversation: 'Café Conversation',
    city_walk: 'City Walk',
    art_culture: 'Art & Culture',
    food_experience: 'Food Experience',
    shopping_assistance: 'Shopping Assistance',
    events: 'Public Event',
    business_networking: 'Networking',
    bookstore: 'Bookstore Visit',
    wellness_walk: 'Wellness Walk',
    movies: 'Cinema'
  };
  return map[cat] ?? cat.replace(/_/g, ' ');
}

function formatSessionTime(isoStart: string, isoEnd: string): string {
  const start = new Date(isoStart);
  const end = new Date(isoEnd);
  const now = new Date();
  const tom = new Date(now);tom.setDate(tom.getDate() + 1);
  const isToday = start.toDateString() === now.toDateString();
  const isTomorrow = start.toDateString() === tom.toDateString();
  const day = isToday ? i18next.t("content.sessions.UpcomingSessionsScreen.today") : isTomorrow ? i18next.t("content.sessions.UpcomingSessionsScreen.tomorrow") :
  start.toLocaleDateString(i18next.language || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const s = start.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const e = end.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} • ${s} – ${e}`;
}

function isStartingSoon(isoStart: string): boolean {
  const diff = new Date(isoStart).getTime() - Date.now();
  return diff > 0 && diff <= 60 * 60 * 1000; // within 1 hour
}

// ─── Session Card ─────────────────────────────────────────────────────────────

interface SessionCardProps {
  session: Session;
  onViewPass: () => void;
  onDetails: () => void;
  onReminder: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onViewPass, onDetails, onReminder }) => {
  const { t } = useTranslation();
  const soon = isStartingSoon(session.scheduledStart);
  const isActive = session.status === 'active' || session.status === 'checked_in';

  return (
    <View style={styles.card}>
      {/* ── Status chip + reminder ── */}
      <View style={styles.cardTopRow}>
        <Text style={styles.cardDateTime}>
          {formatSessionTime(session.scheduledStart, session.scheduledEnd)}
        </Text>
        {soon || isActive ?
        <View style={styles.chipGreen}>
            <View style={styles.pulseDot} />
            <Text style={styles.chipGreenText}>{isActive ? i18next.t("content.sessions.UpcomingSessionsScreen.active") : i18next.t("content.sessions.UpcomingSessionsScreen.starting_soon")}</Text>
          </View> :

        <View style={styles.chipGold}>
            <Text style={styles.chipGoldText}>{i18next.t("content.sessions.UpcomingSessionsScreen.confirmed")}</Text>
          </View>
        }
        <TouchableOpacity
          style={styles.reminderBtn}
          onPress={onReminder}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={i18next.t("accessibility.set_session_reminder")}>
          <Icon name="notifications-none" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* ── Activity title ── */}
      <Text style={styles.activityTitle}>{categoryLabel(session.category)}</Text>

      {/* ── Customer row ── */}
      <View style={styles.customerRow}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerAvatarText}>{session.customer.displayInitials}</Text>
        </View>
        <Text style={styles.customerInitials}>{session.customer.displayInitials}</Text>
        {session.customer.isVerified &&
        <Icon name="verified" size={14} color={colors.safetyGreen} style={{ marginLeft: 4 }} />
        }
      </View>

      {/* ── Location row ── */}
      <View style={styles.detailRow}>
        <Icon name="place" size={14} color={colors.textMuted} />
        <Text style={styles.detailText}>{session.venue.name}</Text>
      </View>

      {/* ── Meeting point ── */}
      <View style={styles.detailRow}>
        <Icon name="meeting-room" size={14} color={colors.textMuted} />
        <Text style={styles.detailText}>{session.venue.meetingPoint}</Text>
      </View>

      {/* ── Pass code ── */}
      {session.sessionPassCode ?
      <View style={styles.passCodeRow}>
          <Icon name="vpn-key" size={13} color={colors.gold} />
          <Text style={styles.passCodeText}>{i18next.t("content.sessions.UpcomingSessionsScreen.pass")}{session.sessionPassCode}</Text>
        </View> :
      null}

      {/* ── Earnings ── */}
      <View style={styles.earningsRow}>
        <Icon name="account-balance-wallet" size={14} color={colors.textMuted} />
        <Text style={styles.earningsText}>{i18next.t("content.sessions.UpcomingSessionsScreen.estimated")}
          <Text style={styles.earningsValue}>{i18next.t("content.sessions.UpcomingSessionsScreen.text")}{session.estimatedTotal.toLocaleString('en-IN')}</Text>
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ── Action buttons ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.btnPass}
          onPress={onViewPass}
          activeOpacity={0.75}
          accessibilityLabel={i18next.t("accessibility.view_digital_session_pass")}>
          <Icon name="confirmation-number" size={15} color={colors.gold} style={{ marginRight: 5 }} />
          <Text style={styles.btnPassText}>{i18next.t("content.sessions.UpcomingSessionsScreen.digital_pass")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDetails}
          onPress={onDetails}
          activeOpacity={0.8}
          accessibilityLabel={i18next.t("accessibility.view_session_details")}>
          <Text style={styles.btnDetailsText}>{i18next.t("content.sessions.UpcomingSessionsScreen.session_details")}</Text>
          <Icon name="arrow-forward" size={15} color={colors.rootBg} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>
    </View>);

};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{tab: TabKey;onViewRequests: () => void;}> = ({ tab, onViewRequests }) => {
  const { t } = useTranslation();
  const msgs: Record<TabKey, {icon: string;title: string;sub: string;}> = {
    upcoming: { icon: 'event', title: i18next.t("content.sessions.UpcomingSessionsScreen.no_upcoming_sessions"), sub: 'When you accept booking requests, they will appear here.' },
    completed: { icon: 'event-available', title: i18next.t("content.sessions.UpcomingSessionsScreen.no_completed_sessions_yet"), sub: 'Your completed sessions history will appear here.' },
    cancelled: { icon: 'event-busy', title: i18next.t("content.sessions.UpcomingSessionsScreen.no_cancelled_sessions"), sub: 'Cancelled sessions will be shown here.' }
  };
  const { icon, title, sub } = msgs[tab];

  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconCircle}>
        <Icon name={icon as any} size={40} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{sub}</Text>
      {tab === 'upcoming' &&
      <TouchableOpacity style={styles.emptyBtn} onPress={onViewRequests} activeOpacity={0.75}>
          <Icon name="inbox" size={16} color={colors.gold} />
          <Text style={styles.emptyBtnText}>{i18next.t("content.sessions.UpcomingSessionsScreen.view_booking_requests")}</Text>
        </TouchableOpacity>
      }
    </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function UpcomingSessionsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

  // Stable-ref selectors — no derivation inside the hook (prevents infinite loop)
  const { upcomingSessions, sessionHistory } = useSessionStore(
    useShallow((s) => ({
      upcomingSessions: s.upcomingSessions,
      sessionHistory: s.sessionHistory
    }))
  );

  // All sessions pool — derived outside the hook with useMemo
  const allSessions = useMemo(
    () => [...upcomingSessions, ...sessionHistory],
    [upcomingSessions, sessionHistory]
  );

  const filteredSessions = useMemo(
    () => allSessions.filter((s) => TAB_STATUSES[activeTab].includes(s.status)),
    [allSessions, activeTab]
  );

  const TABS: {key: TabKey;label: string;}[] = [{ key: "upcoming", label: "content.sessions.UpcomingSessionsScreen.tabs.0.label" }, { key: "completed", label: "content.sessions.UpcomingSessionsScreen.tabs.1.label" }, { key: "cancelled", label: "content.sessions.UpcomingSessionsScreen.tabs.2.label" }] as any[];





  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        tabScreen
        title={i18next.t("content.sessions.UpcomingSessionsScreen.sessions")}
        subtitle={i18next.t("content.sessions.UpcomingSessionsScreen.upcoming_history")}
        rightIcon="calendar-today"
        showBack={false}
        onRightPress={() => navigation.navigate(Routes.AVAILABILITY_CALENDAR)} />
      

      {/* ── Tab bar ── */}
      <View style={styles.tabBar}>
        {TABS.map((tab) =>
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => setActiveTab(tab.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.key }}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {t(tab.label)}
            </Text>
            {activeTab === tab.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        )}
      </View>

      <FlatList<Session>
        data={filteredSessions}
        keyExtractor={(item) => item.sessionId}
        renderItem={({ item }) =>
        <SessionCard
          session={item}
          onViewPass={() => navigation.navigate(Routes.DIGITAL_SESSION_PASS, { sessionId: item.sessionId })}
          onDetails={() => navigation.navigate(Routes.SESSION_DETAIL, { sessionId: item.sessionId })}
          onReminder={() => navigation.navigate(Routes.SESSION_REMINDER, { sessionId: item.sessionId })} />

        }
        contentContainerStyle={[
        styles.listContent,
        filteredSessions.length === 0 && styles.listContentEmpty]
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <EmptyState
          tab={activeTab}
          onViewRequests={() => (navigation as any).navigate('RequestsTab', { screen: Routes.BOOKING_REQUESTS_INBOX })} />

        } />
      
    </SafeAreaView>);

}

export default UpcomingSessionsScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    backgroundColor: colors.rootBg
  },
  tabItem: {
    flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative'
  },
  tabText: {
    fontFamily: fontFamily.interMedium, fontSize: 14, color: colors.textMuted
  },
  tabTextActive: {
    fontFamily: fontFamily.interBold, color: colors.gold
  },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: '20%', right: '20%',
    height: 2, backgroundColor: colors.gold, borderRadius: 1
  },

  // List
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100
  },
  listContentEmpty: { flex: 1, justifyContent: 'center' },

  // Card
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  cardTopRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.sm
  },
  cardDateTime: {
    fontFamily: fontFamily.interMedium, fontSize: 12, color: colors.textMuted, flex: 1
  },

  // Status chips
  chipGold: {
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.35)',
    borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3
  },
  chipGoldText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.gold
  },
  chipGreen: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(109,214,165,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.30)',
    borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3, gap: 5
  },
  chipGreenText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.safetyGreen
  },
  pulseDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: colors.safetyGreen
  },

  // Activity
  activityTitle: {
    fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary,
    marginBottom: spacing.sm
  },

  // Customer
  customerRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs
  },
  customerAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm
  },
  customerAvatarText: {
    fontFamily: fontFamily.interBold, fontSize: 10, color: colors.gold
  },
  customerInitials: {
    fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary
  },

  // Detail rows
  detailRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 4
  },
  detailText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    marginLeft: 6, flex: 1
  },
  passCodeRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs
  },
  passCodeText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold, marginLeft: 5
  },
  earningsRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs
  },
  earningsText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginLeft: 6
  },
  earningsValue: {
    fontFamily: fontFamily.interBold, color: colors.gold
  },

  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: spacing.md
  },

  // Action buttons
  actionRow: { flexDirection: 'row' },
  reminderBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: spacing.xs
  },
  btnPass: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 11, borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.35)',
    marginRight: spacing.sm
  },
  btnPassText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold
  },
  btnDetails: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 11, borderRadius: radius.md,
    backgroundColor: colors.gold
  },
  btnDetailsText: {
    fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg
  },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxxxl },
  emptyIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.borderSurface,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg
  },
  emptyTitle: {
    fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.sm
  },
  emptySubtitle: {
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl
  },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    backgroundColor: 'rgba(214,168,79,0.08)'
  },
  emptyBtnText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold, marginLeft: spacing.xs
  }
});