import i18next from "i18next"; /**
* PreArrivalScreen (CPN-104)
* Shows customer waiting status and pre-arrival checklist before check-in.
*/
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
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
import { useTranslation } from 'react-i18next';


const CHECKLIST = [{ label: "content.sessions.PreArrivalScreen.checklist.0.label", done: "content.sessions.PreArrivalScreen.checklist.0.done" }, { label: "content.sessions.PreArrivalScreen.checklist.1.label", done: "content.sessions.PreArrivalScreen.checklist.1.done" }, { label: "content.sessions.PreArrivalScreen.checklist.2.label", done: "content.sessions.PreArrivalScreen.checklist.2.done" }] as any[];





export function PreArrivalScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string | undefined = route.params?.sessionId;

  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : [])].
  find((ses) => ses.sessionId === sessionId) ?? null
  );

  const checkInSession = useSessionStore((s) => s.checkInSession);
  const [loading, setLoading] = React.useState(false);


  // ── Not found fallback ────────────────────────────────────────────────────
  if (!session) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t('sessions.almost_there')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
        <View style={s.emptyState}>
          <Icon name="search-off" size={40} color={colors.textMuted} />
          <Text style={s.emptyText}> {t('sessions.session_not_found')} </Text>
        </View>
      </SafeAreaView>);

  }

  const customerInitials = session.customer.displayInitials;
  const bookingRef = session.sessionId;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.almost_there')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Customer waiting card */}
        <View style={s.waitingCard}>
          <View style={s.waitingGlow} />
          <Icon name="person-pin-circle" size={28} color={colors.softWarning} />
          <Text style={s.waitingTitle}> {t('sessions.your_customer_is_waiting')} </Text>
          <Text style={s.waitingSub}> {t('sessions.they_arrived_5_minutes_ago')} </Text>

          {/* Customer info — live from store */}
          <View style={s.customerRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{customerInitials.charAt(0)}</Text>
            </View>
            <View>
              <Text style={s.customerName}>{customerInitials}</Text>
              <Text style={s.customerTag}> {t('sessions.booking')} {bookingRef}</Text>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View style={s.card}>
          <Text style={s.cardTitle}> {t('sessions.pre_arrival_checklist')} </Text>
          {CHECKLIST.map((item) =>
          <View key={t(item.label)} style={s.checkRow}>
              <View style={s.checkIcon}>
                <Icon name="check-circle" size={20} color={colors.safetyGreen} />
              </View>
              <Text style={s.checkLabel}>{t(item.label)}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky button */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={[s.btn, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={async () => {
          setLoading(true);
          try {
            await checkInSession(sessionId!);
            navigation.navigate(Routes.ARRIVAL_CHECK_IN, { sessionId });
          } catch (e: any) {
            Alert.alert(t('alerts.error'), e?.message || 'Check-in failed');
          } finally {
            setLoading(false);
          }
        }} activeOpacity={0.85}>
          <Icon name="where-to-vote" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}>{loading ? t("alerts.processing") : t('sessions.i_m_at_the_venue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default PreArrivalScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fontFamily.interSemiBold, fontSize: 15, color: colors.textMuted },

  waitingCard: {
    backgroundColor: 'rgba(255,171,64,0.08)',
    borderRadius: radius.xxl, padding: spacing.xl,
    borderWidth: 1, borderColor: 'rgba(255,171,64,0.25)',
    alignItems: 'center', marginBottom: spacing.md,
    overflow: 'hidden', position: 'relative'
  },
  waitingGlow: {
    position: 'absolute', top: -50, left: '50%', marginLeft: -70,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,171,64,0.08)'
  },
  waitingTitle: { fontFamily: fontFamily.playfairBold, fontSize: 20, color: colors.softWarning,
    marginTop: spacing.sm, textAlign: 'center' },
  waitingSub: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    marginTop: 4, marginBottom: spacing.lg },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: radius.lg,
    padding: spacing.md, width: '100%' },
  avatar: { width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 2, borderColor: 'rgba(255,171,64,0.35)',
    alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.softWarning },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  customerTag: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },

  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  cardTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.md },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)' },
  checkIcon: { flexShrink: 0 },
  checkLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});