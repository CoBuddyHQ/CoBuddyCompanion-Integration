import i18next from "i18next"; /**
* ExtendSessionRequestScreen (CPN-111)
* Companion requests a session extension with duration selection and price preview.
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

const OPTIONS = [{ label: "content.sessions.ExtendSessionRequestScreen.options.0.label", minutes: "content.sessions.ExtendSessionRequestScreen.options.0.minutes", price: "content.sessions.ExtendSessionRequestScreen.options.0.price" }, { label: "content.sessions.ExtendSessionRequestScreen.options.1.label", minutes: "content.sessions.ExtendSessionRequestScreen.options.1.minutes", price: "content.sessions.ExtendSessionRequestScreen.options.1.price" }, { label: "content.sessions.ExtendSessionRequestScreen.options.2.label", minutes: "content.sessions.ExtendSessionRequestScreen.options.2.minutes", price: "content.sessions.ExtendSessionRequestScreen.options.2.price" }] as any[];





export function ExtendSessionRequestScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);

  const fmtTime = (iso?: string, offsetMins = 0): string => {
    if (!iso) {return '—';}
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + offsetMins);
    return d.toLocaleTimeString(i18next.language || 'en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  const currentEnd = fmtTime(session?.scheduledEnd);

  const [selected, setSelected] = useState(1); // default +1 hour

  const opt = OPTIONS[selected];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.extend_session')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Current end time */}
        <View style={s.endTimeCard}>
          <Icon name="schedule" size={20} color={colors.gold} />
          <View style={s.endTimeMid}>
            <Text style={s.endTimeLabel}> {t('sessions.session_currently_ends_at')} </Text>
            <Text style={s.endTimeValue}>{currentEnd}</Text>
          </View>
        </View>

        {/* Duration pills */}
        <Text style={s.sectionTitle}> {t('sessions.select_extension_duration')} </Text>
        <View style={s.optionsRow}>
          {OPTIONS.map((opt2, idx) =>
          <TouchableOpacity
            key={opt2.minutes}
            style={[s.optPill, idx === selected && s.optPillActive]}
            onPress={() => setSelected(idx)}
            activeOpacity={0.75}>
              <Text style={[s.optPillLabel, idx === selected && s.optPillLabelActive]}>
                {t(opt2.label)}
              </Text>
              <Text style={[s.optPillPrice, idx === selected && s.optPillPriceActive]}>{t("content.sessions.ExtendSessionRequestScreen.text")}
              {opt2.price.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Price preview */}
        <View style={s.priceCard}>
          <View style={s.priceRow}>
            <Text style={s.priceLabel}> {t('sessions.extension_duration')} </Text>
            <Text style={s.priceValue}>{t(opt.label)}</Text>
          </View>
          <View style={s.priceDivider} />
          <View style={s.priceRow}>
            <Text style={s.priceLabelBold}> {t('sessions.additional_cost')} </Text>
            <Text style={s.priceValueGold}>{t("content.sessions.ExtendSessionRequestScreen.text")}{opt.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={s.priceRow}>
            <Text style={s.priceLabel}> {t('sessions.new_end_time')} </Text>
            <Text style={s.priceValue}>
              {fmtTime(session?.scheduledEnd, opt.minutes)}
            </Text>
          </View>
        </View>

        {/* Info strip */}
        <View style={s.infoStrip}>
          <Icon name="info" size={14} color={colors.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          <Text style={s.infoText}>
             {t('sessions.extension_requires_customer_confirmation_they_will_be_notified_immediately')} </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={s.bar}>
        <TouchableOpacity style={s.btn}
        onPress={() => navigation.navigate(Routes.EXTEND_SESSION_CONFIRMATION, { sessionId, extendedMinutes: opt.minutes })}
        activeOpacity={0.85}
        accessibilityLabel={t("accessibility.request_extension")}>
          <Icon name="timer" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('sessions.request_extension')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default ExtendSessionRequestScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  endTimeCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    padding: spacing.lg, marginBottom: spacing.lg
  },
  endTimeMid: { flex: 1 },
  endTimeLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  endTimeValue: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.gold, marginTop: 2 },

  sectionTitle: {
    fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.md
  },

  optionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  optPill: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md,
    borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.cardSurface
  },
  optPillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  optPillLabel: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted },
  optPillLabelActive: { color: colors.gold },
  optPillPrice: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 3 },
  optPillPriceActive: { color: colors.gold },

  priceCard: {
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  priceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: spacing.sm },
  priceLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  priceLabelBold: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  priceValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  priceValueGold: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.gold },

  infoStrip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)', padding: spacing.md
  },
  infoText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});