import i18next from "i18next"; /**
* EarlyEndSessionScreen (CPN-113)
* Companion ends session before scheduled time with reason selection and earnings impact.
*/
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const REASONS = ["Customer request", "Emergency", "Safety concern", "Mutual agreement"] as any[];






export function EarlyEndSessionScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const updateSessionStatus = useSessionStore((s) => s.updateSessionStatus);
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);

  const scheduledMins = session?.durationMinutes ?? 0;
  const scheduledEarn = session?.baseEarning ?? 0;
  const scheduledLabel = scheduledMins >= 60 ?
  `${Math.floor(scheduledMins / 60)} hr${Math.floor(scheduledMins / 60) > 1 ? 's' : ''} = ₹${scheduledEarn.toLocaleString('en-IN')}` :
  `${scheduledMins} min = ₹${scheduledEarn.toLocaleString('en-IN')}`;

  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selected) {return;}
    if (sessionId) {updateSessionStatus(sessionId, 'completed');}
    navigation.replace(Routes.SESSION_COMPLETE, { sessionId });
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.end_session_early')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Warning card */}
        <View style={s.warnCard}>
          <Icon name="warning-amber" size={20} color={colors.softWarning} />
          <Text style={s.warnText}>
             {t('sessions.ending_early_may_affect_your_ratings_and_earnings_please_select_a_reason_below')} </Text>
        </View>

        {/* Reason selection */}
        <Text style={s.sectionTitle}> {t('sessions.select_reason')} </Text>
        {REASONS.map((r) =>
        <TouchableOpacity accessibilityRole="button"
          key={r}
          style={[s.reasonPill, selected === r && s.reasonPillActive]}
          onPress={() => setSelected(r)}
          activeOpacity={0.75}>
            <View style={[s.reasonRadio, selected === r && s.reasonRadioActive]}>
              {selected === r && <View style={s.reasonRadioInner} />}
            </View>
            <Text style={[s.reasonLabel, selected === r && s.reasonLabelActive]}>{r}</Text>
          </TouchableOpacity>
        )}

        {/* Earnings summary */}
        <Text style={[s.sectionTitle, { marginTop: spacing.lg }]}> {t('sessions.earnings_impact')} </Text>
        <View style={s.earningsCard}>
          <View style={s.earningsRow}>
            <Text style={s.earningsLabel}> {t('sessions.scheduled')} </Text>
            <Text style={s.earningsValue}>{scheduledLabel}</Text>
          </View>
          <View style={s.earningsDivider} />
          <View style={s.earningsRow}>
            <Text style={s.earningsLabel}> {t('sessions.actual')} </Text>
            <Text style={s.earningsValue}> {t('sessions.prorated_at_end')} </Text>
          </View>
          <View style={s.earningsDivider} />
          <View style={s.earningsRow}>
            <Text style={s.earningsLabel}> {t('sessions.difference')} </Text>
            <Text style={s.earningsRed}> {t('sessions.calculated_at_session_end')} </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky buttons */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button"
          style={[s.btnRed, !selected && s.btnDisabled]}
          onPress={handleConfirm} disabled={!selected}
          activeOpacity={0.85} accessibilityLabel={t("accessibility.confirm_early_end")}>
          <Icon name="stop-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={s.btnRedText}> {t('sessions.confirm_early_end')} </Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={s.btnOutline}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        activeOpacity={0.75} accessibilityLabel={t("accessibility.continue_session")}>
          <Text style={s.btnOutlineText}> {t('sessions.continue_session')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default EarlyEndSessionScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  warnCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(255,171,64,0.09)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.28)',
    padding: spacing.lg, marginBottom: spacing.lg
  },
  warnText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.softWarning, flex: 1, lineHeight: 21 },

  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },

  reasonPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm
  },
  reasonPillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.07)' },
  reasonRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reasonRadioActive: { borderColor: colors.gold },
  reasonRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold },
  reasonLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary },
  reasonLabelActive: { color: colors.textPrimary },

  earningsCard: {
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  earningsDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: spacing.sm },
  earningsLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  earningsValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  earningsRed: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.softWarning },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm },
  btnRed: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.softWarning },
  btnDisabled: { opacity: 0.45 },
  btnRedText: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff' },
  btnOutline: { height: 48, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)' },
  btnOutlineText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold }
});