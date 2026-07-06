/**
 * CPN-109 — Active Session Screen (Premium Redesign)
 * Live session hub with running timer, SOS, and session controls.
 * Back gesture is disabled — companion must use "End Session" to exit.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Dimensions, ScrollView } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.ACTIVE_SESSION>;

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTimer(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs % 3600 / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    cafe_conversation: 'Café Conversation', city_walk: 'City Walk',
    art_culture: 'Art & Culture', food_experience: 'Food Experience',
    shopping_assistance: 'Shopping Assistance', events: 'Public Event',
    business_networking: 'Networking', bookstore: 'Bookstore Visit',
    wellness_walk: 'Wellness Walk', movies: 'Cinema'
  };
  return map[cat] ?? cat.replace(/_/g, ' ');
}

// ─── Glassmorphic Action Tile ─────────────────────────────────────────────────

interface TileProps {icon: string;label: string;onPress: () => void;accent?: string;}

const ActionTile: React.FC<TileProps> = ({ icon, label, onPress, accent }) => {
  const iconColor = accent ?? colors.gold;
  return (
    <TouchableOpacity style={styles.actionTile} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIconWrap, { borderColor: `${iconColor}33` }]}>
        <Icon name={icon as any} size={24} color={iconColor} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ActiveSessionScreen({ route, navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const sessionId: string = route.params?.sessionId ?? '';

  const session = useSessionStore((s) =>
  s.activeSession?.sessionId === sessionId ? s.activeSession :
  s.upcomingSessions.find((ses) => ses.sessionId === sessionId) ?? null
  );

  // ── Running timer ──────────────────────────────────────────────────────────
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!session?.checkInTime) {return 0;}
      return Math.floor((Date.now() - new Date(session.checkInTime).getTime()) / 1000);
    };

    setElapsed(calc()); // initial calculation

    const id = setInterval(() => {
      setElapsed(calc());
    }, 1000);
    return () => clearInterval(id);
  }, [session?.checkInTime]);

  // ── LIVE badge breathing animation ─────────────────────────────────────────
  const liveOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
    Animated.timing(liveOpacity, { toValue: 0.25, duration: 800, useNativeDriver: true }),
    Animated.timing(liveOpacity, { toValue: 1, duration: 800, useNativeDriver: true })]
    )).start();
  }, [liveOpacity]);

  // ── SOS breathing pulse ────────────────────────────────────────────────────
  const sosPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
    Animated.timing(sosPulse, { toValue: 1.025, duration: 1100, useNativeDriver: true }),
    Animated.timing(sosPulse, { toValue: 1, duration: 1100, useNativeDriver: true })]
    )).start();
  }, [sosPulse]);

  // ── Timer glow pulse ───────────────────────────────────────────────────────
  const glowScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
    Animated.timing(glowScale, { toValue: 1.06, duration: 2000, useNativeDriver: true }),
    Animated.timing(glowScale, { toValue: 1, duration: 2000, useNativeDriver: true })]
    )).start();
  }, [glowScale]);

  // ── Time remaining ─────────────────────────────────────────────────────────
  const totalSecs = (session?.durationMinutes ?? 0) * 60;
  const remaining = Math.max(0, totalSecs - elapsed);
  const remH = Math.floor(remaining / 3600);
  const remM = Math.floor(remaining % 3600 / 60);
  const remLabel = remH > 0 ? `${remH}h ${remM}m remaining` : `${remM}m remaining`;
  const isOverdue = remaining === 0 && totalSecs > 0;

  const handleEndSession = () => navigation.navigate(Routes.EARLY_END_SESSION, { sessionId });

  const customer = session?.customer;
  const category = session ? categoryLabel(session.category) : '—';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        {/* LIVE badge with breathing dot */}
        <View style={styles.liveBadge}>
          <Animated.View style={[styles.liveDot, { opacity: liveOpacity }]} />
          <Text style={styles.liveBadgeText}> {t('sessions.live_session')} </Text>
        </View>
        <View style={styles.headerRight}>
          {/* Location quick-access */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate(Routes.LIVE_LOCATION_SHARING, { sessionId })}
            accessibilityLabel={t("accessibility.live_location_sharing")}>
            <Icon name="my-location" size={18} color={colors.safetyGreen} />
          </TouchableOpacity>
          {/* SOS pill */}
          <TouchableOpacity
            style={styles.headerSosBtn}
            onPress={() => navigation.navigate(Routes.SOS)}
            accessibilityLabel={t("accessibility.emergency_sos")}>
            <Icon name="emergency" size={13} color="#fff" />
            <Text style={styles.headerSosBtnText}> {t('sessions.sos')} </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Timer Card ── */}
        <View style={styles.timerCardOuter}>
          {/* Ambient glow behind the card */}
          <Animated.View style={[styles.timerGlow, { transform: [{ scale: glowScale }] }]} />

          <View style={styles.timerCard}>
            {/* Elapsed time — massive monospace */}
            <Text style={styles.timerText}>{fmtTimer(elapsed)}</Text>

            {/* Remaining label */}
            {!isOverdue ?
            <Text style={styles.timerSub}>{remLabel}</Text> :

            <Text style={styles.timerOverdue}> {t('sessions.session_time_reached')} </Text>
            }

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[
              styles.progressFill,
              { width: (totalSecs > 0 ? `${Math.min(100, elapsed / totalSecs * 100).toFixed(1)}%` : '0%') as any }]
              } />
            </View>
          </View>
        </View>

        {/* ── Customer Info Row ── */}
        <View style={styles.sessionInfoRow}>
          <View style={styles.sessionAvatar}>
            <Text style={styles.sessionAvatarText}>{customer?.displayInitials ?? '?'}</Text>
          </View>
          <View style={styles.sessionInfoMid}>
            <Text style={styles.sessionCustomer}>{customer?.displayInitials ?? '—'}</Text>
            <Text style={styles.sessionCategory}>{category}</Text>
          </View>
          <View style={styles.earningsBadge}>
            <Text style={styles.earningsVal}>{t("content.sessions.ActiveSessionScreen.text")}
              {session?.estimatedTotal.toLocaleString('en-IN') ?? '—'}
            </Text>
            <Text style={styles.earningsLabel}> {t('sessions.est_earning')} </Text>
          </View>
        </View>

        {/* ── Glassmorphic Action Grid ── */}
        <View style={styles.actionGrid}>
          <ActionTile
            icon="chat"
            label={t('sessions.chat')}
            onPress={() => navigation.navigate(Routes.IN_SESSION_CHAT, { sessionId, customerName: session?.customer?.displayInitials ?? 'Customer' })} />
          
          <ActionTile
            icon="call"
            label={t('sessions.call')}
            onPress={() => navigation.navigate(Routes.IN_SESSION_CALL, { sessionId, customerName: session?.customer?.displayInitials ?? 'Customer' })} />
          
          <ActionTile
            icon="my-location"
            label={t('sessions.location')}
            onPress={() => navigation.navigate(Routes.LIVE_LOCATION_SHARING, { sessionId })}
            accent={colors.safetyGreen} />
          
          <ActionTile
            icon="timer"
            label={t('sessions.extend')}
            onPress={() => navigation.navigate(Routes.EXTEND_SESSION_REQUEST, { sessionId })} />
          
          <ActionTile
            icon="shield"
            label={t('sessions.safety')}
            onPress={() => navigation.navigate(Routes.COMPANION_SAFETY_HUB)}
            accent={colors.safetyGreen} />
          
          <ActionTile
            icon="edit-note"
            label={t('sessions.notes')}
            onPress={() => navigation.navigate(Routes.POST_SESSION_NOTES, { sessionId })} />
          
        </View>

        {/* ── SOS Breathing Button ── */}
        <Animated.View style={[styles.sosWrap, { transform: [{ scale: sosPulse }] }]}>
          <TouchableOpacity
            style={styles.sosBtn}
            onPress={() => navigation.navigate(Routes.SOS)}
            activeOpacity={0.8}
            accessibilityLabel={t("accessibility.emergency_sos")}>
            <Icon name="emergency" size={26} color={colors.white} style={{ marginRight: 14 }} />
            <View>
              <Text style={styles.sosBtnTitle}> {t('sessions.sos_emergency')} </Text>
              <Text style={styles.sosBtnSub}> {t('sessions.tap_to_contact_emergency_services')} </Text>
            </View>
            <View style={{ flex: 1 }} />
            <Icon name="chevron-right" size={22} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* ── Sticky Footer — End Session ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnEnd}
          onPress={handleEndSession}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.end_session_early")}>
          <Icon name="stop-circle" size={20} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
          <Text style={styles.btnEndText}> {t('sessions.end_session_early')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default ActiveSessionScreen;

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },

  // ── ScrollView ──────────────────────────────────────────────────────────────
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 100, gap: 12 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(192,57,43,0.18)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(192,57,43,0.40)',
    paddingHorizontal: 14, paddingVertical: 6
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E74C3C' },
  liveBadgeText: {
    fontFamily: fontFamily.interBold, fontSize: 11,
    color: '#FF6B6B', letterSpacing: 1.5
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(109,214,165,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)',
    alignItems: 'center', justifyContent: 'center'
  },
  headerSosBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: '#C0392B',
    borderWidth: 1, borderColor: 'rgba(255,100,100,0.50)',
    shadowColor: '#C0392B', shadowOpacity: 0.6, shadowRadius: 8, elevation: 6
  },
  headerSosBtnText: { fontFamily: fontFamily.interBold, fontSize: 12, color: '#fff', letterSpacing: 1 },



  // ── Hero Timer ──────────────────────────────────────────────────────────────
  timerCardOuter: { alignItems: 'center', position: 'relative' },
  timerGlow: {
    position: 'absolute',
    width: SCREEN_W * 0.7, height: SCREEN_W * 0.7,
    borderRadius: SCREEN_W * 0.35,
    backgroundColor: 'rgba(109,214,165,0.05)',
    top: -SCREEN_W * 0.15,
    alignSelf: 'center'
  },
  timerCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.xxl,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.18)',
    paddingVertical: 24, paddingHorizontal: spacing.lg,
    alignItems: 'center',
    shadowColor: '#6DD6A5', shadowOpacity: 0.10,
    shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 6
  },
  timerText: {
    fontFamily: 'Courier New',
    fontSize: 56, fontWeight: '700',
    color: '#6DD6A5', // safetyGreen
    letterSpacing: 6,
    textShadowColor: 'rgba(109,214,165,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18
  },
  timerSub: {
    fontFamily: fontFamily.interMedium, fontSize: 13,
    color: 'rgba(255,255,255,0.45)', marginTop: 6
  },
  timerOverdue: {
    fontFamily: fontFamily.interBold, fontSize: 13,
    color: colors.softWarning, marginTop: 6
  },
  progressTrack: {
    width: '80%', height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 16, overflow: 'hidden'
  },
  progressFill: {
    height: '100%', borderRadius: 2,
    backgroundColor: '#6DD6A5'
  },

  // ── Session info row ────────────────────────────────────────────────────────
  sessionInfoRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.15)'
  },
  sessionAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  sessionAvatarText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  sessionInfoMid: { flex: 1, marginLeft: spacing.md },
  sessionCustomer: { fontFamily: fontFamily.interBold, fontSize: 15, color: '#FFFFFF' },
  sessionCategory: { fontFamily: fontFamily.interRegular, fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  earningsBadge: { alignItems: 'flex-end' },
  earningsVal: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.gold },
  earningsLabel: { fontFamily: fontFamily.interRegular, fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 },

  // ── Action grid — glassmorphism ─────────────────────────────────────────────
  actionGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 9
  },
  actionTile: {
    width: '31%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)',
    // frosted shadow
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 4
  },
  actionIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6
  },
  actionLabel: {
    fontFamily: fontFamily.interSemiBold, fontSize: 12,
    color: 'rgba(255,255,255,0.80)', letterSpacing: 0.3
  },

  // ── SOS Button ──────────────────────────────────────────────────────────────
  sosWrap: { width: '100%' },
  sosBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.55)',
    shadowColor: colors.softWarning, shadowOpacity: 0.40,
    shadowRadius: 18, shadowOffset: { width: 0, height: 4 }, elevation: 10
  },
  sosBtnTitle: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.softWarning },
  sosBtnSub: {
    fontFamily: fontFamily.interRegular, fontSize: 12,
    color: colors.textMuted, marginTop: 3
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnEnd: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.cardSurface,
    borderWidth: 1.5, borderColor: 'rgba(217,108,108,0.45)',
    shadowColor: colors.softWarning, shadowOpacity: 0.25,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4
  },
  btnEndText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.softWarning }
});