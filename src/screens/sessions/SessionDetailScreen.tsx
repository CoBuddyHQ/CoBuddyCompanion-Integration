import i18next from "i18next";
/**
 * CPN-097 — Session Detail Screen
 * Full details and management hub for a specific session.
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Animated } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import GlassCard from '../../components/cards/GlassCard';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.SESSION_DETAIL>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function formatDateRange(isoStart: string, isoEnd: string): string {
  const s = new Date(isoStart),e = new Date(isoEnd),now = new Date();
  const tom = new Date(now);tom.setDate(tom.getDate() + 1);
  const isToday = s.toDateString() === now.toDateString();
  const isTomorrow = s.toDateString() === tom.toDateString();
  const day = isToday ? i18next.t("content.sessions.SessionDetailScreen.today") : isTomorrow ? i18next.t("content.sessions.SessionDetailScreen.tomorrow") :
  s.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const st = s.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const et = e.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}, ${st} – ${et}`;
}

// ─── Pulsing dot ─────────────────────────────────────────────────────────────

const PulsingDot: React.FC = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
    Animated.timing(opacity, { toValue: 0.25, duration: 700, useNativeDriver: true }),
    Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true })]
    )).start();
  }, [opacity]);
  return <Animated.View style={[styles.pulseDot, { opacity }]} />;
};

// ─── Nav row ─────────────────────────────────────────────────────────────────

const NavRow: React.FC<{icon: string;label: string;onPress: () => void;}> = ({ icon, label, onPress }) =>
<TouchableOpacity style={styles.navRow} onPress={onPress} activeOpacity={0.75}>
    <View style={styles.navRowLeft}>
      <Icon name={icon as any} size={18} color={colors.gold} />
      <Text style={styles.navRowLabel}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={20} color={colors.textMuted} />
  </TouchableOpacity>;


// ─── Screen ───────────────────────────────────────────────────────────────────

export function SessionDetailScreen({ route, navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const sessionId = route.params?.sessionId ?? '';

  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null
  );

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={i18next.t('sessions.session_details')} showBack />
        <View style={styles.centeredMsg}>
          <Icon name="search-off" size={44} color={colors.textMuted} />
          <Text style={styles.centeredTitle}> {i18next.t('sessions.session_not_found_1')} </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}> {i18next.t('sessions.go_back_1')} </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const { status, category, customer, venue, scheduledStart, scheduledEnd,
    estimatedTotal, sessionPassCode, durationMinutes } = session;

  const isActive = status === 'active' || status === 'checked_in';
  const isUpcoming = status === 'upcoming' || status === 'pre_arrival';
  const canContact = isActive || isUpcoming;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={i18next.t('sessions.session_details')} showBack />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
                SECTION 1 — STATUS BANNER
             ══════════════════════════════════════════ */}
        {isActive ?
        <View style={styles.bannerGreen}>
            <PulsingDot />
            <Text style={styles.bannerGreenText}> {i18next.t('sessions.session_is_active')} </Text>
          </View> :

        <View style={styles.bannerGold}>
            <Icon name="event" size={15} color={colors.gold} />
            <Text style={styles.bannerGoldText}> {i18next.t('sessions.upcoming_session')} </Text>
          </View>
        }

        {/* ══════════════════════════════════════════
                SECTION 1 — CUSTOMER CARD
             ══════════════════════════════════════════ */}
        <GlassCard style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{customer.displayInitials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.customerName}>{customer.displayInitials}</Text>
              <Text style={styles.customerMeta}>{i18next.t("content.sessions.SessionDetailScreen.text")}
                {(customer.trustScore / 20).toFixed(1)}{i18next.t("content.sessions.SessionDetailScreen.text_1")}{customer.sessionCountOverall}  {i18next.t('sessions.sessions')} </Text>
              <View style={styles.tagsRow}>
                {customer.isVerified &&
                <View style={styles.tagGreen}>
                    <Icon name="verified" size={11} color={colors.safetyGreen} />
                    <Text style={styles.tagGreenText}> {i18next.t('sessions.verified')} </Text>
                  </View>
                }
                {customer.safetyConsent &&
                <View style={styles.tagGreen}>
                    <Icon name="shield" size={11} color={colors.safetyGreen} />
                    <Text style={styles.tagGreenText}> {i18next.t('sessions.safety_ok')} </Text>
                  </View>
                }
              </View>
            </View>
            {/* Contact actions */}
            <View style={styles.contactBtns}>
              <TouchableOpacity
                style={[styles.iconBtn, !canContact && styles.iconBtnMuted]}
                disabled={!canContact}
                onPress={() => (navigation as any).navigate(Routes.IN_SESSION_CHAT, { sessionId })}
                accessibilityLabel={i18next.t("accessibility.chat")}>
                <Icon name="chat" size={18} color={canContact ? colors.gold : colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, !canContact && styles.iconBtnMuted]}
                disabled={!canContact}
                onPress={() => (navigation as any).navigate(Routes.IN_SESSION_CALL, { sessionId })}
                accessibilityLabel={i18next.t("accessibility.call")}>
                <Icon name="call" size={18} color={canContact ? colors.gold : colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>

        {/* ══════════════════════════════════════════
                SECTION 2 — ACTIVITY & VENUE
             ══════════════════════════════════════════ */}
        <GlassCard style={styles.card}>
          <Text style={styles.sectionHeader}> {i18next.t('sessions.activity_details')} </Text>
          {[
          { icon: 'local-activity', label: i18next.t("content.sessions.SessionDetailScreen.activity"), value: categoryLabel(category) },
          { icon: 'schedule', label: i18next.t("content.sessions.SessionDetailScreen.date_time"), value: formatDateRange(scheduledStart, scheduledEnd) },
          { icon: 'language', label: i18next.t("content.sessions.SessionDetailScreen.language"), value: session.language },
          { icon: 'timer', label: i18next.t("content.sessions.SessionDetailScreen.duration"), value: `${durationMinutes} minutes` }].
          map((row) =>
          <View key={t(row.label)} style={styles.detailRow}>
              <Icon name={row.icon as any} size={15} color={colors.textMuted} />
              <Text style={styles.detailLabel}>{t(row.label)}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          )}

          <View style={styles.rowDivider} />

          {/* Venue */}
          <View style={styles.detailRow}>
            <Icon name="storefront" size={15} color={colors.textMuted} />
            <Text style={styles.detailLabel}> {i18next.t('sessions.venue_1')} </Text>
            <Text style={styles.detailValue}>{venue.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="place" size={15} color={colors.textMuted} />
            <Text style={styles.detailLabel}> {i18next.t('sessions.area')} </Text>
            <Text style={styles.detailValue}>{venue.area}, {venue.city}</Text>
          </View>

          {/* Meeting point with navigate link */}
          <View style={styles.detailRow}>
            <Icon name="meeting-room" size={15} color={colors.textMuted} />
            <Text style={styles.detailLabel}> {i18next.t('sessions.meet_at')} </Text>
            <View style={styles.meetRow}>
              <Text style={[styles.detailValue, { flex: 1 }]}>{venue.meetingPoint}</Text>
              <TouchableOpacity
                style={styles.navigateLink}
                onPress={() => (navigation as any).navigate(Routes.NAVIGATION_TO_VENUE, { sessionId })}
                accessibilityLabel={i18next.t("accessibility.navigate_to_venue")}>
                <Icon name="navigation" size={13} color={colors.gold} />
                <Text style={styles.navigateLinkText}> {i18next.t('sessions.navigate')} </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Earnings */}
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}> {i18next.t('sessions.estimated_earnings')} </Text>
            <Text style={styles.earningsValue}>{i18next.t("content.sessions.SessionDetailScreen.text_2")}{estimatedTotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={[styles.earningsRow, { marginTop: 4 }]}>
            <Text style={styles.baseLabel}> {i18next.t('sessions.base')} </Text>
            <Text style={styles.baseValue}>{i18next.t("content.sessions.SessionDetailScreen.text_2")}{session.baseEarning.toLocaleString('en-IN')}</Text>
          </View>
          {session.bonusEarning > 0 &&
          <View style={[styles.earningsRow, { marginTop: 4 }]}>
              <Text style={styles.baseLabel}> {i18next.t('sessions.safety_bonus_1')} </Text>
              <Text style={[styles.baseValue, { color: colors.safetyGreen }]}>{i18next.t("content.sessions.SessionDetailScreen.text_3")}
              {session.bonusEarning.toLocaleString('en-IN')}
              </Text>
            </View>
          }
        </GlassCard>

        {/* ── Session Pass Code ── */}
        {sessionPassCode &&
        <View style={styles.passCodeCard}>
            <Icon name="vpn-key" size={16} color={colors.gold} />
            <Text style={styles.passCodeLabel}> {i18next.t('sessions.session_pass_code')} </Text>
            <Text style={styles.passCodeValue}>{sessionPassCode}</Text>
          </View>
        }

        {/* ══════════════════════════════════════════
                SECTION 3 — SAFETY & CHECKLIST
             ══════════════════════════════════════════ */}
        <GlassCard style={styles.card}>
          <NavRow
            icon="place"
            label={i18next.t('sessions.view_meeting_point')}
            onPress={() => (navigation as any).navigate(Routes.VENUE_MEETING_POINT_DETAIL, { sessionId })} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="navigation"
            label={i18next.t('sessions.navigate_to_venue')}
            onPress={() => (navigation as any).navigate(Routes.NAVIGATION_TO_VENUE, { sessionId })} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="checklist"
            label={i18next.t('sessions.session_prep_checklist')}
            onPress={() => (navigation as any).navigate(Routes.SESSION_PREP_CHECKLIST, { sessionId })} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="person-search"
            label={i18next.t('sessions.customer_safety_summary')}
            onPress={() => (navigation as any).navigate(Routes.CUSTOMER_PROFILE_SAFETY_SUMMARY, { customerId: customer.customerId })} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="shield"
            label={i18next.t('sessions.safety_hub_sos')}
            onPress={() => (navigation as any).navigate(Routes.COMPANION_SAFETY_HUB  )} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="place"
            label={i18next.t('sessions.view_approved_venue_rules')}
            onPress={() => (navigation as any).navigate(Routes.PUBLIC_VENUE_RULES  )} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="flag"
            label={i18next.t('sessions.report_customer')}
            onPress={() => (navigation as any).navigate(Routes.REPORT_CUSTOMER, { customerName: customer.displayInitials ?? 'Customer' })} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="block"
            label={i18next.t('sessions.block_customer')}
            onPress={() => (navigation as any).navigate(Routes.BLOCK_CUSTOMER, { customerName: customer.displayInitials ?? 'Customer' })} />
          
          <View style={styles.navDivider} />
          <NavRow
            icon="notifications"
            label={i18next.t('sessions.set_session_reminder')}
            onPress={() => (navigation as any).navigate(Routes.SESSION_REMINDER, { sessionId })} />
          
        </GlassCard>

        {/* ══════════════════════════════════════════
                SECTION 4 — DIGITAL PASS
             ══════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.passCard}
          onPress={() => (navigation as any).navigate(Routes.DIGITAL_SESSION_PASS, { sessionId })}
          activeOpacity={0.8}>
          <View style={styles.passIconWrap}>
            <Icon name="qr-code" size={28} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.passCardTitle}> {i18next.t('sessions.digital_session_pass')} </Text>
            <Text style={styles.passCardSub}> {i18next.t('sessions.required_for_entry_at_premium_venues')} </Text>
          </View>
          <Icon name="arrow-forward-ios" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
              BOTTOM STICKY ACTION BAR
           ══════════════════════════════════════════ */}
      <View style={styles.footer}>
        {isActive ?
        <TouchableOpacity
          style={styles.btnRed}
          onPress={() => (navigation as any).navigate(Routes.SESSION_COMPLETE, { sessionId })}
          activeOpacity={0.85}
          accessibilityLabel={i18next.t("accessibility.end_session")}>
            <Icon name="stop-circle" size={18} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.btnRedText}> {i18next.t('sessions.end_session')} </Text>
          </TouchableOpacity> :

        <>
            {/* Secondary: Get Directions */}
            <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => (navigation as any).navigate(Routes.NAVIGATION_TO_VENUE, { sessionId })}
            activeOpacity={0.8}
            accessibilityLabel={i18next.t("accessibility.get_directions_to_venue")}>
              <Icon name="navigation" size={17} color={colors.gold} style={{ marginRight: 8 }} />
              <Text style={styles.btnOutlineText}> {i18next.t('sessions.get_directions')} </Text>
            </TouchableOpacity>

            {/* Primary: I've Arrived */}
            <TouchableOpacity
            style={[styles.btnGold, { marginTop: spacing.sm }]}
            onPress={() => (navigation as any).navigate(Routes.PRE_ARRIVAL, { sessionId })}
            activeOpacity={0.85}
            accessibilityLabel={i18next.t("accessibility.arrived_at_venue")}>
              <Icon name="location-on" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
              <Text style={styles.btnGoldText}> {i18next.t('sessions.i_ve_arrived_at_venue')} </Text>
            </TouchableOpacity>

            {/* Tertiary: Cancel link */}
            <TouchableOpacity
            style={styles.cancelLink}
            onPress={() => (navigation as any).navigate(Routes.CANCEL_SESSION_REQUEST, { sessionId })}
            accessibilityLabel={i18next.t("accessibility.cancel_session")}>
              <Text style={styles.cancelLinkText}> {i18next.t('sessions.cancel_session')} </Text>
            </TouchableOpacity>
          </>
        }
      </View>
    </SafeAreaView>);

}

export default SessionDetailScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 24 },

  // Banners
  bannerGold: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md
  },
  bannerGoldText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },
  bannerGreen: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.30)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md
  },
  bannerGreenText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.safetyGreen },
  pulseDot: {
    width: 9, height: 9, borderRadius: 5, backgroundColor: colors.safetyGreen
  },

  card: { marginBottom: spacing.md },
  sectionHeader: {
    fontFamily: fontFamily.playfairSemiBold, fontSize: 15, color: colors.gold,
    marginBottom: spacing.md
  },

  // Customer
  customerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  customerMeta: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.gold, marginTop: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, gap: 5 },
  tagGreen: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.safetyGreenSubtle,
    borderRadius: radius.full, paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', gap: 3
  },
  tagGreenText: { fontFamily: fontFamily.interMedium, fontSize: 10, color: colors.safetyGreen },
  contactBtns: { flexDirection: 'row', gap: spacing.xs, marginLeft: spacing.sm },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },
  iconBtnMuted: { opacity: 0.4 },

  // Detail rows
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  detailLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    width: 80, marginLeft: spacing.sm, paddingTop: 1
  },
  detailValue: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary, flex: 1
  },
  rowDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: spacing.md },

  meetRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  navigateLink: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)', gap: 3, marginLeft: 6
  },
  navigateLinkText: { fontFamily: fontFamily.interMedium, fontSize: 11, color: colors.gold },

  earningsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  earningsLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  earningsValue: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.gold },
  baseLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  baseValue: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary },

  // Pass code row
  passCodeCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    marginBottom: spacing.md
  },
  passCodeLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  passCodeValue: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.gold, marginLeft: 'auto' },

  // Nav rows
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  navRowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  navRowLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  navDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

  // Digital pass card
  passCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(214,168,79,0.06)',
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    marginBottom: spacing.md, gap: spacing.md
  },
  passIconWrap: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  passCardTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  passCardSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 3 },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnGold: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  btnGoldText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  btnRed: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning
  },
  btnRedText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.white },
  cancelLink: { alignItems: 'center', marginTop: spacing.md },
  cancelLinkText: { fontFamily: fontFamily.interMedium, fontSize: 13, color: colors.softWarning },

  btnOutline: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.50)',
    backgroundColor: 'rgba(214,168,79,0.07)'
  },
  btnOutlineText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },

  // Error state
  centeredMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  centeredTitle: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary, marginTop: spacing.md },
  backBtn: { marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  backBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary }
});