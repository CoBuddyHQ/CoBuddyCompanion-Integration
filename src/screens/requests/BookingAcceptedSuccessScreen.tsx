import { useTranslation } from 'react-i18next';
/**
 * CPN-085 — Booking Accepted Success Screen
 * Full-screen celebration state after a companion confirms acceptance.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { useRequestStore } from '../../store/slices/requestStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { RequestsStackParamList } from '../../types/navigation.types';

type Props = StackScreenProps<RequestsStackParamList, typeof Routes.BOOKING_ACCEPTED_SUCCESS>;

function formatShortDateTime(isoStart: string): string {
  const d = new Date(isoStart);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const day = isToday ? 'today' : isTomorrow ? 'tomorrow' :
  d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} at ${time}`;
}

const NEXT_STEPS = [
{ icon: 'chat-bubble-outline', text: 'Send a friendly message to greet your customer.' },
{ icon: 'directions-walk', text: 'Plan your route and aim to arrive 10 minutes early.' },
{ icon: 'shield', text: 'Safety tools and SOS will be active during your session.' }];


export function BookingAcceptedSuccessScreen({ route }: Props): React.JSX.Element {const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const { requestId } = route.params;

  // Look in reviewedRequests because updateRequestStatus moves it there
  const request = useRequestStore((s) =>
  [...s.pendingRequests, ...s.reviewedRequests].find((r) => r.requestId === requestId) ?? null
  );

  // Entrance animation
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true })]
    ).start();
  }, [scaleAnim, opacityAnim]);

  const customerInitials = request?.customer.displayInitials ?? '—';
  const dateLabel = request ? formatShortDateTime(request.proposedStart) : '';
  const earning = request ? `₹${request.estimatedEarning.toLocaleString('en-IN')}` : '';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <Animated.View style={[styles.heroWrap, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <View style={styles.checkCircle}>
            <Icon name="check" size={52} color={colors.rootBg} />
          </View>
          <View style={styles.heroBadge}>
            <Icon name="star" size={14} color={colors.gold} />
          </View>
        </Animated.View>

        <Text style={styles.heroTitle}>{t("application.booking_confirmed")}</Text>
        <Text style={styles.heroSubtitle}>{t("application.your_session_with")}
          {customerInitials}{t("application.is_set_for")}{'\n'}
          <Text style={styles.heroDateHighlight}>{dateLabel}</Text>
        </Text>

        {/* ── Earning pill ── */}
        {earning ?
        <View style={styles.earningPill}>
            <Icon name="account-balance-wallet" size={15} color={colors.gold} />
            <Text style={styles.earningPillText}>{earning}{t("application.will_be_credited_after_the_session")}</Text>
          </View> :
        null}

        {/* ── Next steps ── */}
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}>{t("application.what_s_next")}</Text>
          {NEXT_STEPS.map((step, i) =>
          <View key={i} style={styles.nextRow}>
              <View style={styles.nextStepNumber}>
                <Text style={styles.nextStepNumText}>{i + 1}</Text>
              </View>
              <Icon name={step.icon as any} size={18} color={colors.gold} style={{ marginHorizontal: spacing.sm, flexShrink: 0 }} />
              <Text style={styles.nextStepText}>{t(step.text)}</Text>
            </View>
          )}
        </View>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('SessionsTab', { screen: Routes.UPCOMING_SESSIONS })}
            activeOpacity={0.85}
            accessibilityLabel={t("accessibility.go_to_upcoming_sessions")}>
            <Icon name="event-available" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}>{t("application.go_to_upcoming_sessions")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => (navigation as any).navigate(Routes.HOME_DASHBOARD  )}
            activeOpacity={0.75}
            accessibilityLabel={t("accessibility.back_to_dashboard")}>
            <Text style={styles.btnSecondaryText}>{t("application.back_to_dashboard")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>);

}

export default BookingAcceptedSuccessScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxxl,
    paddingBottom: spacing.xxxxl
  },

  heroWrap: { alignSelf: 'center', position: 'relative', marginBottom: spacing.xl },
  checkCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 0 }, shadowRadius: 24, elevation: 10
  },
  heroBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'
  },

  heroTitle: {
    fontFamily: fontFamily.playfairBold,
    fontSize: 28,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: spacing.md
  },
  heroSubtitle: {
    fontFamily: fontFamily.interRegular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: spacing.lg
  },
  heroDateHighlight: {
    fontFamily: fontFamily.interBold,
    color: colors.textPrimary
  },

  earningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.30)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
    gap: spacing.sm
  },
  earningPillText: {
    fontFamily: fontFamily.interMedium,
    fontSize: 13,
    color: colors.gold
  },

  nextCard: {
    width: '100%',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  nextTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md
  },
  nextStepNumber: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  nextStepNumText: {
    fontFamily: fontFamily.interBold,
    fontSize: 11,
    color: colors.gold
  },
  nextStepText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    flex: 1
  },

  actions: { width: '100%' },
  btnPrimary: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    marginBottom: spacing.md
  },
  btnPrimaryText: {
    fontFamily: fontFamily.interBold,
    fontSize: 15,
    color: colors.rootBg
  },
  btnSecondary: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  btnSecondaryText: {
    fontFamily: fontFamily.interSemiBold,
    fontSize: 14,
    color: colors.textSecondary
  }
});