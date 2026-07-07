import i18next from "i18next"; /**
* AddAvailabilitySlotScreen (CPN-072)
* Dynamic date generation (next 7 days) + handleSave writes to availabilityStore.
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView, StyleSheet, StatusBar } from 'react-native';
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

// ─── Dynamic date & time arrays ───────────────────────────────────────────────

function genNextDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString(i18next.language || 'en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  });
}

const DATES = genNextDays(14); // Next 14 days from today
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

export function AddAvailabilitySlotScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const addSlot = useAvailabilityStore((s) => s.addSlot);

  const [date, setDate] = useState(DATES[0]); // Defaults to today
  const [start, setStart] = useState('09:00 AM');
  const [end, setEnd] = useState('01:00 PM');
  const [repeat, setRepeat] = useState(false);

  // ── Save — writes to store ───────────────────────────────────────────────────
  const handleSave = () => {
    addSlot({ date, startTime: start, endTime: end, repeat });
    Alert.alert(t("alerts.slot_added"), t("alerts.v0_v1_v2_v3", { v0:

      date, v1: start, v2: end, v3: repeat ? t("content.availability.AddAvailabilitySlotScreen.repeating_weekly") : '' }),
    [{ text: t("alerts.ok"), onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('availability.add_new_slot')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

        <Text style={s.subtitle}> {t('availability.choose_when_you_want_to_be_available')} </Text>

        <View style={s.card}>
          <CycleRow icon="calendar-today" label={t('availability.select_date')} value={date} options={DATES} onChange={setDate} />
          <View style={s.sep} />
          <CycleRow icon="schedule" label={t('availability.start_time')} value={start} options={STARTS} onChange={setStart} />
          <View style={s.sep} />
          <CycleRow icon="timer-off" label={t('availability.end_time')} value={end} options={ENDS} onChange={setEnd} />
        </View>

        {/* Repeat weekly toggle */}
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

        {/* Summary preview */}
        <View style={s.previewCard}>
          <Icon name="event-available" size={16} color={colors.safetyGreen} />
          <Text style={s.previewText}>
            <Text style={s.previewBold}>{date}</Text>
            {' '} {t('availability.from')} {' '}
            <Text style={s.previewBold}>{start}</Text>
            {' '} {t('availability.to')} {' '}
            <Text style={s.previewBold}>{end}</Text>
            {repeat ? t("content.availability.AddAvailabilitySlotScreen.repeating_weekly_1") : ''}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Icon name="check" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.saveBtnText}> {t('availability.save_availability_slot')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default AddAvailabilitySlotScreen;

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
  previewCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)', padding: spacing.md },
  previewText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    flex: 1, lineHeight: 19 },
  previewBold: { fontFamily: fontFamily.interBold, color: colors.textPrimary },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  saveBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});