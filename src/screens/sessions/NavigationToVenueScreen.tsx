import i18next from "i18next"; /**
* NavigationToVenueScreen (CPN-103)
* Map placeholder, ETA, transport mode pills, "I've Arrived" button.
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
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

type Mode = 'metro' | 'cab' | 'walk';
const MODES: {key: Mode;emoji: string;label: string;eta: string;}[] = [{ key: "metro", emoji: "\uD83D\uDE87", label: "content.sessions.NavigationToVenueScreen.modes.0.label", eta: "~20 min" }, { key: "cab", emoji: "\uD83D\uDE97", label: "content.sessions.NavigationToVenueScreen.modes.1.label", eta: "~15 min" }, { key: "walk", emoji: "\uD83D\uDEB6", label: "content.sessions.NavigationToVenueScreen.modes.2.label", eta: "~45 min" }] as any[];





export function NavigationToVenueScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);
  const venueLine = session?.venue?.name ?
  [session.venue.name, session.venue.area, session.venue.city].filter(Boolean).join(', ') : t("content.sessions.NavigationToVenueScreen.venue_address_unavailable");

  const [mode, setMode] = useState<Mode>('cab');
  const active = MODES.find((m) => m.key === mode)!;;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.navigate_to_venue')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      {/* Map placeholder */}
      <View style={s.map}>
        {[0, 1, 2, 3, 4, 5].map((i) => <View key={`h${i}`} style={[s.gh, { top: `${i * 20}%` as any }]} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <View key={`v${i}`} style={[s.gv, { left: `${i * 20}%` as any }]} />)}
        <View style={s.routeLine} />
        <View style={s.pin}><Icon name="location-on" size={44} color={colors.softWarning} /></View>
        <View style={s.yourDot} />
      </View>

      {/* ETA card */}
      <View style={s.etaCard}>
        <View style={{ flex: 1 }}>
          <Text style={s.etaVal}>{active.eta}</Text>
          <Text style={s.etaLbl}> {t('sessions.estimated_arrival')} </Text>
        </View>
        <View style={s.div} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>{active.emoji}</Text>
          <Text style={s.modeLbl}>{t(active.label)}</Text>
        </View>
      </View>

      {/* Mode pills */}
      <View style={s.pills}>
        {MODES.map((m) =>
        <TouchableOpacity key={m.key} style={[s.pill, m.key === mode && s.pillActive]}
        onPress={() => setMode(m.key)} activeOpacity={0.75}>
            <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
            <Text style={[s.pillLbl, m.key === mode && s.pillLblActive]}>{t(m.label)}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Address */}
      <View style={s.addrRow}>
        <Icon name="place" size={15} color={colors.textMuted} />
        <Text style={s.addrText}>{venueLine}</Text>
      </View>

      <View style={{ flex: 1 }} />

      {/* Sticky bar */}
      <View style={s.bar}>
        <TouchableOpacity style={s.btn}
        onPress={() => navigation.navigate(Routes.ARRIVAL_CHECK_IN, { sessionId })} activeOpacity={0.85}>
          <Icon name="check-circle" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('sessions.i_ve_arrived')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default NavigationToVenueScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  map: { height: 240, backgroundColor: '#0B1726', position: 'relative', overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  gh: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  gv: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  routeLine: { position: 'absolute', width: 3, height: 120, backgroundColor: colors.gold,
    opacity: 0.4, borderRadius: 2, bottom: '30%', alignSelf: 'center' },
  pin: { position: 'absolute', top: '20%', alignSelf: 'center' },
  yourDot: { position: 'absolute', bottom: '26%', alignSelf: 'center',
    width: 14, height: 14, borderRadius: 7, backgroundColor: '#4A90E2',
    borderWidth: 3, borderColor: '#fff' },
  etaCard: { flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface, marginHorizontal: spacing.lg, marginTop: -18,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', zIndex: 10 },
  etaVal: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.gold },
  etaLbl: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  div: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: spacing.lg },
  modeLbl: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.textMuted, marginTop: 3 },
  pills: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 9,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.cardSurface },
  pillActive: { borderColor: 'rgba(214,168,79,0.45)', backgroundColor: 'rgba(214,168,79,0.10)' },
  pillLbl: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  pillLblActive: { color: colors.gold },
  addrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  addrText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1, lineHeight: 19 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});