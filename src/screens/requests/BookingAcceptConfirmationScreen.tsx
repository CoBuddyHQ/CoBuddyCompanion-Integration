import i18next from "i18next";
import { useTranslation } from 'react-i18next';
/**
 * CPN-084 — Booking Accept Confirmation Screen
 * Companion reviews a summary and confirms acceptance before committing.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, ActivityIndicator, Alert } from
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
import { useSessionStore } from '../../store/slices/sessionStore';
import type { RequestsStackParamList } from '../../types/navigation.types';
import { RequestsService } from '../../services/api/services/requests.service';

type Props = StackScreenProps<RequestsStackParamList, typeof Routes.BOOKING_ACCEPT_CONFIRMATION>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categoryLabel(cat: string): string {
  return AdminConfig.categoryDetails[cat]?.label ?? cat;
}

function formatDateTime(isoStart: string, isoEnd: string): string {
  const start = new Date(isoStart);
  const end = new Date(isoEnd);
  const now = new Date();
  const tom = new Date(now);
  tom.setDate(tom.getDate() + 1);
  const isToday = start.toDateString() === now.toDateString();
  const isTomorrow = start.toDateString() === tom.toDateString();
  const day = isToday ? i18next.t("content.requests.BookingAcceptConfirmationScreen.today") : isTomorrow ? i18next.t("content.requests.BookingAcceptConfirmationScreen.tomorrow") :
  start.toLocaleDateString(i18next.language || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const s = start.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const e = end.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}, ${s} – ${e}`;
}

// ─── Checkbox Row ─────────────────────────────────────────────────────────────

const CheckRow: React.FC<{label: string;checked: boolean;onToggle: () => void;}> = (
{ label, checked, onToggle }) =>

<TouchableOpacity
  style={styles.checkRow}
  onPress={onToggle}
  activeOpacity={0.7}
  accessibilityRole="checkbox"
  accessibilityState={{ checked }}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Icon name="check" size={13} color={colors.rootBg} />}
    </View>
    <Text style={styles.checkLabel}>{label}</Text>
  </TouchableOpacity>;


// ─── Screen ───────────────────────────────────────────────────────────────────

export function BookingAcceptConfirmationScreen({ route, navigation }: Props): React.JSX.Element {const { t } = useTranslation();
  const { requestId } = route.params;

  const updateRequestStatus = useRequestStore((s) => s.updateRequestStatus);
  const request = useRequestStore(
    (s) => s.pendingRequests.find((r) => r.requestId === requestId) ?? null
  );

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [loading, setLoading] = useState(false);
  const canConfirm = check1 && check2 && !loading;

  const upcomingSessions = useSessionStore(s => s.upcomingSessions);

  const handleConfirm = async () => {
    if (!canConfirm) {return;}
    
    // Double-booking check
    if (request?.proposedStart && request?.proposedEnd) {
      const newStart = new Date(request.proposedStart).getTime();
      const newEnd = new Date(request.proposedEnd).getTime();
      
      const conflict = upcomingSessions.find(s => {
        const existStart = new Date(s.scheduledStart).getTime();
        const existEnd = new Date(s.scheduledEnd).getTime();
        return newStart < existEnd && newEnd > existStart;
      });

      if (conflict) {
        (navigation as any).navigate(Routes.AVAILABILITY_CONFLICT, {
          sessionId: conflict.sessionId,
          sessionTitle: conflict.customer?.displayInitials ?? categoryLabel(conflict.category),
          sessionTime: formatDateTime(conflict.scheduledStart, conflict.scheduledEnd),
          sessionVenue: `${conflict.venue?.name ?? ''}, ${conflict.venue?.area ?? ''}`.replace(/^, | , $/g, ''),
        });
        return;
      }
    }

    setLoading(true);
    try {
      await RequestsService.acceptRequest(requestId);
      updateRequestStatus(requestId, 'accepted');
      navigation.replace(Routes.BOOKING_ACCEPTED_SUCCESS, { requestId });
    } catch (e: any) {
      Alert.alert(t("alerts.error"), e.message || 'Failed to accept booking');
    } finally {
      setLoading(false);
    }
  };

  // ── Not-found guard ──────────────────────────────────────────────────────────
  if (!request) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={i18next.t("application.confirm_booking")} showBack />
        <View style={styles.centeredMsg}>
          <Icon name="search-off" size={44} color={colors.textMuted} />
          <Text style={styles.centeredTitle}>{i18next.t("application.request_not_found")}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>{i18next.t("application.go_back")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const { category, proposedStart, proposedEnd, venue, estimatedEarning, customer } = request;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={i18next.t("application.confirm_booking")} showBack />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

        {/* ── Commitment banner ── */}
        <View style={styles.banner}>
          <Icon name="info" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={styles.bannerText}>{i18next.t("application.by_accepting_you_commit_to_this_session")}


          </Text>
        </View>

        {/* ── Summary card ── */}
        <GlassCard style={styles.card} borderStrength="strong">
          <Text style={styles.summaryHeading}>{i18next.t("application.booking_summary")}</Text>
          {[
          { icon: 'local-activity', label: i18next.t("content.requests.BookingAcceptConfirmationScreen.activity"), value: categoryLabel(category) },
          { icon: 'schedule', label: i18next.t("content.requests.BookingAcceptConfirmationScreen.date_time"), value: formatDateTime(proposedStart, proposedEnd) },
          { icon: 'place', label: i18next.t("content.requests.BookingAcceptConfirmationScreen.location"), value: `${venue.area}, ${venue.city}` },
          { icon: 'storefront', label: i18next.t("content.requests.BookingAcceptConfirmationScreen.venue"), value: venue.name }].
          map((row) =>
          <View key={t(row.label)} style={styles.summaryRow}>
              <Icon name={row.icon as any} size={15} color={colors.textMuted} />
              <Text style={styles.summaryLabel}>{t(row.label)}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>{i18next.t("application.your_earnings")}</Text>
            <Text style={styles.earningsValue}>{i18next.t("content.requests.BookingAcceptConfirmationScreen.text")}{estimatedEarning.toLocaleString('en-IN')}</Text>
          </View>
        </GlassCard>

        {/* ── Customer chip ── */}
        <View style={styles.customerChip}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>{customer.displayInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{customer.displayInitials}</Text>
            <Text style={styles.customerMeta}>{i18next.t("content.requests.BookingAcceptConfirmationScreen.text_1")}
              {(customer.trustScore / 20).toFixed(1)}{i18next.t("content.requests.BookingAcceptConfirmationScreen.text_2")}{customer.sessionCountOverall}{i18next.t("application.sessions")}
            </Text>
          </View>
          {customer.isVerified &&
          <View style={styles.verifiedBadge}>
              <Icon name="verified" size={13} color={colors.safetyGreen} />
              <Text style={styles.verifiedText}>{i18next.t("application.verified")}</Text>
            </View>
          }
        </View>

        {/* ── Checklist ── */}
        <GlassCard style={styles.card}>
          <Text style={styles.checklistTitle}>{i18next.t("application.before_you_confirm")}</Text>
          <CheckRow
            label={i18next.t("application.i_have_reviewed_the_customer_s_notes_and")}
            checked={check1}
            onToggle={() => setCheck1((v) => !v)} />
          
          <View style={{ height: 10 }} />
          <CheckRow
            label={i18next.t("application.i_agree_to_the_cobuddy_public_venue_safe")}
            checked={check2}
            onToggle={() => setCheck2((v) => !v)} />
          
        </GlassCard>

        {!check1 || !check2 ?
        <Text style={styles.checkHint}>{i18next.t("application.please_check_both_boxes_to_confirm")}</Text> :
        null}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button"
          style={[styles.btnConfirm, !canConfirm && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={!canConfirm}
          activeOpacity={0.82}
          accessibilityLabel={i18next.t("accessibility.confirm_and_accept_booking")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} /> :

          <>
              <Icon name="check-circle" size={18}
            color={canConfirm ? colors.rootBg : colors.textMuted}
            style={{ marginRight: 8 }} />
              <Text style={[styles.btnConfirmText, !canConfirm && styles.btnDisabledText]}>{i18next.t("application.confirm_accept")}

            </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default BookingAcceptConfirmationScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 24 },

  banner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm
  },
  bannerText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.gold,
    lineHeight: 19, flex: 1
  },

  card: { marginBottom: spacing.md },

  summaryHeading: {
    fontFamily: fontFamily.playfairSemiBold, fontSize: 15, color: colors.gold,
    marginBottom: spacing.md
  },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  summaryLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    width: 90, marginLeft: spacing.sm
  },
  summaryValue: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary, flex: 1
  },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: spacing.md },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 15, color: colors.textPrimary },
  earningsValue: { fontFamily: fontFamily.interBold, fontSize: 20, color: colors.gold },

  customerChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.md, gap: spacing.md
  },
  customerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },
  customerAvatarText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.gold },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  customerMeta: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.safetyGreenSubtle,
    borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, gap: 4
  },
  verifiedText: { fontFamily: fontFamily.interMedium, fontSize: 11, color: colors.safetyGreen },

  checklistTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm, flexShrink: 0, marginTop: 1
  },
  checkboxChecked: { backgroundColor: colors.gold, borderColor: colors.gold },
  checkLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    lineHeight: 19, flex: 1
  },
  checkHint: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    textAlign: 'center', marginTop: -spacing.sm, fontStyle: 'italic'
  },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnConfirm: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  btnConfirmText: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.rootBg },
  btnDisabled: { backgroundColor: colors.elevatedSurface },
  btnDisabledText: { color: colors.textMuted },

  centeredMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  centeredTitle: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary, marginTop: spacing.md },
  backBtn: { marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  backBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary }
});