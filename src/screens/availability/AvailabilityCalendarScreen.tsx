import i18next from "i18next"; /**
* CPN-041 — Availability Calendar Screen
* Lets the companion view their monthly calendar, manage weekly
* recurring hours, and add date-specific overrides.
* Calendar booked/off days are now derived from real store data.
*/
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useAvailabilityStore } from '../../store/slices/availabilityStore';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Calendar helpers ─────────────────────────────────────────────────────────

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as any[];



const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"] as any[];

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {grid.push(d);}
  // Pad to complete last week
  while (grid.length % 7 !== 0) {grid.push(null);}
  return grid;
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

const MiniCalendar: React.FC<{
  year: number;
  month: number;
  bookedDays: Set<number>;
  offDays: Set<number>;
}> = ({ year, month, bookedDays, offDays }) => {
  const { t } = useTranslation();
  const grid = buildCalendarGrid(year, month);
  const today = new Date().getDate();
  const isCurrentMonth =
  new Date().getFullYear() === year && new Date().getMonth() === month;

  return (
    <View style={calStyles.calWrap}>
      {/* Day headers */}
      <View style={calStyles.calRow}>
        {DAY_HEADERS.map((h, i) =>
        <View key={i} style={calStyles.calCell}>
            <Text style={calStyles.calDayHeader}>{h}</Text>
          </View>
        )}
      </View>
      {/* Day grid — 7 cells per row */}
      {Array.from({ length: grid.length / 7 }).map((_, rowIdx) =>
      <View key={rowIdx} style={calStyles.calRow}>
          {grid.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
          const isToday = isCurrentMonth && day === today;
          const isBooked = day !== null && bookedDays.has(day);
          const isOff = day !== null && offDays.has(day);
          return (
            <View key={colIdx} style={[
            calStyles.calCell,
            isToday && calStyles.calCellToday,
            isBooked && calStyles.calCellBooked,
            isOff && calStyles.calCellOff]
            }>
                {day !== null &&
              <Text style={[
              calStyles.calDayText,
              isToday && calStyles.calDayTextToday,
              isBooked && calStyles.calDayTextBooked,
              isOff && calStyles.calDayTextOff]
              }>
                    {day}
                  </Text>
              }
              </View>);

        })}
        </View>
      )}
      {/* Legend */}
      <View style={calStyles.legend}>
        {[
        { color: colors.gold, label: i18next.t("content.availability.AvailabilityCalendarScreen.session_booked") },
        { color: colors.softWarning, label: i18next.t("content.availability.AvailabilityCalendarScreen.unavailable") },
        { color: colors.safetyGreen, label: i18next.t("content.availability.AvailabilityCalendarScreen.today") }].
        map((l) =>
        <View key={t(l.label)} style={calStyles.legendItem}>
            <View style={[calStyles.legendDot, { backgroundColor: l.color }]} />
            <Text style={calStyles.legendText}>{t(l.label)}</Text>
          </View>
        )}
      </View>
    </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function AvailabilityCalendarScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const upcomingSessions = useSessionStore((s) => s.upcomingSessions);
  const defaultHours = useAvailabilityStore((s) => s.defaultHours);
  const dateOverrides = useAvailabilityStore((s) => s.dateOverrides);
  const isAvailable = useAvailabilityStore((s) => s.isAvailable);
  const toggleDay = useAvailabilityStore((s) => s.toggleDay);
  const setLiveAvail = useAvailabilityStore((s) => s.setLiveAvailable);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Month navigation state — must be declared BEFORE useMemo that depends on them
  const [calYear, setCalYear] = React.useState(year);
  const [calMonth, setCalMonth] = React.useState(month);

  const prevMonth = () => {
    if (calMonth === 0) {setCalMonth(11);setCalYear((y) => y - 1);} else
    {setCalMonth((m) => m - 1);}
  };
  const nextMonth = () => {
    if (calMonth === 11) {setCalMonth(0);setCalYear((y) => y + 1);} else
    {setCalMonth((m) => m + 1);}
  };

  // ── Derive real booked/off days for the currently displayed month ────────────
  const bookedDays = React.useMemo(() => {
    const s = new Set<number>();
    upcomingSessions.forEach((sess) => {
      const d = new Date(sess.scheduledStart);
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
        s.add(d.getDate());
      }
    });
    return s;
  }, [upcomingSessions, calYear, calMonth]);

  const offDays = React.useMemo(() => {
    const s = new Set<number>();
    dateOverrides.forEach((o) => {
      // Mark every day in the override range that falls in this month
      const start = new Date(o.startDate);
      const end = new Date(o.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        if (cur.getFullYear() === calYear && cur.getMonth() === calMonth) {
          s.add(cur.getDate());
        }
        cur.setDate(cur.getDate() + 1);
      }
    });
    return s;
  }, [dateOverrides, calYear, calMonth]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={i18next.t('availability.my_availability')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate(Routes.ADD_AVAILABILITY_SLOT)} />
      

      {/* ── Live status bar ── */}
      <View style={styles.liveStatusBar}>
        <View style={styles.liveStatusLeft}>
          <View style={[styles.livePulse, { backgroundColor: isAvailable ? colors.safetyGreen : colors.textMuted }]} />
          <Text style={[styles.liveLabel, { color: isAvailable ? colors.safetyGreen : colors.textMuted }]}>
            {isAvailable ? t("content.availability.AvailabilityCalendarScreen.accepting_bookings") : t("content.availability.AvailabilityCalendarScreen.not_available")}
          </Text>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={setLiveAvail}
          trackColor={{ false: colors.elevatedSurface, true: 'rgba(109,214,165,0.35)' }}
          thumbColor={isAvailable ? colors.safetyGreen : colors.border} />
        
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

        {/* SECTION A: TIPS BANNER */}
        <View style={styles.tipBanner}>
          <Icon name="tips-and-updates" size={18} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={styles.tipText}>
            <Text style={styles.tipHighlight}> {i18next.t('availability.want_more_bookings')} </Text>
            {' '} {i18next.t('availability.opening_weekend_slots_increases_bookings_by')} {' '}
            <Text style={styles.tipHighlight}>{i18next.t("content.availability.AvailabilityCalendarScreen.40")}</Text>.
          </Text>
        </View>

        {/* SECTION B: CALENDAR */}
        <View style={styles.card}>
          {/* Month navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity accessibilityRole="button" onPress={prevMonth} style={styles.monthNavBtn}
            accessibilityLabel={i18next.t("accessibility.previous_month")}>
              <Icon name="chevron-left" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[calMonth]} {calYear}
            </Text>
            <TouchableOpacity accessibilityRole="button" onPress={nextMonth} style={styles.monthNavBtn}
            accessibilityLabel={i18next.t("accessibility.next_month")}>
              <Icon name="chevron-right" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <MiniCalendar year={calYear} month={calMonth}
          bookedDays={bookedDays} offDays={offDays} />
        </View>

        {/* SECTION C: WEEKLY SCHEDULE */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}> {i18next.t('availability.default_weekly_schedule')} </Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>
                {defaultHours.filter((d) => d.active).length} {i18next.t('availability.d_active')} </Text>
            </View>
          </View>

          {defaultHours.map((item) =>
          <TouchableOpacity accessibilityRole="button" key={item.day} style={styles.dayRow} activeOpacity={0.7}
          onPress={() => navigation.navigate(Routes.EDIT_AVAILABILITY_SLOT, { slotId: item.day })}>
              {/* Toggle + Day */}
              <Switch
              value={item.active}
              onValueChange={() => toggleDay(item.day)}
              trackColor={{ false: colors.elevatedSurface, true: 'rgba(109,214,165,0.30)' }}
              thumbColor={item.active ? colors.safetyGreen : colors.border}
              style={styles.daySwitch} />
            
              <Text style={[styles.dayName, !item.active && styles.dayNameOff]}>
                {item.day}
              </Text>

              {/* Times */}
              <View style={styles.dayTimesWrap}>
                {item.active ?
              <View style={styles.dayTimesPill}>
                    <Icon name="schedule" size={11} color={colors.textMuted} />
                    <Text style={styles.dayTimesText}>{item.times}</Text>
                  </View> :

              <View style={styles.dayClosedPill}>
                    <Text style={styles.dayClosedText}> {i18next.t('availability.closed')} </Text>
                  </View>
              }
              </View>
              <Icon name="chevron-right" size={16} color={colors.border} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}

          <TouchableOpacity accessibilityRole="button"
            style={styles.editScheduleBtn}
            onPress={() => navigation.navigate(Routes.WEEKLY_RECURRING_AVAILABILITY)}
            activeOpacity={0.75}>
            <Icon name="edit" size={14} color={colors.gold} style={{ marginRight: 5 }} />
            <Text style={styles.editScheduleText}> {i18next.t('availability.edit_weekly_schedule')} </Text>
          </TouchableOpacity>
        </View>

        {/* SECTION D: DATE OVERRIDES */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}> {i18next.t('availability.date_overrides')} </Text>
            {dateOverrides.length > 0 &&
            <View style={[styles.sectionBadge, { backgroundColor: 'rgba(217,108,108,0.12)' }]}>
                <Text style={[styles.sectionBadgeText, { color: colors.softWarning }]}>
                  {dateOverrides.length}  {i18next.t('availability.override')} {dateOverrides.length > 1 ? 's' : ''}
                </Text>
              </View>
            }
          </View>

          {dateOverrides.length === 0 ?
          <View style={styles.emptyOverride}>
              <Icon name="event-busy" size={28} color={colors.textMuted} style={{ marginBottom: 8 }} />
              <Text style={styles.emptyOverrideTitle}> {i18next.t('availability.no_upcoming_overrides')} </Text>
              <Text style={styles.emptyOverrideText}>
                 {i18next.t('availability.add_one_if_you_are_taking_a_leave_going_on_vacation_or_need_a_custom_day')} </Text>
            </View> :

          dateOverrides.map((o) =>
          <View key={o.id} style={styles.overrideRow}>
                <Icon name="event-busy" size={16} color={colors.softWarning} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.overrideDate}>{o.startDate}{o.startDate !== o.endDate ? ` → ${o.endDate}` : ''}</Text>
                  <Text style={styles.overrideLabel}>{t(o.reason)}{o.note ? ` · ${o.note}` : ''}</Text>
                </View>
                <TouchableOpacity accessibilityRole="button" onPress={() => useAvailabilityStore.getState().removeOverride(o.id)}>
                  <Icon name="close" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
          )
          }

          <TouchableOpacity accessibilityRole="button"
            style={styles.addOverrideBtn}
            onPress={() => navigation.navigate(Routes.BLOCK_TIME_DAY_OFF)}
            activeOpacity={0.8}
            accessibilityLabel={i18next.t("accessibility.add_date_override")}>
            <Icon name="add" size={18} color={colors.gold} style={{ marginRight: 6 }} />
            <Text style={styles.addOverrideBtnText}> {i18next.t('availability.add_date_override')} </Text>
          </TouchableOpacity>
        </View>

        {/* ── Go Live link ── */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.vacationRow}
          onPress={() => navigation.navigate(Routes.LIVE_AVAILABILITY_TOGGLE)}
          activeOpacity={0.75}>
          <Icon name="wifi-tethering" size={16} color={colors.safetyGreen} />
          <Text style={[styles.vacationText, { color: colors.safetyGreen }]}> {i18next.t('availability.go_live_for_instant_bookings')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ── Vacation mode link ── */}
        <TouchableOpacity accessibilityRole="button"
          style={styles.vacationRow}
          onPress={() => navigation.navigate(Routes.VACATION_MODE)}
          activeOpacity={0.75}>
          <Icon name="flight" size={16} color={colors.textMuted} />
          <Text style={styles.vacationText}> {i18next.t('availability.going_away_enable_vacation_mode')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>);

}

export default AvailabilityCalendarScreen;

// ─── Calendar sub-styles ──────────────────────────────────────────────────────

const calStyles = StyleSheet.create({
  calWrap: { paddingTop: spacing.sm },
  calRow: { flexDirection: 'row' },
  calCell: {
    flex: 1, aspectRatio: 1,
    alignItems: 'center', justifyContent: 'center',
    margin: 1.5, borderRadius: radius.sm
  },
  calCellToday: { backgroundColor: 'rgba(109,214,165,0.20)', borderWidth: 1, borderColor: colors.safetyGreen },
  calCellBooked: { backgroundColor: 'rgba(214,168,79,0.18)' },
  calCellOff: { backgroundColor: 'rgba(217,108,108,0.12)' },
  calDayHeader: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted },
  calDayText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary },
  calDayTextToday: { fontFamily: fontFamily.interBold, color: colors.safetyGreen },
  calDayTextBooked: { fontFamily: fontFamily.interSemiBold, color: colors.gold },
  calDayTextOff: { color: colors.softWarning },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted }
});

// ─── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  liveStatusBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    backgroundColor: colors.cardSurface,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)'
  },
  liveStatusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  livePulse: { width: 8, height: 8, borderRadius: 4 },
  liveLabel: { fontFamily: fontFamily.interBold, fontSize: 13 },

  // Tip banner
  tipBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md
  },
  tipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 19, flex: 1 },
  tipHighlight: { fontFamily: fontFamily.interBold, color: colors.gold },

  // Card
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },

  // Month header
  monthHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  monthTitle: { fontFamily: fontFamily.playfairSemiBold, fontSize: 16, color: colors.gold },
  monthNavBtn: {
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  sectionTitle: { fontFamily: fontFamily.playfairSemiBold, fontSize: 15, color: colors.gold },
  sectionBadge: {
    backgroundColor: 'rgba(109,214,165,0.12)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)',
    paddingHorizontal: 8, paddingVertical: 2
  },
  sectionBadgeText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.safetyGreen },

  // Day rows
  dayRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  daySwitch: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }], marginRight: spacing.sm },
  dayName: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary, width: 36 },
  dayNameOff: { color: colors.textMuted },
  dayTimesWrap: { flex: 1, alignItems: 'flex-end' },
  dayTimesPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)',
    paddingHorizontal: 8, paddingVertical: 3
  },
  dayTimesText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textSecondary },
  dayClosedPill: {
    backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 3
  },
  dayClosedText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },

  editScheduleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.md, paddingVertical: spacing.sm
  },
  editScheduleText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },

  // Overrides
  emptyOverride: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyOverrideTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary, marginBottom: 5 },
  emptyOverrideText: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    textAlign: 'center', lineHeight: 18
  },
  overrideRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  overrideDate: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  overrideLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  addOverrideBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.md, height: 44, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)',
    backgroundColor: 'rgba(214,168,79,0.06)'
  },
  addOverrideBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold },

  // Vacation strip
  vacationRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.sm
  },
  vacationText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1 }
});