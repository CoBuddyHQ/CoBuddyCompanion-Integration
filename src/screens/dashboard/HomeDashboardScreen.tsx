import i18next from "i18next";
/**
 * CPN-061 — Home Dashboard Screen
 * First screen companions see after login. All 6 sections per design spec.
 */
import { AdminConfig } from '../../config/adminValues';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useProfileStore } from '../../store/slices/profileStore';
import { useSessionStore } from '../../store/slices/sessionStore';
import { useRequestStore } from '../../store/slices/requestStore';
import { useEarningsStore } from '../../store/slices/earningsStore';
import { useAvailabilityStore } from '../../store/slices/availabilityStore';
import { useNotificationStore } from '../../store/slices/notificationStore';
import { useSafetyStore } from '../../store/slices/safetyStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? i18next.t("content.dashboard.HomeDashboardScreen.good_morning") : h < 17 ? i18next.t("content.dashboard.HomeDashboardScreen.good_afternoon") : i18next.t("content.dashboard.HomeDashboardScreen.good_evening");
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function fmtINR(val: number): string {
  return `₹${val.toLocaleString('en-IN')}`;
}

// ─── Category label helper ───────────────────────────────────────────────────

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

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((d.getTime() - now.getTime()) / 86_400_000);
  const timeStr = d.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 0) {return `Today • ${timeStr}`;}
  if (diffDays === 1) {return `Tomorrow • ${timeStr}`;}
  return `${d.toLocaleDateString(i18next.language || 'en-IN', { day: 'numeric', month: 'short' })} • ${timeStr}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const Divider: React.FC = () => <View style={styles.divider} />;

const Chip: React.FC<{
  icon: string;
  label: string;
  color: string;
  bg: string;
}> = ({ icon, label, color, bg }) =>
<View style={[styles.chip, { backgroundColor: bg }]}>
    <Icon name={icon} size={12} color={color} />
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>;


const StatusChip: React.FC<{label: string;color: string;bg: string;border?: string;}> = ({
  label, color, bg, border
}) =>
<View style={[styles.statusChip, { backgroundColor: bg, borderColor: border ?? 'transparent', borderWidth: border ? 1 : 0 }]}>
    <Text style={[styles.statusChipText, { color }]}>{label}</Text>
  </View>;


const SectionLabel: React.FC<{label: string;}> = ({ label }) =>
<Text style={styles.sectionLabel}>{label}</Text>;


// ─── Pulsing dot (used in upcoming session) ───────────────────────────────────

const PulsingDot: React.FC = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
      Animated.timing(opacity, { toValue: 0.3, duration: 750, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true })]
      )
    ).start();
  }, [opacity]);
  return <Animated.View style={[styles.pulsingDot, { opacity }]} />;
};

// ─── Stat Card (Today Snapshot) ───────────────────────────────────────────────

const StatCard: React.FC<{
  icon?: string;
  iconText?: string;
  value: string;
  label: string;
  onPress: () => void;
  mr?: boolean;
}> = ({ icon, iconText, value, label, onPress, mr }) =>
<TouchableOpacity accessibilityRole="button"
  style={[styles.statCard, mr && { marginRight: 10 }]}
  onPress={onPress}
  activeOpacity={0.75}>
    {iconText ?
  <Text style={styles.statIconText}>{iconText}</Text> :

  <Icon name={icon!} size={22} color={colors.gold} />
  }
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>;


// ─── Main Screen ──────────────────────────────────────────────────────────────


export function HomeDashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();
  // useNavigation typed as any — this screen is a cross-stack hub; strict
  // CompositeNavigationProp would require threading every reachable stack.

  const navigation = useNavigation<any>();
  const profile = useProfileStore((s) => s.profile);
  const upcomingSessions = useSessionStore((s) => s.upcomingSessions);
  const pendingRequests = useRequestStore((s) => s.pendingRequests);
  const availableBalance = useEarningsStore((s) => s.availableBalance);
  const pendingClearance = useEarningsStore((s) => s.pendingClearance);
  const recentTransactions = useEarningsStore((s) => s.recentTransactions);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const sosStatus = useSafetyStore((s) => s.sosStatus);
  const venueApproved = useSafetyStore((s) => s.currentVenueApproved);

  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const fetchUpcomingSessions = useSessionStore((s) => s.fetchUpcomingSessions);
  const fetchRequests = useRequestStore((s) => s.fetchRequests);
  const fetchSummary = useEarningsStore((s) => s.fetchSummary);
  const fetchTransactions = useEarningsStore((s) => s.fetchTransactions);
  const fetchAvailability = useAvailabilityStore((s) => s.fetchAvailability);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    fetchProfile();
    fetchUpcomingSessions();
    fetchRequests();
    fetchSummary();
    fetchTransactions(1, 10);
    fetchAvailability();
    fetchNotifications();
  }, []);

  const [showRequest, setShowRequest] = useState(true);

  const displayName = profile?.displayName ?? 'Companion';
  const city = profile?.city ?? 'Your City';
  const initials = getInitials(displayName);
  const isPublished = profile?.verificationStatus === 'approved';
  const isSafetyActive = sosStatus === 'idle' && venueApproved;
  const pendingCount = pendingRequests?.length ?? 0;
  const availableSlots = useAvailabilityStore((s) => s.slots.length);
  const todaySessionCount = upcomingSessions?.length ?? 0;
  const todayEarnings = availableBalance;
  // Week earnings: sum credits from recentTransactions
  const weekEarnings = recentTransactions.
  filter((t) => t.amount > 0 || t.status === 'pending_review').
  reduce((sum, t) => sum + t.amount, 0);
  const pendingEarnings = pendingClearance;

  const firstRequest = pendingRequests?.[0] ?? null;
  const firstSession = upcomingSessions?.[0] ?? null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      {/* ══════════════════════════════════════════
              TOP BAR
           ══════════════════════════════════════════ */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarBrand}> {i18next.t('dashboard.cobuddy')} </Text>
          <Text style={styles.topBarGreeting}>{getGreeting()}, {displayName.split(' ')[0]}</Text>
        </View>
        <View style={styles.topBarRight}>
          {/* Bell */}
          <TouchableOpacity accessibilityRole="button"
            style={styles.bellWrap}
            onPress={() => navigation.navigate(Routes.NOTIFICATION_CENTER)}
            accessibilityLabel={i18next.t("accessibility.notifications")}>
            <Icon name="notifications" size={24} color={colors.textSecondary} />
            {unreadCount > 0 && <View style={styles.bellBadge} />}
          </TouchableOpacity>
          {/* Avatar */}
          <TouchableOpacity accessibilityRole="button"
            style={styles.avatar}
            onPress={() => navigation.navigate('GlobalProfileStack', { screen: Routes.COMPANION_PROFILE })}
            accessibilityLabel={i18next.t("accessibility.profile")}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
                SECTION 1 — PROFILE STATUS HERO
             ══════════════════════════════════════════ */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}> {i18next.t('dashboard.your_profile_is_live')} </Text>
          <Text style={styles.heroSubtitle}>
             {i18next.t('dashboard.you_are_visible_to_vetted_clients_and_ready_to_receive_verified_requests')} </Text>
          <View style={styles.chipRow}>
            {isPublished &&
            <Chip icon="check-circle" label={i18next.t('dashboard.published')} color={colors.safetyGreen} bg={colors.safetyGreenSubtle} />
            }
            {isSafetyActive &&
            <Chip icon="shield" label={i18next.t('dashboard.safety_active')} color={colors.safetyGreen} bg={colors.safetyGreenSubtle} />
            }
            <Chip icon="place" label={i18next.t('dashboard.public_venues_only')} color={colors.gold} bg={colors.goldSubtle} />
          </View>
          <View style={styles.heroIdentityRow}>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>{initials}</Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.heroName}>{displayName}</Text>
              <View style={styles.heroVerifiedRow}>
                <Icon name="verified" size={12} color={colors.gold} />
                <Text style={styles.heroVerified}>  {i18next.t('dashboard.verified_companion')} </Text>
              </View>
              <Text style={styles.heroCity}>{city}</Text>
            </View>
          </View>
          <TouchableOpacity accessibilityRole="button"
            style={styles.heroCTA}
            onPress={() => navigation.navigate(Routes.TODAY_OVERVIEW)}
            activeOpacity={0.8}>
            <Text style={styles.heroCTAText}> {i18next.t('dashboard.view_today')} </Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════
                SECTION 2 — TODAY SNAPSHOT 2×2 GRID
             ══════════════════════════════════════════ */}
        <View style={{ marginBottom: 16 }}>
          <SectionLabel label={i18next.t('dashboard.today_snapshot')} />
          <View style={styles.gridRow}>
            <StatCard
              icon="mail"
              value={String(pendingCount)}
              label={i18next.t('dashboard.new_requests')}
              onPress={() => navigation.navigate('RequestsTab', { screen: Routes.BOOKING_REQUESTS_INBOX })}
              mr />
            <StatCard
              icon="event-available"
              value={String(availableSlots)}
              label={i18next.t('dashboard.available_slots')}
              onPress={() => navigation.navigate(Routes.AVAILABILITY_CALENDAR)} />
          </View>
          <View style={[styles.gridRow, { marginTop: 10 }]}>
            <StatCard
              icon="schedule"
              value={String(todaySessionCount)}
              label={i18next.t('dashboard.upcoming_sessions')}
              onPress={() => navigation.navigate('SessionsTab', { screen: Routes.UPCOMING_SESSIONS })}
              mr />
            <StatCard
              iconText="₹"
              value={fmtINR(todayEarnings)}
              label={i18next.t('dashboard.today_earnings')}
              onPress={() => navigation.navigate('EarningsTab', { screen: Routes.EARNINGS_DASHBOARD })} />
          </View>
        </View>

        {/* ══════════════════════════════════════════
                SECTION 3 — BOOKING REQUESTS CARD
             ══════════════════════════════════════════ */}
        <View style={[styles.card, { marginBottom: 16 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Icon name="mail" size={20} color={colors.gold} />
              <Text style={styles.cardTitle}> {i18next.t('dashboard.booking_requests')} </Text>
            </View>
            <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('RequestsTab', { screen: Routes.BOOKING_REQUESTS_INBOX })}>
              <Text style={styles.viewAll}> {i18next.t('dashboard.view_all')} </Text>
            </TouchableOpacity>
          </View>

          {firstRequest && showRequest ?
          <>
              <View style={{ marginTop: 12 }}>
                <View style={styles.requestTopRow}>
                  <Text style={styles.requestActivity}>
                    {catLabel(firstRequest.category)}
                  </Text>
                  <Text style={styles.requestPrice}>{i18next.t("content.dashboard.HomeDashboardScreen.text")}{firstRequest.estimatedEarning}</Text>
                </View>
                <View style={styles.requestMetaRow}>
                  <Icon name="place" size={14} color={colors.textSecondary} />
                  <Text style={styles.requestMeta}>
                    {' '}{firstRequest.venue?.area ?? 'Venue TBD'}{i18next.t("content.dashboard.HomeDashboardScreen.text_1")}{fmtDate(firstRequest.proposedStart)}
                  </Text>
                </View>
                <View style={styles.chipRow}>
                  <Chip icon="verified-user" label={i18next.t('dashboard.verified_customer')} color={colors.safetyGreen} bg={colors.safetyGreenSubtle} />
                  <Chip icon="shield" label={i18next.t('dashboard.safety_checked')} color={colors.safetyGreen} bg={colors.safetyGreenSubtle} />
                </View>
              </View>
              <Divider />
              <View style={styles.requestBtnRow}>
                <TouchableOpacity accessibilityRole="button"
                style={[styles.requestBtnFilled, { flex: 1 }]}
                onPress={() => navigation.navigate('RequestsTab', { screen: Routes.BOOKING_REQUESTS_INBOX })}
                activeOpacity={0.8}>
                  <Text style={styles.requestBtnFilledText}> {i18next.t('dashboard.review')} </Text>
                </TouchableOpacity>
                <TouchableOpacity accessibilityRole="button"
                style={[styles.requestBtnOutline, { flex: 1, marginLeft: 10 }]}
                onPress={() => setShowRequest(false)}
                activeOpacity={0.8}>
                  <Text style={styles.requestBtnOutlineText}> {i18next.t('dashboard.later')} </Text>
                </TouchableOpacity>
              </View>
            </> :

          <View style={styles.emptyState}>
              <Icon name="inbox" size={32} color={colors.textMuted} />
              <Text style={styles.emptyTitle}> {i18next.t('dashboard.no_pending_requests')} </Text>
              <Text style={styles.emptySubtitle}> {i18next.t('dashboard.new_requests_will_appear_here')} </Text>
            </View>
          }
        </View>

        {/* ══════════════════════════════════════════
                SECTION 4 — UPCOMING SESSION CARD
             ══════════════════════════════════════════ */}
        <View style={[styles.card, { marginBottom: 16 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Icon name="event" size={20} color={colors.gold} />
              <Text style={styles.cardTitle}> {i18next.t('dashboard.upcoming_session')} </Text>
            </View>
            {firstSession &&
            <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('SessionsTab', { screen: Routes.SESSION_DETAIL, params: { sessionId: firstSession.sessionId } })}>
                <Text style={styles.viewAll}> {i18next.t('dashboard.details')} </Text>
              </TouchableOpacity>
            }
          </View>

          {firstSession ?
          <>
              <View style={[styles.sessionNameRow, { marginTop: 12 }]}>
                <Text style={styles.sessionName}>{catLabel(firstSession.category)}</Text>
                {firstSession.status === 'upcoming' && <PulsingDot />}
              </View>
              <View style={styles.sessionMetaRow}>
                <Icon name="event" size={14} color={colors.textSecondary} />
                <Text style={styles.sessionMeta}> {fmtDate(firstSession.scheduledStart)}</Text>
              </View>
              <View style={styles.sessionMetaRow}>
                <Icon name="place" size={14} color={colors.textSecondary} />
                <Text style={styles.sessionMeta}> {firstSession.venue?.name ?? 'Venue TBD'}</Text>
              </View>
              <Divider />
              <View style={styles.sessionStatusRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionStatusLabel}> {i18next.t('dashboard.status')} </Text>
                  <StatusChip label={i18next.t('dashboard.confirmed')} color={colors.gold} bg={colors.goldSubtle} border={colors.goldSubtle} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionStatusLabel}> {i18next.t('dashboard.safety')} </Text>
                  <Text style={styles.sessionStatusValue}> {i18next.t('dashboard.check_in_required')} </Text>
                </View>
              </View>
            </> :

          <View style={styles.emptyState}>
              <Icon name="event" size={32} color={colors.textMuted} />
              <Text style={styles.emptyTitle}> {i18next.t('dashboard.no_sessions_today')} </Text>
              <Text style={styles.emptySubtitle}> {i18next.t('dashboard.update_your_availability_to_get_bookings')} </Text>
            </View>
          }
        </View>

        {/* ══════════════════════════════════════════
                SECTION 5 — EARNINGS CARD
             ══════════════════════════════════════════ */}
        <View style={[styles.card, { marginBottom: 16 }]}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="account-balance-wallet" size={20} color={colors.gold} />
            <Text style={styles.cardTitle}> {i18next.t('dashboard.earnings')} </Text>
          </View>
          <View style={[styles.earningsRow, { marginTop: 14 }]}>
            <Text style={styles.earningsLabel}> {i18next.t('dashboard.this_week')} </Text>
            <Text style={styles.earningsValueGold}>{fmtINR(weekEarnings)}</Text>
          </View>
          <View style={[styles.earningsRow, { marginTop: 8 }]}>
            <Text style={styles.earningsLabel}> {i18next.t('dashboard.pending')} </Text>
            <Text style={styles.earningsValueMuted}>{fmtINR(pendingEarnings)}</Text>
          </View>
          <Text style={styles.earningsNote}> {i18next.t('dashboard.next_payout_after_completed_sessions')} </Text>
          <TouchableOpacity accessibilityRole="button"
            onPress={() => navigation.navigate('EarningsTab', { screen: Routes.EARNINGS_DASHBOARD })}
            style={{ marginTop: 12, alignItems: 'flex-end' }}>
            <Text style={styles.earningsCTA}> {i18next.t('dashboard.view_earnings')} </Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════
                SECTION 6 — AVAILABILITY QUICK ACCESS
             ══════════════════════════════════════════ */}
        <TouchableOpacity accessibilityRole="button"
          style={[styles.card, styles.availabilityTile]}
          onPress={() => navigation.navigate(Routes.AVAILABILITY_CALENDAR)}
          activeOpacity={0.82}
          accessibilityLabel={i18next.t("accessibility.manage_availability")}>
          <View style={styles.availabilityLeft}>
            <View style={styles.availabilityIconWrap}>
              <Icon name="calendar-today" size={22} color={colors.gold} />
            </View>
            <View>
              <Text style={styles.availabilityTitle}> {i18next.t('dashboard.manage_availability')} </Text>
              <Text style={styles.availabilitySubtitle}> {i18next.t('dashboard.set_your_working_hours_days_off')} </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={22} color={colors.gold} />
        </TouchableOpacity>

        {/* ══════════════════════════════════════════
                SECTION 7 — SAFETY STATUS
             ══════════════════════════════════════════ */}
        <TouchableOpacity accessibilityRole="button"
          style={[styles.card, { marginBottom: 16 }]}
          onPress={() => navigation.navigate('GlobalProfileStack', { screen: Routes.COMPANION_SAFETY_HUB })}
          activeOpacity={0.85}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="shield" size={20} color={colors.gold} />
            <Text style={styles.cardTitle}> {i18next.t('dashboard.safety_status')} </Text>
          </View>
          {[
          { icon: 'security', label: i18next.t("content.dashboard.HomeDashboardScreen.safety_tools"), chip: 'Active', green: true },
          { icon: 'location-on', label: i18next.t("content.dashboard.HomeDashboardScreen.live_location"), chip: 'Ready', green: true },
          { icon: 'headset-mic', label: i18next.t("content.dashboard.HomeDashboardScreen.cobuddy_support"), chip: 'Available', green: true },
          { icon: 'lock', label: i18next.t("content.dashboard.HomeDashboardScreen.public_venue_policy"), chip: 'Locked', green: false }].
          map((row, i, arr) =>
          <View key={t(row.label)}>
              <View style={styles.safetyRow}>
                <View style={styles.safetyLeft}>
                  <Icon name={row.icon as any} size={18} color={colors.textSecondary} />
                  <Text style={styles.safetyLabel}>{t(row.label)}</Text>
                </View>
                <StatusChip
                label={t(row.chip)}
                color={row.green ? colors.safetyGreen : colors.gold}
                bg={row.green ? colors.safetyGreenSubtle : colors.goldSubtle} />
              
              </View>
              {i < arr.length - 1 && <View style={styles.safetyDivider} />}
            </View>
          )}
        </TouchableOpacity>

        {/* ═══ QUICK LINKS ROW ═══ */}
        <View style={styles.quickLinksRow}>
          {[
          { icon: 'bar-chart', label: i18next.t("content.dashboard.HomeDashboardScreen.insights"), route: Routes.PERFORMANCE_INSIGHTS },
          { icon: 'campaign', label: i18next.t("content.dashboard.HomeDashboardScreen.news"), route: Routes.IMPORTANT_ANNOUNCEMENTS },
          { icon: 'flash-on', label: i18next.t("content.dashboard.HomeDashboardScreen.quick_actions"), route: Routes.QUICK_ACTIONS }].
          map((q) =>
          <TouchableOpacity accessibilityRole="button" key={t(q.label)} style={styles.quickLinkBtn}
          onPress={() => navigation.navigate(q.route)} activeOpacity={0.75}>
              <Icon name={q.icon as any} size={18} color={colors.gold} />
              <Text style={styles.quickLinkText}>{t(q.label)}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ═══ SUPPORT LINK ═══ */}
        <TouchableOpacity accessibilityRole="button"
          onPress={() => navigation.navigate(Routes.SUPPORT_CENTER)}
          style={styles.supportLink}
          activeOpacity={0.7}
          accessibilityLabel={i18next.t("accessibility.contact_support_1")}>
          <Icon name="headset-mic" size={16} color={colors.textMuted} />
          <Text style={styles.supportLinkText}> {i18next.t('dashboard.need_help_contact_support')} </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>);

}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: colors.rootBg
  },
  topBarBrand: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.gold },
  topBarGreeting: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, marginTop: 1 },
  topBarRight: { flexDirection: 'row', alignItems: 'center' },
  bellWrap: { marginRight: 14, position: 'relative' },
  bellBadge: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.softWarning,
    borderWidth: 1.5, borderColor: colors.rootBg
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center'
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg },

  // Chips
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, marginRight: 8, marginTop: 8
  },
  chipText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, marginLeft: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },

  // Hero card
  heroCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    marginBottom: 16
  },
  heroTitle: { fontFamily: fontFamily.playfairBold, fontSize: 18, color: colors.textPrimary },
  heroSubtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 19 },
  heroIdentityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  heroAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center'
  },
  heroAvatarText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg },
  heroName: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  heroVerifiedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  heroVerified: { fontFamily: fontFamily.interMedium, fontSize: 12, color: colors.gold },
  heroCity: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  heroCTA: {
    marginTop: 14, alignSelf: 'flex-start',
    backgroundColor: colors.gold, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 20
  },
  heroCTAText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg },

  // Section label
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary, marginBottom: 10 },

  // Stat grid
  gridRow: { flexDirection: 'row' },
  statCard: {
    flex: 1, backgroundColor: colors.cardSurface,
    borderRadius: 12, padding: 14
  },
  statIconText: { fontFamily: fontFamily.interBold, fontSize: 22, color: colors.gold },
  statValue: { fontFamily: fontFamily.interBold, fontSize: 26, color: colors.textPrimary, marginTop: 6 },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },

  // General card
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16, padding: 16
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary, marginLeft: 8 },
  viewAll: { fontFamily: fontFamily.interMedium, fontSize: 13, color: colors.gold },

  // Divider
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 12 },

  // Requests
  requestTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestActivity: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary },
  requestPrice: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.gold },
  requestMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  requestMeta: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary },
  requestBtnRow: { flexDirection: 'row' },
  requestBtnFilled: {
    backgroundColor: colors.gold, borderRadius: 10,
    paddingVertical: 10, alignItems: 'center'
  },
  requestBtnFilledText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg },
  requestBtnOutline: {
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.4)',
    borderRadius: 10, paddingVertical: 10, alignItems: 'center'
  },
  requestBtnOutlineText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary, marginTop: 8 },
  emptySubtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginTop: 4 },

  // Session
  sessionNameRow: { flexDirection: 'row', alignItems: 'center' },
  sessionName: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary },
  pulsingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, marginLeft: 8 },
  sessionMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  sessionMeta: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary },
  sessionStatusRow: { flexDirection: 'row' },
  sessionStatusLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  sessionStatusValue: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, marginTop: 4 },

  // Status chip
  statusChip: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 999
  },
  statusChipText: { fontFamily: fontFamily.interSemiBold, fontSize: 12 },

  // Earnings
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsLabel: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary },
  earningsValueGold: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.gold },
  earningsValueMuted: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary },
  earningsNote: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 6 },
  earningsCTA: { fontFamily: fontFamily.interMedium, fontSize: 14, color: colors.gold },

  // Safety
  safetyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  safetyLeft: { flexDirection: 'row', alignItems: 'center' },
  safetyLabel: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, marginLeft: 10 },
  safetyDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  // Availability tile
  availabilityTile: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16,
    borderColor: 'rgba(214,168,79,0.22)'
  },
  availabilityLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  availabilityIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  availabilityTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  availabilitySubtitle: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 3 },

  // Support link
  supportLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 8
  },
  supportLinkText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },

  // Quick links row
  quickLinksRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: colors.cardSurface, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14, marginBottom: 16
  },
  quickLinkBtn: { flex: 1, alignItems: 'center', gap: 6 },
  quickLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.textMuted }
});

export default HomeDashboardScreen;