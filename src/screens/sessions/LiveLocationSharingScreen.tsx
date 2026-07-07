/**
 * LiveLocationSharingScreen (CPN-110)
 * Shows real-time location sharing status with the CoBuddy safety team.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Switch, Alert, Animated } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function LiveLocationSharingScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);

  const remainingLabel = (() => {
    if (!session?.scheduledEnd) {return '—';}
    const diffMs = new Date(session.scheduledEnd).getTime() - Date.now();
    if (diffMs <= 0) {return 'Session ended';}
    const totalMins = Math.floor(diffMs / 60000);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  })();

  const [shareContacts, setShareContacts] = useState(false);

  // Pulsing gold dot animation
  const dotOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
    Animated.timing(dotOpacity, { toValue: 0.15, duration: 800, useNativeDriver: true }),
    Animated.timing(dotOpacity, { toValue: 1, duration: 800, useNativeDriver: true })]
    )).start();
  }, [dotOpacity]);

  const handleStopSharing = () => {
    Alert.alert(t("alerts.stop_location_sharing"), t("alerts.your_location_will_no_longer_be_visible"),


    [
    { text: t("alerts.cancel"), style: 'cancel' },
    { text: t("alerts.stop_sharing"), style: 'destructive',
      onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]

    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.live_location')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}>

        {/* Status banner */}
        <View style={s.statusBanner}>
          <Text style={s.statusEmoji}>{t("content.sessions.LiveLocationSharingScreen.text")}</Text>
          <Text style={s.statusText}>
             {t('sessions.your_location_is_being_shared_with_the')} {' '}
            <Text style={s.statusBold}> {t('sessions.cobuddy_safety_team')} </Text>
          </Text>
        </View>

        {/* Map placeholder */}
        <View style={s.mapCard}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) =>
          <View key={`h${i}`} style={[s.gridH, { top: `${i * 17}%` as any }]} />
          )}
          {[0, 1, 2, 3, 4, 5, 6].map((i) =>
          <View key={`v${i}`} style={[s.gridV, { left: `${i * 17}%` as any }]} />
          )}

          {/* Pulsing dot */}
          <View style={s.dotOuter}>
            <Animated.View style={[s.dotPulse, { opacity: dotOpacity }]} />
            <View style={s.dotInner} />
          </View>

          {/* LIVE badge */}
          <View style={s.liveBadge}>
            <View style={s.liveRedDot} />
            <Text style={s.liveBadgeText}> {t('sessions.live')} </Text>
          </View>

          {/* Accuracy label */}
          <View style={s.accuracyBadge}>
            <Icon name="gps-fixed" size={11} color={colors.safetyGreen} />
            <Text style={s.accuracyText}> {t('sessions.high_accuracy')} </Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <View style={s.infoIconWrap}>
              <Icon name="shield" size={16} color={colors.safetyGreen} />
            </View>
            <View style={s.infoMid}>
              <Text style={s.infoLabel}> {t('sessions.shared_with')} </Text>
              <Text style={s.infoValue}> {t('sessions.cobuddy_support_team')} </Text>
            </View>
          </View>

          <View style={s.rowDivider} />

          <View style={s.infoRow}>
            <View style={[s.infoIconWrap, { backgroundColor: 'rgba(214,168,79,0.10)' }]}>
              <Icon name="schedule" size={16} color={colors.gold} />
            </View>
            <View style={s.infoMid}>
              <Text style={s.infoLabel}> {t('sessions.session_ends_in')} </Text>
              <Text style={s.infoValue}>{remainingLabel}</Text>
            </View>
          </View>

          <View style={s.rowDivider} />

          <View style={s.infoRow}>
            <View style={[s.infoIconWrap, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <Icon name="stop-circle" size={16} color={colors.textMuted} />
            </View>
            <View style={s.infoMid}>
              <Text style={s.infoLabel}> {t('sessions.auto_stops_when_session_ends')} </Text>
              <Text style={s.infoValueMuted}> {t('sessions.no_action_needed_from_you')} </Text>
            </View>
          </View>
        </View>

        {/* Emergency contacts toggle */}
        <View style={s.toggleCard}>
          <View style={s.toggleLeft}>
            <Icon name="contacts" size={18} color={colors.gold} />
            <View style={s.toggleMid}>
              <Text style={s.toggleLabel}> {t('sessions.share_with_emergency_contacts')} </Text>
              <Text style={s.toggleSub}> {t('sessions.your_trusted_contacts_can_see_your_location')} </Text>
            </View>
          </View>
          <Switch
            value={shareContacts}
            onValueChange={setShareContacts}
            trackColor={{ false: colors.elevatedSurface, true: 'rgba(109,214,165,0.30)' }}
            thumbColor={shareContacts ? colors.safetyGreen : colors.border} />
          
        </View>

        {/* Stop sharing */}
        <TouchableOpacity accessibilityRole="button" style={s.stopBtn} onPress={handleStopSharing} activeOpacity={0.7}>
          <Icon name="location-off" size={15} color={colors.softWarning} />
          <Text style={s.stopBtnText}> {t('sessions.stop_sharing_early')} </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default LiveLocationSharingScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.08)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md
  },
  statusEmoji: { fontSize: 18 },
  statusText: { fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textSecondary, flex: 1, lineHeight: 19 },
  statusBold: { fontFamily: fontFamily.interBold, color: colors.safetyGreen },

  mapCard: {
    height: 300, borderRadius: radius.xl, overflow: 'hidden',
    backgroundColor: '#0B1726',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: spacing.md, position: 'relative',
    alignItems: 'center', justifyContent: 'center'
  },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.04)' },

  dotOuter: { alignItems: 'center', justifyContent: 'center', width: 60, height: 60 },
  dotPulse: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(214,168,79,0.20)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.35)'
  },
  dotInner: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.gold,
    borderWidth: 3, borderColor: '#fff' },

  liveBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(200,40,40,0.80)',
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4
  },
  liveRedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveBadgeText: { fontFamily: fontFamily.interBold, fontSize: 10, color: '#fff', letterSpacing: 1 },

  accuracyBadge: {
    position: 'absolute', bottom: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,214,165,0.12)',
    borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)'
  },
  accuracyText: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.safetyGreen },

  infoCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 4 },
  infoIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(109,214,165,0.10)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  infoMid: { flex: 1 },
  infoLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  infoValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary, marginTop: 2 },
  infoValueMuted: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  rowDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: spacing.sm },

  toggleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.lg
  },
  toggleLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  toggleMid: { flex: 1 },
  toggleLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  toggleSub: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },

  stopBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  stopBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.softWarning }
});