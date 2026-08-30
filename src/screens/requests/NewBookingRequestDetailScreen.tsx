import { useTranslation } from 'react-i18next';
/**
 * CPN-082 — New Booking Request Detail Screen
 * Full details of a single pending booking request.
 * Accessed via "Review Request" from the Inbox (CPN-081).
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import GlassCard from '../../components/cards/GlassCard';
import { useRequestStore } from '../../store/slices/requestStore';
import { AdminConfig } from '../../config/adminValues';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { RequestsStackParamList } from '../../types/navigation.types';
import i18next from 'i18next';

type Props = StackScreenProps<RequestsStackParamList, typeof Routes.NEW_BOOKING_REQUEST_DETAIL>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categoryLabel(cat: string): string {
  return AdminConfig.categoryDetails[cat]?.label ?? cat;
}

function formatDateRange(isoStart: string, isoEnd: string, durationMinutes: number, t: any): string {
  const start = new Date(isoStart);
  const end = new Date(isoEnd);
  const now = new Date();
  const isToday =
  start.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = start.toDateString() === tomorrow.toDateString();
  const dayLabel = isToday ?
  t('application.date_today') :
  isTomorrow ?
  t('application.date_tomorrow') :
  start.toLocaleDateString(i18next.language || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const startTime = start.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const endTime = end.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const hrs = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const dur = hrs > 0 && mins > 0 ? t('application.time_duration_h_m').replace('{hrs}', String(hrs)).replace('{mins}', String(mins)) : hrs > 0 ? t('application.time_duration_hr').replace('{hrs}', String(hrs)) : t('application.time_duration_mins').replace('{mins}', String(mins));
  return `${dayLabel}, ${startTime} – ${endTime} (${dur})`;
}

function trustScoreToStars(score: number): string {
  return (score / 20).toFixed(1);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionHeader: React.FC<{title: string;}> = ({ title }) =>
<Text style={styles.sectionHeader}>{title}</Text>;


const DetailRow: React.FC<{icon: string;label: string;value: string;valueGold?: boolean;}> = ({
  icon, label, value, valueGold = false
}) =>
<View style={styles.detailRow}>
    <View style={styles.detailIconWrap}>
      <Icon name={icon as any} size={16} color={colors.textMuted} />
    </View>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueGold && styles.detailValueGold]}>
      {value}
    </Text>
  </View>;


const TrustChip: React.FC<{icon: string;label: string;}> = ({ icon, label }) =>
<View style={styles.trustChip}>
    <Icon name={icon as any} size={12} color={colors.safetyGreen} />
    <Text style={styles.trustChipText}>{label}</Text>
  </View>;


// ─── Screen ───────────────────────────────────────────────────────────────────

export function NewBookingRequestDetailScreen({ route, navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const requestId: string = route.params?.requestId ?? '';

  const request = useRequestStore(
    (s) => s.pendingRequests.find((r) => r.requestId === requestId) ?? null
  );

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!request) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t("application.request_detail")} showBack />
        <View style={styles.notFoundWrap}>
          <Icon name="search-off" size={48} color={colors.textMuted} />
          <Text style={styles.notFoundTitle}>{t("application.request_not_found")}</Text>
          <Text style={styles.notFoundSub}>{t("application.this_request_may_have_expired_or_been_re")}

          </Text>
          <TouchableOpacity accessibilityRole="button"
            style={styles.notFoundBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Text style={styles.notFoundBtnText}>{t("application.go_back")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const { customer, venue, category, proposedStart, proposedEnd, durationMinutes,
    estimatedEarning, language, customerNote, matchScore } = request;

  // ── Expiry display ──────────────────────────────────────────────────────────
  const minsLeft = Math.floor((new Date(request.expiresAt).getTime() - Date.now()) / 60000);
  const isExpiringSoon = minsLeft > 0 && minsLeft <= 60;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t("application.request_detail")}
        showBack
        subtitle={isExpiringSoon ? t('application.expires_in_m').replace('{mins}', String(minsLeft)) : undefined} />


      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Expiry banner ── */}
        {isExpiringSoon &&
        <View style={styles.expiryBanner}>
            <Icon name="timer" size={14} color={colors.softWarning} />
            <Text style={styles.expiryBannerText}>{t("application.expiring_in")}
              {minsLeft}{t("application.min_review_quickly_to_confirm")}
            </Text>
          </View>
        }

        {/* ══════════════════════════════════════════
              SECTION 1 — CUSTOMER SNAPSHOT
           ══════════════════════════════════════════ */}
        <GlassCard style={styles.card}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.customerTopRow}
            activeOpacity={0.75}
            onPress={() => navigation.navigate(Routes.CUSTOMER_TRUST_SNAPSHOT, { customerId: requestId })}
            accessibilityLabel={t("application.accessibility_view_customer_profile")}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerAvatarText}>{customer.displayInitials}</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.displayInitials}</Text>
              <Text style={styles.customerRating}>{t("content.requests.NewBookingRequestDetailScreen.text")}
                {trustScoreToStars(customer.trustScore)}{t("content.requests.NewBookingRequestDetailScreen.text_1")}{customer.sessionCountOverall}{t("application.sessions")}
              </Text>
              <Text style={styles.customerSince}>{t("application.verified_member")}</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchPct}>{matchScore}{t("content.requests.NewBookingRequestDetailScreen.text_2")}</Text>
              <Text style={styles.matchLabel}>{t("application.match")}</Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <View style={styles.chipRow}>
            {customer.isVerified &&
            <TrustChip icon="verified-user" label={t("application.verified_customer")} />
            }
            {customer.safetyConsent &&
            <TrustChip icon="shield" label={t("application.safety_checked")} />
            }
            {customer.identityVerified &&
            <TrustChip icon="badge" label={t("application.id_verified")} />
            }
          </View>
        </GlassCard>

        {/* ══════════════════════════════════════════
              SECTION 2 — BOOKING DETAILS
           ══════════════════════════════════════════ */}
        <GlassCard style={styles.card}>
          <SectionHeader title={t("application.booking_details")} />
          <DetailRow icon="local-activity" label={t("application.activity")} value={categoryLabel(category)} />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="schedule"
            label={t("application.date_time")}
            value={formatDateRange(proposedStart, proposedEnd, durationMinutes, t)} />

          <View style={styles.rowDivider} />
          <DetailRow
            icon="place"
            label={t("application.location")}
            value={`${venue.area}, ${venue.city}`} />

          <View style={styles.rowDivider} />
          <DetailRow
            icon="meeting-room"
            label={t("application.meeting_point")}
            value={venue.meetingPoint} />

          <View style={styles.rowDivider} />
          <DetailRow icon="language" label={t("application.language")} value={language} />
          <View style={styles.rowDivider} />
          <DetailRow
            icon="account-balance-wallet"
            label={t("application.your_earnings")}
            value={`₹${estimatedEarning.toLocaleString('en-IN')}`}
            valueGold />

        </GlassCard>

        {/* ══════════════════════════════════════════
              SECTION 3 — VENUE
           ══════════════════════════════════════════ */}
        <GlassCard style={styles.card}>
          <SectionHeader title={t("application.venue")} />
          <View style={styles.venueRow}>
            <View style={styles.venueIconWrap}>
              <Icon name="storefront" size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <Text style={styles.venueType}>{venue.venueType}</Text>
              <View style={styles.venueApprovedRow}>
                <Icon name="check-circle" size={12} color={colors.safetyGreen} />
                <Text style={styles.venueApproved}>{t("application.cobuddy_approved_venue")}</Text>
              </View>
              {venue.landmark ?
              <Text style={styles.venueLandmark}>{t("application.near")}{venue.landmark}</Text> :
              null}
            </View>
          </View>
        </GlassCard>

        {/* ══════════════════════════════════════════
              SECTION 4 — CUSTOMER NOTE / PREFERENCES
           ══════════════════════════════════════════ */}
        {customerNote ?
        <GlassCard style={styles.card}>
            <SectionHeader title={t("application.note_from_customer")} />
            <Text style={styles.customerNote}>"{customerNote}"</Text>
          </GlassCard> :
        null}

        {/* ══════════════════════════════════════════
              SECTION 5 — SAFETY HIGHLIGHT
           ══════════════════════════════════════════ */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyIconWrap}>
            <Icon name="shield" size={22} color={colors.safetyGreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>{t("application.your_safety_is_our_priority")}</Text>
            <Text style={styles.safetyBody}>{t("application.share_live_location_during_the_session_a")}


            </Text>
          </View>
        </View>

        {/* Spacer for sticky footer */}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
            BOTTOM STICKY ACTION BAR
         ══════════════════════════════════════════ */}
      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button"
          style={styles.btnAccept}
          onPress={() => navigation.navigate(Routes.BOOKING_ACCEPT_CONFIRMATION, { requestId })}
          activeOpacity={0.8}
          accessibilityLabel={t("application.accessibility_accept_request")}>
          <Icon name="check" size={18} color={colors.rootBg} style={{ marginRight: 6 }} />
          <Text style={styles.btnAcceptText}>{t("application.accept")}</Text>
        </TouchableOpacity>

        <View style={styles.footerSecondaryRow}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.btnDecline}
            onPress={() => navigation.navigate(Routes.BOOKING_REJECT_REASON, { requestId })}
            activeOpacity={0.75}
            accessibilityLabel={t("application.accessibility_decline_request")}>
            <Text style={styles.btnDeclineText}>{t("application.decline")}</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button"
            style={styles.btnSuggest}
            onPress={() => navigation.navigate(Routes.SUGGEST_DIFFERENT_TIME, { requestId })}
            activeOpacity={0.75}
            accessibilityLabel={t("application.accessibility_suggest_time")}>
            <Icon name="schedule" size={15} color={colors.gold} style={{ marginRight: 4 }} />
            <Text style={styles.btnSuggestText}>{t("application.suggest_time")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>);

}

export default NewBookingRequestDetailScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 24
  },

  // Expiry banner
  expiryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217,108,108,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217,108,108,0.30)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md
  },
  expiryBannerText: {
    fontFamily: fontFamily.interMedium,
    fontSize: 13,
    color: colors.softWarning,
    marginLeft: 8,
    flex: 1
  },

  // Cards
  card: { marginBottom: spacing.md },

  // Section header
  sectionHeader: {
    fontFamily: fontFamily.playfairSemiBold,
    fontSize: 15,
    color: colors.gold,
    marginBottom: spacing.md
  },

  // Customer card
  customerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  customerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  customerAvatarText: {
    fontFamily: fontFamily.interBold,
    fontSize: 16,
    color: colors.gold
  },
  customerInfo: {
    flex: 1,
    marginLeft: spacing.md
  },
  customerName: {
    fontFamily: fontFamily.interBold,
    fontSize: 16,
    color: colors.textPrimary
  },
  customerRating: {
    fontFamily: fontFamily.interMedium,
    fontSize: 13,
    color: colors.gold,
    marginTop: 2
  },
  customerSince: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  matchBadge: {
    alignItems: 'center',
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.30)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  matchPct: {
    fontFamily: fontFamily.interBold,
    fontSize: 18,
    color: colors.gold
  },
  matchLabel: {
    fontFamily: fontFamily.interRegular,
    fontSize: 10,
    color: colors.textMuted
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.safetyGreenSubtle,
    borderWidth: 1,
    borderColor: 'rgba(109,214,165,0.30)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4
  },
  trustChipText: {
    fontFamily: fontFamily.interMedium,
    fontSize: 11,
    color: colors.safetyGreen,
    marginLeft: 5
  },

  // Detail rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2
  },
  detailIconWrap: {
    width: 24,
    alignItems: 'center',
    paddingTop: 1
  },
  detailLabel: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    color: colors.textMuted,
    width: 100
  },
  detailValue: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right'
  },
  detailValueGold: {
    fontFamily: fontFamily.interBold,
    fontSize: 16,
    color: colors.gold
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: spacing.sm
  },

  // Venue
  venueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  venueIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0
  },
  venueName: {
    fontFamily: fontFamily.interBold,
    fontSize: 14,
    color: colors.textPrimary
  },
  venueType: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  venueApprovedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  venueApproved: {
    fontFamily: fontFamily.interMedium,
    fontSize: 11,
    color: colors.safetyGreen
  },
  venueLandmark: {
    fontFamily: fontFamily.interRegular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  },

  // Customer note
  customerNote: {
    fontFamily: fontFamily.interRegular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic'
  },

  // Safety card
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(109,214,165,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(109,214,165,0.25)',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  safetyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(109,214,165,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0
  },
  safetyTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 13,
    color: colors.safetyGreen,
    marginBottom: 4
  },
  safetyBody: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  },

  // Not-found state
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl
  },
  notFoundTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: spacing.lg
  },
  notFoundSub: {
    fontFamily: fontFamily.interRegular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21
  },
  notFoundBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border
  },
  notFoundBtnText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.textPrimary
  },

  // Footer action bar
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    gap: spacing.md
  },
  footerSecondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  btnAccept: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.gold
  },
  btnAcceptText: {
    fontFamily: fontFamily.interBold,
    fontSize: 15,
    color: colors.rootBg
  },
  btnSuggest: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  btnSuggestText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 13,
    color: colors.gold
  },
  btnDecline: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(217,108,108,0.40)'
  },
  btnDeclineText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.softWarning
  }
});