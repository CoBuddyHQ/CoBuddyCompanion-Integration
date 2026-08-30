import i18next from "i18next";
import { useTranslation } from 'react-i18next';
/**
 * CPN-081 — Booking Requests Inbox Screen
 * Lists all pending booking requests from customers.
 * Companions can Review or Decline each request from this screen.
 */
import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import type { BookingRequest as BR } from '../../store/types/store.types';
import AppHeader from '../../components/layout/AppHeader';
import { useRequestStore, DEFAULT_FILTER } from '../../store/slices/requestStore';
import type { BookingRequest } from '../../store/types/store.types';
import { AdminConfig } from '../../config/adminValues';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Minutes remaining until a request expires. */
function minutesUntil(isoStr: string): number {
  return Math.floor((new Date(isoStr).getTime() - Date.now()) / 60000);
}

/** Format an ISO datetime as a readable schedule label. */
function formatSchedule(isoStart: string, durationMinutes: number): string {
  const d = new Date(isoStart);
  const now = new Date();
  const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth();
  const dayLabel = isToday ? i18next.t("content.requests.BookingRequestsInboxScreen.today") : isTomorrow ? i18next.t("content.requests.BookingRequestsInboxScreen.tomorrow") : d.toLocaleDateString(i18next.language || 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
  const timeLabel = d.toLocaleTimeString(i18next.language || 'en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const hrs = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durLabel = hrs > 0 && mins > 0 ? `${hrs}h ${mins}m` : hrs > 0 ? `${hrs} hr` : `${mins} mins`;
  return `${dayLabel} • ${timeLabel} (${durLabel})`;
}

/** Map ExperienceCategory enum to a readable label. */
function categoryLabel(cat: string): string {
  return AdminConfig.categoryDetails[cat]?.label ?? cat;
}

// ─── Request Card ─────────────────────────────────────────────────────────────

interface RequestCardProps {
  request: BookingRequest;
  onReview: () => void;
  onDecline: () => void;
}
const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onReview,
  onDecline
}) => {
  const {
    t
  } = useTranslation();
  const minsLeft = minutesUntil(request.expiresAt);
  const isExpiringSoon = minsLeft <= 60 && minsLeft > 0;
  return <View style={styles.card}>
      {/* ── Top row: chip + price ── */}
      <View style={styles.cardTopRow}>
        {isExpiringSoon ? <View style={[styles.chip, styles.chipRed]}>
            <Icon name="timer" size={12} color={colors.softWarning} />
            <Text style={[styles.chipText, {
          color: colors.softWarning
        }]}>{i18next.t("application.expiring_in")}
            {minsLeft}{i18next.t("content.requests.BookingRequestsInboxScreen.m")}
          </Text>
          </View> : <View style={[styles.chip, styles.chipGold]}>
            <Icon name="star" size={12} color={colors.gold} />
            <Text style={[styles.chipText, {
          color: colors.gold
        }]}>{i18next.t("application.new_request")}</Text>
          </View>}
        <Text style={styles.price}>{i18next.t("content.requests.BookingRequestsInboxScreen.text")}{request.estimatedEarning.toLocaleString('en-IN')}</Text>
      </View>

      {/* ── Activity title ── */}
      <Text style={styles.activityTitle}>{categoryLabel(request.category)}</Text>

      {/* ── Details ── */}
      <View style={styles.detailRow}>
        <Icon name="schedule" size={14} color={colors.textMuted} />
        <Text style={styles.detailText}>
          {formatSchedule(request.proposedStart, request.durationMinutes)}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="place" size={14} color={colors.textMuted} />
        <Text style={styles.detailText}>
          {request.venue.area}, {request.venue.city}
        </Text>
      </View>

      {/* ── Customer row ── */}
      <View style={styles.customerRow}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerAvatarText}>{request.customer.displayInitials}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{request.customer.displayInitials}</Text>
          {request.customer.sessionCountOverall > 0 && <Text style={styles.customerMeta}>{i18next.t("content.requests.BookingRequestsInboxScreen.text_1")}
            {(request.customer.trustScore / 20).toFixed(1)}{i18next.t("content.requests.BookingRequestsInboxScreen.text_2")}{request.customer.sessionCountOverall}{i18next.t("application.sessions")}
          </Text>}
        </View>
      </View>

      {/* ── Trust tags ── */}
      <View style={styles.tagRow}>
        {request.customer.isVerified && <View style={[styles.tag, styles.tagGreen]}>
            <Icon name="verified-user" size={11} color={colors.safetyGreen} />
            <Text style={[styles.tagText, {
          color: colors.safetyGreen
        }]}>{i18next.t("application.verified_customer")}</Text>
          </View>}
        {request.customer.safetyConsent && <View style={[styles.tag, styles.tagGreen]}>
            <Icon name="shield" size={11} color={colors.safetyGreen} />
            <Text style={[styles.tagText, {
          color: colors.safetyGreen
        }]}>{i18next.t("application.safety_checked")}</Text>
          </View>}
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Action buttons ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity accessibilityRole="button" style={styles.btnDecline} onPress={onDecline} activeOpacity={0.75} accessibilityLabel={i18next.t("accessibility.decline_request")}>
          <Text style={styles.btnDeclineText}>{i18next.t("application.decline")}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.btnReview} onPress={onReview} activeOpacity={0.8} accessibilityLabel={i18next.t("accessibility.review_request")}>
          <Text style={styles.btnReviewText}>{i18next.t("application.review_request")}</Text>
        </TouchableOpacity>
      </View>
    </View>;
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{
  onGoLive: () => void;
}> = ({
  onGoLive
}) => {
  const {
    t
  } = useTranslation();
  return <View style={styles.emptyWrap}>
    <View style={styles.emptyIconCircle}>
      <Icon name="inbox" size={40} color={colors.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>{i18next.t("application.no_new_requests_right_now")}</Text>
    <Text style={styles.emptySubtitle}>{i18next.t("application.when_customers_book_you_their_requests_w")}

      </Text>
    <TouchableOpacity accessibilityRole="button" style={styles.emptyBtnPrimary} onPress={onGoLive} activeOpacity={0.85}>
      <Icon name="wifi-tethering" size={16} color={colors.rootBg} />
      <Text style={styles.emptyBtnPrimaryText}>{i18next.t("application.go_live_for_instant_bookings")}</Text>
    </TouchableOpacity>
  </View>;
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function BookingRequestsInboxScreen(): React.JSX.Element {
  const {
    t
  } = useTranslation();
  // Cross-stack hub screen — useNavigation<any> avoids CompositeNavigationProp complexity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      useRequestStore.getState().fetchRequests();
    }, [])
  );

  // Split into two atomic selectors — never derive new arrays inside a selector.
  // .filter() inside a selector creates a new array ref every render → infinite loop.
  const {
    allPending,
    allReviewed,
    activeFilter
  } = useRequestStore(useShallow(s => ({
    allPending: s.pendingRequests,
    allReviewed: s.reviewedRequests,
    activeFilter: s.activeFilter
  })));
  // Safe: filter runs outside the selector, result stored in a local const.
  const pendingRequests = allPending.filter(r => r.status === 'pending');
  const expiredRequests = allReviewed.filter(r => r.status === 'expired');
  const safeFilter = activeFilter || DEFAULT_FILTER;
  const hasActiveFilters = safeFilter.status !== 'all' || safeFilter.categories.length > 0 || safeFilter.minEarning > 0;
  const filteredRequests = useMemo(() => {
    let result = [...pendingRequests];

    // Status (if 'all', we keep all 'pending' requests since we already filtered them above)
    if (safeFilter.status !== 'all') {
      result = result.filter(r => r.status === safeFilter.status);
    }

    // Categories
    if (safeFilter.categories.length > 0) {
      result = result.filter(r => safeFilter.categories.includes(r.category));
    }

    // Earnings
    if (safeFilter.minEarning > 0) {
      result = result.filter(r => r.estimatedEarning >= safeFilter.minEarning);
    }

    // Sort
    if (safeFilter.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    } else if (safeFilter.sortBy === 'expiring_soon') {
      result.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    } else if (safeFilter.sortBy === 'highest_earning') {
      result.sort((a, b) => b.estimatedEarning - a.estimatedEarning);
    }
    return result;
  }, [pendingRequests, safeFilter]);
  const handleReview = (requestId: string) => {
    navigation.navigate(Routes.NEW_BOOKING_REQUEST_DETAIL, {
      requestId
    });
  };
  const handleDecline = (requestId: string) => {
    navigation.navigate(Routes.BOOKING_REJECT_REASON, {
      requestId
    });
  };
  const renderItem = ({
    item
  }: {
    item: BookingRequest;
  }) => <RequestCard request={item} onReview={() => handleReview(item.requestId)} onDecline={() => handleDecline(item.requestId)} />;
  return <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader tabScreen title={i18next.t("application.requests")} subtitle={i18next.t("application.your_booking_inbox")} rightIcon={i18next.t("application.inbox")} showBack={false} onRightPress={() => navigation.navigate(Routes.BOOKING_REQUESTS_FILTER)} rightBadge={hasActiveFilters ? 1 : 0} />
      

      {/* ── DEV: Test empty state route ── */}
      <TouchableOpacity accessibilityRole="button" style={styles.devTestStrip} onPress={() => navigation.navigate(Routes.BOOKING_REQUEST_EMPTY_STATE)} activeOpacity={0.75}>
        <Icon name="science" size={14} color={colors.textMuted} />
        <Text style={styles.devTestText}>{i18next.t("application.test_empty_inbox_screen")}</Text>
        <Icon name="chevron-right" size={14} color={colors.textMuted} />
      </TouchableOpacity>

      <FlatList<BookingRequest> data={filteredRequests} keyExtractor={item => item.requestId} renderItem={renderItem} contentContainerStyle={[styles.listContent, filteredRequests.length === 0 && styles.listContentEmpty]} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState onGoLive={() => navigation.navigate(Routes.LIVE_AVAILABILITY_TOGGLE)} />} ListHeaderComponent={pendingRequests.length > 0 ? <Text style={styles.listHeader}>
              {pendingRequests.length}{i18next.t("application.pending")}{pendingRequests.length === 1 ? 'request' : 'requests'}
            </Text> : null} ListFooterComponent={expiredRequests.length > 0 ? <>
              <Text style={styles.expiredSectionLabel}>{i18next.t("application.expired_requests")}</Text>
              {expiredRequests.map((req: BR) => {
        return <TouchableOpacity accessibilityRole="button" key={req.requestId} style={styles.expiredCard} activeOpacity={0.8} onPress={() => navigation.navigate(Routes.EXPIRED_BOOKING_REQUEST, {
          requestId: req.requestId
        })}>
                  <View style={styles.expiredTopRow}>
                    <View style={styles.expiredBadge}>
                      <Icon name="timer-off" size={12} color={colors.softWarning} />
                      <Text style={styles.expiredBadgeText}>{i18next.t("application.expired")}</Text>
                    </View>
                    <Text style={styles.expiredPrice}>{i18next.t("content.requests.BookingRequestsInboxScreen.text")}{req.estimatedEarning.toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={styles.expiredTitle}>{categoryLabel(req.category)}{i18next.t("application.with")}{req.customer.displayInitials}</Text>
                  <View style={styles.expiredDetailRow}>
                    <Icon name="schedule" size={13} color={colors.textMuted} />
                    <Text style={styles.expiredDetailText}>{formatSchedule(req.proposedStart, req.durationMinutes)}{i18next.t("application.not_accepted_in_time")}</Text>
                  </View>
                  <View style={styles.expiredDetailRow}>
                    <Icon name="place" size={13} color={colors.textMuted} />
                    <Text style={styles.expiredDetailText}>{req.venue.area}, {req.venue.city}</Text>
                  </View>
                  <View style={styles.expiredFooterRow}>
                    <Icon name="info-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.expiredFooterText}>{i18next.t("application.tap_to_view_details")}</Text>
                    <Icon name="chevron-right" size={15} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>;
      })}
            </> : null} />
      
    </SafeAreaView>;
}
export default BookingRequestsInboxScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center'
  },
  listHeader: {
    fontFamily: fontFamily.interMedium,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md
  },
  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  // Chips
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1
  },
  chipGold: {
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderColor: 'rgba(214,168,79,0.35)'
  },
  chipRed: {
    backgroundColor: 'rgba(217,108,108,0.10)',
    borderColor: 'rgba(217,108,108,0.35)'
  },
  chipText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 12,
    marginLeft: 5
  },
  price: {
    fontFamily: fontFamily.interBold,
    fontSize: 20,
    color: colors.gold
  },
  // Activity
  activityTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 17,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  // Details
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  detailText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1
  },
  // Customer
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  customerAvatarText: {
    fontFamily: fontFamily.interBold,
    fontSize: 13,
    color: colors.gold
  },
  customerInfo: {
    marginLeft: spacing.sm,
    flex: 1
  },
  customerName: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.textPrimary
  },
  customerMeta: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1
  },
  tagGreen: {
    backgroundColor: colors.safetyGreenSubtle,
    borderColor: 'rgba(109,214,165,0.3)'
  },
  tagText: {
    fontFamily: fontFamily.interMedium,
    fontSize: 11,
    marginLeft: 4
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: spacing.md
  },
  // Buttons
  actionRow: {
    flexDirection: 'row'
  },
  btnDecline: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(184,192,204,0.25)',
    marginRight: spacing.sm
  },
  btnDeclineText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.textMuted
  },
  btnReview: {
    flex: 2,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.gold
  },
  btnReviewText: {
    fontFamily: fontFamily.interBold,
    fontSize: 14,
    color: colors.rootBg
  },
  // ── Empty state ─────────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxxl
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.borderSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg
  },
  emptyTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm
  },
  emptySubtitle: {
    fontFamily: fontFamily.interRegular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.xl
  },
  emptyBtnPrimary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.safetyGreen,
    marginBottom: spacing.sm
  },
  emptyBtnPrimaryText: {
    fontFamily: fontFamily.interBold,
    fontSize: 14,
    color: colors.rootBg
  },
  emptyBtnSecondary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  emptyBtnSecondaryText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.gold
  },
  // ── Dev test strip ────────────────────────────────────────────────────────
  devTestStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  devTestText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted,
    flex: 1
  },
  // ── Expired section header ─────────────────────────────────────────────────
  expiredSectionLabel: {
    fontFamily: fontFamily.interBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm
  },
  // ── Expired request card ───────────────────────────────────────────────────
  expiredCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(217,108,108,0.22)',
    opacity: 0.78
  },
  expiredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(217,108,108,0.10)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(217,108,108,0.30)',
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  expiredBadgeText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 12,
    color: colors.softWarning
  },
  expiredPrice: {
    fontFamily: fontFamily.interBold,
    fontSize: 18,
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  },
  expiredTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.sm
  },
  expiredDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  expiredDetailText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1
  },
  expiredFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  expiredFooterText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted,
    flex: 1
  }
});