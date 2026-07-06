import { useTranslation } from 'react-i18next';
/**
 * CPN-087 — Booking Declined Success Screen
 * Full-screen confirmation after a companion declines a booking request.
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated } from
'react-native';
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

type Props = StackScreenProps<RequestsStackParamList, typeof Routes.BOOKING_DECLINED_SUCCESS>;

export function BookingDeclinedSuccessScreen({ route }: Props): React.JSX.Element {const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const { requestId } = route.params;

  // Request has been moved to reviewedRequests by the store action
  const request = useRequestStore(
    (s) => [...s.pendingRequests, ...s.reviewedRequests].find((r) => r.requestId === requestId) ?? null
  );
  const customerInitials = request?.customer.displayInitials ?? '—';

  // Entrance animation
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
    Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true })]
    ).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={styles.content}>

        {/* ── Icon ── */}
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <Icon name="close" size={48} color={colors.softWarning} />
        </Animated.View>

        {/* ── Text ── */}
        <Text style={styles.title}>{t("application.request_declined")}</Text>
        <Text style={styles.subtitle}>{t("application.you_have_declined_the_request_from")}
          {' '}
          <Text style={styles.subtitleBold}>{customerInitials}</Text>.
        </Text>

        {/* ── Tip card ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}>
            <Icon name="event-available" size={20} color={colors.gold} />
          </View>
          <Text style={styles.tipText}>{t("application.keep_your_availability_calendar_updated")}

          </Text>
        </View>

        {/* ── Stats nudge ── */}
        <View style={styles.nudgeRow}>
          <Icon name="trending-up" size={15} color={colors.infoBlue} />
          <Text style={styles.nudgeText}>{t("application.accepting_more_requests_improves_your_ra")}

          </Text>
        </View>

        {/* ── Spacer ── */}
        <View style={{ flex: 1 }} />

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate(Routes.AVAILABILITY_CALENDAR)}
            activeOpacity={0.85}
            accessibilityLabel={t("accessibility.update_availability")}>
            <Icon name="event-available" size={18} color={colors.gold} style={{ marginRight: 8 }} />
            <Text style={styles.btnPrimaryText}>{t("application.update_availability")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate(Routes.BOOKING_REQUESTS_INBOX)}
            activeOpacity={0.75}
            accessibilityLabel={t("accessibility.back_to_inbox")}>
            <Text style={styles.btnSecondaryText}>{t("application.back_to_inbox")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>);

}

export default BookingDeclinedSuccessScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxxl,
    paddingBottom: spacing.xl
  },

  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(217,108,108,0.12)',
    borderWidth: 2, borderColor: 'rgba(217,108,108,0.30)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl
  },

  title: {
    fontFamily: fontFamily.playfairBold,
    fontSize: 26, color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.sm
  },
  subtitle: {
    fontFamily: fontFamily.interRegular,
    fontSize: 15, color: colors.textMuted,
    textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl
  },
  subtitleBold: {
    fontFamily: fontFamily.interBold, color: colors.textSecondary
  },

  tipCard: {
    width: '100%',
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md, gap: spacing.md
  },
  tipIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  tipText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 13, color: colors.textSecondary,
    lineHeight: 19, flex: 1
  },

  nudgeRow: {
    width: '100%',
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.infoBlueSubtle,
    borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(91,155,213,0.20)',
    gap: spacing.sm
  },
  nudgeText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12, color: colors.infoBlue, lineHeight: 18, flex: 1
  },

  actions: { width: '100%' },
  btnPrimary: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.gold,
    backgroundColor: 'rgba(214,168,79,0.08)',
    marginBottom: spacing.md
  },
  btnPrimaryText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  btnSecondary: {
    height: 44, alignItems: 'center', justifyContent: 'center'
  },
  btnSecondaryText: {
    fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted
  }
});