import i18next from "i18next"; /**
* WeeklyRecurringAvailabilityScreen
* Companion edits their default working hours per day of the week.
* Accessed from: AvailabilityCalendarScreen → "Edit Weekly Schedule".
*/
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useAvailabilityStore } from '../../store/slices/availabilityStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayState {
  day: string; // short  e.g. 'Mon'
  fullDay: string; // long   e.g. 'Monday'
  active: boolean;
  startTime: string; // e.g. '09:00 AM'
  endTime: string; // e.g. '05:00 PM'
}
const FULL_DAY_MAP: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

// Pre-defined time slots for the picker Alert
const TIME_OPTIONS = ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"] as

any[];

// ─── Time picker (Alert-based, no native library) ─────────────────────────────

function openTimePicker(title: string, current: string, onSelect: (time: string) => void): void {
  // Show two pages of options to keep the Alert manageable (first 8, then next 9)
  const page1 = TIME_OPTIONS.slice(0, 8);
  const page2 = TIME_OPTIONS.slice(8);
  const showPage = (options: string[], showMore: boolean) => {
    Alert.alert(title, i18next.t("alerts.current_v0", {
      v0: current
    }), [...options.map((t) => ({
      text: t,
      onPress: () => onSelect(t)
    })), showMore ? {
      text: 'More times →',
      onPress: () => showPage(page2, false)
    } : {
      text: '← Earlier times',
      onPress: () => showPage(page1, true)
    }, {
      text: i18next.t("alerts.cancel"),
      style: 'cancel' as const
    }]);
  };
  showPage(page1, true);
}

// ─── Day Editor Card ──────────────────────────────────────────────────────────

interface DayCardProps {
  day: DayState;
  onToggle: () => void;
  onStartTime: () => void;
  onEndTime: () => void;
}
const DayCard: React.FC<DayCardProps> = ({
  day,
  onToggle,
  onStartTime,
  onEndTime
}) => {
  const {
    t
  } = useTranslation();
  return <View style={[styles.dayCard, !day.active && styles.dayCardOff]}>
    {/* Header row: day name + toggle */}
    <View style={styles.dayCardHeader}>
      <View style={styles.dayNameWrap}>
        <View style={[styles.dayDot, {
          backgroundColor: day.active ? colors.safetyGreen : colors.border
        }]} />
        <Text style={[styles.dayName, !day.active && styles.dayNameOff]}>
          {day.fullDay}
        </Text>
      </View>
      <Switch value={day.active} onValueChange={onToggle} trackColor={{
        false: colors.elevatedSurface,
        true: 'rgba(109,214,165,0.30)'
      }} thumbColor={day.active ? colors.safetyGreen : colors.border} />
        
    </View>

    {/* Time pickers or Closed state */}
    {day.active ? <View style={styles.timeRow}>
        {/* Start time */}
        <TouchableOpacity accessibilityRole="button" style={styles.timeBtn} onPress={onStartTime} activeOpacity={0.75}>
          <Icon name="play-circle-outline" size={14} color={colors.safetyGreen} />
          <View style={styles.timeBtnMid}>
            <Text style={styles.timeBtnLabel}> {i18next.t('availability.start')} </Text>
            <Text style={styles.timeBtnValue}>{day.startTime}</Text>
          </View>
          <Icon name="expand-more" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Separator arrow */}
        <View style={styles.timeArrow}>
          <Icon name="arrow-forward" size={14} color={colors.textMuted} />
        </View>

        {/* End time */}
        <TouchableOpacity accessibilityRole="button" style={styles.timeBtn} onPress={onEndTime} activeOpacity={0.75}>
          <Icon name="stop-circle" size={14} color={colors.softWarning} />
          <View style={styles.timeBtnMid}>
            <Text style={styles.timeBtnLabel}> {i18next.t('availability.end')} </Text>
            <Text style={styles.timeBtnValue}>{day.endTime}</Text>
          </View>
          <Icon name="expand-more" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Duration chip */}
        <View style={styles.durationChip}>
          <Text style={styles.durationText}>{calcDuration(day.startTime, day.endTime)}</Text>
        </View>
      </View> : <View style={styles.closedRow}>
        <Icon name="do-not-disturb" size={14} color={colors.textMuted} />
        <Text style={styles.closedText}> {i18next.t('availability.closed_tap_toggle_to_enable')} </Text>
      </View>}
  </View>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTime(t: string): number {
  // Returns minutes from midnight
  const [timePart, meridiem] = t.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  const hours = meridiem === 'PM' ? h === 12 ? 12 : h + 12 : h === 12 ? 0 : h;
  return hours * 60 + (m || 0);
}
function calcDuration(start: string, end: string): string {
  const diff = parseTime(end) - parseTime(start);
  if (diff <= 0) {
    return '—';
  }
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
function stateToTimesString(day: DayState): string {
  return day.active ? `${day.startTime} - ${day.endTime}` : i18next.t("content.availability.WeeklyRecurringAvailabilityScreen.closed");
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function WeeklyRecurringAvailabilityScreen(): React.JSX.Element {
  const {
    t
  } = useTranslation();
  const navigation = useNavigation<any>();
  const defaultHours = useAvailabilityStore((s) => s.defaultHours);
  const setDayTimes = useAvailabilityStore((s) => s.setDayTimes);
  const toggleDay = useAvailabilityStore((s) => s.toggleDay);

  // Local editable state — seed from store
  const [days, setDays] = useState<DayState[]>(() => defaultHours.map((d) => {
    const parts = d.times.split(' - ');
    return {
      day: d.day,
      fullDay: FULL_DAY_MAP[d.day] ?? d.day,
      active: d.active,
      startTime: parts[0] ?? '09:00 AM',
      endTime: parts[1] ?? '05:00 PM'
    };
  }));
  const [loading, setLoading] = useState(false);

  // ── Day updates ─────────────────────────────────────────────────────────────
  const handleToggle = useCallback((idx: number) => {
    setDays((prev) => prev.map((d, i) => i === idx ? {
      ...d,
      active: !d.active
    } : d));
  }, []);
  const handleStartTime = useCallback((idx: number) => {
    openTimePicker(`${days[idx].fullDay} — Start Time`, days[idx].startTime, (time) => setDays((prev) => prev.map((d, i) => i === idx ? {
      ...d,
      startTime: time
    } : d)));
  }, [days]);
  const handleEndTime = useCallback((idx: number) => {
    openTimePicker(`${days[idx].fullDay} — End Time`, days[idx].endTime, (time) => setDays((prev) => prev.map((d, i) => i === idx ? {
      ...d,
      endTime: time
    } : d)));
  }, [days]);

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (loading) {
      return;
    }
    setLoading(true);

    // Sync back to store
    days.forEach((d) => {
      // Toggle store state if it differs
      const storeDay = defaultHours.find((h) => h.day === d.day);
      if (storeDay && storeDay.active !== d.active) {
        toggleDay(d.day);
      }
      // Update times
      if (d.active) {
        setDayTimes(d.day, stateToTimesString(d));
      }
    });
    setTimeout(() => {
      setLoading(false);
      navigation.canGoBack() ? navigation.goBack() : undefined;
    }, 800);
  };
  const activeDaysCount = days.filter((d) => d.active).length;
  return <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={i18next.t('availability.weekly_schedule')} showBack onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ══════════════════════════════════════════
               INFO BANNER
            ══════════════════════════════════════════ */}
        <View style={styles.infoBanner}>
          <Icon name="info-outline" size={17} color={colors.gold} style={{
          flexShrink: 0,
          marginTop: 1
        }} />
          <Text style={styles.infoBannerText}>
             {i18next.t('availability.these_are_your')} {' '}
            <Text style={styles.infoBannerHighlight}> {i18next.t('availability.default_working_hours')} </Text> {i18next.t('availability.you_can_still_block_specific_dates_using')} {' '}
            <Text style={styles.infoBannerHighlight}> {i18next.t('availability.date_overrides')} </Text>.
          </Text>
        </View>

        {/* Active days summary */}
        <View style={styles.summaryRow}>
          <Icon name="event-available" size={14} color={colors.safetyGreen} />
          <Text style={styles.summaryText}>
            {activeDaysCount}  {i18next.t('availability.day')} {activeDaysCount !== 1 ? 's' : ''}  {i18next.t('availability.active_this_week')} </Text>
        </View>

        {/* ══════════════════════════════════════════
               DAY CARDS
            ══════════════════════════════════════════ */}
        {days.map((day, idx) => <DayCard key={day.day} day={day} onToggle={() => handleToggle(idx)} onStartTime={() => handleStartTime(idx)} onEndTime={() => handleEndTime(idx)} />)}

        {/* Tip */}
        <View style={styles.tipRow}>
          <Icon name="tips-and-updates" size={13} color={colors.textMuted} />
          <Text style={styles.tipText}>
             {i18next.t('availability.adding_weekend_slots_can_increase_your_bookings_by_up_to_40')} </Text>
        </View>

        <View style={{
        height: 120
      }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
             STICKY SAVE BAR
          ══════════════════════════════════════════ */}
      <View style={styles.stickyBar}>
        <TouchableOpacity accessibilityRole="button" style={[styles.saveBtn, loading && styles.saveBtnLoading]} onPress={handleSave} disabled={loading} activeOpacity={0.85} accessibilityLabel={i18next.t("accessibility.save_schedule")}>
          {loading ? <ActivityIndicator size="small" color={colors.rootBg} /> : <>
              <Icon name="check-circle" size={18} color={colors.rootBg} style={{
            marginRight: 8
          }} />
              <Text style={styles.saveBtnText}> {i18next.t('availability.save_schedule')} </Text>
            </>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>;
}
export default WeeklyRecurringAvailabilityScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  // Info banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.22)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  infoBannerText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    flex: 1
  },
  infoBannerHighlight: {
    fontFamily: fontFamily.interBold,
    color: colors.gold
  },
  // Summary
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md
  },
  summaryText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 13,
    color: colors.safetyGreen
  },
  // Day card
  dayCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: spacing.sm
  },
  dayCardOff: {
    opacity: 0.72
  },
  dayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  dayNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  dayName: {
    fontFamily: fontFamily.interBold,
    fontSize: 15,
    color: colors.textPrimary
  },
  dayNameOff: {
    color: colors.textMuted
  },
  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  timeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  timeBtnMid: {
    flex: 1
  },
  timeBtnLabel: {
    fontFamily: fontFamily.interRegular,
    fontSize: 10,
    color: colors.textMuted
  },
  timeBtnValue: {
    fontFamily: fontFamily.interBold,
    fontSize: 13,
    color: colors.textPrimary
  },
  timeArrow: {
    alignItems: 'center',
    paddingHorizontal: 2
  },
  durationChip: {
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.20)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexShrink: 0
  },
  durationText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 11,
    color: colors.gold
  },
  // Closed state
  closedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6
  },
  closedText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted
  },
  // Tip
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs
  },
  tipText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 18
  },
  // Sticky bar
  stickyBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)'
  },
  saveBtn: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.gold
  },
  saveBtnLoading: {
    opacity: 0.75
  },
  saveBtnText: {
    fontFamily: fontFamily.interBold,
    fontSize: 15,
    color: colors.rootBg
  }
});