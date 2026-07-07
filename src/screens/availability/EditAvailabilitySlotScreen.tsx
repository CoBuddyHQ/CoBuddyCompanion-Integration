import i18next from "i18next"; /**
* EditAvailabilitySlotScreen (CPN-073)
* Now reads slot data from route.params.slotId + availabilityStore.
* handleUpdate calls store.updateSlot(), handleDelete calls store.removeSlot().
*/
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useAvailabilityStore } from '../../store/slices/availabilityStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Dynamic date & time arrays ───────────────────────────────────────────────

function genNextDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString(i18next.language || 'en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  });
}

const DATES = genNextDays(14);
const STARTS = ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"] as any[];
const ENDS = ["11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"] as any[];

// ─── CycleRow sub-component ───────────────────────────────────────────────────

const CycleRow: React.FC<{
  icon: string;label: string;value: string;
  options: string[];onChange: (v: string) => void;
}> = ({ icon, label, value, options, onChange }) => {
  const idx = options.indexOf(value);
  const next = () => onChange(options[(idx + 1) % options.length]);
  const prev = () => onChange(options[(idx - 1 + options.length) % options.length]);
  return (
    <View style={s.fieldRow}>
      <View style={s.fieldIconWrap}>
        <Icon name={icon as any} size={18} color={colors.gold} />
      </View>
      <View style={s.fieldBody}>
        <Text style={s.fieldLabel}>{label}</Text>
        <View style={s.cycleWrap}>
          <TouchableOpacity onPress={prev} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="chevron-left" size={22} color={colors.textMuted} />
          </TouchableOpacity>
          <Text style={s.cycleValue}>{value}</Text>
          <TouchableOpacity onPress={next} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function EditAvailabilitySlotScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const slotId = route.params?.slotId as string | undefined;

  const slots = useAvailabilityStore((s) => s.slots);
  const updateSlot = useAvailabilityStore((s) => s.updateSlot);
  const removeSlot = useAvailabilityStore((s) => s.removeSlot);

  // Resolve slot from store — fallback to empty defaults
  const existingSlot = useMemo(
    () => slots.find((sl) => sl.id === slotId),
    [slots, slotId]
  );

  // Ensure date is in our DATES array; if not (slot has a date outside window), prepend it
  const resolvedDates = useMemo(() => {
    if (existingSlot && !DATES.includes(existingSlot.date)) {
      return [existingSlot.date, ...DATES];
    }
    return DATES;
  }, [existingSlot]);

  const [date, setDate] = useState(existingSlot?.date ?? DATES[0]);
  const [start, setStart] = useState(existingSlot?.startTime ?? '09:00 AM');
  const [end, setEnd] = useState(existingSlot?.endTime ?? '01:00 PM');
  const [repeat, setRepeat] = useState(existingSlot?.repeat ?? false);

  // ── Update — writes to store ──────────────────────────────────────────────────
  const handleUpdate = () => {
    if (slotId) {
      updateSlot(slotId, { date, startTime: start, endTime: end, repeat });
    }
    Alert.alert(t("alerts.slot_updated"), t("alerts.v0_v1_v2", { v0: date, v1: start, v2: end }), [
    { text: t("alerts.ok"), onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]
    );
  };

  // ── Delete — writes to store ──────────────────────────────────────────────────
  const handleDelete = () => {
    Alert.alert(t("alerts.delete_slot"), t("alerts.are_you_sure_you_want_to_delete_this_slo"), [
    { text: t("alerts.cancel"), style: 'cancel' },
    { text: t("alerts.delete"), style: 'destructive', onPress: () => {
        if (slotId) {removeSlot(slotId);}
        navigation.canGoBack() ? navigation.goBack() : undefined;
      } }]
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('availability.edit_slot')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

        <Text style={s.subtitle}> {t('availability.modify_your_existing_availability_slot')} </Text>

        <View style={s.card}>
          <CycleRow icon="calendar-today" label={t('availability.select_date')} value={date} options={resolvedDates} onChange={setDate} />
          <View style={s.sep} />
          <CycleRow icon="schedule" label={t('availability.start_time')} value={start} options={STARTS} onChange={setStart} />
          <View style={s.sep} />
          <CycleRow icon="timer-off" label={t('availability.end_time')} value={end} options={ENDS} onChange={setEnd} />
        </View>

        <View style={s.toggleCard}>
          <View style={s.toggleLeft}>
            <View style={s.toggleIconWrap}>
              <Icon name="repeat" size={18} color={colors.gold} />
            </View>
            <View>
              <Text style={s.toggleLabel}> {t('availability.repeat_weekly')} </Text>
              <Text style={s.toggleSub}> {t('availability.every_week_on_this_same_day')} </Text>
            </View>
          </View>
          <Switch value={repeat} onValueChange={setRepeat}
          trackColor={{ false: colors.elevatedSurface, true: 'rgba(214,168,79,0.35)' }}
          thumbColor={repeat ? colors.gold : colors.border} />
        </View>

        <View style={{ height: 20 }} />

        {/* Danger zone */}
        <Text style={s.dangerLabel}> {t('availability.danger_zone')} </Text>
        <TouchableOpacity style={s.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Icon name="delete-outline" size={18} color={colors.softWarning} style={{ marginRight: 8 }} />
          <Text style={s.deleteBtnText}> {t('availability.delete_this_slot')} </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.saveBtn} onPress={handleUpdate} activeOpacity={0.85}>
          <Icon name="check" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.saveBtnText}> {t('availability.update_slot')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default EditAvailabilitySlotScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  card: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  fieldIconWrap: { width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  fieldBody: { flex: 1 },
  fieldLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  cycleWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cycleValue: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  toggleCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.md },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  toggleIconWrap: { width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  toggleLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  toggleSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  dangerLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: radius.md, borderWidth: 1.5,
    borderColor: 'rgba(217,108,108,0.40)', backgroundColor: 'rgba(217,108,108,0.06)' },
  deleteBtnText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.softWarning },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  saveBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});