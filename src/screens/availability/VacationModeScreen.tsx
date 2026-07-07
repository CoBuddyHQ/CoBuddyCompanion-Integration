/**
 * VacationModeScreen (CPN-078)
 * handleSave now calls useAvailabilityStore.setVacationMode() — persists across navigation.
 * Date options generated dynamically from today forward.
 */
import React, { useState, useMemo } from 'react';
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
import i18next from 'i18next';

// ─── Dynamic date generation ──────────────────────────────────────────────────

function genFutureDates(startOffsetDays: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + startOffsetDays + i);
    return d.toLocaleDateString(i18next.language || 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  });
}

// ─── CycleRow sub-component ───────────────────────────────────────────────────

const CycleRow: React.FC<{
  icon: string;label: string;value: string;
  options: string[];onChange: (v: string) => void;disabled?: boolean;
}> = ({ icon, label, value, options, onChange, disabled }) => {
  const idx = options.indexOf(value);
  const next = () => !disabled && onChange(options[(idx + 1) % options.length]);
  const prev = () => !disabled && onChange(options[(idx - 1 + options.length) % options.length]);
  return (
    <View style={[s.fieldRow, disabled && { opacity: 0.45 }]}>
      <View style={s.fieldIconWrap}>
        <Icon name={icon as any} size={18} color={colors.gold} />
      </View>
      <View style={s.fieldBody}>
        <Text style={s.fieldLabel}>{label}</Text>
        <View style={s.cycleWrap}>
          <TouchableOpacity accessibilityRole="button" onPress={prev} disabled={disabled} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="chevron-left" size={22} color={disabled ? colors.border : colors.textMuted} />
          </TouchableOpacity>
          <Text style={s.cycleValue}>{value}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={next} disabled={disabled} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="chevron-right" size={22} color={disabled ? colors.border : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function VacationModeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const vacationMode = useAvailabilityStore((s) => s.vacationMode);
  const setVacationMode = useAvailabilityStore((s) => s.setVacationMode);

  // Dynamic future dates — regenerated each render (stable via useMemo)
  const AWAY_OPTIONS = useMemo(() => genFutureDates(1, 10), []);
  const RETURN_OPTIONS = useMemo(() => genFutureDates(3, 10), []);

  // Seed from store; fall back to first dynamic option
  const [enabled, setEnabled] = useState(vacationMode.enabled);
  const [awayFrom, setAwayFrom] = useState(
    vacationMode.awayFrom || AWAY_OPTIONS[0]
  );
  const [returnOn, setReturnOn] = useState(
    vacationMode.returnOn || RETURN_OPTIONS[0]
  );

  // ── Save — writes to store ────────────────────────────────────────────────────
  const handleSave = () => {
    setVacationMode(enabled, awayFrom, returnOn);
    Alert.alert(t("alerts.settings_saved"),

    enabled ?
    `Vacation Mode enabled from ${awayFrom} to ${returnOn}.` : t("content.availability.VacationModeScreen.vacation_mode_disabled"),

    [{ text: t("alerts.ok") }]
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('availability.vacation_mode')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={[s.heroBanner, enabled && s.heroBannerActive]}>
          <Icon name="flight" size={28} color={enabled ? colors.gold : colors.textMuted} />
          <Text style={[s.heroTitle, enabled && s.heroTitleActive]}>
             {t('availability.vacation_mode')} {enabled ? t("content.availability.VacationModeScreen.on") : t("content.availability.VacationModeScreen.off")}
          </Text>
          <Text style={s.heroSub}>
            {enabled ?
            `You will be hidden from search and won't receive bookings from ${awayFrom}.` : t("content.availability.VacationModeScreen.enable_to_pause_new_bookings_while_you_a")
            }
          </Text>
        </View>

        {/* Toggle card */}
        <View style={s.toggleCard}>
          <View style={s.toggleLeft}>
            <View style={[s.toggleIconWrap, enabled && s.toggleIconWrapActive]}>
              <Icon name="beach-access" size={18} color={enabled ? colors.gold : colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.toggleLabel}> {t('availability.enable_vacation_mode')} </Text>
              <Text style={s.toggleSub}> {t('availability.pause_all_new_booking_requests')} </Text>
            </View>
          </View>
          <Switch value={enabled} onValueChange={setEnabled}
          trackColor={{ false: colors.elevatedSurface, true: 'rgba(214,168,79,0.40)' }}
          thumbColor={enabled ? colors.gold : colors.border} />
        </View>

        {/* Info note */}
        <View style={s.infoNote}>
          <Icon name="info-outline" size={14} color={colors.textMuted} style={{ flexShrink: 0 }} />
          <Text style={s.infoText}>
             {t('availability.your_profile_will_be_hidden_from_search_results_and_you_won_t_receive_new_booking_requests_existing_confirmed_sessions_will_not_be_affected')} </Text>
        </View>

        {/* Date selection — only when enabled */}
        {enabled &&
        <>
            <Text style={s.sectionLabel}> {t('availability.travel_dates')} </Text>
            <View style={s.datesCard}>
              <CycleRow icon="flight-takeoff" label={t('availability.away_from_1')} value={awayFrom}
            options={AWAY_OPTIONS} onChange={setAwayFrom} />
              <View style={s.sep} />
              <CycleRow icon="flight-land" label={t('availability.return_on')} value={returnOn}
            options={RETURN_OPTIONS} onChange={setReturnOn} />
            </View>

            <View style={s.summaryCard}>
              <Icon name="date-range" size={16} color={colors.gold} />
              <Text style={s.summaryText}>
                 {t('availability.away_from')} {' '}
                <Text style={s.summaryBold}>{awayFrom}</Text>
                {' '} {t('availability.until')} {' '}
                <Text style={s.summaryBold}>{returnOn}</Text>
              </Text>
            </View>
          </>
        }

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity accessibilityRole="button" style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Icon name="check" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.saveBtnText}> {t('availability.save_settings')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default VacationModeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  heroBanner: { alignItems: 'center', gap: spacing.sm, backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.xl, marginBottom: spacing.md },
  heroBannerActive: { borderColor: 'rgba(214,168,79,0.35)', backgroundColor: 'rgba(214,168,79,0.05)' },
  heroTitle: { fontFamily: fontFamily.playfairBold, fontSize: 20, color: colors.textMuted },
  heroTitleActive: { color: colors.gold },
  heroSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    textAlign: 'center', lineHeight: 19 },
  toggleCard: { flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  toggleIconWrap: { width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.elevatedSurface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  toggleIconWrapActive: { backgroundColor: 'rgba(214,168,79,0.12)', borderColor: 'rgba(214,168,79,0.28)' },
  toggleLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  toggleSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  infoNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    padding: spacing.md, marginBottom: spacing.md },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted,
    flex: 1, lineHeight: 18 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  datesCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.sm },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  fieldIconWrap: { width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  fieldBody: { flex: 1 },
  fieldLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  cycleWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cycleValue: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  summaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md },
  summaryText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    flex: 1, lineHeight: 19 },
  summaryBold: { fontFamily: fontFamily.interBold, color: colors.gold },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  saveBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.gold, borderRadius: radius.md },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});