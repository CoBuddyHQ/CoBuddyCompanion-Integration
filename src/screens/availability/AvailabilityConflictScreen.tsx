/**
 * AvailabilityConflictScreen (CPN-076)
 * Conflict details are now read entirely from route.params — no hardcoded data.
 * "Cancel Existing Booking" is wired to sessionStore.updateSessionStatus().
 *
 * Expected route params:
 *   sessionId      : string   — ID of the conflicting session
 *   sessionTitle   : string   — e.g. 'Lunch with Amit'
 *   sessionTime    : string   — e.g. '15 Jun · 12:00 PM – 02:00 PM'
 *   sessionVenue   : string   — e.g. 'Café Coffee Day, BKC'
 */
import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Route params interface ───────────────────────────────────────────────────

interface ConflictParams {
  sessionId?: string;
  sessionTitle?: string;
  sessionTime?: string;
  sessionVenue?: string;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function AvailabilityConflictScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const updateSessionStatus = useSessionStore((s) => s.updateSessionStatus);

  // Resolve params with sensible fallbacks (screen may be navigated to without full params during testing)
  const params: ConflictParams = route.params ?? {};
  const sessionId = params.sessionId ?? '';
  const sessionTitle = params.sessionTitle ?? 'Existing Session';
  const sessionTime = params.sessionTime ?? '—';
  const sessionVenue = params.sessionVenue ?? '—';

  // ── Cancel existing booking ──────────────────────────────────────────────────
  const handleCancelExisting = () => {
    Alert.alert(t("alerts.cancel_booking"), t("alerts.are_you_sure_you_want_to_cancel_v0_this", { v0:

      sessionTitle }),
    [
    { text: t("alerts.no_keep_it"), style: 'cancel' },
    {
      text: t("alerts.yes_cancel"),
      style: 'destructive',
      onPress: () => {
        if (sessionId) {
          updateSessionStatus(sessionId, 'disputed');
        }
        Alert.alert(t("alerts.cancellation_requested"), t("alerts.the_session_has_been_marked_for_cancella"),


        [{ text: t("alerts.ok"), onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]
        );
      }
    }]

    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('availability.schedule_conflict')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <View style={s.body}>
        {/* Warning icon */}
        <View style={s.iconCircle}>
          <Icon name="warning-amber" size={52} color="#F5A623" />
        </View>

        <Text style={s.heading}> {t('availability.scheduling_conflict')} </Text>
        <Text style={s.desc}>
           {t('availability.you_already_have_a_confirmed_session_during_this_time_adding_this_slot_would_create_a_conflict')} </Text>

        {/* Conflict card — populated from route params */}
        <View style={s.conflictCard}>
          <View style={s.conflictRow}>
            <Icon name="event" size={16} color={colors.softWarning} />
            <Text style={s.conflictTime}>{sessionTime}</Text>
          </View>
          <View style={s.conflictSep} />
          <View style={s.conflictRow}>
            <Icon name="person" size={16} color={colors.textMuted} />
            <View style={s.conflictSessionInfo}>
              <Text style={s.conflictSessionTitle}>{sessionTitle}</Text>
              <Text style={s.conflictSessionSub}> {t('availability.confirmed_booking')} {sessionVenue}</Text>
            </View>
          </View>
          <View style={s.conflictBadge}>
            <Icon name="error-outline" size={12} color={colors.softWarning} />
            <Text style={s.conflictBadgeText}> {t('availability.overlapping_with_new_slot')} </Text>
          </View>
        </View>

        <Text style={s.resolutionLabel}> {t('availability.how_would_you_like_to_resolve_this')} </Text>

        {/* Primary action — discard new slot and go back */}
        <TouchableOpacity style={s.discardBtn} activeOpacity={0.85}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}>
          <Icon name="close" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.discardBtnText}> {t('availability.discard_new_slot')} </Text>
        </TouchableOpacity>

        {/* Secondary action — cancel existing session via sessionStore */}
        <TouchableOpacity style={s.cancelBookingBtn} activeOpacity={0.8}
        onPress={handleCancelExisting}>
          <Icon name="cancel" size={18} color={colors.softWarning} style={{ marginRight: 8 }} />
          <Text style={s.cancelBookingText}> {t('availability.cancel_existing_booking')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default AvailabilityConflictScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'center' },
  iconCircle: { width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(245,166,35,0.12)', borderWidth: 1.5, borderColor: 'rgba(245,166,35,0.35)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  heading: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.sm },
  desc: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl },
  conflictCard: { width: '100%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(245,166,35,0.30)',
    padding: spacing.md, marginBottom: spacing.lg },
  conflictRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  conflictTime: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.softWarning },
  conflictSep: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: spacing.sm },
  conflictSessionInfo: { flex: 1 },
  conflictSessionTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  conflictSessionSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  conflictBadge: { flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: spacing.sm, backgroundColor: 'rgba(245,166,35,0.08)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(245,166,35,0.25)',
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4 },
  conflictBadgeText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.softWarning },
  resolutionLabel: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.md, alignSelf: 'flex-start' },
  discardBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md, marginBottom: spacing.sm },
  discardBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  cancelBookingBtn: { width: '100%', height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.40)',
    backgroundColor: 'rgba(217,108,108,0.06)' },
  cancelBookingText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.softWarning }
});