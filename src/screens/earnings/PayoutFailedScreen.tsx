/**
 * PayoutFailedScreen (CPN-109)
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const ERROR_RED = '#E74C3C';

export function PayoutFailedScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const opac = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opac, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.sequence([
    Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true })]
    ).start();
  }, [opac, shake]);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <Animated.View style={[s.body, { opacity: opac }]}>
        <Animated.View style={[s.iconWrap, { transform: [{ translateX: shake }] }]}>
          <Icon name="error-outline" size={64} color={ERROR_RED} />
        </Animated.View>
        <Text style={[s.title, { color: ERROR_RED }]}> {t('earnings.payout_failed')} </Text>
        <Text style={s.subtitle}>
           {t('earnings.there_was_an_issue_with_your_bank_details')} {'\n'} {t('earnings.please_update_them_and_try_again')} </Text>
        <View style={s.errorCard}>
          <Icon name="credit-card-off" size={16} color={ERROR_RED} style={{ flexShrink: 0 }} />
          <Text style={s.errorCardText}> {t('earnings.bank_account_could_not_be_verified_ensure_your_account_details_are_correct')} </Text>
        </View>
      </Animated.View>
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnPrimary}
        onPress={() => navigation.navigate(Routes.BANK_DETAILS)} activeOpacity={0.85}>
          <Icon name="account-balance" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnPrimaryText}> {t('earnings.update_bank_details')} </Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={s.btnCancel}
        onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} activeOpacity={0.7}>
          <Text style={s.btnCancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default PayoutFailedScreen;

const ERROR_RED_STR = '#E74C3C';
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: { width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(231,76,60,0.10)', borderWidth: 2, borderColor: 'rgba(231,76,60,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 28, textAlign: 'center', marginBottom: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 23, marginBottom: spacing.lg },
  errorCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(231,76,60,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.20)', padding: spacing.md, alignSelf: 'stretch' },
  errorCardText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: ERROR_RED_STR, flex: 1, lineHeight: 19 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm },
  btnPrimary: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnPrimaryText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  btnCancel: { height: 44, alignItems: 'center', justifyContent: 'center' },
  btnCancelText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted }
});