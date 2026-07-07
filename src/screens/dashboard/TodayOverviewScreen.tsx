/**
 * TodayOverviewScreen (CPN-062)
 * Timeline is now driven by useSessionStore.upcomingSessions.
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import type { Session } from '../../store/types/store.types';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";
import i18next from 'i18next';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit' });
}

function catLabel(cat: string): string {
  const m: Record<string, string> = {
    cafe_conversation: 'Café Conversation', city_walk: 'City Walk',
    food_experience: 'Food Experience', art_culture: 'Art & Culture',
    shopping_assistance: 'Shopping', events: 'Events',
    business_networking: 'Networking', bookstore: 'Bookstore',
    wellness_walk: 'Wellness', movies: 'Cinema'
  };
  return m[cat] ?? cat.replace(/_/g, ' ');
}

type TStatus = 'upcoming' | 'pending' | 'empty';

interface TimelineItem {
  time: string;
  title: string;
  status: TStatus;
  sub?: string;
  sessionId?: string;
}

const DOT_COLOR: Record<TStatus, string> = {
  upcoming: colors.safetyGreen,
  pending: '#F5A623',
  empty: colors.textMuted
};

const STATUS_LABEL: Record<TStatus, string> = {
  upcoming: 'Confirmed',
  pending: 'Pending',
  empty: 'Open Slot'
};

function sessionToItem(s: Session): TimelineItem {
  const tStatus: TStatus = s.status === 'upcoming' ? 'upcoming' : 'pending';
  return {
    time: fmtTime(s.scheduledStart),
    title: catLabel(s.category),
    status: tStatus,
    sub: s.venue?.area ?? s.venue?.city ?? undefined,
    sessionId: s.sessionId
  };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function TodayOverviewScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const upcomingSessions = useSessionStore((s) => s.upcomingSessions);

  // Filter to today's sessions and map to timeline items
  const today = new Date().toDateString();
  const todaySessions = upcomingSessions.filter(
    (s) => new Date(s.scheduledStart).toDateString() === today
  );

  const timeline: TimelineItem[] = todaySessions.length > 0 ?
  todaySessions.map(sessionToItem) :
  [{ time: 'Today', title: t("content.dashboard.TodayOverviewScreen.no_sessions_scheduled"), status: 'empty' }];

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('dashboard.today_s_schedule')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Banner — dynamic count */}
        <View style={s.banner}>
          <Icon name="today" size={18} color={colors.rootBg} />
          <Text style={s.bannerText}>
            {todaySessions.length > 0 ?
            `You have ${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} today!` : t("content.dashboard.TodayOverviewScreen.no_sessions_today_update_availability_to")
            }
          </Text>
        </View>

        {/* Date strip */}
        <Text style={s.dateLabel}>
          {new Date().toLocaleDateString(i18next.language || 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>

        {/* Timeline */}
        <View style={s.timeline}>
          {timeline.map((item, i) =>
          <View key={`${item.time}-${i}`} style={s.timelineRow}>
              {/* Left: time + line */}
              <View style={s.timeCol}>
                <Text style={s.timeText}>{item.time}</Text>
                {i < timeline.length - 1 && <View style={s.line} />}
              </View>

              {/* Dot */}
              <View style={s.dotWrap}>
                <View style={[s.dot, { backgroundColor: DOT_COLOR[item.status] }]} />
              </View>

              {/* Card */}
              <TouchableOpacity accessibilityRole="button"
              style={[s.timelineCard, item.status === 'empty' && s.timelineCardEmpty]}
              activeOpacity={item.sessionId ? 0.8 : 1}
              onPress={() =>
              item.sessionId ?
              navigation.navigate('SessionsTab', { screen: Routes.SESSION_DETAIL, params: { sessionId: item.sessionId } }) :
              undefined
              }>
                <View style={s.timelineCardTop}>
                  <Text style={[s.timelineTitle, item.status === 'empty' && s.timelineTitleMuted]}>
                    {t(item.title)}
                  </Text>
                  <View style={[s.statusPill, { borderColor: DOT_COLOR[item.status] }]}>
                    <Text style={[s.statusPillText, { color: DOT_COLOR[item.status] }]}>
                      {STATUS_LABEL[item.status]}
                    </Text>
                  </View>
                </View>
                {item.sub && <Text style={s.timelineSub}>{t(item.sub)}</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.footer}>
        <TouchableOpacity accessibilityRole="button" style={s.footerBtn}
        onPress={() => navigation.navigate(Routes.AVAILABILITY_CALENDAR)} activeOpacity={0.85}>
          <Icon name="calendar-month" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.footerBtnText}> {t('dashboard.manage_availability')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default TodayOverviewScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.gold, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.md },
  bannerText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg, flex: 1 },
  dateLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted,
    marginBottom: spacing.lg },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  timeCol: { width: 72, alignItems: 'flex-end', paddingRight: spacing.sm, paddingTop: 14 },
  timeText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.textMuted },
  line: { width: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'center', minHeight: 60, marginTop: 4 },
  dotWrap: { width: 20, alignItems: 'center', paddingTop: 16, zIndex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  timelineCard: { flex: 1, backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginLeft: spacing.sm, marginBottom: spacing.sm },
  timelineCardEmpty: { borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'transparent' },
  timelineCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timelineTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, flex: 1 },
  timelineTitleMuted: { color: colors.textMuted },
  timelineSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  statusPill: { borderRadius: radius.full, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 2, flexShrink: 0 },
  statusPillText: { fontFamily: fontFamily.interBold, fontSize: 10 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  footerBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  footerBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});