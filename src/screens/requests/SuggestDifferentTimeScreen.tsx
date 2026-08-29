import i18next from "i18next";import { useTranslation } from 'react-i18next';
/**
 * SuggestDifferentTimeScreen (CPN-088)
 * Now reads requestId from route.params, resolves original booking time from requestStore.
 * DATES picker uses dynamic genNextDays(14) — no more stale June 2026 dates.
 * handleSend calls updateRequestStatus(requestId, 'counter_proposed') to persist the
 * counter-proposal in the store before showing the confirmation alert.
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from
'react-native';
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
import { RequestsService } from '../../services/api/services/requests.service';

// ─── Dynamic date generator (same pattern as Availability module) ─────────────

function genNextDays(count: number): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    result.push(d.toLocaleDateString(i18next.language || 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  }
  return result;
}

// ─── Time slots ──────────────────────────────────────────────────────────────

const STARTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"] as any[];
const ENDS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"] as any[];

// ─── Cycle field component ────────────────────────────────────────────────────

const CycleField: React.FC<{
  icon: string;label: string;value: string;
  options: string[];onChange: (v: string) => void;flex?: number;
}> = ({ icon, label, value, options, onChange, flex }) => {
  const idx = options.indexOf(value);
  return (
    <View style={[cf.wrap, flex !== undefined && { flex }]}>
      <Icon name={icon as any} size={14} color={colors.gold} />
      <Text style={cf.label}>{label}</Text>
      <View style={cf.row}>
        <TouchableOpacity accessibilityRole="button"
          onPress={() => onChange(options[(idx - 1 + options.length) % options.length])}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="chevron-left" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={cf.value}>{value}</Text>
        <TouchableOpacity accessibilityRole="button"
          onPress={() => onChange(options[(idx + 1) % options.length])}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>);

};

const cf = StyleSheet.create({
  wrap: { backgroundColor: colors.elevatedSurface, borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    padding: spacing.md, alignItems: 'center' },
  label: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  value: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary,
    minWidth: 80, textAlign: 'center' }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatOriginalTime(isoStart: string, isoEnd: string): string {
  const start = new Date(isoStart);
  const end = new Date(isoEnd);
  const now = new Date();
  const tom = new Date(now);
  tom.setDate(now.getDate() + 1);
  const isToday = start.toDateString() === now.toDateString();
  const isTomorrow = start.toDateString() === tom.toDateString();
  const day = isToday ? i18next.t("content.requests.SuggestDifferentTimeScreen.today") :
  isTomorrow ? i18next.t("content.requests.SuggestDifferentTimeScreen.tomorrow") :
  start.toLocaleDateString(i18next.language || 'en-IN', { day: 'numeric', month: 'short' });
  const s = start.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const e = end.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} · ${s} – ${e}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function SuggestDifferentTimeScreen(): React.JSX.Element {const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const route = useRoute<any>();
  const requestId = (route.params?.requestId ?? '') as string;

  const request = useRequestStore((s) => s.pendingRequests.find((r) => r.requestId === requestId) ?? null);
  const updateRequestStatus = useRequestStore((s) => s.updateRequestStatus);

  // Dynamic dates — re-computed once on mount
  const DATES = useMemo(() => genNextDays(14), []);

  const [newDate, setNewDate] = useState(DATES[0] ?? '');
  const [start, setStart] = useState(STARTS[2]); // 10:00 AM
  const [end, setEnd] = useState(ENDS[4]); // 02:00 PM
  const [rate, setRate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!requestId) {
      Alert.alert(i18next.t("alerts.error"), i18next.t("alerts.request_not_found"));
      return;
    }
    
    setLoading(true);
    try {
      const newStart = new Date(`${newDate} ${start}`).toISOString();
      const newEnd = new Date(`${newDate} ${end}`).toISOString();
      
      const payload: any = { newStart, newEnd };
      if (rate) {
        payload.newRate = Number(rate);
      }
      await RequestsService.counterPropose(requestId, payload);
      
      // Persist counter-proposal to store (moves request from pending → reviewed as counter_proposed)
      updateRequestStatus(requestId, 'counter_proposed');

      Alert.alert(i18next.t("alerts.suggestion_sent"), i18next.t("alerts.your_suggested_time_v0_v1_v2_has_been_se", { v0:

        newDate, v1: start, v2: end }),
      [{ text: i18next.t("alerts.ok"), onPress: () => navigation.navigate(Routes.BOOKING_REQUESTS_INBOX) }]
      );
    } catch (e: any) {
      Alert.alert(t("alerts.error"), e.message || 'Failed to send counter proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={i18next.t("application.suggest_new_time")} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Original request ── */}
          <Text style={s.secLabel}>{i18next.t("application.original_request")}</Text>
          <View style={s.origCard}>
            <Icon name="schedule" size={16} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.origMeta}>{i18next.t("application.customer_requested")}</Text>
              <Text style={s.origTime}>
                {request ?
                formatOriginalTime(request.proposedStart, request.proposedEnd) :
                '—'}
              </Text>
            </View>
            <View style={s.pendingBadge}>
              <Icon name="pending" size={12} color={colors.softWarning} />
              <Text style={s.pendingText}>{i18next.t("application.pending")}</Text>
            </View>
          </View>

          {/* ── Suggested time pickers ── */}
          <Text style={s.secLabel}>{i18next.t("application.your_suggested_time")}</Text>
          <CycleField icon="calendar-today" label={i18next.t("application.new_date")}
          value={newDate} options={DATES} onChange={setNewDate} />
          <View style={s.timeRow}>
            <CycleField icon="play-circle-outline" label={i18next.t("application.start")}
            value={start} options={STARTS} onChange={setStart} flex={1} />
            <Icon name="arrow-forward" size={16} color={colors.textMuted} style={{ marginTop: 18 }} />
            <CycleField icon="stop-circle" label={i18next.t("application.end")}
            value={end} options={ENDS} onChange={setEnd} flex={1} />
          </View>

          <Text style={s.secLabel}>{i18next.t("application.proposed_rate")}</Text>
          <View style={s.rateCard}>
            <Text style={s.currencyPrefix}>₹</Text>
            <TextInput style={s.rateInput} value={rate} onChangeText={setRate}
            keyboardType="numeric" placeholder="250" placeholderTextColor={colors.textMuted}
            selectionColor={colors.gold} />
          </View>

          {/* ── Preview pill ── */}
          <View style={s.previewCard}>
            <Icon name="event-available" size={15} color={colors.safetyGreen} />
            <Text style={s.previewText}>
              <Text style={s.bold}>{newDate}</Text>{' | '}
              <Text style={s.bold}>{start}</Text>{' to '}
              <Text style={s.bold}>{end}</Text>
              {rate ? <Text style={s.bold}> | \u20B9{rate}</Text> : null}
            </Text>
          </View>

          {/* ── Optional message ── */}
          <Text style={s.secLabel}>{i18next.t("application.message_to_customer")}</Text>
          <View style={s.msgCard}>
            <TextInput style={s.msgInput} value={message}
            onChangeText={(t) => setMessage(t.slice(0, 300))}
            placeholder={i18next.t("application.optional_message_to_customer")}
            placeholderTextColor={colors.textMuted}
            multiline textAlignVertical="top" selectionColor={colors.gold} />
            <Text style={s.charCount}>{message.length}/300</Text>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.footer}>
        <TouchableOpacity accessibilityRole="button" style={[s.sendBtn, loading && s.sendBtnDisabled]} onPress={handleSend} activeOpacity={0.85} disabled={loading}
        accessibilityLabel={i18next.t("accessibility.send_time_suggestion_to_customer")}>
          <Text style={s.sendBtnText}>{loading ? t("alerts.processing") : i18next.t("application.send_suggestion")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default SuggestDifferentTimeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  secLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm, marginTop: spacing.md },
  origCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)', padding: spacing.md },
  origMeta: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  origTime: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginTop: 2 },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(245,166,35,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(245,166,35,0.25)',
    paddingHorizontal: 8, paddingVertical: 4 },
  pendingText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.softWarning },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  rateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: spacing.md, marginTop: spacing.xs },
  currencyPrefix: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textSecondary },
  rateInput: { flex: 1, fontFamily: fontFamily.interRegular, fontSize: 16, color: colors.textPrimary,
    paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
  previewCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)',
    padding: spacing.md, marginTop: spacing.sm },
  previewText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },
  bold: { fontFamily: fontFamily.interBold, color: colors.textPrimary },
  msgCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  msgInput: { padding: spacing.md, minHeight: 100, fontFamily: fontFamily.interRegular,
    fontSize: 14, color: colors.textPrimary, lineHeight: 21 },
  charCount: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', padding: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
    shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 20 },
  sendBtn: { backgroundColor: colors.gold, paddingVertical: 14, borderRadius: radius.full,
    alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 15, color: colors.rootBg }
});