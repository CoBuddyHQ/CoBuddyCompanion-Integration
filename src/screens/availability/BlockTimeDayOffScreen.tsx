import i18next from "i18next"; /**
* BlockTimeDayOffScreen (CPN-075)
* handleConfirm now calls useAvailabilityStore.addOverride() — the block
* persists across screens and appears in AvailabilityCalendarScreen's override list.
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Switch, StyleSheet, StatusBar, ActivityIndicator, Alert } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useAvailabilityStore } from '../../store/slices/availabilityStore';
import type { LeaveReason } from '../../store/slices/availabilityStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReasonOption {
  label: LeaveReason;
  icon: string;
}

const REASON_OPTIONS: ReasonOption[] = [{ label: "content.availability.BlockTimeDayOffScreen.reason_options.0.label", icon: "person-off" }, { label: "content.availability.BlockTimeDayOffScreen.reason_options.1.label", icon: "sick" }, { label: "content.availability.BlockTimeDayOffScreen.reason_options.2.label", icon: "flight" }, { label: "content.availability.BlockTimeDayOffScreen.reason_options.3.label", icon: "more-horiz" }] as any[];






// ─── Dynamic date helpers ─────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function todayStr(): string {return formatDate(new Date());}
function tomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDate(d);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const DateField: React.FC<{label: string;value: string;onPress: () => void;}> = ({
  label, value, onPress
}) =>
<TouchableOpacity style={dateStyles.wrap} onPress={onPress} activeOpacity={0.75}>
    <View style={dateStyles.iconWrap}>
      <Icon name="calendar-today" size={16} color={colors.gold} />
    </View>
    <View style={dateStyles.mid}>
      <Text style={dateStyles.label}>{label}</Text>
      <Text style={dateStyles.value}>{value}</Text>
    </View>
    <Icon name="expand-more" size={18} color={colors.textMuted} />
  </TouchableOpacity>;


const dateStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, flex: 1
  },
  iconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  mid: { flex: 1 },
  label: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  value: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginTop: 2 }
});

const TimeButton: React.FC<{label: string;time: string;onPress: () => void;}> = ({
  label, time, onPress
}) =>
<TouchableOpacity style={timeStyles.btn} onPress={onPress} activeOpacity={0.75}>
    <Text style={timeStyles.label}>{label}</Text>
    <Text style={timeStyles.value}>{time}</Text>
    <Icon name="expand-more" size={16} color={colors.textMuted} />
  </TouchableOpacity>;


const timeStyles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: 10, alignItems: 'center'
  },
  label: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted },
  value: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginTop: 3 }
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export function BlockTimeDayOffScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const addOverride = useAvailabilityStore((s) => s.addOverride);

  const [reason, setReason] = useState<LeaveReason>('Personal Leave');
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(tomorrowStr());
  const [fullDay, setFullDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Date picker ──────────────────────────────────────────────────────────────
  const openDatePicker = (which: 'start' | 'end') => {
    const setFn = which === 'start' ? setStartDate : setEndDate;
    Alert.alert(
      which === 'start' ? t("content.availability.BlockTimeDayOffScreen.select_start_date") : t("content.availability.BlockTimeDayOffScreen.select_end_date"), t("alerts.choose_a_date"),

      [
      { text: t("alerts.today"), onPress: () => setFn(todayStr()) },
      { text: t("alerts.tomorrow"), onPress: () => {
          const d = new Date();d.setDate(d.getDate() + 1);setFn(formatDate(d));
        } },
      ...Array.from({ length: 5 }, (_, i) => {
        const d = new Date();d.setDate(d.getDate() + i + 2);
        return { text: formatDate(d), onPress: () => setFn(formatDate(d)) };
      }),
      { text: t("alerts.cancel"), style: 'cancel' as const }]

    );
  };

  // ── Time picker ──────────────────────────────────────────────────────────────
  const TIME_OPTIONS = ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"] as any[];




  const openTimePicker = (which: 'start' | 'end') => {
    const setFn = which === 'start' ? setStartTime : setEndTime;
    Alert.alert(
      which === 'start' ? t("content.availability.BlockTimeDayOffScreen.select_start_time") : t("content.availability.BlockTimeDayOffScreen.select_end_time"), t("alerts.choose_a_time"),

      [
      ...TIME_OPTIONS.slice(0, 7).map((t) => ({ text: t, onPress: () => setFn(t) })),
      { text: t("alerts.more"), onPress: () =>
        Alert.alert(t("alerts.more_times"), '', TIME_OPTIONS.slice(7).map((t) => ({
          text: t, onPress: () => setFn(t)
        }))) },
      { text: t("alerts.cancel"), style: 'cancel' as const }]

    );
  };

  // ── Submit — writes to store ─────────────────────────────────────────────────
  const handleConfirm = () => {
    if (loading) {return;}
    setLoading(true);

    addOverride({
      startDate,
      endDate,
      reason,
      note: note.trim() || undefined,
      fullDay,
      startTime: fullDay ? undefined : startTime,
      endTime: fullDay ? undefined : endTime
    });

    setTimeout(() => {
      setLoading(false);
      Alert.alert(t("alerts.dates_blocked"), t("alerts.your_v0_has_been_saved_you_won_t_receive", { v0:

        reason, v1: startDate, v2: endDate }),
      [{ text: t("alerts.done"), onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]
      );
    }, 600);
  };

  const isValid = startDate.length > 0 && endDate.length > 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('availability.block_date')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* REASON SELECTOR */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> {t('availability.why_are_you_taking_time_off')} </Text>
          <View style={styles.reasonGrid}>
            {REASON_OPTIONS.map((opt) => {
              const active = reason === opt.label;
              return (
                <TouchableOpacity
                  key={t(opt.label)}
                  style={[styles.reasonPill, active && styles.reasonPillActive]}
                  onPress={() => setReason(opt.label)}
                  activeOpacity={0.75}>
                  <Icon
                    name={opt.icon as any}
                    size={16}
                    color={active ? colors.gold : colors.textMuted} />
                  
                  <Text style={[styles.reasonPillText, active && styles.reasonPillTextActive]}>
                    {t(opt.label)}
                  </Text>
                </TouchableOpacity>);

            })}
          </View>
        </View>

        {/* DATE SELECTION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> {t('availability.select_dates')} </Text>
          <View style={styles.dateRow}>
            <DateField label={t('availability.start_date')} value={startDate} onPress={() => openDatePicker('start')} />
            <View style={styles.dateArrow}>
              <Icon name="arrow-forward" size={16} color={colors.textMuted} />
            </View>
            <DateField label={t('availability.end_date')} value={endDate} onPress={() => openDatePicker('end')} />
          </View>
          <View style={styles.durationHint}>
            <Icon name="schedule" size={12} color={colors.textMuted} />
            <Text style={styles.durationHintText}>
              {reason === 'Vacation' ? t("content.availability.BlockTimeDayOffScreen.extended_leave_will_pause_all_incoming_r") : t("content.availability.BlockTimeDayOffScreen.your_availability_will_be_hidden_on_bloc")
              }
            </Text>
          </View>
        </View>

        {/* FULL DAY vs SPECIFIC HOURS */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Icon name="wb-sunny" size={18} color={colors.gold} />
              <View>
                <Text style={styles.switchLabel}> {t('availability.block_full_day')} </Text>
                <Text style={styles.switchSubtitle}>
                  {fullDay ? t("content.availability.BlockTimeDayOffScreen.all_day_no_bookings_accepted") : t("content.availability.BlockTimeDayOffScreen.block_a_specific_time_window")}
                </Text>
              </View>
            </View>
            <Switch
              value={fullDay}
              onValueChange={setFullDay}
              trackColor={{ false: colors.elevatedSurface, true: 'rgba(214,168,79,0.30)' }}
              thumbColor={fullDay ? colors.gold : colors.border} />
            
          </View>

          {!fullDay &&
          <View style={styles.timePickerRow}>
              <TimeButton label={t('availability.start_time')} time={startTime} onPress={() => openTimePicker('start')} />
              <Icon name="arrow-forward" size={14} color={colors.textMuted} />
              <TimeButton label={t('availability.end_time')} time={endTime} onPress={() => openTimePicker('end')} />
            </View>
          }
        </View>

        {/* NOTES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> {t('availability.add_a_note')} </Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder={t('availability.e_g_out_of_town_for_a_family_event_optional')}
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            maxLength={200}
            selectionColor={colors.gold} />
          
          <Text style={styles.noteCharCount}>{note.length}/200</Text>
        </View>

        <View style={styles.reminderStrip}>
          <Icon name="notifications-none" size={14} color={colors.textMuted} />
          <Text style={styles.reminderText}>
             {t('availability.existing_bookings_on_blocked_dates_will_not_be_automatically_cancelled_manage_them_manually_from_sessions')} </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.stickyBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, (!isValid || loading) && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!isValid || loading}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.confirm_and_block_time")}>
          {loading ?
          <ActivityIndicator size="small" color={colors.rootBg} /> :

          <>
              <Icon name="block" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
              <Text style={styles.confirmBtnText}> {t('availability.confirm_block_time')} </Text>
            </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default BlockTimeDayOffScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  cardTitle: {
    fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary,
    marginBottom: spacing.md
  },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  reasonPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: 12, paddingVertical: 8
  },
  reasonPillActive: { backgroundColor: 'rgba(214,168,79,0.10)', borderColor: 'rgba(214,168,79,0.45)' },
  reasonPillText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  reasonPillTextActive: { color: colors.gold },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dateArrow: { paddingHorizontal: 4 },
  durationHint: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: spacing.md },
  durationHintText: {
    fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    flex: 1, lineHeight: 16
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  switchLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  switchSubtitle: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  timePickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)'
  },
  noteInput: {
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, minHeight: 90,
    fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textPrimary, lineHeight: 20
  },
  noteCharCount: {
    fontFamily: fontFamily.interRegular, fontSize: 11,
    color: colors.textMuted, textAlign: 'right', marginTop: 4
  },
  reminderStrip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: 'rgba(217,108,108,0.07)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(217,108,108,0.18)',
    padding: spacing.md
  },
  reminderText: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    flex: 1, lineHeight: 18
  },
  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  confirmBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});