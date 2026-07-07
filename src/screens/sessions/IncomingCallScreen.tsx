/**
 * IncomingCallScreen (CPN-207)
 * Full-screen takeover shown when a customer initiates a call.
 * gestureEnabled: false — cannot be dismissed by swipe.
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  Animated, Easing } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type RouteType = RouteProp<RootStackParamList, typeof Routes.INCOMING_CALL>;

// ─── Pulsing ring animation ───────────────────────────────────────────────────

const PulseRing: React.FC<{delay: number;color: string;}> = ({ delay, color }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
      Animated.timing(scale, { toValue: 2.2, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true })]
      ),
      Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true })]
      )]
      )
    );
    anim.start();
    return () => anim.stop();
  }, [delay, scale, opacity]);

  return (
    <Animated.View
      style={[s.ring, { borderColor: color, transform: [{ scale }], opacity }]}
      pointerEvents="none" />);


};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function IncomingCallScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();
  const customerName = route.params?.customerName ?? 'Customer';

  // Extract initials from name
  const initials = customerName.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((n) => n[0].toUpperCase()).
  join('');

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#09111F" />

      {/* Top section */}
      <View style={s.topSection}>
        <Text style={s.callingLabel}> {t('sessions.incoming_call')} </Text>
        <Text style={s.customerName}>{customerName}</Text>
        <Text style={s.subtitle}> {t('sessions.cobuddy_customer')} </Text>
      </View>

      {/* Avatar + pulsing rings */}
      <View style={s.avatarSection}>
        <PulseRing delay={0} color={colors.safetyGreen} />
        <PulseRing delay={500} color={colors.safetyGreen} />
        <PulseRing delay={1000} color={colors.safetyGreen} />
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
      </View>

      {/* Bottom action row */}
      <View style={s.bottomSection}>
        <View style={s.actionRow}>
          {/* Decline */}
          <View style={s.actionWrap}>
            <TouchableOpacity accessibilityRole="button"
              style={s.declineBtn}
              onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
              activeOpacity={0.8}
              accessibilityLabel={t("accessibility.decline_call")}>
              <Icon name="call-end" size={32} color={colors.white} />
            </TouchableOpacity>
            <Text style={s.actionLabel}> {t('sessions.decline')} </Text>
          </View>

          {/* Accept */}
          <View style={s.actionWrap}>
            <TouchableOpacity accessibilityRole="button"
              style={s.acceptBtn}
              onPress={() => navigation.replace(Routes.IN_SESSION_CALL, {})}
              activeOpacity={0.8}
              accessibilityLabel={t("accessibility.accept_call")}>
              <Icon name="call" size={32} color={colors.white} />
            </TouchableOpacity>
            <Text style={s.actionLabel}> {t('sessions.accept')} </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>);

}
export default IncomingCallScreen;

const AVATAR_SIZE = 110;
const RING_SIZE = AVATAR_SIZE + 20;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09111F', alignItems: 'center' },

  // Top
  topSection: { alignItems: 'center', marginTop: spacing.xxxxl, paddingHorizontal: spacing.xl },
  callingLabel: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.sm },
  customerName: { fontFamily: fontFamily.playfairBold, fontSize: 32, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.safetyGreen },

  // Avatar
  avatarSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(109,214,165,0.15)',
    borderWidth: 3,
    borderColor: colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.safetyGreen,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 36, color: colors.safetyGreen },

  // Bottom
  bottomSection: { paddingBottom: spacing.xxxxl, width: '100%', alignItems: 'center' },
  actionRow: { flexDirection: 'row', gap: 72, justifyContent: 'center', alignItems: 'flex-start' },
  actionWrap: { alignItems: 'center', gap: spacing.sm },
  actionLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  declineBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#D96C6C',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D96C6C', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
    elevation: 10
  },
  acceptBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.safetyGreen,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.safetyGreen, shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
    elevation: 10
  }
});