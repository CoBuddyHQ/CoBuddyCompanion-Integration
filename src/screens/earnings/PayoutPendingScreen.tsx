/**
 * PayoutPendingScreen (CPN-108)
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

export function PayoutPendingScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const amount: number = route.params?.amount ?? 0;
  const amountStr = `₹${Number(amount).toLocaleString('en-IN')}`;
  const pulse = useRef(new Animated.Value(1)).current;
  const opac = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opac, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true })]
      )
    ).start();
  }, [pulse, opac]);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <Animated.View style={[s.body, { opacity: opac }]}>
        <Animated.View style={[s.iconWrap, { transform: [{ scale: pulse }] }]}>
          <Icon name="access-time" size={64} color={colors.softWarning} />
        </Animated.View>
        <Text style={s.title}> {t('earnings.payout_processing')} </Text>
        <Text style={s.subtitle}>
           {t('earnings.your_transfer_of')} {amountStr}  {t('earnings.is_being_processed')} {'\n'} {t('earnings.it_usually_takes_2_4_hours_to_reflect_in_your_account')} </Text>
        <View style={s.stepsCard}>
          {[t("content.earnings.PayoutPendingScreen.payout_requested"), t("content.earnings.PayoutPendingScreen.bank_processing"), t("content.earnings.PayoutPendingScreen.amount_credited")].map((step, i) =>
          <View key={step} style={s.stepRow}>
              <View style={[s.stepDot, i === 0 && s.stepDotDone, i === 1 && s.stepDotActive]} />
              <Text style={[s.stepText, i < 2 && s.stepTextActive]}>{step}</Text>
            </View>
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
export default PayoutPendingScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: { width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,171,64,0.10)', borderWidth: 2, borderColor: 'rgba(255,171,64,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 28, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 23, marginBottom: spacing.xl },
  stepsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: spacing.md, alignSelf: 'stretch' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.elevatedSurface, flexShrink: 0 },
  stepDotDone: { backgroundColor: colors.safetyGreen },
  stepDotActive: { backgroundColor: colors.softWarning },
  stepText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  stepTextActive: { color: colors.textSecondary },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});