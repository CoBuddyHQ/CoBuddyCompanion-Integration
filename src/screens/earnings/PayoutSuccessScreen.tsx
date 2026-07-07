/**
 * PayoutSuccessScreen (CPN-107)
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// Routes not needed — popToTop() is used to return to EarningsDashboard

export function PayoutSuccessScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { payoutId = 'TXN-998877', amount = 0 } = route.params ?? {};
  const amountStr = `₹${Number(amount).toLocaleString('en-IN')}`;

  const scale = useRef(new Animated.Value(0.4)).current;
  const opac = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
    Animated.spring(scale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
    Animated.timing(opac, { toValue: 1, duration: 500, useNativeDriver: true })]
    ).start();
  }, [scale, opac]);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <Animated.View style={[s.body, { opacity: opac }]}>
        <Animated.View style={[s.iconWrap, { transform: [{ scale }] }]}>
          <Icon name="check-circle" size={72} color={colors.safetyGreen} />
        </Animated.View>

        <Text style={s.title}> {t('earnings.payout_successful')} </Text>
        <Text style={s.subtitle}>{amountStr}  {t('earnings.has_been_sent_to_your_bank_account')} </Text>

        <View style={s.refCard}>
          <Text style={s.refLabel}> {t('earnings.reference_id')} </Text>
          <Text style={s.refId}>{payoutId}</Text>
        </View>

        <View style={s.dotsRow}>
          {['#6DD6A5', '#D6A84F', '#6DD6A5', '#D6A84F', '#6DD6A5'].map((c, i) =>
          <View key={i} style={[s.dot, { backgroundColor: c }]} />
          )}
        </View>
      </Animated.View>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btn}
        onPress={() => navigation.popToTop()} activeOpacity={0.85}>
          <Icon name="account-balance-wallet" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('earnings.return_to_dashboard')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default PayoutSuccessScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: { width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(109,214,165,0.10)', borderWidth: 2, borderColor: 'rgba(109,214,165,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  refCard: { backgroundColor: colors.cardSurface, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
    marginBottom: spacing.lg, minWidth: 200 },
  refLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  refId: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary, letterSpacing: 0.5 },
  dotsRow: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});