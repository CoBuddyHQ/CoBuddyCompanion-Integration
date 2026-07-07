import { useTranslation } from 'react-i18next';
/**
 * ExpiredBookingRequestScreen (CPN-089)
 * Now reads requestId from route.params and resolves real data from
 * reviewedRequests in requestStore. All detail rows are dynamic.
 * "Message Customer" button shows an informational alert (chat unavailable
 * for expired requests — no stub fake names).
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useRequestStore } from '../../store/slices/requestStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import i18next from 'i18next';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatExpiredAt(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString(i18next.language || 'en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) + ' · ' + d.toLocaleTimeString(i18next.language || 'en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    cafe_conversation: 'Café Conversation',
    city_walk: 'City Walk',
    art_culture: 'Art & Culture',
    food_experience: 'Food Experience',
    shopping_assistance: 'Shopping',
    events: 'Public Event',
    business_networking: 'Networking',
    bookstore: 'Bookstore Visit',
    wellness_walk: 'Wellness Walk',
    movies: 'Cinema'
  };
  return map[cat] ?? cat.replace(/_/g, ' ');
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ExpiredBookingRequestScreen(): React.JSX.Element {const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = useRoute<any>();
  const requestId = (route.params?.requestId ?? '') as string;

  // Expired requests live in reviewedRequests (moved there by removeExpiredRequests or updateRequestStatus)
  const request = useRequestStore((s) =>
  [...s.pendingRequests, ...s.reviewedRequests].find((r) => r.requestId === requestId) ?? null
  );

  // ── Not found fallback ───────────────────────────────────────────────────────
  if (!request) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t("application.request_expired")} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
        <View style={s.notFound}>
          <Icon name="timer-off" size={48} color={colors.textMuted} />
          <Text style={s.notFoundTitle}>{t("application.request_not_found")}</Text>
          <Text style={s.notFoundSub}>{t("application.this_request_may_have_been_cleared_from")}</Text>
          <TouchableOpacity style={s.backLinkBtn} onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}>
            <Text style={s.backLinkText}>{t("application.back_to_inbox")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>);

  }

  const durationHrs = Math.floor(request.durationMinutes / 60);
  const durationMins = request.durationMinutes % 60;
  const durationLabel = durationHrs > 0 && durationMins > 0 ?
  `${durationHrs}h ${durationMins}m` :
  durationHrs > 0 ? `${durationHrs} hr` : `${durationMins} mins`;

  const detailRows = [{ icon: "schedule", label: "content.requests.ExpiredBookingRequestScreen.detailrows.0.label" }, { icon: "person", label: "content.requests.ExpiredBookingRequestScreen.detailrows.1.label" }, { icon: "local-activity", label: "content.requests.ExpiredBookingRequestScreen.detailrows.2.label" }, { icon: "payments", label: "content.requests.ExpiredBookingRequestScreen.detailrows.3.label" }] as any[];






  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t("application.request_expired")} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <View style={s.body}>
        {/* Hero icon */}
        <View style={s.iconCircle}>
          <Icon name="timer-off" size={56} color={colors.softWarning} />
        </View>

        <Text style={s.title}>{t("application.booking_request_expired")}</Text>
        <Text style={s.desc}>{t("application.this_request_was_not_accepted_within_24")}


        </Text>

        {/* Detail card — all fields from store */}
        <View style={s.detailCard}>
          {detailRows.map((row, i, arr) =>
          <View key={t(row.label)}>
              <View style={s.detailRow}>
                <Icon name={row.icon as any} size={15} color={colors.textMuted} />
                <Text style={s.detailLabel}>{t(row.label)}</Text>
                <Text style={s.detailValue}>{row.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.rowSep} />}
            </View>
          )}
        </View>

        {/* Tip */}
        <View style={s.tipCard}>
          <Icon name="tips-and-updates" size={14} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={s.tipText}>{t("application.tip_respond_to_requests_within")}
            <Text style={s.tipBold}>{t("application.2_hours")}</Text>{t("application.to_boost_your_acceptance_rate_and_visibi")}

          </Text>
        </View>

        {/* "Message Customer" — disabled for expired requests */}
        <TouchableOpacity style={[s.msgBtn, s.msgBtnDisabled]} activeOpacity={0.7}
        onPress={() => Alert.alert(t("alerts.chat_unavailable"), t("alerts.in_app_chat_is_not_available_for_expired"),


        [{ text: t("alerts.ok") }]
        )}>
          <Icon name="chat-bubble-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <Text style={s.msgBtnTextDisabled}>{t("application.message_unavailable")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.doneBtn} activeOpacity={0.8}
        onPress={() => navigation.navigate(Routes.BOOKING_REQUESTS_INBOX)}>
          <Text style={s.doneBtnText}>{t("application.back_to_inbox")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default ExpiredBookingRequestScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'center' },

  // Not found
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  notFoundTitle: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary, marginTop: spacing.lg },
  notFoundSub: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 },
  backLinkBtn: { marginTop: spacing.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  backLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },

  iconCircle: { width: 104, height: 104, borderRadius: 52,
    backgroundColor: 'rgba(217,108,108,0.10)', borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.30)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  desc: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl },
  detailCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.md, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  detailLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1, marginLeft: 2 },
  detailValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  rowSep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  tipCard: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginBottom: spacing.lg },
  tipText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  tipBold: { fontFamily: fontFamily.interBold, color: colors.gold },
  msgBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: colors.elevatedSurface, marginBottom: spacing.sm },
  msgBtnDisabled: { opacity: 0.5 },
  msgBtnTextDisabled: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textMuted },
  doneBtn: { width: '100%', height: 52, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted }
});