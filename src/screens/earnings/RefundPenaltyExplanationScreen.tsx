/**
 * RefundPenaltyExplanationScreen (CPN-110)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const ERR = '#E74C3C';

export function RefundPenaltyExplanationScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const rows = [{ label: "content.earnings.RefundPenaltyExplanationScreen.rows.0.label", value: "content.earnings.RefundPenaltyExplanationScreen.rows.0.value" }, { label: "content.earnings.RefundPenaltyExplanationScreen.rows.1.label", value: "content.earnings.RefundPenaltyExplanationScreen.rows.1.value" }, { label: "content.earnings.RefundPenaltyExplanationScreen.rows.2.label", value: "content.earnings.RefundPenaltyExplanationScreen.rows.2.value" }, { label: "content.earnings.RefundPenaltyExplanationScreen.rows.3.label", value: "content.earnings.RefundPenaltyExplanationScreen.rows.3.value" }, { label: "content.earnings.RefundPenaltyExplanationScreen.rows.4.label", value: "content.earnings.RefundPenaltyExplanationScreen.rows.4.value" }] as any[];






  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('earnings.penalty_details')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.banner}>
          <Icon name="warning" size={18} color={ERR} />
          <Text style={s.bannerText}> {t('earnings.platform_penalty_applied')} </Text>
        </View>
        <View style={s.amountCard}>
          <Text style={s.amountLabel}> {t('earnings.penalty_deduction')} </Text>
          <Text style={s.amountValue}>{t("content.earnings.RefundPenaltyExplanationScreen.150")}</Text>
        </View>
        <Text style={s.sectionLabel}> {t('earnings.reason')} </Text>
        <View style={s.reasonCard}>
          <Text style={s.reasonText}>
             {t('earnings.late_cancellation_of_session_ses_8821_as_per_policy_cancellations_within_2_hours_of_the_session_start_time_incur_a_penalty_of_150')} </Text>
        </View>
        <Text style={s.sectionLabel}> {t('earnings.breakdown')} </Text>
        <View style={s.tableCard}>
          {rows.map((r, i) =>
          <View key={t(r.label)}>
              <View style={s.tableRow}>
                <Text style={s.tableKey}>{t(r.label)}</Text>
                <Text style={s.tableVal}>{t(r.value)}</Text>
              </View>
              {i < rows.length - 1 && <View style={s.divider} />}
            </View>
          )}
        </View>
        <TouchableOpacity accessibilityRole="button" style={s.policyLink}
        onPress={() => navigation.navigate(Routes.POLICY_CENTER)} activeOpacity={0.7}>
          <Icon name="menu-book" size={16} color={colors.gold} />
          <Text style={s.policyLinkText}> {t('earnings.view_cancellation_policy')} </Text>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btn}
        onPress={() => navigation.navigate(Routes.CREATE_SUPPORT_TICKET)} activeOpacity={0.85}>
          <Icon name="gavel" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnText}> {t('earnings.appeal_this_penalty')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default RefundPenaltyExplanationScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(231,76,60,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.22)', padding: spacing.md, marginBottom: spacing.md },
  bannerText: { fontFamily: fontFamily.interBold, fontSize: 14, color: ERR },
  amountCard: { backgroundColor: 'rgba(231,76,60,0.06)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.22)', padding: spacing.lg,
    alignItems: 'center', marginBottom: spacing.lg },
  amountLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  amountValue: { fontFamily: fontFamily.playfairBold, fontSize: 44, color: ERR, lineHeight: 52 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  reasonCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.lg, marginBottom: spacing.lg },
  reasonText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  tableCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  tableKey: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  tableVal: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary, maxWidth: '55%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md },
  policyLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginBottom: spacing.sm },
  policyLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.gold, flex: 1 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});