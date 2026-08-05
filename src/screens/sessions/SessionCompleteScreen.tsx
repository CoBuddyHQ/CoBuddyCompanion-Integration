/**
 * CPN-119 — Session Complete Screen
 * Full-screen celebration state after a session ends.
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated, ScrollView } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.SESSION_COMPLETE>;

export function SessionCompleteScreen({ route }: Props): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const sessionId: string = route.params?.sessionId ?? '';

  // Session may now be in history after updateSessionStatus('completed')
  const session = useSessionStore((s) =>
  [...s.sessionHistory, ...(s.activeSession ? [s.activeSession] : [])].
  find((ses) => ses.sessionId === sessionId) ?? null
  );

  const customer = session?.customer;
  const baseEarning = session?.baseEarning ?? 0;
  const bonusEarning = session?.bonusEarning ?? 0;
  const total = session?.estimatedTotal ?? 0;
  const confirmedEarn = session?.confirmedEarning ?? null;

  // Entrance animation
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
    Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true })]
    ).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <Animated.View style={[styles.heroWrap, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <View style={styles.heroCircle}>
            <Icon name="star" size={52} color={colors.rootBg} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="check" size={14} color={colors.safetyGreen} />
          </View>
        </Animated.View>

        <Text style={styles.heroTitle}> {t('sessions.session_completed')} </Text>
        <Text style={styles.heroSubtitle}>
           {t('sessions.great_job_you_ve_successfully_finished_your_session')} {customer ? ` with ${customer.displayInitials}` : ''}.
        </Text>

        {/* ── Earnings card ── */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsCardTitle}> {t('sessions.earnings_summary')} </Text>

          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}> {t('sessions.base_pay')} </Text>
            <Text style={styles.earningsValue}>{t("content.sessions.SessionCompleteScreen.text")}{baseEarning.toLocaleString('en-IN')}</Text>
          </View>

          {bonusEarning > 0 &&
          <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}> {t('sessions.safety_bonus')} </Text>
              <Text style={[styles.earningsValue, { color: colors.safetyGreen }]}>{t("content.sessions.SessionCompleteScreen.text_1")}
              {bonusEarning.toLocaleString('en-IN')}
              </Text>
            </View>
          }

          {/* Platform fee deduction */}
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}> {t('sessions.platform_fee_20')} </Text>
            <Text style={[styles.earningsValue, { color: 'rgba(255,100,100,0.80)' }]}>{t("content.sessions.SessionCompleteScreen.text_2")}
              {Math.round((session?.estimatedTotal ?? 0) * 0.20).toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}> {t('sessions.tips')} </Text>
            <Text style={[styles.earningsValue, { color: colors.textMuted }]}> {t('sessions.pending')} </Text>
          </View>

          <View style={styles.earningsDivider} />

          <View style={styles.earningsRow}>
            <Text style={styles.earningsTotalLabel}> {t('sessions.total_earned')} </Text>
            <Text style={styles.earningsTotalValue}>{t("content.sessions.SessionCompleteScreen.text")}
              {(confirmedEarn ?? total).toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.earningsNote}>
            <Icon name="info-outline" size={13} color={colors.textMuted} />
            <Text style={styles.earningsNoteText}>
               {t('sessions.payout_will_be_credited_within_24_hours')} </Text>
          </View>
        </View>

        {/* ── Rating prompt ── */}
        <View style={styles.ratingPrompt}>
          <Icon name="rate-review" size={18} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={styles.ratingPromptText}>
             {t('sessions.please_rate_the_customer_to_help_keep_the_community_safe_and_improve_future_matches')} </Text>
        </View>

        {/* ── Next steps ── */}
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}> {t('sessions.what_s_next')} </Text>
          {[
          { icon: 'star-rate', text: 'Rate your customer experience.' },
          { icon: 'account-balance-wallet', text: 'Earnings will be credited in 24h.' },
          { icon: 'event-available', text: 'Update your availability for more bookings.' }].
          map((step, i) =>
          <View key={i} style={styles.nextRow}>
              <View style={styles.nextNum}>
                <Text style={styles.nextNumText}>{i + 1}</Text>
              </View>
              <Icon name={step.icon as any} size={16} color={colors.gold} style={{ marginHorizontal: 8, flexShrink: 0 }} />
              <Text style={styles.nextText}>{t(step.text)}</Text>
            </View>
          )}
        </View>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity accessibilityRole="button"
            style={styles.btnPrimary}
            onPress={() => navigation.navigate(Routes.CUSTOMER_RATING_FEEDBACK, { sessionId })}
            activeOpacity={0.85}
            accessibilityLabel={t("accessibility.rate_customer")}>
            <Icon name="star" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}> {t('sessions.rate_customer')} </Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button"
            style={styles.btnSecondary}
            onPress={() => navigation.navigate(Routes.POST_SESSION_NOTES, { sessionId })}
            activeOpacity={0.75}
            accessibilityLabel={t("accessibility.add_session_notes")}>
            <Text style={styles.btnSecondaryText}> {t('sessions.add_session_notes')} </Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button"
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('MainApp', { screen: 'DashboardTab' })}
            activeOpacity={0.75}
            accessibilityLabel={t("accessibility.back_to_dashboard")}>
            <Text style={styles.btnSecondaryText}> {t('sessions.back_to_dashboard')} </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>);

}

export default SessionCompleteScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: {
    flexGrow: 1, alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxxl, paddingBottom: spacing.xxxxl
  },

  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.xl },
  heroCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOpacity: 0.50,
    shadowOffset: { width: 0, height: 0 }, shadowRadius: 24, elevation: 10
  },
  heroBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  heroTitle: {
    fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.sm
  },
  heroSubtitle: {
    fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl
  },

  earningsCard: {
    width: '100%', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md
  },
  earningsCardTitle: {
    fontFamily: fontFamily.playfairSemiBold, fontSize: 15, color: colors.gold,
    marginBottom: spacing.md
  },
  earningsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm
  },
  earningsLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  earningsValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  earningsDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: spacing.sm },
  earningsTotalLabel: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  earningsTotalValue: { fontFamily: fontFamily.interBold, fontSize: 20, color: colors.gold },
  earningsNote: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm
  },
  earningsNoteText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },

  ratingPrompt: {
    width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    padding: spacing.md, marginBottom: spacing.md
  },
  ratingPromptText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 18, flex: 1 },

  nextCard: {
    width: '100%', backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.xl
  },
  nextTitle: {
    fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.md
  },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  nextNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  nextNumText: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.gold },
  nextText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 19, flex: 1 },

  actions: { width: '100%' },
  btnPrimary: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold, marginBottom: spacing.md
  },
  btnPrimaryText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  btnSecondary: { height: 44, alignItems: 'center', justifyContent: 'center' },
  btnSecondaryText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted }
});