/**
 * VenueMeetingPointDetailScreen (CPN-102)
 * Shows venue, map placeholder, meeting instructions, and directions button.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Linking } from
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

export function VenueMeetingPointDetailScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);

  const venueName = session?.venue?.name ?? 'Venue';
  const venueArea = session?.venue?.area ?? '—';
  const venueAddress = [session?.venue?.name, session?.venue?.area, session?.venue?.city].
  filter(Boolean).join(', ');
  const instructions = session?.venue?.meetingPoint ??
  'Meet at the main entrance. Look for the CoBuddy logo on your companion\'s badge.';

  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    // In real app, use Clipboard.setString(venueAddress)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleDirections = () => {
    Linking.openURL(`geo:0,0?q=${encodeURIComponent(venueAddress)}`).catch(() => {

      // Fallback if no map app exists
    });};

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('sessions.meeting_point')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

        {/* Venue name card */}
        <View style={styles.venueCard}>
          <View style={styles.venueIconWrap}>
            <Icon name="store" size={22} color={colors.gold} />
          </View>
          <View style={styles.venueMid}>
            <Text style={styles.venueName}>{venueName}</Text>
            <Text style={styles.venueArea}>{venueArea}</Text>
          </View>
        </View>

        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) =>
          <View key={`h${i}`} style={[styles.gridLineH, { top: `${i * 25}%` as any }]} />
          )}
          {[0, 1, 2, 3, 4].map((i) =>
          <View key={`v${i}`} style={[styles.gridLineV, { left: `${i * 25}%` as any }]} />
          )}
          <View style={styles.mapCenterContent}>
            <Icon name="location-on" size={40} color={colors.softWarning} />
            <Text style={styles.mapLabel}> {t('sessions.map_view')} </Text>
            <Text style={styles.mapSub}> {t('sessions.interactive_map_coming_soon')} </Text>
          </View>
        </View>

        {/* Meeting instructions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="info" size={16} color={colors.gold} />
            <Text style={styles.cardTitle}> {t('sessions.meeting_instructions')} </Text>
          </View>
          <Text style={styles.instructionsText}>{instructions}</Text>
        </View>

        {/* Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="place" size={16} color={colors.gold} />
            <Text style={styles.cardTitle}> {t('sessions.full_address')} </Text>
            <TouchableOpacity onPress={handleCopyAddress} style={styles.copyBtn} disabled={copied}>
              <Icon name={copied ? "check" : "content-copy"} size={15} color={colors.gold} />
              <Text style={styles.copyText}>{copied ? t("content.sessions.VenueMeetingPointDetailScreen.copied") : t("content.sessions.VenueMeetingPointDetailScreen.copy")}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>{venueAddress}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky get directions */}
      <View style={styles.stickyBar}>
        <TouchableOpacity style={styles.directionsBtn} onPress={handleDirections} activeOpacity={0.85}>
          <Icon name="navigation" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={styles.directionsBtnText}> {t('sessions.get_directions')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default VenueMeetingPointDetailScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  venueCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    marginBottom: spacing.md
  },
  venueIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    alignItems: 'center', justifyContent: 'center'
  },
  venueMid: { flex: 1 },
  venueName: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textPrimary },
  venueArea: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginTop: 2 },

  mapPlaceholder: {
    height: 200, borderRadius: radius.xl, overflow: 'hidden',
    backgroundColor: '#0D1B2E',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: spacing.md, position: 'relative',
    alignItems: 'center', justifyContent: 'center'
  },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  mapCenterContent: { alignItems: 'center', zIndex: 1 },
  mapLabel: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  mapSub: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },

  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  cardTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, flex: 1 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copyText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  instructionsText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  addressText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  directionsBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  directionsBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});