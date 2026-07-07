/**
 * PayoutReviewScreen (CPN-106)
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useEarningsStore } from '../../store/slices/earningsStore';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { useTranslation } from "react-i18next";

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function PayoutReviewScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const amount: number = route.params?.amount ?? 0;
  const [loading, setLoading] = useState(false);

  const availableBalance = useEarningsStore((s) => s.availableBalance);
  const setAvailableBalance = useEarningsStore((s) => s.setAvailableBalance);
  const addTransaction = useEarningsStore((s) => s.addTransaction);

  const bankName = useApplicationStore((s) => s.bankName);
  const last4 = useApplicationStore((s) => s.bankAccountLast4);

  const handleConfirm = () => {
    if (loading) {return;}
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Update balance
      setAvailableBalance(availableBalance - amount);

      // Generate a simple reference ID and thread the real amount forward
      const payoutId = `PAY-${Date.now().toString().slice(-6)}`;

      // Log the transaction
      addTransaction({
        id: payoutId,
        title: t("content.earnings.PayoutReviewScreen.withdrawal_to_bank_account"),
        date: 'Today',
        amount: -amount,
        type: 'pending'
      });

      navigation.navigate(Routes.PAYOUT_SUCCESS, { payoutId, amount });
    }, 2000);
  };

  const details = [{ icon: "account-balance", label: t("content.earnings.PayoutReviewScreen.details.0.label"), value: bankName }, { icon: "credit-card", label: t("content.earnings.PayoutReviewScreen.details.1.label"), value: `**** **** **** ${last4}` }, { icon: "schedule", label: t("content.earnings.PayoutReviewScreen.details.2.label"), value: t("content.earnings.PayoutReviewScreen.details.2.value") }] as any[];





  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.review_payout')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Amount card */}
        <View style={s.amountCard}>
          <Text style={s.amountLabel}> {t('earnings.amount_to_withdraw')} </Text>
          <Text style={s.amountValue}>{fmtINR(amount)}</Text>
          <Text style={s.amountSub}> {t('earnings.from_your_cobuddy_wallet')} </Text>
        </View>

        {/* Transfer details */}
        <Text style={s.sectionLabel}> {t('earnings.transfer_details')} </Text>
        <View style={s.detailsCard}>
          {details.map((row, i) =>
          <View key={row.icon}>
              <View style={s.detailRow}>
                <View style={s.detailIcon}>
                  <Icon name={row.icon as any} size={18} color={colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.detailLabel}>{t(row.label)}</Text>
                  <Text style={s.detailValue}>{row.value}</Text>
                </View>
              </View>
              {i < details.length - 1 && <View style={s.divider} />}
            </View>
          )}
        </View>

        {/* Fee note */}
        <View style={s.feeNote}>
          <Icon name="info-outline" size={14} color={colors.textMuted} />
          <Text style={s.feeNoteText}> {t('earnings.no_transfer_fees_cobuddy_covers_all_payout_charges')} </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={[s.btn, loading && s.btnDisabled]}
        onPress={handleConfirm} disabled={loading} activeOpacity={0.85}>
          <Icon name="send" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}>{loading ? t("content.earnings.PayoutReviewScreen.processing") : `Confirm ${fmtINR(amount)}`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default PayoutReviewScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  amountCard: { backgroundColor: colors.gold, borderRadius: radius.xxl, padding: spacing.xl,
    alignItems: 'center', marginBottom: spacing.lg },
  amountLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: 'rgba(10,18,32,0.65)', marginBottom: spacing.sm },
  amountValue: { fontFamily: fontFamily.playfairBold, fontSize: 44, color: colors.rootBg, lineHeight: 52 },
  amountSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: 'rgba(10,18,32,0.55)', marginTop: 4 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  detailsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  detailIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(214,168,79,0.10)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  detailLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  detailValue: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  feeNote: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(109,214,165,0.06)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.15)', padding: spacing.md },
  feeNoteText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, flex: 1 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.55 },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});